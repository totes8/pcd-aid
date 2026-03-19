<script setup lang="ts"></script>

<template>
  <main class="app-shell">
    <router-view />
  </main>
</template>

<style>
:root {
  --bg: #F1F7FD;
  --bg-2: #d7e2ee;
  --text-muted: #5E657D;
  --muted: #5a6a7a;
  --card: #f8fbff;
  --stroke: #c6d4e3;
  --accent: #0074FF;
  --accent-hover: #0767dc;
  --accent-2: #e8b04a;
  --danger: #b34b3d;
  --shadow: 0 1px 4px #0C0C0D25;

  background-color: var(--bg);
  font-family: "Inter", "Segoe UI", sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
}
</style>

<style scoped>
.app-shell {
  min-height: 100vh;
}
</style>
