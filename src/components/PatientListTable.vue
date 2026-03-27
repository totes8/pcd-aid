<template lang="html">
  <section class="patient-list">
    <header class="patient-list__header">
      <h1>Patients</h1>
      <button class="add-patient-button button" @click="addPatient">
        + Add new patient
      </button>
    </header>

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
          <tr v-for="p in filteredPatients" :key="p.id" @click="goToPatient(p.id)" class="row-click">
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
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePatientsStore } from "../stores/patients";
import { ArrowDown, RotateCcw } from "lucide-vue-next";

const patientsStore = usePatientsStore();
const router = useRouter();


const query = ref("");

const showAdvanced = ref(false);
const ageMin = ref<number | null>(null);
const ageMax = ref<number | null>(null);
const temFilter = ref<"" | "Positive" | "Negative" | "N/A">("");

const filteredPatients = computed(() => {
  const q = query.value.trim().toLowerCase();
  let items = patientsStore.items;

  if (q) items = items.filter((p) => p.id.toLowerCase().includes(q));

  if (ageMin.value != null) items = items.filter((p) => p.age >= ageMin.value!);
  if (ageMax.value != null) items = items.filter((p) => p.age <= ageMax.value!);

  if (temFilter.value) items = items.filter((p) => p.tem === temFilter.value);

  return items;
});

const statuses = ["Active", "Pending", "Inactive", "Archived"];

const statusFilter = ref("");
const sortKey = ref("lastUpdate");
const sortDir = ref("desc");

const filtered = computed(() => {
  return patients.value.filter((p) => {
    const matchesQuery = p.id.toLowerCase().includes(query.value.toLowerCase());
    const matchesStatus =
      !statusFilter.value || p.status === statusFilter.value;
    return matchesQuery && matchesStatus;
  });
});

const sortedPatients = computed(() => {
  const items = [...filtered.value];
  items.sort((a, b) => {
    const av = a[sortKey.value];
    const bv = b[sortKey.value];

    if (av === bv) return 0;
    if (sortDir.value === "asc") return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
  return items;
});

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

function sortIndicator(key) {
  if (sortKey.value !== key) return "";
  return sortDir.value === "asc" ? "▲" : "▼";
}

function resetFilters() {
  query.value = "";
  statusFilter.value = "";
  ageMin.value = null;
  ageMax.value = null;
  temFilter.value = "";
}

function goToPatient(id: string) {
  router.push({ name: "PatientProfile", params: { id } });
}

onMounted(() => {
  patientsStore.fetchList();
});
</script>

<style scoped lang="css">
.patient-list {
  padding: 24px;
}

.row-click { cursor: pointer; }

.row-click:hover { background: #f8fafc; }

.patient-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
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
  margin: 16px 0px 16px 16px;
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

.pill[data-status="Active"] {
  background: #e7f6ed;
  color: #1b5e20;
}
.pill[data-status="Pending"] {
  background: #fff4e5;
  color: #8a5a00;
}
.pill[data-status="Inactive"] {
  background: #f1f3f7;
  color: #4b5563;
}
.pill[data-status="Archived"] {
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
</style>
