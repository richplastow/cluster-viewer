<script setup lang="ts">
import { PerspectiveCamera } from '@janvorisek/drie';
import { Vector3 } from 'three'
import { ref, watch } from 'vue'
import type { GLTFLoader, PerspectiveCamera as PerspectiveCameraType, Matrix3 }
  from '@/types/ThreeTypes'
import { GLTFRenderer, GLTFScene } from './'

const props = defineProps<{
  cameraPosition: Matrix3
  fov: number
  modelPosition: Matrix3
  modelUrl: string
  text: string
}>()

const didSetup = ref(false)
const camera = ref<null | PerspectiveCameraType>(null)

/** Starts as `null`, and then becomes a reference to the GLTFLoader component
 *  as soon as the model has loaded, when GLTFScene emits 'modelReady'. */
const model = ref<null | GLTFLoader>(null) // @TODO maybe refactor into useGLTFModel()
const onModelReady = (m: GLTFLoader) => model.value = m

// Initialise variables and constants used by onAnimationFrame() which don't
// need to be reactive.
let previousTimestamp = performance.now() // shouldn't be reactive
const yAxis = new Vector3(0, 1, 0)

/** Slowly rotates the model, one radian per 10 seconds about the y-axis. */
const onAnimationFrame = () => {
  // Keep recording the duration of the most recent animation frame, even if the
  // model has not loaded yet.
  const currentTimestamp = performance.now()
  const frameDuration = currentTimestamp - previousTimestamp
  previousTimestamp = currentTimestamp

  if (model.value === null || !model.value.three.children[0]) return
  if (!didSetup.value) {
    // `watch(model, ...)` doesn't trigger at the right time
    model.value.three.children[0].position.x = props.modelPosition[0] // @TODO find a more graceful method
    model.value.three.children[0].position.y = props.modelPosition[1]
    model.value.three.children[0].position.z = props.modelPosition[2]
    didSetup.value = true
  }

  model.value.three.rotateOnAxis(yAxis, frameDuration / 4000)
}

// Passing `:fov="fov" :lookAt="[0, 0, 0]"` to Drie's PerspectiveCamera doesn't
// do anything, so as a workaround set these properties on the Three camera.
watch(camera, async () => {
  if (camera.value === null) return // camera not ready
  camera.value.three.lookAt(0, 0, 0)
  camera.value.three.fov = props.fov
})

</script>

<template>
  <div>
    <GLTFRenderer :onBeforeRender="onAnimationFrame">
      <PerspectiveCamera
        :autoResize="true"
        :position="cameraPosition"
        :up="[0, 1, 0]"
        ref="camera"
      />
      <GLTFScene
        :modelUrl="modelUrl"
        @modelReady="onModelReady"
      />
    </GLTFRenderer>
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

/* Breakpoints based on <https://tailwindcss.com/docs/responsive-design>. */
/* sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px */
@media (min-width: 768px) {
  div {
    width: 20rem;
    height: 14rem;
  }
}
@media (min-width: 1024px) {
  div {
    width: 28rem;
    height: 18rem;
  }
}

</style>
