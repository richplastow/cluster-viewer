<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePreferredColorScheme } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import ClusterMode from '../types/ClusterMode.ts'

defineProps<{
  cameraDistance: number,
  modelUrl: string,
  selectedMode: ClusterMode,
}>()

const model = ref(null) // reference to the GLTFLoader component
const colorScheme = usePreferredColorScheme()

// method called when glTF loaded and whenever color variant is pressed
const onLoad = () => {
  if (model.value === null) return
  console.log('HERE!')
  
  
  // // In our case the fabric mesh has a name 'SheenChair_fabric' (in the glTF file)
  // // fabricMesh is instance of THREE.Mesh
  // // console.log(model.value.three.children[0].children[0].children.filter(
  // //   el => el.children[0]?.material?.name === 'Timber - Vertical Battens'
  // // ))
  // const els = model.value.three.children[0].children[0].children.filter(
  //   el => el.children[0]?.material?.name === 'Timber - Vertical Battens'
  // );

  // // fabricMesh.material is instance of THREE.Material
  // els.forEach(el => el.position.x += activeVariant.value.offset)
}

</script>

<template>
  <main>
    <Renderer :autoResize="true" :antialias="true">
      <PerspectiveCamera
        :position="[cameraDistance, cameraDistance, cameraDistance]"
        :up="[0, 1, 0]"
      >
        <OrbitControls />
      </PerspectiveCamera>

      <Scene :background="colorScheme === 'dark' ? '#333' : '#ccc'">
        <DirectionalLight :position="[30, 100, 100]" :color="0xffffff" />
        <DirectionalLight :position="[-30, 100, -100]" :color="0xffffff" />
        <GLTFLoader
          ref="model"
          :url="modelUrl"
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
