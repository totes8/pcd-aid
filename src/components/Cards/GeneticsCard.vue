<template>
  <section class="card">
    <div class="card-header">
      <div>
        <h3>Genetics</h3>
      </div>
      <button v-if="!adding" class="button button--ghost" @click="startAdd">Add report</button>
    </div>

    <div v-if="adding" class="composer">
      <label class="field full">
        <span class="label">Report</span>
        <textarea
          v-model="newReport"
          rows="5"
          class="input"
          placeholder="Write genetics report..."
        ></textarea>
      </label>

      <label class="field">
        <span class="label">Date</span>
        <input v-model="newDate" type="date" class="input" />
      </label>

      <label class="field">
        <span class="label">Attachment (optional)</span>
        <input class="input file" type="file" @change="onNewFileChange" />
        <span v-if="newAttachmentName" class="file-meta">{{ newAttachmentName }}</span>
      </label>

      <div class="composer-actions">
        <button class="button button--ghost" @click="cancelAdd">Cancel</button>
        <button class="button button--accent" :disabled="!canSaveNew" @click="saveNew">Save</button>
      </div>
    </div>

    <div v-if="entries.length === 0" class="empty">
      <p class="muted">No genetics reports yet.</p>
    </div>

    <div v-else class="list">
      <div v-for="e in entries" :key="e.id" class="row">
        <div class="row-main">
          <div class="meta">
            <span class="meta-pill">Added by {{ e.clinician }}</span>
            <span class="meta-dot" aria-hidden="true">|</span>
            <span class="meta-date">{{ e.date }}</span>
          </div>

          <div class="report">
            <p class="report-text">{{ e.report }}</p>
          </div>

          <div v-if="e.attachment?.url" class="attachment">
            <a class="attachment-link" :href="e.attachment.url" target="_blank" rel="noreferrer">
              {{ e.attachment.name }}
            </a>
            <span class="attachment-meta">({{ formatBytes(e.attachment.size) }})</span>
          </div>
        </div>

        <div class="row-actions">
          <button v-if="editingId !== e.id" class="button button--ghost" @click="startEdit(e.id)">
            Edit
          </button>
        </div>

        <div v-if="editingId === e.id" class="edit">
          <label class="field full">
            <span class="label">Report</span>
            <textarea v-model="editReport" rows="5" class="input"></textarea>
          </label>

          <label class="field">
            <span class="label">Date</span>
            <input v-model="editDate" type="date" class="input" />
          </label>

          <label class="field">
            <span class="label">Replace attachment (optional)</span>
            <input class="input file" type="file" @change="onEditFileChange" />
            <span v-if="editAttachmentName" class="file-meta">{{ editAttachmentName }}</span>
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
import {
  type HsvmAttachment,
  usePatientDiagnosticsSessionStore,
} from "../../stores/patientDiagnosticsSession";

const props = defineProps<{ patientId: string }>();

const CURRENT_CLINICIAN = "Janko Mrkvička";

const store = usePatientDiagnosticsSessionStore();
const entries = computed(() => store.listGenetics(props.patientId));

const adding = ref(false);
const newReport = ref("");
const newDate = ref<string>(new Date().toISOString().slice(0, 10));
const newAttachment = ref<HsvmAttachment | null>(null);
const newAttachmentName = computed(() => newAttachment.value?.name ?? "");

const editingId = ref<string | null>(null);
const editReport = ref("");
const editDate = ref("");
const editAttachment = ref<HsvmAttachment | null>(null);
const editAttachmentName = computed(() => editAttachment.value?.name ?? "");

const canSaveNew = computed(() => newReport.value.trim().length > 0);
const canSaveEdit = computed(() => editReport.value.trim().length > 0 && !!editingId.value);

function startAdd() {
  adding.value = true;
  newReport.value = "";
  newDate.value = new Date().toISOString().slice(0, 10);
  newAttachment.value = null;
}

function cancelAdd() {
  adding.value = false;
  newReport.value = "";
  newAttachment.value = null;
}

function onNewFileChange(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    newAttachment.value = null;
    return;
  }
  newAttachment.value = {
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
  };
}

function saveNew() {
  const report = newReport.value.trim();
  if (!report) return;
  store.addGenetics(props.patientId, {
    report,
    clinician: CURRENT_CLINICIAN,
    date: newDate.value,
    attachment: newAttachment.value,
  });
  adding.value = false;
  newReport.value = "";
  newAttachment.value = null;
}

function startEdit(id: string) {
  const item = entries.value.find((x) => x.id === id);
  if (!item) return;
  editingId.value = id;
  editReport.value = item.report;
  editDate.value = item.date;
  editAttachment.value = null;
}

function cancelEdit() {
  editingId.value = null;
  editReport.value = "";
  editDate.value = "";
  editAttachment.value = null;
}

function onEditFileChange(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    editAttachment.value = null;
    return;
  }
  editAttachment.value = {
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
  };
}

function saveEdit() {
  if (!editingId.value) return;
  const report = editReport.value.trim();
  if (!report) return;

  store.updateGenetics(props.patientId, editingId.value, {
    report,
    date: editDate.value,
    attachment: editAttachment.value ?? undefined,
  });
  cancelEdit();
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.button--ghost:hover {
  background: var(--white-hover);
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
  gap: 10px;
}

.row-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
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

.report-text {
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  line-height: 1.35;
}

.attachment {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.attachment-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 700;
}

.attachment-meta {
  color: #6b7280;
  font-size: 12px;
  font-weight: 650;
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

.full {
  grid-column: 1 / -1;
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

.input.file {
  padding: 7px 10px;
}

.file-meta {
  font-size: 12px;
  color: #6b7280;
  font-weight: 650;
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

.button--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.button--accent:hover {
  background: var(--accent-hover);
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

