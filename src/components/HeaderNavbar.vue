<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeaderButton from './HeaderButton.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'

const route = useRoute()

const buttons = [
  {
    name: 'home',
    Icon: EcosystemIcon,
    title: 'Click to return to the homepage',
    to: '/',
  },
  {
    name: 'apartment',
    text: 'Apartment',
    title: 'Click to view the Apartment',
    to: '/apartment/',
  },
  {
    name: 'building',
    text: 'Building',
    title: 'Click to view the Building',
    to: '/building/',
  },
]
</script>

<template>
  <nav>
    <HeaderButton
      v-for="{ name, Icon, text, title, to } in buttons"
      :icon="Icon"
      :isEnabled="route.name !== name"
      :key="name"
      :to="to"
      :text="text"
      :title="title"
    />
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 2.7rem;
  line-height: 0.1;
  padding: 0.2rem;
  background-color: var(--color-background-soft);
  font-size: 1rem;
  z-index: 10;
}
</style>
