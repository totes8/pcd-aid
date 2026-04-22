<template>
  <section class="card">
    <div class="card-header">
      <div>
        <h3>nNO</h3>
        <p class="muted">Measured value only (ppb). Multiple measurements allowed.</p>
      </div>
      <button v-if="!adding" class="button button--ghost" @click="startAdd">Add measurement</button>
    </div>

    <div v-if="adding" class="composer">
      <label class="field">
        <span class="label">Value (ppb)</span>
        <input v-model.number="newValuePpb" type="number" min="0" step="1" class="input" />
      </label>

      <label class="field">
        <span class="label">Date</span>
        <input v-model="newDate" type="date" class="input" />
      </label>

      <div class="composer-actions">
        <button class="button button--ghost" @click="cancelAdd">Cancel</button>
        <button class="button button--accent" :disabled="!canSaveNew" @click="saveNew">Save</button>
      </div>
    </div>

    <div v-if="entries.length === 0" class="empty">
      <p class="muted">No nNO measurements yet.</p>
    </div>

    <div v-else class="list">
      <div v-for="e in entries" :key="e.id" class="row">
        <div class="row-main">
          <div class="value">
            <span class="value-number">{{ e.valuePpb }}</span>
            <span class="value-unit">ppb</span>
          </div>
          <div class="meta">
            <span class="meta-pill">Added by {{ e.clinician }}</span>
            <span class="meta-dot" aria-hidden="true">|</span>
            <span class="meta-date">{{ e.date }}</span>
          </div>
        </div>

        <div class="row-actions">
          <button v-if="editingId !== e.id" class="button button--ghost" @click="startEdit(e.id)">
            Edit
          </button>
        </div>

        <div v-if="editingId === e.id" class="edit">
          <label class="field">
            <span class="label">Value (ppb)</span>
            <input v-model.number="editValuePpb" type="number" min="0" step="1" class="input" />
          </label>
          <label class="field">
            <span class="label">Date</span>
            <input v-model="editDate" type="date" class="input" />
          </label>
          <div class="edit-actions">
            <button class="button button--ghost" @click="cancelEdit">Cancel</button>
            <button class="button button--accent" :disabled="!canSaveEdit" @click="saveEdit">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { usePatientDiagnosticsSessionStore } from "../../stores/patientDiagnosticsSession";

const props = defineProps<{ patientId: string }>();

const CURRENT_CLINICIAN = "Janko Mrkvička";

const store = usePatientDiagnosticsSessionStore();
const entries = computed(() => store.listNno(props.patientId));

const adding = ref(false);
const newValuePpb = ref<number | null>(null);
const newDate = ref<string>(new Date().toISOString().slice(0, 10));

const editingId = ref<string | null>(null);
const editValuePpb = ref<number | null>(null);
const editDate = ref<string>("");

const canSaveNew = computed(() => typeof newValuePpb.value === "number" && newValuePpb.value >= 0);
const canSaveEdit = computed(
  () => typeof editValuePpb.value === "number" && editValuePpb.value >= 0 && !!editingId.value,
);

function startAdd() {
  adding.value = true;
  newValuePpb.value = null;
  newDate.value = new Date().toISOString().slice(0, 10);
}

function cancelAdd() {
  adding.value = false;
  newValuePpb.value = null;
}

function saveNew() {
  if (!canSaveNew.value || newValuePpb.value == null) return;
  store.addNno(props.patientId, {
    valuePpb: Math.round(newValuePpb.value),
    clinician: CURRENT_CLINICIAN,
    date: newDate.value,
  });
  adding.value = false;
  newValuePpb.value = null;
}

function startEdit(id: string) {
  const item = entries.value.find((x) => x.id === id);
  if (!item) return;
  editingId.value = id;
  editValuePpb.value = item.valuePpb;
  editDate.value = item.date;
}

function cancelEdit() {
  editingId.value = null;
  editValuePpb.value = null;
  editDate.value = "";
}

function saveEdit() {
  if (!canSaveEdit.value || editingId.value == null || editValuePpb.value == null) return;
  store.updateNno(props.patientId, editingId.value, {
    valuePpb: Math.round(editValuePpb.value),
    date: editDate.value,
  });
  cancelEdit();
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.muted {
  color: #6b7280;
  font-size: 13px;
  margin: 2px 0 0;
}

.composer {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fafbfe;
}

.composer-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty {
  margin-top: 12px;
}

.list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.row {
  border: 1px solid #eef1f6;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.row-main {
  display: grid;
  gap: 6px;
}

.row-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.value {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.value-number {
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.value-unit {
  color: #6b7280;
  font-weight: 700;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: #6b7280;
  font-size: 12px;
}

.meta-pill {
  background: #f4f6f9;
  border: 1px solid #e6e9ef;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
}

.meta-dot {
  opacity: 0.6;
}

.edit {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px dashed #eef1f6;
}

.edit-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: #6b7280;
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

.button {
  padding: 6px 12px;
  border: 1px solid #e1e5ea;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
}

.button--ghost {
  background: transparent;
}

.button--ghost:hover {
  background: var(--white-hover);
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

@media (max-width: 720px) {
  .composer,
  .edit {
    grid-template-columns: 1fr;
  }
}
</style>
