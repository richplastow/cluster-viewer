<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeaderButton from './HeaderButton.vue'
import IconEcosystem from './icons/IconEcosystem.vue'
import IconGithub from './icons/IconGithub.vue'

const route = useRoute()

const buttons = [
  {
    name: 'home',
    icon: IconEcosystem,
    title: 'Click to return to the homepage',
    to: '/',
  },
  {
    name: 'building',
    text: 'Building',
    title: 'Click to view the Building',
    to: '/building/',
  },
  {
    name: 'apartment',
    text: 'Apartment',
    title: 'Click to view the Apartment',
    to: '/apartment/',
  },
  {
    name: 'github',
    icon: IconGithub,
    isRight: true,
    title: 'Click to see this app’s GitHub repository',
    to: 'https://github.com/richplastow/cluster-viewer',
  },
]
</script>

<template>
  <nav>
    <HeaderButton
      v-for="{ name, icon, isRight, text, title, to } in buttons"
      :icon="icon"
      :isEnabled="route.name !== name"
      :isRight="isRight"
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
  text-align: left;
  z-index: 10;
}
</style>
