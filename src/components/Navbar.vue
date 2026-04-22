<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="brand">
        <img class="brand-logo" src="../assets/pcdaid_logo.svg" alt="PCDAid" />
        <div class="brand-text">
          <div class="brand-title">PCD<span class="blue-text">Aid</span></div>
        </div>
      </div>

      <div class="profile-card">
        <div class="avatar">JM</div>
        <div>
          <div class="name">MUDr. Janko Mrkvička</div>
          <div class="role">Pulmonology</div>
        </div>
      </div>

      <nav class="nav">
        <router-link class="nav-item" to="/patients">
          <Users/><span>Patients</span>
        </router-link>
        <router-link class="nav-item" to="/organization">
          <Globe /><span>My Organization</span>
        </router-link>
        <router-link class="nav-item" to="/collaboration">
          <Handshake /><span>Collaboration</span>
        </router-link>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <router-link class="nav-item settings" to="/settings">
        <Settings /><span>Settings</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {Users, Globe, Handshake, Settings} from "lucide-vue-next";
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Tilt+Warp&display=swap');

.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 250px;
  flex-shrink: 0;
  box-sizing: border-box;
  background-color: var(--white);
  background-color: var(--white);
  padding: 20px;
  box-shadow: var(--shadow);
}

.avatar {
  background-color: #e1e5ea;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: auto;
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 12px;

}

.name {
  margin-right: 0px;
}

.brand {
    display: flex;
    align-items: center;
    margin-bottom: 28px;
}

.brand-text {
    margin-left: 24px;
    font-family: 'Tilt Warp', cursive;
    font-size: 32px;
}

.blue-text {
    color: var(--accent);
}

.nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
}

.nav-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 500;
}

.nav-item:hover {
    background-color: var(--bg);
    color: var(--accent);
}

.profile-card {
  background-color: var(--bg);
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  padding: 4px;
}
</style>
