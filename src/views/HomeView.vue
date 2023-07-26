<script setup lang="ts">
import GLTFLink from '@/components/GLTFLink.vue'
</script>

<template>
  <aside>
    <h1>Welcome to<br />Cluster Viewer</h1>
    <RouterLink to="/apartment/">
      <GLTFLink
        :cameraPosition="[6.5, 6.5, 6.5]"
        :fov="35"
        :modelPosition="[-1, -1, 3]"
        modelUrl="/models/apartment.glb"
        text="View the Apartment"
      />
    </RouterLink>
    <br />
    <RouterLink to="/building/">
      <GLTFLink
        :cameraPosition="[0, 50, 300]"
        :fov="22"
        :modelPosition="[0, -45, 0]"
        modelUrl="/models/building.glb"
        text="View the Building"
      />
    </RouterLink>
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  left: 1rem;
  top: 5rem;
  width: 18rem;
  line-height: 1.1;
  padding: 0.5rem;
  padding-bottom: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  font-size: 1.3rem;
  z-index: 10;
}
</style>
