<template lang="html">
  <section class="patient-list">
    <header class="patient-list__header">
      <h1>Patients</h1>
      <button class="add-patient-button button" @click="openModal">
  + Add new patient
</button>
    </header>

<!-- modal new patient -->
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

      <!-- sirsi search -->
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

      <!-- smart search -->
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

      <!-- patient list   -->

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
import { usePatientProfilesStore } from "../stores/patientProfiles";
import { usePatientSessionStore } from "../stores/patientSession";
import { usePatientDiagnosticsSessionStore } from "../stores/patientDiagnosticsSession";
import { ArrowDown, RotateCcw, Sparkles } from "lucide-vue-next";

const patientsStore = usePatientsStore();
const patientProfilesStore = usePatientProfilesStore();
const patientSessionStore = usePatientSessionStore();
const patientDiagnosticsSessionStore = usePatientDiagnosticsSessionStore();
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
  const created = patientsStore.byId(newId.value.trim());
  if (created) {
    patientProfilesStore.ensureFromListItem(created);
    patientSessionStore.ensureFromListItem(created);
    patientDiagnosticsSessionStore.ensureFromListItem(created);
  }
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

const statuses = ["Not Diagnosed", "Highly Suspected", "Confirmed PCD", "PCD Excluded"];

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

onMounted(async () => {
  await patientsStore.fetchList();
  patientProfilesStore.ensureFromList(patientsStore.items);
  patientSessionStore.ensureFromList(patientsStore.items);
  patientDiagnosticsSessionStore.ensureFromList(patientsStore.items);
});

function buildSmartResult(patient: any, prompt: string): SmartResult {
  const normalized = prompt.toLowerCase();
  let score = 0;
  const evidences: SmartEvidence[] = [];
  const anamnesis = patientSessionStore.getOrCreateAnamnesis(patient.id);
  const diagnostics = patientDiagnosticsSessionStore.getOrCreate(patient.id);
  const profile = patientProfilesStore.getById(patient.id);

  const hasAny = (...words: string[]) => words.some((w) => normalized.includes(w));
  const addEvidence = (label: string, preview: string, points = 1) => {
    if (evidences.some((item) => item.label === label && item.preview === preview)) return;
    evidences.push({ label, preview });
    score += points;
  };
  const latestNno = diagnostics.nno[0];
  const latestHsvm = diagnostics.hsvm[0];
  const latestIf = diagnostics.if[0];
  const latestGenetics = diagnostics.genetics[0];
  const excerpt = (value: string, max = 92) =>
    value.length > max ? `"${value.slice(0, max).trim()}..."` : `"${value}"`;

  if (hasAny("nno", "nitric oxide")) {
    if (latestNno) {
      addEvidence("low nNO", `Measured nNO: ${latestNno.valuePpb} ppb.`, 3);
    } else {
      addEvidence("nNO pending", `nNO state in the list is ${patient.nno ?? "Unknown"}.`, 1);
    }
    if (hasAny("low", "reduced")) {
      if (latestNno) {
        const points = latestNno.valuePpb < 77 ? 3 : latestNno.valuePpb < 100 ? 2 : 1;
        addEvidence("nNO value", `Latest measured nNO is ${latestNno.valuePpb} ppb.`, points);
      }
    }
  }

  if (hasAny("tem", "inconclusive", "unclear ultrastructure")) {
    addEvidence(
      patient.tem === "N/A" ? "TEM inconclusive" : "TEM state",
      patient.tem === "N/A"
        ? "TEM is still not resolved in the list state."
        : `TEM list state is ${patient.tem}.`,
      patient.tem === "N/A" ? 3 : 1,
    );
  }

  if (hasAny("hsvm", "video microscopy")) {
    if (latestHsvm) {
      addEvidence("HSVM report", excerpt(latestHsvm.report), 3);
    } else {
      addEvidence("HSVM state", `HSVM state in the list is ${patient.hsvm ?? "Unknown"}.`, 1);
    }
  }

  if (hasAny("genetic", "mutation", "variant")) {
    if (latestGenetics) {
      addEvidence("Genetics report", excerpt(latestGenetics.report), 3);
    } else {
      addEvidence("Genetics state", `Genetics state in the list is ${patient.genetics ?? "Unknown"}.`, 1);
    }
  }

  if (hasAny("if", "immunofluorescence", "staining")) {
    if (latestIf) {
      addEvidence("IF report", excerpt(latestIf.report), 3);
    } else {
      addEvidence("IF state", `IF state in the list is ${patient.if ?? "Unknown"}.`, 1);
    }
  }

  if (hasAny("picadar")) {
    addEvidence("PICADAR", `PICADAR score: ${anamnesis.picadar}.`, anamnesis.picadar >= 5 ? 3 : 1);
  }

  if (hasAny("clinical index", "clinic index")) {
    addEvidence(
      "Clinical index",
      `Clinical index score: ${anamnesis.clinicalIndex}.`,
      anamnesis.clinicalIndex >= 4 ? 3 : 1,
    );
  }

  if (hasAny("wet cough", "cough")) {
    addEvidence(
      "Wet cough",
      `PICADAR wet cough: ${anamnesis.picadarAnswers.wetCough ?? "Unknown"}.`,
      anamnesis.picadarAnswers.wetCough === "Yes" ? 2 : 1,
    );
  }

  if (hasAny("rhinitis", "nasal discharge", "nasal obstruction")) {
    addEvidence(
      "Rhinitis",
      `Postnatal rhinitis: ${anamnesis.postnatal.rhinitis}; perennial rhinitis in PICADAR: ${anamnesis.picadarAnswers.perennialRhinitis ?? "Unknown"}.`,
      anamnesis.postnatal.rhinitis === "Yes" || anamnesis.picadarAnswers.perennialRhinitis === "Yes" ? 3 : 1,
    );
  }

  if (hasAny("pneumonia")) {
    addEvidence(
      "Pneumonia history",
      `Postnatal pneumonia: ${anamnesis.postnatal.pneumonia}; Clinical index pneumonia: ${anamnesis.clinicalIndexAnswers.pneumonia ?? "Unknown"}.`,
      anamnesis.postnatal.pneumonia === "Yes" || anamnesis.clinicalIndexAnswers.pneumonia === "Yes" ? 3 : 1,
    );
  }

  if (hasAny("neonatal", "nicu", "rds", "oxygen", "ventilation", "mechanical ventilation")) {
    addEvidence(
      "Neonatal course",
      `Neonatal RDS ${anamnesis.postnatal.neonatalRds}, NICU ${anamnesis.postnatal.hospitalizationAtNeoJip}, oxygen therapy ${anamnesis.postnatal.oxygenTherapy}, mechanical ventilation support ${anamnesis.postnatal.lungVentilation}.`,
      2,
    );
  }

  if (hasAny("situs", "heterotaxy", "organ position")) {
    addEvidence(
      "Organ position",
      `Organ position disorder: ${anamnesis.organPositionDisorder}.`,
      anamnesis.organPositionDisorder !== "Not present" && anamnesis.organPositionDisorder !== "Unknown" ? 4 : 1,
    );
  }

  if (hasAny("fertility", "subfertility", "infertility")) {
    addEvidence("Fertility", `Fertility disorder: ${anamnesis.fertilityDisorder}.`, 2);
  }

  if (hasAny("hearing", "ear", "grommet", "grommets", "t-tube", "t-tubes")) {
    addEvidence(
      "ENT hearing",
      `Hearing disorder: ${anamnesis.hearingDisorder}; T-Tubes or Grommets: ${anamnesis.hasTTubesOrGrommets}.`,
      anamnesis.hearingDisorder === "Yes" || anamnesis.hasTTubesOrGrommets === "Yes" ? 3 : 1,
    );
  }

  if (hasAny("polyp", "polyps", "polyposis", "nasal polyposis")) {
    addEvidence(
      "ENT nasal polyposis",
      `Chronic nasal polyposis: ${anamnesis.chronicNasalPolyposis}.`,
      anamnesis.chronicNasalPolyposis === "Yes" ? 3 : 1,
    );
  }

  if (hasAny("renal", "kidney")) {
    addEvidence("Renal problems", `Renal problems: ${anamnesis.renalProblems}.`, 2);
  }

  if (hasAny("retinitis", "pigmentosa", "vision")) {
    addEvidence("Retinitis pigmentosa", `Retinitis pigmentosa: ${anamnesis.retinitisPigmentosa}.`, 2);
  }

  if (hasAny("family", "relative", "sibling")) {
    addEvidence(
      "Family history",
      `Blood relatives with PCD: ${profile?.bloodRelativesWithPCD ?? 0}; siblings: ${profile?.siblings ?? 0}${profile?.siblingNote ? `; note: ${profile.siblingNote}` : ""}.`,
      (profile?.bloodRelativesWithPCD ?? 0) > 0 ? 3 : 1,
    );
  }

  if (hasAny("confirmed", "definite")) {
    addEvidence("Diagnosis status", `Patient status is "${patient.status}".`, patient.status === "Confirmed PCD" ? 4 : 1);
  }

  if (hasAny("suspected", "probable")) {
    addEvidence("Suspicion status", `Patient status is "${patient.status}".`, patient.status === "Highly Suspected" ? 4 : 1);
  }

  if (hasAny("not diagnosed", "undiagnosed")) {
    addEvidence("Diagnostic phase", `Patient status is "${patient.status}".`, patient.status === "Not Diagnosed" ? 4 : 1);
  }

  if (hasAny("recent", "latest", "updated")) {
    addEvidence("Recency", `Last update: ${patient.lastUpdate}.`, 2);
  }

  if (evidences.length === 0) {
    if (latestNno) {
      addEvidence("nNO", `Latest nNO measured value: ${latestNno.valuePpb} ppb.`, 2);
    }
    if (latestHsvm) {
      addEvidence("HSVM report", excerpt(latestHsvm.report), 2);
    }
    if (evidences.length === 0) {
      addEvidence(
        "General profile fit",
        `Status "${patient.status}", PICADAR ${anamnesis.picadar}, Clinical index ${anamnesis.clinicalIndex}.`,
        1,
      );
    }
  }

  const level: SmartMatchLevel = score >= 7 ? "High match" : score >= 4 ? "Medium match" : "Low match";
  return { score, level, evidences: evidences.slice(0, 4) };
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
  flex-wrap: wrap;
  gap: 8px 12px;
  min-width: 0;
}

.patient-list__filters {
  padding: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
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
  background: #fbeaec;
  color: #8a1f2c;
}
.pill[data-status="PCD Excluded"] {
  
  background: #e7f6ed;
  color: #1b5e20;
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
  flex-wrap: wrap;
  justify-content: flex-end;
  min-width: 0;
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
  min-width: 0;
  overflow: hidden;
}

.smart-search__header h3 {
  margin: 0;
  font-size: 16px;
}

.smart-search__header .muted {
  margin: 4px 0 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.smart-search__input {
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
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
  overflow-wrap: anywhere;
  word-break: break-word;
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
  max-width: 0;
}

.smart-result {
  margin: 12px;
  border: 1px solid #e9edf7;
  border-radius: 10px;
  background: #fff;
  padding: 10px 12px;
  width: 95%;
  box-sizing: border-box;
  min-width: 0;
}

.smart-result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  min-width: 0;
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
  white-space: normal;
  overflow-wrap: anywhere;
}

.smart-evidence-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.smart-evidence {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 8px;
  align-items: start;
  min-width: 0;
  border: 1px solid #e9edf7;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fcfdff;
}

.smart-chevron {
  color: var(--accent);
  font-weight: 800;
  line-height: 1.2;
  margin-top: 2px;
}

.smart-evidence-title {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  color: #7a8699;
  font-weight: 700;
  background: #f3f6fb;
  border: 1px solid #e2e8f0;
  overflow-wrap: anywhere;
  margin-bottom: 6px;
}

.smart-evidence-preview {
  font-size: 13px;
  color: #1f2937;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.35;
  font-weight: 500;
}
</style>
