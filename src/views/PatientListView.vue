<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import PatientListTable from '../components/PatientListTable.vue';
</script>

<template>
  <div class="page">
    <Navbar class="navbar"/>
    <main class="main">
      
    <PatientListTable/>
    </main>
    </div>
</template>

<style scoped>
.page {
  display: flex;
}
.navbar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
}
</style>
