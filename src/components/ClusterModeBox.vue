<script setup lang="ts">
import ClusterMode from '../types/ClusterMode.ts'
import ClusterModeButton from './ClusterModeButton.vue';

defineProps<{
  selectedMode: ClusterMode,
  switchMode: (mode: ClusterMode) => void,
}>()

const buttons = [
  { mode:ClusterMode.Material, text:'Cluster by Material', title:'Click to arrange into clusters of the same material' },
  { mode:ClusterMode.Shape, text:'Cluster by Shape', title:'Click to arrange into clusters of similar shape' },
  { mode:ClusterMode.None, text:'Original', title:'Click to show the original model' },
]
</script>

<template>
  <aside>
    <ClusterModeButton
      v-for="{ mode, text, title } in buttons"
      :isEnabled="selectedMode !== mode"
      :key="mode"
      :mode="mode"
      :switchMode="switchMode"
      :text="text"
      :title="title"
    />
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  bottom: 2rem;
  right: 1rem;
  width: 18rem;
  line-height: 1.2;
  padding: 0.5rem 0.5rem 0;
  background-color: var(--color-background-soft-translucent);
  border-radius: 4px;
  z-index: 10;
}
</style>
