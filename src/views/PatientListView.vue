<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import PatientListTable from '../components/PatientListTable.vue';
</script>

<template>
  <div class="page">
    <Navbar/>
    <main class="main">
      
    <PatientListTable/>
    </main>
    </div>
</template>

<style scoped>
.page {
  display: flex;
}
</style>
