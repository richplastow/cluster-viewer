<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'
import { ref, watch } from 'vue'
import ClusterMode from '@/types/ClusterMode'
import type ModelInfo from '@/types/ModelInfo'
import type { GLTFLoader, Matrix3, Mesh } from '@/types/ThreeTypes'

import { Box3, Vector3 } from 'three'

const props = defineProps<{
  cameraDistance: number,
  modelPosition: Matrix3,
  modelUrl: string,
  reportModelInfo: (info: ModelInfo) => void,
  selectedMode: ClusterMode,
}>()

const model = ref<null | GLTFLoader>(null) // null before the model loads
const colorScheme = usePreferredColorScheme() // tracks CSS prefers-color-scheme

// Each Mesh will be treated as an individually-positionable 3D object.
const meshes = ref<Mesh[]>([])

// 
const interpolation = ref(0)
watch(() => props.selectedMode, async () => {
  interpolation.value = 0
})

let previousTimestamp = performance.now() // shouldn't be reactive!
const onAnimationFrame = () => {

  // Keep recording the duration of the most recent animation frame, even if the
  // model has not loaded yet, or the interpolation has ended.
  const currentTimestamp = performance.now()
  const frameDuration = currentTimestamp - previousTimestamp
  previousTimestamp = currentTimestamp

  // Do nothing else, if the model has not loaded, or the interpolation has ended.
  if (model.value === null || interpolation.value >= 1) return

  // When the user clicks a button, interpolating to that position takes 5 seconds.
  interpolation.value += frameDuration / 5000

  // Cache values which wont change during the tight `forEach` loop, below.
  const alpha = interpolation.value
  const mode = props.selectedMode === ClusterMode.Material
    ? 'material'
    : props.selectedMode === ClusterMode.Shape
      ? 'shape'
      : 'original'

  // Linearly interpolate each Mesh between its current and target positions.
  meshes.value.forEach(mesh =>
    mesh.position.lerp(mesh.userData.offset[mode], alpha)
  )
}

// Generates a name like '15x400x985' from a Mesh's geometry. 'Cluster by Shape'
// will group together meshes whose geometries are:
// - Less than a millimeter different
// - The same when rotated 90 degrees about the y axis
const boundingBoxToShapeName = (mesh?: Mesh) => {
  if (! mesh?.geometry) return '(invalid)' // probably never encountered
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const size = new Vector3()
  boundingBox.getSize(size)
  const x = Math.round(size.x * 1000) // round to the nearest mm
  const y = Math.round(size.y * 1000)
  const z = Math.round(size.z * 1000)
  return `${Math.min(x, z)}x${Math.max(x, z)}x${y}` // short x long x height
}

const getBoundingBoxOffset = (origin: Vector3, mesh?: Mesh): Vector3 => {
  if (! mesh?.geometry) return new Vector3(0, 0, 0) // probably never encountered
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const center = new Vector3()
  boundingBox.getCenter(center)
  return center.sub(origin).negate() // negate() sets x = -x, y = -y and z = -z
  // return origin.sub(center)
}

// Returns the coordinates of a cluster's center, based on a rectangular grid.
const getClusterCenter = (
  itemIndex: number,
  spacing: number,
  totalItems: number,
) => {
  if (totalItems === 6) {
    const x = itemIndex % 2
    const y = (itemIndex - x) / 2
    return new Vector3(x * spacing - 1, y * spacing - 1.5, 1.5)
  }
  if (totalItems === 9) {
    const x = itemIndex % 3
    const y = (itemIndex - x) / 3
    return new Vector3(x * spacing - 70, y * spacing - 70, 0)
  }
  return new Vector3(itemIndex * - spacing, 0, 0)
}

// Precalculates the clusters, to minimise the work during animation.
const onModelLoaded = () => {
  if (model.value === null) return

  // Populate the `meshes` reference with an array of Meshes, which will each be
  // treated as an individually-positionable 3D object.
  // `children[0].children[0].children` depends on the structure of the models.
  meshes.value = model.value.three.children[0].children[0].children
  console.log(meshes.value)

  // Tell each Mesh which material cluster its in, and group Meshes by material name.
  const meshesByMaterialName = meshes.value.reduce(
    (accumulator: { [key: string]: Mesh[] }, mesh) => {
      const key: string = mesh.children[0]?.material?.name
      mesh.userData.materialName = key
      const array = accumulator[key]
      if (array) {
        array.push(mesh)
      } else {
        accumulator[key] = [ mesh ]
      }
      return accumulator
    }, {}
  )

  // Tell each Mesh which shape cluster its in, and group Meshes by shape name.
  // A shape is determined by the geometry's bounding box.
  const meshesByShapeName = meshes.value.reduce(
    (accumulator: { [key: string]: Mesh[] }, mesh) => {
      const key = boundingBoxToShapeName(mesh.children[0])
      mesh.userData.shapeName = key
      const array = accumulator[key]
      if (array) {
        array.push(mesh)
      } else {
        accumulator[key] = [ mesh ]
      }
      return accumulator
    }, {}
  )

  // Send the tally of materials and shapes to the InfoBox.
  const modelInfo: ModelInfo = {
    materialTally: Object.keys(meshesByMaterialName).length,
    shapeTally: Object.keys(meshesByShapeName).length,
  }
  props.reportModelInfo(modelInfo)

  // Use `props.cameraDistance` as a proxy for model size.
  const spacing = props.cameraDistance * 0.7

  // Calculate the central position of each cluster.
  const materialClusterCenters = Object.keys(meshesByMaterialName).reduce(
    (accumulator: { [key: string]: Vector3 }, key, i) => (
      {
        ...accumulator,
        [key]: getClusterCenter(i, spacing, modelInfo.materialTally)
      }
    ), {}
  )
  const shapeClusterCenters = Object.keys(meshesByShapeName).reduce(
    (accumulator: { [key: string]: Vector3 }, key, i) => (
      {
        ...accumulator,
        [key]: getClusterCenter(i, spacing, modelInfo.shapeTally)
      }
    ), {}
  )

  // Tell each Mesh its geometry's offset from the original starting position.
  interface UserData {
    materialName: string
    shapeName: string
    offset: {
      material: Vector3,
      shape: Vector3,
      original: Vector3,
    }
  }
  meshes.value.forEach(mesh => {
    const child = mesh.children[0] // contains the geometry
    const data: UserData = mesh.userData
    const materialClusterCenter = materialClusterCenters[data.materialName]
    const shapeClusterCenter = shapeClusterCenters[data.shapeName]
    data.offset = {
      material: getBoundingBoxOffset(materialClusterCenter, child),
      shape: getBoundingBoxOffset(shapeClusterCenter, child),
      original: mesh.position.clone(), // always (0,0,0) in Apartment, but not Building
       //getBoundingBoxOffset(origin, child),
    }
  })
}

</script>

<template>
  <main>
    <Renderer
      :antialias="true"
      :autoResize="true"
      :on-before-render="onAnimationFrame"
    >
      <PerspectiveCamera
        :position="[cameraDistance, cameraDistance, cameraDistance]"
        :up="[0, 1, 0]"
      >
        <OrbitControls />
      </PerspectiveCamera>

      <Scene :background="colorScheme === 'dark' ? '#333' : '#ccc'">
        <DirectionalLight :position="[30, 100, 100]" />
        <DirectionalLight :position="[-30, 100, -100]" />
        <GLTFLoader
          :position="modelPosition"
          :url="modelUrl"
          @load="onModelLoaded"
          ref="model"
        />
      </Scene>

    </Renderer>
  </main>
</template>

<style scoped>
main {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
