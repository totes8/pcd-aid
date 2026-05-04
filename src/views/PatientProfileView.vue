<template lang="html">
  <div class="page">
    <Navbar class="navbar"/>
    <main class="main">
      <PatientProfile />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import PatientProfile from "../components/PatientProfile.vue";
</script>


<style scoped lang="css">
.page {
  display: flex;
  min-height: 100vh;
}
.main {
  flex: 1;
  min-width: 0; 
}
.navbar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
}

</style>
