<template lang="html">
    <section class="patient-list">
    <header class="patient-list__header">
    
      <h1>Patients</h1>
      <button class="add-patient-button" @click="addPatient">
        +   Add new patient
      </button>
      
    </header>
      

    <div class="table-wrap">
        <div class="patient-list__filters">
        <input
          v-model="query"
          class="input"
          type="search"
          placeholder="Search by ID…"
          aria-label="Search by ID"
        />
        <select v-model="statusFilter" class="input" aria-label="Filter by status">
          <option value="">All statuses</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="sticky-left" @click="toggleSort('id')">
              ID <span class="sort">{{ sortIndicator('id') }}</span>
            </th>
            <th @click="toggleSort('dob')">
              Date of Birth <span class="sort">{{ sortIndicator('dob') }}</span>
            </th>
            <th @click="toggleSort('status')" class="divider">
              Status <span class="sort">{{ sortIndicator('status') }}</span>
            </th>
            <th>HSVM</th>
            <th>nNO</th>
            <th>TEM</th>
            <th>IF</th>
            <th class="divider">Genetics</th>
            <th @click="toggleSort('dateAdded')">
              Date added <span class="sort">{{ sortIndicator('dateAdded') }}</span>
            </th>
            <th @click="toggleSort('lastUpdate')">
              Last update <span class="sort">{{ sortIndicator('lastUpdate') }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in sortedPatients" :key="p.id">
            <td class="sticky-left mono">{{ p.id }}</td>
            <td>
              <div>{{ p.dob }}</div>
              <div class="muted">{{ p.age }} years</div>
            </td>
            <td class="divider">
              <span class="pill" :data-status="p.status">{{ p.status }}</span>
            </td>
            <td><span class="diag" :data-state="p.hsvm">{{ p.hsvm }}</span></td>
            <td><span class="diag" :data-state="p.nno">{{ p.nno }}</span></td>
            <td><span class="diag" :data-state="p.tem">{{ p.tem }}</span></td>
            <td><span class="diag" :data-state="p.if">{{ p.if }}</span></td>
            <td class="divider"><span class="diag" :data-state="p.genetics">{{ p.genetics }}</span></td>
            <td>{{ p.dateAdded }}</td>
            <td>{{ p.lastUpdate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>


<script setup lang="ts">
import { computed, ref } from "vue";

const statuses = ["Active", "Pending", "Inactive", "Archived"];

const patients = ref([
  {
    id: "0001",
    dob: "1989-07-14",
    age: 35,
    status: "Active",
    hsvm: "Done",
    nno: "Pending",
    tem: "N/A",
    if: "Done",
    genetics: "Unknown",
    dateAdded: "2024-01-05",
    lastUpdate: "2024-03-01",
  },
  {
    id: "0002",
    dob: "2001-11-02",
    age: 23,
    status: "Pending",
    hsvm: "Pending",
    nno: "Pending",
    tem: "Pending",
    if: "Pending",
    genetics: "Pending",
    dateAdded: "2024-02-14",
    lastUpdate: "2024-03-10",
  },
  {
    id: "0003",
    dob: "1976-03-28",
    age: 48,
    status: "Inactive",
    hsvm: "Done",
    nno: "Done",
    tem: "Done",
    if: "Done",
    genetics: "Done",
    dateAdded: "2023-12-01",
    lastUpdate: "2024-02-20",
  },
]);

const query = ref("");
const statusFilter = ref("");
const sortKey = ref("lastUpdate");
const sortDir = ref("desc");

const filtered = computed(() => {
  return patients.value.filter((p) => {
    const matchesQuery = p.id.toLowerCase().includes(query.value.toLowerCase());
    const matchesStatus = !statusFilter.value || p.status === statusFilter.value;
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
</script>


<style scoped lang="css">
    .patient-list {
  padding: 24px;
}

.patient-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.patient-list__filters {
    padding: 16px;
  display: flex;
  gap: 12px;
}

.input {
  border: 1px solid #d4d7dd;
  padding: 8px 10px;
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
  color: #1f2328;
  vertical-align: top;
}

.table tbody tr:hover {
  background: #f8fafc;
  transition: background 120ms ease;
}

.add-patient-button {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.add-patient-button:hover {
  background: var(--accent-hover);
  transition: background 150ms ease;
}

.sticky-left {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 2;
  border-right: 1px solid #eef1f6;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
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

.sort {
  font-size: 11px;
  color: #7b8794;
  margin-left: 4px;
}

.divider {
    border-right: 1px solid #e6e9ef;
}
</style>