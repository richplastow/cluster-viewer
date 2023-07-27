<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'
import { Vector3 } from 'three'
import { ref, watch } from 'vue'
import { fixUrlForProd } from '@/env'
import type { GLTFLoader, PerspectiveCamera, Matrix3 } from '@/types/ThreeTypes'

const props = defineProps<{
  cameraPosition: Matrix3,
  fov: number,
  modelPosition: Matrix3,
  modelUrl: string,
  text: string,
}>()

const didSetup = ref(false)
const camera = ref<null | PerspectiveCamera>(null)
const model = ref<null | GLTFLoader>(null) // null before the model loads
const theme = usePreferredColorScheme() // tracks CSS prefers-color-scheme

// Slowly rotate the model, one radian per 10 seconds about the y-axis.
const yAxis = new Vector3(0, 1, 0)
let previousTimestamp = performance.now() // shouldn't be reactive!
const onAnimationFrame = () => {

  // Keep recording the duration of the most recent animation frame, even if the
  // model has not loaded yet.
  const currentTimestamp = performance.now()
  const frameDuration = currentTimestamp - previousTimestamp
  previousTimestamp = currentTimestamp

  if (model.value === null || ! model.value.three.children[0]) return
  if (! didSetup.value) { // `watch(model, ...)` doesn't trigger at the right time
    model.value.three.children[0].position.x = props.modelPosition[0] // @TODO find a more graceful method
    model.value.three.children[0].position.y = props.modelPosition[1]
    model.value.three.children[0].position.z = props.modelPosition[2]
    didSetup.value = true
  }

  model.value.three.rotateOnAxis(yAxis, frameDuration / 4000)
}

watch(camera, async () => {
  if (camera.value === null) return // camera not ready
  camera.value.three.lookAt(0,0,0)
  camera.value.three.fov = props.fov
})

</script>

<template>
  <div>
    <Renderer
      :antialias="true"
      :autoResize="true"
      :on-before-render="onAnimationFrame"
    >
      <PerspectiveCamera
        :autoResize="true"
        :fov="fov"
        :position="cameraPosition"
        :up="[0, 1, 0]"
        ref="camera"
      />

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
        :url="fixUrlForProd(modelUrl)"
          ref="model"
        />
      </Scene>

    </Renderer>
    <h4>{{ text }} ▶</h4>
  </div>
</template>

<style scoped>
div {
  display: inline-block;
  width: 17rem;
  height: 9rem;
  margin-top: 1rem;
  padding: 0.5rem;
  padding-bottom: 2rem;
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  text-align: right;
  transition: background-color var(--fast); /* but not border-color */
}
div:hover {
  background-color: var(--color-background-button-beige);
  border: 1px solid var(--color-border-hover);
}
h4 {
  margin-top: 0.1rem;
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-big-link-text);
  transition: color var(--fast);
}
div:hover > h4 {
  color: var(--color-big-link-text-hover);
}
</style>
