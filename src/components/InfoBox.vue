<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <aside>
    <h1>{{ title }}</h1>
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  left: 1rem;
  top: 5rem;
  width: 12rem;
  height: 5rem;
  line-height: 1.2;
  padding: 0.5rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  z-index: 10;
}
</style>
