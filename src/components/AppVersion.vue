<script setup lang="ts">
import { APP_VERSION } from '@/constants'
</script>

<template>
  <span>{{ APP_VERSION }}</span>
</template>

<style scoped>
span {
  position: fixed;
  left: 0.5rem;
  bottom: 0.5rem;
  font-size: 0.7rem;
}
</style>
