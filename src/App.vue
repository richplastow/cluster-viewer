<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNavbar from './components/HeaderNavbar.vue'
import AppVersion from './components/AppVersion.vue'
import { SHOW_VERSION } from './constants'
</script>

<template>
  <HeaderNavbar />
  <RouterView />
  <AppVersion v-if="SHOW_VERSION" />
</template>
