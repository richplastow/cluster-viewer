<script setup lang="ts">
import { ref } from 'vue'
import ClusterMode from '@/types/ClusterMode'
import ClusterModeBox from '@/components/ClusterModeBox.vue'
import InfoBox from '../components/InfoBox.vue'
import ThreeScene from '../components/ThreeScene.vue'

const selectedMode = ref(ClusterMode.None)
const switchMode = (mode: ClusterMode) => selectedMode.value = mode
</script>

<template>
  <InfoBox title="Building" />
  <ClusterModeBox :selectedMode="selectedMode" :switchMode="switchMode" />
  <ThreeScene
    :cameraDistance="100"
    modelUrl="/models/building.glb"
    :selectedMode="selectedMode"
  />
</template>
