<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'
import { Box3, Vector3 } from 'three'
import { ref, watch } from 'vue'
import { fixUrlForProd } from '@/env'
import ClusterMode from '@/types/ClusterMode'
import ShapeName from '@/types/ShapeName'
import type ModelInfo from '@/types/ModelInfo'
import type { GLTFLoader, Matrix3, Mesh, MeshArrayDict } from '@/types/ThreeTypes'

const props = defineProps<{
  cameraPosition: Matrix3,
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

// Identifies a Mesh's geometry as a 'Pillar', or 'VerticalPlaneSideways', etc.
// This function relies on a model where all geometries are aligned to the x, y
// and z axis.
const boundingBoxToShapeName = (mesh?: Mesh) => {
  if (! mesh?.geometry) return ShapeName.Unknown // probably never encountered
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const dimensions = new Vector3()
  boundingBox.getSize(dimensions) // note that y is depth, not height
  const { x: width, y: depth, z: height } = dimensions
  const w5 = width * 5
  const d5 = depth * 5
  const h5 = height * 5
  switch (true) {
    // A shape whose width is much greater than its height or depth.
    case width > h5 && width > d5: return ShapeName.BeamFacing
    // A shape whose depth is much greater than its width or height.
    case depth > w5 && depth > h5: return ShapeName.BeamSideways
    // A shape whose height is much greater than its width or depth.
    case height > w5 && height > d5: return ShapeName.Pillar
    // A horizontal plane, like a floor or ceiling.
    case h5 < width && h5 < depth: return ShapeName.HorizontalPlane
    // A vertical plane, like a wall, which extends in the x direction.
    case d5 < width && d5 < height: return ShapeName.VerticalPlaneFacing
    // A vertical plane, like a wall, which extends in the z direction.
    case w5 < height && w5 < depth: return ShapeName.VerticalPlaneSideways
    // Doesn't conform to any of the other shapes, so must be somewhat boxy.
    default: return ShapeName.Block
  }
}

const getBoundingBoxOffset = (origin: Vector3, mesh?: Mesh): Vector3 => {
  if (! mesh?.geometry) return new Vector3(0, 0, 0) // probably never encountered
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const center = new Vector3()
  boundingBox.getCenter(center)
  return center.sub(origin).negate() // negate() sets x = -x, y = -y and z = -z
}

// Returns the coordinates of a cluster's center, based on a rectangular grid.
//
// Note that the choice of coordinates has been tailored to the peculiarities
// of apartment.glb and building.glb - a more complex system would be needed
// to deal with a wider range of glTF models.
const getClusterCenter = (
  itemIndex: number,
  spacing: number,
  totalItems: number,
) => {
  if (totalItems === 4) { // Building has 4 shapes
    switch (itemIndex) {
      case 0: return new Vector3(0, 0, 0) // BeamSideways 19
      case 1: return new Vector3(spacing * -2, spacing, 0) // Block 380
      case 2: return new Vector3(spacing * -0.3, 0, 47) // Pillar 3
      case 3: return new Vector3(-spacing, 0, 0) // HorizontalPlane 29
    }
  }
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

  // Tell each Mesh which material cluster its in, and group Meshes by material name.
  const meshesByMaterialName: MeshArrayDict = meshes.value.reduce(
    (accumulator: MeshArrayDict, mesh) => {
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
  const meshesByShapeName: MeshArrayDict = meshes.value.reduce(
    (accumulator: MeshArrayDict, mesh) => {
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

  // Use `props.cameraPosition[2]` as a proxy for model size.
  const clusterSpacing = props.cameraPosition[2] * 0.7 // gap between clusters
  const modelSpacing = props.cameraPosition[2] * 0.03 // gap within a cluster
  

  // Calculate the central position of each cluster.
  const materialClusterCenters = Object.keys(meshesByMaterialName).reduce(
    (accumulator: { [key: string]: Vector3 }, key, i) => (
      {
        ...accumulator,
        [key]: getClusterCenter(i, clusterSpacing, modelInfo.materialTally)
      }
    ), {}
  )
  const shapeClusterCenters = Object.keys(meshesByShapeName).reduce(
    (accumulator: { [key: string]: Vector3 }, key, i) => (
      {
        ...accumulator,
        [key]: getClusterCenter(i, clusterSpacing, modelInfo.shapeTally)
      }
    ), {}
  )

  // Tell each Mesh its geometry's offsets from the original starting position.
  // First, overlapping at the exact center of the three cluster modes.
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
    }
  })

  // Second, stop the Material cluster Meshes from overlapping.
  //
  // Note that the fanning-out here is carefully tailored to the peculiarities
  // of apartment.glb and building.glb - a more complex system would be needed
  // to deal with a wider range of glTF models.
  Object.entries(meshesByShapeName).forEach(([ shapeName, meshes ]) => {
    const tally = meshes.length
    const rankCount = Math.floor(Math.sqrt(tally))
    const fileCount = Math.floor(tally / rankCount)
    meshes.forEach((mesh, i) => {
      const data: UserData = mesh.userData
      switch (Number(shapeName)) {
        case ShapeName.Block:
          const rank = i % rankCount
          const file = (i - rank) / fileCount
          data.offset.shape.x += rank * modelSpacing * 4
          data.offset.shape.y += file * modelSpacing * 4
          break
        case ShapeName.HorizontalPlane:
          data.offset.shape.z += i * modelSpacing
          break
        case ShapeName.Pillar:
          data.offset.shape.y += i * modelSpacing * 4
          break
        case ShapeName.BeamFacing:
        case ShapeName.VerticalPlaneFacing:
          data.offset.shape.y += i * modelSpacing
          break
        case ShapeName.BeamSideways:
        case ShapeName.VerticalPlaneSideways:
          data.offset.shape.x += i * modelSpacing
          break
      }
    })
    console.log(ShapeName[shapeName], meshes.length);    
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
        :position="cameraPosition"
        :up="[0, 1, 0]"
      >
        <OrbitControls />
      </PerspectiveCamera>

      <Scene :background="colorScheme === 'dark' ? '#333' : '#ccc'">
        <DirectionalLight :position="[30, 100, 100]" />
        <DirectionalLight :position="[-30, 100, -100]" />
        <GLTFLoader
          :position="modelPosition"
          :url="fixUrlForProd(modelUrl)"
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
