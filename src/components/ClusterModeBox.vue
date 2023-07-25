<script setup lang="ts">
import ClusterMode from '../type/ClusterMode.ts'
import ClusterModeButton from './ClusterModeButton.vue';

defineProps<{
  selectedMode: ClusterMode,
  switchMode: (mode: ClusterMode) => void,
}>()

const buttons = [
  { mode:ClusterMode.Material, title:'Cluster by Material' },
  { mode:ClusterMode.Shape, title:'Cluster by Shape' },
  { mode:ClusterMode.None, title:'De-Cluster' },
]
</script>

<template>
  <aside>
    <ClusterModeButton
      v-for="{ mode, title } in buttons"
      :isEnabled="selectedMode !== mode"
      :key="mode"
      :mode="mode"
      :switchMode="switchMode"
      :title="title"
    />
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  right: 1rem;
  bottom: 5rem;
  width: 12rem;
  line-height: 1.2;
  padding: 0.5rem 0.5rem 0;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  z-index: 10;
}
</style>
