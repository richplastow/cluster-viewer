<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
defineProps<{
  icon?: Component,
  isEnabled?: boolean,
  text?: string,
  title: string,
  to: string,
}>()
</script>

<template>
  <RouterLink
    :to="to"
    :class="`${isEnabled ? 'enabled' : ''} ${icon ? 'icon' : 'text'}`"
    :tabindex="isEnabled ? 1 : -1"
    :title="title"
  >
    <component v-if="icon" :is="icon" />
    <span v-else>{{ text }}</span>
  </RouterLink>
</template>

<style scoped>
a {
  display: inline-block;
  margin: 0 0.2rem 0.5rem 0;
  padding: 0.5rem;
  line-height: 1.2rem;
  background-color: transparent;
  color: var(--color-button-text-neutral);
  border: 1px solid transparent;
  border-radius: 2px;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color var(--fast); /* but not border-color or color */
  cursor: pointer;
  pointer-events: none;
}
a.icon {
  padding: 0.4rem 0.5rem 0.3rem;
}
a.text {
  transform: translateY(-0.2rem);
}
a.enabled {
  border-color: var(--color-border);
  color: var(--color-button-text-header);
  pointer-events: auto;
}
a:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-button-brick-hover);
  color: var(--color-button-text-header-hover);
}
</style>
