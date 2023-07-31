<script setup lang="ts">
import { ref } from 'vue'
import ClusterModeBox from '@/components/ClusterModeBox.vue'
import { GLTFViewer } from '@/components/GLTF'
import InfoBox from '@/components/InfoBox.vue'
import ClusterMode from '@/types/ClusterMode'
import ColorName from '@/types/ColorName'
import type ModelInfo from '@/types/ModelInfo'

const modelInfo = ref<null | ModelInfo>(null)
const reportModelInfo = (info: ModelInfo) => modelInfo.value = info

const selectedMode = ref(ClusterMode.Original)
const switchMode = (mode: ClusterMode) => selectedMode.value = mode
</script>

<template>
  <InfoBox :modelInfo="modelInfo" heading="Apartment" />
  <ClusterModeBox :selectedMode="selectedMode" :switchMode="switchMode" />
  <GLTFViewer
    :cameraPosition="[6.5, 6.5, 6.5]"
    :modelPosition="[-1, 0, 3]"
    :reportModelInfo="reportModelInfo"
    :selectedMode="selectedMode"
    :invisibleColorName="ColorName.Black"
    modelUrl="/models/apartment.glb"
  />
</template>
