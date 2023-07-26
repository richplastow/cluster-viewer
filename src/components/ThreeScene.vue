<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'
import { ref } from 'vue'
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

const initialBoundingBoxes = ref<Box3[]>([])

const meshesByMaterialName = ref<{ [key: string]: Mesh[] }>({})
const meshesByShape = ref<{ [key: string]: Mesh[] }>({})

const onAnimationFrame = () => {
  // const angle = Date.now() / 1000
  // rotation.value = [ 0, Math.cos(angle) * Math.PI, 0 ]
  // meshesByMaterialName.value['Timber - Vertical Battens']
  //   .forEach((mesh: Mesh) => mesh.position.x += 0.01)
}

const boundingBoxToShape = (mesh?: Mesh) => {
  if (! mesh) return 'no-mesh'
  if (! mesh.geometry) return 'no-geometry'
  const boundingBox: Box3 = mesh.geometry.boundingBox
  const size = new Vector3()
  boundingBox.getSize(size)
  const x = Math.round(size.x * 1000) // round to the nearest mm
  const y = Math.round(size.y * 1000)
  const z = Math.round(size.z * 1000)
  return `${Math.min(x, z)}x${Math.max(x, z)}x${y}` // short x long x height
}

const onModelLoaded = () => {
  if (model.value === null) return

  // Get a handy reference to the array of Meshes which will be clustered.
  const meshes = model.value.three.children[0].children[0].children

  // Make an array for each of the Meshes' material names.
  meshesByMaterialName.value = meshes.reduce(
    (accumulator: object, mesh: Mesh) =>
      ({ ...accumulator, [mesh.children[0]?.material?.name]:[] }),
    {}
  )

  // Make an array for each of the Meshes' shapes, where a shape is determined
  // by the geometry's bounding box.
  meshesByShape.value = meshes.reduce(
    (accumulator: object, mesh: Mesh) =>
      ({ ...accumulator, [boundingBoxToShape(mesh.children[0])]:[] }),
    {}
  )

  // Send the tally of materials and shapes to the InfoBox.
  props.reportModelInfo({
    materialTally: Object.keys(meshesByMaterialName.value).length,
    shapeTally: Object.keys(meshesByShape.value).length,
  })
  console.log(meshesByShape);  

/*
  // Record the Meshes' original bounding boxes.
  initialBoundingBoxes.value = meshes.map(
    (mesh: Mesh) => mesh.children[0]?.geometry?.boundingBox
  )
  console.log(initialBoundingBoxes);

  // To begin with, all target matrices are the Meshes' original matrices.
  
  
  meshesByMaterialName.value['Timber - Vertical Battens'] =
    model.value.three.children[0].children[0].children.filter(
      (mesh: Mesh) =>
        mesh.children[0]?.material?.name === 'Timber - Vertical Battens'
    )

  console.log(2, meshesByMaterialName.value['Timber - Vertical Battens'][0].children[0]);
*/
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
