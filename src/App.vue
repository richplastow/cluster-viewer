<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import ClusterModeBox from './components/ClusterModeBox.vue'
import ThreeScene from './components/ThreeScene.vue'
import ClusterMode from './type/ClusterMode.ts'

const selectedMode = ref(ClusterMode.None)
const switchMode = (mode: ClusterMode) => selectedMode.value = mode
</script>

<template>
  <ThreeScene />
  <RouterView />
  <ClusterModeBox :selectedMode="selectedMode" :switchMode="switchMode" />
</template>
