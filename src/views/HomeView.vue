<template>
  <aside>
    <h1>Welcome to<br />Cluster Viewer!</h1>
    <RouterLink to="/apartment/">Apartment</RouterLink>
    <br />
    <RouterLink to="/building/">Building</RouterLink>
  </aside>
</template>

<style scoped>
aside {
  position: fixed;
  left: 1rem;
  top: 5rem;
  width: 18rem;
  height: 12rem;
  line-height: 1.2;
  padding: 0.5rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  font-size: 1.3rem;
  z-index: 10;
}
</style>
