<template lang="html">
  <div class="page">
    <Navbar class="navbar"/>
    <main class="main">
      This page is not available yet =C
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
</script>

<style scoped>

.page {
  display: flex;
  min-height: 100vh;
}
.main {
   flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;   /* vertical */
  justify-content: center;
}
.navbar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
}

</style>
