<script setup lang="ts">
import ClusterMode from '../type/ClusterMode.ts'
defineProps<{
  isEnabled?: boolean,
  mode: ClusterMode,
  switchMode: (mode: ClusterMode) => void,
  title: string,
}>()
</script>

<template>
  <button
    @click="() => switchMode(mode)"
    :className="isEnabled ? 'enabled' : ''"
    :tabindex="isEnabled ? 1 : -1"
  >{{ title }}</button>
</template>

<style scoped>
button {
  width: 100%;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-background-button-neutral);
  color: var(--color-button-text-neutral);
  border: none;
  border-radius: 2px;
  transition: background-color var(--fast);
  cursor: pointer;
  pointer-events: none;
}
button.enabled {
  background-color: var(--color-background-button-blue);
  color: var(--color-button-text);
  pointer-events: auto;
}
button:hover {
  background-color: var(--color-background-button-blue-hover);
  color: var(--color-button-text-hover);
}
</style>
