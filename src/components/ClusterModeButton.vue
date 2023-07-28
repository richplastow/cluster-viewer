<script setup lang="ts">
import ClusterMode from '@/types/ClusterMode'
defineProps<{
  isEnabled?: boolean
  mode: ClusterMode
  switchMode: (mode: ClusterMode) => void
  text: string
  title: string
}>()
</script>

<template>
  <button
    @click="() => switchMode(mode)"
    :class="isEnabled ? 'enabled' : ''"
    :tabindex="isEnabled ? 1 : -1"
    :title="title"
  >
    {{ text }}
  </button>
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
  font-size: 1.3rem;
  font-weight: bold;
  transition: background-color var(--fast);
  cursor: pointer;
  pointer-events: none;
}
button.enabled {
  background-color: var(--color-background-button-beige);
  color: var(--color-button-text);
  pointer-events: auto;
}
button:hover {
  background-color: var(--color-background-button-beige-hover);
  color: var(--color-button-text-hover);
}
</style>
