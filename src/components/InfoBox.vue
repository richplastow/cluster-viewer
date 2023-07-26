<script setup lang="ts">
import { computed } from 'vue'
import type ModelInfo from '@/types/ModelInfo'

const props = defineProps<{
  heading: string
  modelInfo: null | ModelInfo
}>()

// Generates a readable summary of the `modelInfo` object.
const infoText = (
  info: ModelInfo | null,
  key:'materialTally' | 'shapeTally',
  plural: string,
  singular: string,
) => {
  if (info === null) return '' // loading
  const tally = info[key] // eg props.modelInfo.materialTally
  if (tally === 0) return `No ${plural}` // @TODO disable the button
  if (tally === 1) return `1 ${singular}` // @TODO does the button make sense?
  return `${tally} ${plural}`
}

const materialText = computed(
  () => infoText(props.modelInfo, 'materialTally', 'Materials', 'Material'))

const shapeText = computed(
  () => infoText(props.modelInfo, 'shapeTally', 'Shapes', 'Shape'))
</script>

<template>
  <aside>
    <h1>{{ heading }}</h1>
    <p>{{ materialText }} · {{ shapeText }}</p>
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  left: 1rem;
  top: 5rem;
  width: 18rem;
  height: 5.5rem;
  line-height: 1.5;
  padding: 0.5rem;
  background-color: var(--color-background-soft-translucent);
  border-radius: 4px;
  font-size: 1.3rem;
  z-index: 10;
}
h1 {
  color: var(--color-heading);
}
p {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: bold;
}
</style>
