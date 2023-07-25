<template>
  <main>
    <Renderer :autoResize="true" :antialias="true">
      <PerspectiveCamera :position="[7, 7, 7]" :up="[0, 1, 0]">
        <OrbitControls />
      </PerspectiveCamera>

      <Scene background="#333">
        <DirectionalLight :position="[30, 100, 100]" :color="0xffffff" />
        <DirectionalLight :position="[-30, 100, -100]" :color="0xffffff" />
        <GLTFLoader url="/apartment.glb" />
      </Scene>

    </Renderer>
  </main>
</template>

<style scoped>
main {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
