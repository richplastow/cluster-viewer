<script setup lang="ts">
import { GLTFLink } from '@/components/GLTF'
</script>

<template>
  <aside>
    <h1>Welcome to <br />Cluster Viewer</h1>
    <RouterLink to="/building/">
      <GLTFLink
        :cameraPosition="[0, 50, 300]"
        :fov="22"
        :modelPosition="[0, -45, 0]"
        modelUrl="/models/building.glb"
        text="View the Building"
      />
    </RouterLink>
    &nbsp;
    <RouterLink to="/apartment/">
      <GLTFLink
        :cameraPosition="[6.5, 6.5, 6.5]"
        :fov="35"
        :modelPosition="[-1, -1, 3]"
        modelUrl="/models/apartment.glb"
        text="View the Apartment"
      />
    </RouterLink>
  </aside>
</template>

<style scoped>
aside {
  display: inline-block;
  position: relative;
  top: 5rem;
  width: 18rem;
  line-height: 1.1;
  padding: 0.5rem;
  padding-bottom: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  font-size: 1.3rem;
  text-align: left;
  z-index: 10;
}

/* Breakpoints based on <https://tailwindcss.com/docs/responsive-design>. */
/* sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px */
@media (min-width: 768px) {
  aside {
    width: 42rem;
  }
}
@media (min-width: 1024px) {
  aside {
    width: 58rem;
  }
}
/* @TODO no need to scroll on small landscape screen sizes */
</style>
