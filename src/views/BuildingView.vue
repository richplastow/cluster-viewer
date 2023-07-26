<script setup lang="ts">
import { ref } from 'vue'
import ClusterModeBox from '@/components/ClusterModeBox.vue'
import InfoBox from '@/components/InfoBox.vue'
import ThreeScene from '@/components/ThreeScene.vue'
import ClusterMode from '@/types/ClusterMode'
import type ModelInfo from '@/types/ModelInfo'

const modelInfo = ref<null | ModelInfo>(null)
const reportModelInfo = (info: ModelInfo) => modelInfo.value = info

const selectedMode = ref(ClusterMode.None)
const switchMode = (mode: ClusterMode) => selectedMode.value = mode
</script>

<template>
  <InfoBox :modelInfo="modelInfo" heading="Building" />
  <ClusterModeBox :selectedMode="selectedMode" :switchMode="switchMode" />
  <ThreeScene
    :cameraPosition="[0, 50, 300]"
    :modelPosition="[0, -30, 0]"
    :reportModelInfo="reportModelInfo"
    :selectedMode="selectedMode"
    modelUrl="/models/building.glb"
  />
</template>
