<template lang="html">
  <section class="patient-list">
    <header class="patient-list__header">
      <h1>Patients</h1>
      <button class="add-patient-button button" @click="openModal">
  + Add new patient
</button>
    </header>

<!-- MDOAL -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
  <div class="modal">
    <h3>Add patient</h3>

    <label class="field">
      <span class="label">Patient ID</span>
      <input v-model="newId" class="input" type="text" placeholder="XXXX" />
    </label>

    <label class="field">
      <span class="label">Date of birth</span>
      <input v-model="newDob" class="input" type="date" />
    </label>

    <div class="modal-actions">
      <button class="button button--ghost" @click="closeModal">Cancel</button>
      <button class="button" @click="submitNewPatient">Create</button>
    </div>
  </div>
</div>

    <div class="table-wrap">
      <!-- SEARCH BAR -->
      <div class="patient_list__search_bar">
        <div class="patient-list__filters">
          <input
            v-model="query"
            class="input"
            type="search"
            placeholder="Search by ID…"
            aria-label="Search by ID"
          />
          <select
            v-model="statusFilter"
            class="input"
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="search-bar__actions">
        <button class="button button--ghost" @click="resetFilters"><RotateCcw :size="16"/>
          Reset filters
        </button>
        <button class="button smart-search-button" @click="showSmartSearch = !showSmartSearch">
          <Sparkles :size="16" />
          Smart search
        </button>
        <button
          class="advanced-search-button button"
          @click="showAdvanced = !showAdvanced"
        >
          {{ showAdvanced ? "Hide extended search" : "Show extended search" }}
          <ArrowDown :size="16" class="arrow" :class="{ 'arrow--open': showAdvanced }" />
        </button>
        </div>
      </div>

      <!-- ADVANCED SEARCH-->
      <div v-if="showAdvanced" class="advanced-search">
        <div class="advanced-field">
          <label>Age (years)</label>
          <div class="age-range">
            <input
              v-model.number="ageMin"
              class="input"
              type="number"
              min="0"
              placeholder="Min"
            />
            <span class="range-sep">—</span>
            <input
              v-model.number="ageMax"
              class="input"
              type="number"
              min="0"
              placeholder="Max"
            />
          </div>
        </div>

        <div class="advanced-field">
          <label>TEM</label>
          <select v-model="temFilter" class="input">
            <option value="">Any</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="N/A">N/A</option>
          </select>
        </div>
      </div>

      <!-- SMART SEARCH (Wizard-of-Oz stub) -->
      <div v-if="showSmartSearch" class="smart-search">
        <div class="smart-search__header">
          <h3>Smart search</h3>
          <p class="muted">
            Describe what you're looking for (we'll rank matching patients next).
          </p>
        </div>

        <textarea
          v-model="smartPrompt"
          class="input smart-search__input"
          rows="4"
          placeholder="e.g. Patients with high PICADAR score and neonatal RDS..."
        ></textarea>

        <div class="smart-search__actions">
          <button class="button button--ghost" @click="smartPrompt = ''">Clear</button>
          <button class="button button--accent" :disabled="!smartPrompt.trim()" @click="runSmartSearch">
            Search
          </button>
        </div>

        <p v-if="smartSearchApplied && lastSmartPrompt" class="muted smart-search__stub">
          Ranked by: "{{ lastSmartPrompt }}"
        </p>
      </div>

      <!-- PATIENTS TABLE  -->

      <table class="table">
        <thead>
          <tr>
            <th class="sticky-left" @click="toggleSort('id')">
              ID <span class="sort">{{ sortIndicator("id") }}</span>
            </th>
            <th @click="toggleSort('dob')">
              Date of Birth <span class="sort">{{ sortIndicator("dob") }}</span>
            </th>
            <th @click="toggleSort('status')" class="divider">
              Status <span class="sort">{{ sortIndicator("status") }}</span>
            </th>
            <th>HSVM</th>
            <th>nNO</th>
            <th>TEM</th>
            <th>IF</th>
            <th class="divider">Genetics</th>
            <th @click="toggleSort('dateAdded')">
              Date added
              <span class="sort">{{ sortIndicator("dateAdded") }}</span>
            </th>
            <th @click="toggleSort('lastUpdate')">
              Last update
              <span class="sort">{{ sortIndicator("lastUpdate") }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-for="p in displayedPatients" :key="p.id">
          <tr @click="goToPatient(p.id)" class="row-click">
            <td class="sticky-left id">{{ p.id }}</td>
            <td>
              <div>{{ p.dob }}</div>
              <div class="muted">{{ p.age }} years</div>
            </td>
            <td class="divider">
              <span class="pill" :data-status="p.status">{{ p.status }}</span>
            </td>
            <td>
              <span class="diag" :data-state="p.hsvm">{{ p.hsvm }}</span>
            </td>
            <td>
              <span class="diag" :data-state="p.nno">{{ p.nno }}</span>
            </td>
            <td>
              <span class="diag" :data-state="p.tem">{{ p.tem }}</span>
            </td>
            <td>
              <span class="diag" :data-state="p.if">{{ p.if }}</span>
            </td>
            <td class="divider">
              <span class="diag" :data-state="p.genetics">{{
                p.genetics
              }}</span>
            </td>
            <td>{{ p.dateAdded }}</td>
            <td>{{ p.lastUpdate }}</td>
          </tr>
          <tr v-if="smartSearchApplied && smartResultById[p.id]" class="smart-result-row">
            <td :colspan="10" class="smart-result-cell">
              <div class="smart-result">
                <div class="smart-result-top">
                  <span class="smart-level" :data-level="smartResultById[p.id].level">
                    {{ smartResultById[p.id].level }}
                  </span>
                  <span class="smart-score">Relevance {{ smartResultById[p.id].score }}</span>
                </div>

                <div class="smart-evidence-list">
                  <div
                    v-for="(ev, idx) in smartResultById[p.id].evidences"
                    :key="`${p.id}-ev-${idx}`"
                    class="smart-evidence"
                  >
                    <span class="smart-chevron">›</span>
                    <div>
                      <div class="smart-evidence-title">{{ ev.label }}</div>
                      <div class="smart-evidence-preview">{{ ev.preview }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePatientsStore } from "../stores/patients";
import { ArrowDown, RotateCcw, Sparkles } from "lucide-vue-next";

const patientsStore = usePatientsStore();
const router = useRouter();


const query = ref("");

const showAdvanced = ref(false);
const ageMin = ref<number | null>(null);
const ageMax = ref<number | null>(null);
const temFilter = ref<"" | "Positive" | "Negative" | "N/A">("");

const showSmartSearch = ref(false);
const smartPrompt = ref("");
const lastSmartPrompt = ref("");
const smartSearchApplied = ref(false);

type SmartMatchLevel = "High match" | "Medium match" | "Low match";
type SmartEvidence = { label: string; preview: string };
type SmartResult = { score: number; level: SmartMatchLevel; evidences: SmartEvidence[] };
const smartResultById = ref<Record<string, SmartResult>>({});

const showModal = ref(false);
const newId = ref("");
const newDob = ref("");

function openModal() {
  showModal.value = true;
}

function runSmartSearch() {
  const prompt = smartPrompt.value.trim();
  if (!prompt) return;

  const results: Record<string, SmartResult> = {};
  for (const patient of filteredPatients.value) {
    results[patient.id] = buildSmartResult(patient, prompt);
  }

  smartResultById.value = results;
  lastSmartPrompt.value = prompt;
  smartSearchApplied.value = true;
}

function closeModal() {
  showModal.value = false;
  newId.value = "";
  newDob.value = "";
}

function submitNewPatient() {
  if (!newId.value || !newDob.value) return;
  patientsStore.addPatient({ id: newId.value.trim(), dob: newDob.value });
  closeModal();
}

const filteredPatients = computed(() => {
  const q = query.value.trim().toLowerCase();
  let items = patientsStore.items;

  if (q) items = items.filter((p) => p.id.toLowerCase().includes(q));
  if (statusFilter.value) items = items.filter((p) => p.status === statusFilter.value);

  if (ageMin.value != null) items = items.filter((p) => p.age >= ageMin.value!);
  if (ageMax.value != null) items = items.filter((p) => p.age <= ageMax.value!);

  if (temFilter.value) items = items.filter((p) => p.tem === temFilter.value);

  return items;
});

const displayedPatients = computed(() => {
  const items = [...filteredPatients.value];
  if (!smartSearchApplied.value) return items;

  return items.sort((a, b) => {
    const scoreA = smartResultById.value[a.id]?.score ?? 0;
    const scoreB = smartResultById.value[b.id]?.score ?? 0;
    if (scoreA === scoreB) return a.id.localeCompare(b.id);
    return scoreB - scoreA;
  });
});

const statuses = ["Not Diagnosed", "Highly Suspected", "Confirmed PCD", "PCD Unconfirmed"];

const statusFilter = ref("");
const sortKey = ref("lastUpdate");
const sortDir = ref("desc");

/*const filtered = computed(() => {
  return filteredPatients.value.filter((p) => {
    const matchesQuery = p.id.toLowerCase().includes(query.value.toLowerCase());
    const matchesStatus =
      !statusFilter.value || p.status === statusFilter.value;
    return matchesQuery && matchesStatus;
  });
});*/

/*const sortedPatients = computed(() => {
  const items = [...filtered.value];
  items.sort((a, b) => {
    const av = a[sortKey.value];
    const bv = b[sortKey.value];

    if (av === bv) return 0;
    if (sortDir.value === "asc") return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
  return items;
});*/

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

function sortIndicator(key: string) {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "▲" : "▼";
}

function resetFilters() {
  query.value = "";
  statusFilter.value = "";
  ageMin.value = null;
  ageMax.value = null;
  temFilter.value = "";
  smartSearchApplied.value = false;
  smartResultById.value = {};
  lastSmartPrompt.value = "";
  smartPrompt.value = "";
}

function goToPatient(id: string) {
  router.push({ name: "patientProfile", params: { id } });
}

onMounted(() => {
  patientsStore.fetchList();
});

function buildSmartResult(patient: any, prompt: string): SmartResult {
  const normalized = prompt.toLowerCase();
  let score = 0;
  const evidences: SmartEvidence[] = [];

  const hasAny = (...words: string[]) => words.some((w) => normalized.includes(w));

  if (hasAny("nno", "nitric oxide")) {
    score += 3;
    evidences.push({
      label: "nNO signal",
      preview: `nNO workflow state: ${patient.nno ?? "Unknown"}.`,
    });
    if (hasAny("low", "reduced")) {
      score += patient.nno === "Done" ? 2 : 1;
      evidences.push({
        label: "Low nNO cue",
        preview: patient.nno === "Done"
          ? "nNO is completed; measured ppb can be inspected in diagnostic entries."
          : "nNO measurement is not completed yet; low-value confirmation pending.",
      });
    }
  }

  if (hasAny("tem", "inconclusive", "unclear ultrastructure")) {
    score += 2;
    if (patient.tem === "N/A") score += 2;
    evidences.push({
      label: "TEM cue",
      preview: patient.tem === "N/A"
        ? "TEM currently marked as N/A, which can indicate unresolved or incomplete evidence."
        : `TEM state is ${patient.tem}.`,
    });
  }

  if (hasAny("hsvm", "video microscopy")) {
    score += 2;
    evidences.push({
      label: "HSVM cue",
      preview: `HSVM state: ${patient.hsvm ?? "Unknown"}.`,
    });
  }

  if (hasAny("genetic", "mutation", "variant")) {
    score += 2;
    evidences.push({
      label: "Genetics cue",
      preview: `Genetics state: ${patient.genetics ?? "Unknown"}.`,
    });
  }

  if (hasAny("if", "immunofluorescence", "staining")) {
    score += 2;
    evidences.push({
      label: "IF cue",
      preview: `IF state: ${patient.if ?? "Unknown"}.`,
    });
  }

  if (hasAny("confirmed", "definite")) {
    if (patient.status === "Confirmed PCD") score += 4;
    evidences.push({
      label: "Diagnosis status",
      preview: `Patient status is "${patient.status}".`,
    });
  }

  if (hasAny("suspected", "probable")) {
    if (patient.status === "Highly Suspected") score += 4;
    evidences.push({
      label: "Suspicion status",
      preview: `Patient status is "${patient.status}".`,
    });
  }

  if (hasAny("not diagnosed", "undiagnosed")) {
    if (patient.status === "Not Diagnosed") score += 4;
    evidences.push({
      label: "Diagnostic phase",
      preview: `Patient status is "${patient.status}".`,
    });
  }

  if (hasAny("recent", "latest", "updated")) {
    score += 2;
    evidences.push({
      label: "Recency",
      preview: `Last update: ${patient.lastUpdate}.`,
    });
  }

  if (evidences.length === 0) {
    score += 1;
    evidences.push({
      label: "General profile fit",
      preview: `Status "${patient.status}", TEM "${patient.tem}", nNO "${patient.nno}".`,
    });
  }

  const level: SmartMatchLevel = score >= 7 ? "High match" : score >= 4 ? "Medium match" : "Low match";
  return { score, level, evidences: evidences.slice(0, 3) };
}
</script>

<style scoped lang="css">
.patient-list {
  padding: 24px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  padding: 18px;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}


.row-click { cursor: pointer; }

.row-click:hover { background: #f8fafc; }

.patient-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 4px;
}

.patient_list__search_bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.patient-list__filters {
  padding: 16px;
  display: flex;
  gap: 12px;
}

.input {
  border: 1px solid #d4d7dd;
  padding: 8px 16px;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
}

.table-wrap {
  border: 1px solid #e6e9ef;
  border-radius: 12px;
  overflow: auto;
  background: #fff;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 980px;
}

thead th {
  position: sticky;
  top: 0;
  /*background: #f6f8fb;*/
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #2b2f36;
  padding: 12px 10px;
  border-bottom: 1px solid #e6e9ef;
  border-top: 1px solid #e6e9ef;
  cursor: pointer;
}

tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid #eef1f6;
  font-size: 14px;
  color: var(--text-standard);
  vertical-align: top;
}

h1 {
  padding: 0;
  margin: 0;
}

.button {
  border: none;
  height: 36px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.add-patient-button {
  background: var(--accent);
  color: #fff;
}

.add-patient-button:hover {
  background: var(--accent-hover);
  transition: background 150ms ease;
}

.advanced-search-button {
  background: white;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-standard);
  border: 1px solid var(--border-standard);
}

.advanced-search-button:hover {
  background: var(--white-hover);
  transition: background 150ms ease;
}

.button--ghost {
  background: transparent;
  border: 1px solid #e1e5ea;
  color: var(--text-standard);
  display: flex;
  align-items: center;
  gap: 12px;
}

.button--ghost:hover {
  background: var(--white-hover);
  transition: background 150ms ease;
}

.sticky-left {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 2;
  border-right: 1px solid #eef1f6;
}

.id {
  font-weight: bold;
}

.muted {
  color: #6b7280;
  font-size: 12px;
}

.pill {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.pill[data-status="Not Diagnosed"] {
  background: #f1f3f7;
  color: #4b5563;
}
.pill[data-status="Highly Suspected"] {
  background: #fff4e5;
  color: #8a5a00;
}
.pill[data-status="Confirmed PCD"] {
  background: #e7f6ed;
  color: #1b5e20;
}
.pill[data-status="PCD Unconfirmed"] {
  background: #fbeaec;
  color: #8a1f2c;
}

.diag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  background: #f4f5f7;
  color: #4b5563;
}

.diag[data-state="Done"] {
  background: #e8f7ee;
  color: #1b5e20;
}
.diag[data-state="Pending"] {
  background: #fff7e6;
  color: #8a5a00;
}
.diag[data-state="N/A"] {
  background: #f1f3f7;
  color: #6b7280;
}
.diag[data-state="Unknown"] {
  background: #fbeef2;
  color: #8a1f2c;
}

.diag[data-state="Positive"] {
  background: #fbeef2;
  color: #8a1f2c;
}

.sort {
  font-size: 11px;
  color: #7b8794;
  margin-left: 4px;
}

.divider {
  border-right: 1px solid #e6e9ef;
}

.arrow {
  transition: transform 160ms ease;
}
.arrow--open {
  transform: rotate(180deg);
}

.advanced-search {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 10px;
  border: 1px solid #eef1f6;
  border-radius: 10px;
  background: #fafbfe;
}

.advanced-field label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.age-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-sep {
  color: #9aa3af;
}

.search-bar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 16px;
}

.smart-search-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--accent);
  color: var(--white);
}

.smart-search {
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: linear-gradient(180deg, #fafbff 0%, #ffffff 100%);
}

.smart-search__header h3 {
  margin: 0;
  font-size: 16px;
}

.smart-search__header .muted {
  margin: 4px 0 0;
}

.smart-search__input {
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  min-height: 110px;
  border-radius: 12px;
  padding: 12px 12px;
  line-height: 1.4;
  background: #fff;
  border: 1px solid #e1e5ea;
}

.smart-search__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(75, 108, 255, 0.12);
}

.smart-search__actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.smart-search__stub {
  margin: 10px 0 0;
}

.button--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.button--accent:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.smart-result-row td {
  padding-top: 0;
  background: #fbfcff;
}

.smart-result-cell {
  border-bottom: 1px solid #eef1f6;
}

.smart-result {
  margin: 2px 0 10px;
  border: 1px solid #e9edf7;
  border-radius: 10px;
  background: #fff;
  padding: 10px 12px;
}

.smart-result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.smart-level {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.smart-level[data-level="High match"] {
  background: #e7f6ed;
  color: #1b5e20;
}

.smart-level[data-level="Medium match"] {
  background: #fff4e5;
  color: #8a5a00;
}

.smart-level[data-level="Low match"] {
  background: #fbeaec;
  color: #8a1f2c;
}

.smart-score {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

.smart-evidence-list {
  display: grid;
  gap: 8px;
}

.smart-evidence {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 8px;
  align-items: start;
}

.smart-chevron {
  color: var(--accent);
  font-weight: 800;
  line-height: 1.2;
}

.smart-evidence-title {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

.smart-evidence-preview {
  font-size: 13px;
  color: #1f2937;
}
</style>
