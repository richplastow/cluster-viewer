<script setup lang="ts">
import { DirectionalLight, GLTFLoader, Scene } from '@janvorisek/drie'
import { usePreferredColorScheme } from '@vueuse/core'
import { ref } from 'vue'
import { prependBaseToProdUrl } from '@/helpers'
import type { GLTFLoader as GLTFLoaderType, Matrix3 } from '@/types/ThreeTypes'

const { onModelReady } = defineProps<{
  /** Sets the GLTFLoader component's `position` prop.
   *  @default [0,0,0] */
  modelPosition?: Matrix3
  /** Sets the GLTFLoader component's `url` prop. Relative to the public/ dir. */
  modelUrl: string
  /** Called with the GLTFLoader component as an argument, when the model loads. */
  onModelReady: (model: GLTFLoaderType) => void
}>()

/** Starts as `null`, and then becomes a reference to the GLTFLoader component
 *  as soon as the model has loaded. */
const modelRef = ref<null | GLTFLoaderType>(null) // @TODO maybe refactor into useGLTFModel()
const onModelLoaded = () => {
  if (modelRef === null) // probably not possible under normal operation
    throw Error('GLTFScene: onModelLoaded() called while `modelRef` is still null')
  if (! modelRef.value?.three?.children[0]?.children[0]?.children)
    throw Error('GLTFScene: The model is not structured as expected')
  onModelReady(modelRef.value as GLTFLoaderType)
}

const theme = usePreferredColorScheme() // tracks CSS prefers-color-scheme
</script>

<template>
  <Scene :background="theme === 'dark' ? '#333' : '#ccc'">
    <DirectionalLight
      :position="[30, 100, 100]"
      :intensity="theme === 'dark' ? 0.7 : 2"
    />
    <DirectionalLight
      :position="[-30, 100, -100]"
      :intensity="theme === 'dark' ? 0.2 : 1.5"
    />
    <GLTFLoader
      :position="modelPosition || [0, 0, 0]"
      :url="prependBaseToProdUrl(modelUrl)"
      @load="onModelLoaded"
      ref="modelRef"
    />
  </Scene>
</template>
