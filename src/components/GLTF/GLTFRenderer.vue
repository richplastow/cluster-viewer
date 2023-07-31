<script setup lang="ts">
import { Renderer } from '@janvorisek/drie'

withDefaults(
  defineProps<{
    antialias?: boolean
    autoResize?: boolean
    onBeforeRender?: () => void
  }>(),
  {
    antialias: true,
    autoResize: true,
  }
)

</script>

<template>
  <Renderer
    :antialias="antialias"
    :autoResize="autoResize"
    :onBeforeRender="onBeforeRender"
  >
    <slot />
  </Renderer>
</template>
