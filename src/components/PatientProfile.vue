<template>
  <section class="patient-profile">
    <header class="profile-header">
      <div>
        <h1 class="breadcrumb">
          <router-link class="breadcrumb-link" :to="{ name: 'patients' }">Patients</router-link>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">Patient {{ patientId }}</span>
        </h1>
      </div>
    </header>

    <div class="profile-grid">
      <!-- LEFT: main medical info -->
      <main class="profile-main">
        <section class="card">
          <div class="card-header">
            <div class="flex-row"><User class="icon"/><h2>Basic Information</h2></div>
            <div class="card-actions">
              <button
                v-if="!editingBasicInfo"
                class="button button--ghost"
                @click="startEditBasicInfo"
              >
                Edit
              </button>
              <button
                v-else
                class="button"
                :disabled="!basicInfoValid"
                @click="saveBasicInfo"
              >
                Save
              </button>
              <button
                v-if="editingBasicInfo"
                class="button button--ghost"
                @click="cancelEditBasicInfo"
              >
                Cancel
              </button>
            </div>
          </div>

          <div class="basic-meta">
            <div class="meta-chip">
              <span class="meta-label">Added by</span>
              <span class="meta-value">{{ patient.clinician }}</span>
            </div>

            <div class="meta-chip">
              <span class="meta-label">PCD Status</span>
              <div class="meta-value">
                <select
                  v-if="editingBasicInfo"
                  v-model="basicInfoDraft.status"
                  class="input input--compact"
                >
                  <option v-for="s in pcdStatusOptions" :key="s" :value="s">{{ s }}</option>
                </select>
                <span
                  v-else
                  class="status-pill"
                  :data-status="patient.status"
                  :title="pcdStatusMeta[patient.status].description"
                >
                  <span class="status-dot" aria-hidden="true"></span>
                  {{ pcdStatusMeta[patient.status].label }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="!editingBasicInfo" class="info-grid">
            <div>
              <span class="label">Date of Birth</span>
              <span>{{ patient.dob }}</span>
            </div>
            <div>
              <span class="label">Age</span>
              <span>{{ patient.age }}</span>
            </div>
            <div>
              <span class="label">Siblings</span>
              <span>{{ patient.siblings }}</span>
            </div>
            <div>
              <span class="label">Age at Diagnosis</span>
              <span>{{ patient.ageAtDiagnosis }}</span>
            </div>
            <div>
              <span class="label">Blood Relatives with PCD</span>
              <span>{{ patient.bloodRelativesWithPCD }}</span>
            </div>
          </div>

          <div v-else class="form-grid">
            <label class="field">
              <span class="label">Date of Birth</span>
              <input v-model="basicInfoDraft.dob" type="date" class="input" />
              <span v-if="basicInfoDobError" class="error-text">{{ basicInfoDobError }}</span>
            </label>

            <label class="field">
              <span class="label">Age</span>
              <input :value="basicInfoAge" type="number" class="input" disabled />
            </label>

            <label class="field">
              <span class="label">Siblings</span>
              <input
                v-model.number="basicInfoDraft.siblings"
                type="number"
                min="0"
                step="1"
                class="input"
              />
            </label>

            <label class="field">
              <span class="label">Age at Diagnosis</span>
              <input
                v-model.number="basicInfoDraft.ageAtDiagnosis"
                type="number"
                min="0"
                step="1"
                class="input"
              />
            </label>

            <label class="field">
              <span class="label">Blood Relatives with PCD</span>
              <input
                v-model.number="basicInfoDraft.bloodRelativesWithPCD"
                type="number"
                min="0"
                step="1"
                class="input"
              />
            </label>
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
           <AnamnesisCard :patientId="patientId" />
        </section>
        <section v-else-if="activeTab === 'diagnostic'" class="tab-panel">
          <!-- Diagnostic Test content -->
           <DiagnosticTests :patientId="patientId" />
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
            <button
              v-if="!addingNote"
              class="button button--ghost add-note-button"
              @click="startAddNote"
            >
              Add note
            </button>
          </div>

          <div v-if="addingNote" class="note-composer">
            <textarea
              v-model="newNoteText"
              class="input"
              rows="4"
              placeholder="Write a note..."
            ></textarea>
            <div class="composer-actions">
              <button class="button button--ghost" @click="cancelAddNote">Cancel</button>
              <button
                class="button--accent"
                :disabled="!newNoteText.trim()"
                @click="saveNote"
              >
                Save
              </button>
            </div>
          </div>

          <div class="notes-list">
            <p v-if="notes.length === 0" class="muted empty-notes">No notes yet.</p>
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
import { computed, reactive, ref } from "vue";
import AnamnesisCard from "./Cards/AnamnesisCard.vue";
import DiagnosticTests from "./Cards/DiagnosticTests.vue";
import BlankCard from "./Cards/BlankCard.vue";
import { type PatientStatus, usePatientsStore } from "../stores/patients";
import { User } from "lucide-vue-next";

const route = useRoute();
const patientId = route.params.id as string;
const activeTab = ref<"anamnesis" | "diagnostic" | "ai" | "collab">(
  "anamnesis",
);

const patientsStore = usePatientsStore();
const pcdStatusOptions: readonly PatientStatus[] = [
  "Not Diagnosed",
  "Highly Suspected",
  "Confirmed PCD",
  "PCD Unconfirmed",
];
const pcdStatusMeta: Record<PatientStatus, { label: string; description: string }> = {
  "Not Diagnosed": {
    label: "Not diagnosed",
    description: "No confirmed diagnosis yet.",
  },
  "Highly Suspected": {
    label: "High suspicion",
    description: "Strong clinical suspicion; confirmation pending.",
  },
  "Confirmed PCD": {
    label: "Confirmed",
    description: "PCD diagnosis confirmed.",
  },
  "PCD Unconfirmed": {
    label: "Unconfirmed",
    description: "PCD not confirmed based on current data.",
  },
};

function calcAge(dob: string): number {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return NaN;

  const birth = new Date(y, m - 1, d);
  if (Number.isNaN(birth.getTime())) return NaN;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasHadBirthday) age -= 1;
  return age;
}

function isValidDob(dob: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false;
  const age = calcAge(dob);
  // Reject invalid/future DOBs and obviously wrong ages.
  return Number.isFinite(age) && age >= 0 && age <= 130;
}

const patient = reactive({
  dob: "1989-07-14",
  age: calcAge("1989-07-14"),
  clinician: "Janko Mrkvička",
  status: "Not Diagnosed" as PatientStatus,
  siblings: 0,
  ageAtDiagnosis: 0,
  bloodRelativesWithPCD: 0,
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
});

// Prefer store data when available (currently mock store is the closest thing to source-of-truth).
const storePatient = patientsStore.byId(patientId);
if (storePatient) {
  patient.dob = storePatient.dob;
  patient.age = storePatient.age;
  patient.clinician = storePatient.clinician;
  patient.status = storePatient.status;
}

const editingBasicInfo = ref(false);
const basicInfoDraft = reactive({
  dob: patient.dob,
  clinician: patient.clinician,
  status: patient.status,
  siblings: patient.siblings,
  ageAtDiagnosis: patient.ageAtDiagnosis,
  bloodRelativesWithPCD: patient.bloodRelativesWithPCD,
});

const basicInfoAge = computed(() => {
  const age = calcAge(basicInfoDraft.dob);
  return Number.isFinite(age) ? age : "";
});
const basicInfoDobError = computed(() => {
  if (isValidDob(basicInfoDraft.dob)) return null;
  return "Please enter a valid date.";
});
const basicInfoValid = computed(() => {
  const okDob = isValidDob(basicInfoDraft.dob);
  const okStatus = pcdStatusOptions.includes(basicInfoDraft.status);
  const okSiblings = Number.isFinite(basicInfoDraft.siblings) && basicInfoDraft.siblings >= 0;
  const okDiagAge =
    Number.isFinite(basicInfoDraft.ageAtDiagnosis) && basicInfoDraft.ageAtDiagnosis >= 0;
  const okRelatives =
    Number.isFinite(basicInfoDraft.bloodRelativesWithPCD) &&
    basicInfoDraft.bloodRelativesWithPCD >= 0;
  return okDob && okStatus && okSiblings && okDiagAge && okRelatives;
});

function startEditBasicInfo() {
  editingBasicInfo.value = true;
  basicInfoDraft.dob = patient.dob;
  basicInfoDraft.clinician = patient.clinician;
  basicInfoDraft.status = patient.status;
  basicInfoDraft.siblings = patient.siblings;
  basicInfoDraft.ageAtDiagnosis = patient.ageAtDiagnosis;
  basicInfoDraft.bloodRelativesWithPCD = patient.bloodRelativesWithPCD;
}

function cancelEditBasicInfo() {
  editingBasicInfo.value = false;
  basicInfoDraft.dob = patient.dob;
  basicInfoDraft.clinician = patient.clinician;
  basicInfoDraft.status = patient.status;
  basicInfoDraft.siblings = patient.siblings;
  basicInfoDraft.ageAtDiagnosis = patient.ageAtDiagnosis;
  basicInfoDraft.bloodRelativesWithPCD = patient.bloodRelativesWithPCD;
}

function saveBasicInfo() {
  if (!basicInfoValid.value) return;

  patient.dob = basicInfoDraft.dob;
  patient.age = calcAge(patient.dob);
  patient.status = basicInfoDraft.status;
  patient.siblings = basicInfoDraft.siblings;
  patient.ageAtDiagnosis = basicInfoDraft.ageAtDiagnosis;
  patient.bloodRelativesWithPCD = basicInfoDraft.bloodRelativesWithPCD;
  editingBasicInfo.value = false;

  // Best-effort: keep the list store in sync if it already has this patient.
  const listItem = patientsStore.byId(patientId);
  if (listItem) {
    listItem.dob = patient.dob;
    listItem.age = patient.age;
    listItem.status = patient.status;
    listItem.lastUpdate = new Date().toISOString().slice(0, 10);
  }
}

type NoteItem = { id: string; author: string; date: string; text: string };

const notes = ref<NoteItem[]>([]);
const addingNote = ref(false);
const newNoteText = ref("");

function startAddNote() {
  addingNote.value = true;
  newNoteText.value = "";
}

function cancelAddNote() {
  addingNote.value = false;
  newNoteText.value = "";
}

function saveNote() {
  const text = newNoteText.value.trim();
  if (!text) return;

  notes.value.unshift({
    id: `n_${Date.now()}`,
    author: patient.clinician || "Janko Mrkvička",
    date: new Date().toISOString().slice(0, 10),
    text,
  });

  addingNote.value = false;
  newNoteText.value = "";
}
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 700;
}

.breadcrumb-link:hover {
  text-decoration-thickness: 2px;
}

.breadcrumb-sep {
  color: #9aa3af;
}

.breadcrumb-current {
  color: #111827;
  font-weight: 650;
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
  align-items: start;
}

.profile-main,
.profile-notes {
  display: grid;
  gap: 16px;
}

.profile-notes {
  align-self: start;
}

.card {
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.basic-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 10px 0 14px;
  padding: 10px;
  border: 1px solid #eef1f6;
  border-radius: 14px;
  background: linear-gradient(180deg, #fafbff 0%, #ffffff 100%);
}

.meta-chip {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fff;
}

.meta-label {
  font-size: 12px;
  color: #6b7280;
}

.meta-value {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 650;
  color: #111827;
  min-height: 32px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid transparent;
  width: fit-content;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.9;
}

.status-pill[data-status="Not Diagnosed"] {
  background: #f1f3f7;
  color: #4b5563;
  border-color: #e6e9ef;
}
.status-pill[data-status="Highly Suspected"] {
  background: #fff4e5;
  color: #8a5a00;
  border-color: #ffe1b3;
}
.status-pill[data-status="Confirmed PCD"] {
  background: #e7f6ed;
  color: #1b5e20;
  border-color: #cfeedd;
}
.status-pill[data-status="PCD Unconfirmed"] {
  background: #fbeaec;
  color: #8a1f2c;
  border-color: #f7cbd1;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.flex-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input {
  border: 1px solid #e1e5ea;
  background: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(75, 108, 255, 0.12);
}

.input:disabled {
  background: #f4f6f9;
  color: #6b7280;
}

.input--compact {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 999px;
  width: 100%;
  max-width: 220px;
}

.error-text {
  font-size: 12px;
  color: #b91c1c;
}

.icon {
  color: var(--accent);
  background-color: var(--accent-transparent);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  padding: 4px;
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


.note-composer {
  display: grid;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fafbfe;
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty-notes {
  margin: 10px 0 0;
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
  cursor: pointer;
}

.button:hover {
  background: var(--white-hover);
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.button--ghost {
  background: transparent;
}

.button--accent {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: var(--accent);
  border: 1px solid #e1e5ea;
  color: #fff;
}

.button--accent:hover {
  background-color: var(--accent-hover);
}

@media (max-width: 960px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .basic-meta {
    grid-template-columns: 1fr;
  }
  .tests-grid,
  .image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
