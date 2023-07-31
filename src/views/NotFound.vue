<script setup lang="ts">
import HeaderButton from '@/components/HeaderButton.vue'

</script>

<template>
  <div>
    <aside>
      <h2>Not Found</h2>
      <HeaderButton
        :isEnabled="true"
        :isWide="true"
        text="Return to the homepage"
        title="Click to return to the homepage"
        to="/"
      />
    </aside>
  </div>
</template>

<style scoped>
div {
  position: fixed;
  top: 5rem;
  left: 0;
  right: 0;
}
aside {
  display: inline-block;
  width: 18rem;
  height: 7rem;
  line-height: 1.5;
  padding: 0.5rem;
  background-color: var(--color-background-soft-translucent);
  border-radius: 4px;
  font-size: 1.3rem;
  z-index: 10;
}
h2 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}
</style>
