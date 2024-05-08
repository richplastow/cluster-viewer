<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  icon?: Component
  isEnabled?: boolean
  isRight?: boolean
  isWide?: boolean
  text?: string
  title: string
  to: string
}>()

const linkClass = computed(() => {
  const { icon, isEnabled, isRight, isWide } = props
  return {
    icon: icon,
    text: !icon,
    enabled: isEnabled,
    right: isRight,
    wide: isWide,
  }
})
</script>

<template>
  <a
    v-if="to.slice(0, 4) === 'http'"
    :href="to"
    :class="linkClass"
    :tabindex="isEnabled ? 1 : -1"
    :title="title"
    target="_blank"
  >
    <component v-if="icon" :is="icon" />
    <span v-else>{{ text }}</span>
  </a>
  <RouterLink
    v-else
    :to="to"
    :class="linkClass"
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
  padding: 0.45rem 0.5rem 0.55rem;
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
a.right {
  float: right;
}
a.wide {
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}
a:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-button-brick-hover);
  color: var(--color-button-text-header-hover);
}
</style>
