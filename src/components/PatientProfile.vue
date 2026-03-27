<template>
  <section class="patient-profile">
    <header class="profile-header">
      <div>
        <h1>Patients > Patient {{ patientId }}</h1>
      </div>
    </header>

    <div class="profile-grid">
      <!-- LEFT: main medical info -->
      <main class="profile-main">
        <section class="card">
          <h2>Basic Information</h2>
          <div class="info-grid">
            <div>
              <span class="label">Date of Birth</span
              ><span>{{ patient.dob }}</span>
            </div>
            <div>
              <span class="label">Age</span><span>{{ patient.age }}</span>
            </div>
            <div>
              <span class="label">Siblings</span
              ><span>{{ patient.siblings }}</span>
            </div>
            <div>
              <span class="label">Age at Diagnosis</span
              ><span>{{ patient.ageAtDiagnosis }}</span>
            </div>
          </div>
        </section>

        <!-- TABS -->
        <div class="tabs">
          <button
            class="tab"
            :class="{ 'tab--active': activeTab === 'anamnesis' }"
            @click="activeTab = 'anamnesis'"
          >
            Anamnesis
          </button>
          <button
            class="tab"
            :class="{ 'tab--active': activeTab === 'diagnostic' }"
            @click="activeTab = 'diagnostic'"
          >
            Diagnostic Test
          </button>
          <button
            class="tab"
            :class="{ 'tab--active': activeTab === 'ai' }"
            @click="activeTab = 'ai'"
          >
            AI Assistant
          </button>
          <button
            class="tab"
            :class="{ 'tab--active': activeTab === 'collab' }"
            @click="activeTab = 'collab'"
          >
            Collaboration
          </button>
        </div>

        <section v-if="activeTab === 'anamnesis'" class="tab-panel">
          <!-- Anamnesis content -->
           <AnamnesisCard />
        </section>
        <section v-else-if="activeTab === 'diagnostic'" class="tab-panel">
          <!-- Diagnostic Test content -->
           <DiagnosticTests />
        </section>
        <section v-else-if="activeTab === 'ai'" class="tab-panel">
          <!-- AI Assistant content -->
           <BlankCard/>
        </section>
        <section v-else class="tab-panel">
          <!-- Collaboration content -->
           <BlankCard/>
        </section>
        
      </main>

      <!-- RIGHT: notes -->
      <aside class="profile-notes">
        <section class="card">
          <div class="notes-header">
            <h2>Notes</h2>
            <button class="button button--ghost">Add note</button>
          </div>

          <div class="notes-list">
            <div class="note" v-for="n in notes" :key="n.id">
              <div class="note-meta">
                <span class="note-author">{{ n.author }}</span>
                <span class="note-date">{{ n.date }}</span>
              </div>
              <p class="note-text">{{ n.text }}</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import AnamnesisCard from "./Cards/AnamnesisCard.vue";
import DiagnosticTests from "./Cards/DiagnosticTests.vue";
import BlankCard from "./Cards/BlankCard.vue";

const route = useRoute();
const patientId = route.params.id as string;
const activeTab = ref<"anamnesis" | "diagnostic" | "ai" | "collab">(
  "anamnesis",
);

const patient = {
  dob: "1989-07-14",
  age: 35,
  siblings: 2,
  ageAtDiagnosis: 12,
  anamnesis: {
    picadar: 7,
    clinicIndex: 5,
    situsInversus: "No",
    fertilityIssues: "Unknown",
    retinitisPigmentosa: "No",
  },
  tests: {
    nno: "Positive",
    hsvm: "Pending",
    tem: "N/A",
    if: "Negative",
    genetics: "Pending",
  },
  temReport: "Short report text here...",
  temImages: [
    { id: "1", name: "TEM 01" },
    { id: "2", name: "TEM 02" },
  ],
};

const notes = [
  {
    id: "n1",
    author: "Dr. Smith",
    date: "2026-03-20",
    text: "Initial consultation.",
  },
  { id: "n2", author: "Lab", date: "2026-03-21", text: "TEM pending." },
];
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin: 0;
}

h2 {
  font-size: 18px;
  margin: 12px 0px;
}

.tabs {
  display: flex;
  gap: 8px;
  justify-content: space-evenly;
  border-bottom: 1px solid #e6e9ef;
  margin: 10px 0;
  background-color: var(--white);
  border-radius: 20px;
}
.tab {
  padding: 8px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid transparent;
}
.tab--active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
.tab-panel {
  padding-top: 12px;
}

.patient-profile {
  padding: 24px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 5fr 2fr;
  gap: 16px;
}

.profile-main,
.profile-notes {
  display: grid;
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  padding: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tests-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.label {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.muted {
  color: #6b7280;
  font-size: 14px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.image-card {
  border: 1px solid #eef1f6;
  border-radius: 8px;
  padding: 8px;
}

.image-placeholder {
  background: #f4f6f9;
  height: 80px;
  border-radius: 6px;
  margin-bottom: 6px;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note {
  border-top: 1px solid #eef1f6;
  padding: 10px 0;
}

.note:first-child {
  border-top: none;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.note-text {
  margin: 6px 0 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.button {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e1e5ea;
  background: #fff;
}

.button--ghost {
  background: transparent;
}

@media (max-width: 960px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .tests-grid,
  .image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
