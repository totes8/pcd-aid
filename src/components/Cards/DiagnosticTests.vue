<template>
  <section class="card">
    <div class="diag-tabs">
      <button
        v-for="t in tabs"
        :key="t"
        class="diag-tab"
        :class="{ 'diag-tab--active': activeTab === t }"
        @click="activeTab = t"
      >
        {{ t }}
      </button>
    </div>

    <div class="diag-panel">
      <div v-if="activeTab === 'nNO'">
        <nNOCard :patientId="patientId" />
      </div>

      <div v-else-if="activeTab === 'HSVM'">
        <HSVMCard :patientId="patientId" />
      </div>

      <div v-else-if="activeTab === 'TEM'">
        <TEMCard />
      </div>

      <div v-else-if="activeTab === 'IF'">
        <IFCard :patientId="patientId" />
      </div>

      <div v-else>
        <GeneticsCard :patientId="patientId" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import nNOCard from "./nNOCard.vue";
import HSVMCard from "./HSVMCard.vue";
import TEMCard from "./TEMCard.vue";
import IFCard from "./IFCard.vue";
import GeneticsCard from "./GeneticsCard.vue";

defineProps<{ patientId: string }>();

const tabs = ["nNO", "HSVM", "TEM", "IF", "Genetics"] as const;
const activeTab = ref<(typeof tabs)[number]>("nNO");
</script>

<style scoped>
.diag-tabs {
  display: flex;
  justify-content: space-evenly;
  gap: 8px;
  border-bottom: 1px solid #e6e9ef;
  margin-bottom: 12px;
  border-radius: 20px;
  border: 1px solid #e6e9ef;
}

.diag-tab {
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid transparent;
}

.diag-tab--active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.diag-panel h3 {
  margin: 0 0 6px;
}

.muted {
  color: #6b7280;
  font-size: 14px;
}

</style>
