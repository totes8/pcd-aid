<script setup lang="ts">
import { ref } from "vue";

const editing = ref(false);

const genetics = ref({
  status: "Pending",
  testDate: "2026-03-18",
  genes: "DNAH5, DNAI1",
  variant: "c.1234A>G (p.Lys412Arg)",
  zygosity: "Heterozygous",
  classification: "VUS",
  summary: "Variant of uncertain significance. Correlate clinically.",
  notes: "Reanalysis recommended in 12 months.",
});

function save() {
  editing.value = false;
  // TODO: persist to store/API
}

function cancel() {
  editing.value = false;
  // TODO: reset from source of truth
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h3>Genetics</h3>
      <div class="card-actions">
        <button v-if="!editing" class="button button--ghost" @click="editing = true">Edit</button>
        <button v-else class="button" @click="save">Save</button>
        <button v-if="editing" class="button button--ghost" @click="cancel">Cancel</button>
      </div>
    </div>

    <div v-if="!editing" class="info-grid">
      <div class="info-item">
        <span class="label">Status</span>
        <span>{{ genetics.status }}</span>
      </div>
      <div class="info-item">
        <span class="label">Test Date</span>
        <span>{{ genetics.testDate }}</span>
      </div>
      <div class="info-item full">
        <span class="label">Genes tested</span>
        <span>{{ genetics.genes }}</span>
      </div>
      <div class="info-item full">
        <span class="label">Variant</span>
        <span>{{ genetics.variant }}</span>
      </div>
      <div class="info-item">
        <span class="label">Zygosity</span>
        <span>{{ genetics.zygosity }}</span>
      </div>
      <div class="info-item">
        <span class="label">Classification</span>
        <span>{{ genetics.classification }}</span>
      </div>
      <div class="info-item full">
        <span class="label">Summary</span>
        <span>{{ genetics.summary }}</span>
      </div>
      <div class="info-item full">
        <span class="label">Notes</span>
        <span>{{ genetics.notes }}</span>
      </div>
    </div>

    <div v-else class="form-grid">
      <label class="field">
        <span class="label">Status</span>
        <select v-model="genetics.status" class="input">
          <option>Positive</option>
          <option>Negative</option>
          <option>Pending</option>
          <option>N/A</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Test Date</span>
        <input v-model="genetics.testDate" type="date" class="input" />
      </label>

      <label class="field full">
        <span class="label">Genes tested</span>
        <input v-model="genetics.genes" type="text" class="input" />
      </label>

      <label class="field full">
        <span class="label">Variant</span>
        <input v-model="genetics.variant" type="text" class="input" />
      </label>

      <label class="field">
        <span class="label">Zygosity</span>
        <input v-model="genetics.zygosity" type="text" class="input" />
      </label>

      <label class="field">
        <span class="label">Classification</span>
        <select v-model="genetics.classification" class="input">
          <option>Pathogenic</option>
          <option>Likely pathogenic</option>
          <option>VUS</option>
          <option>Likely benign</option>
          <option>Benign</option>
        </select>
      </label>

      <label class="field full">
        <span class="label">Summary</span>
        <textarea v-model="genetics.summary" rows="3" class="input"></textarea>
      </label>

      <label class="field full">
        <span class="label">Notes</span>
        <textarea v-model="genetics.notes" rows="3" class="input"></textarea>
      </label>
    </div>
  </section>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.info-grid,
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 10px;
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
  padding: 8px 10px;
  border-radius: 8px;
  background: #fff;
}

.button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e1e5ea;
  background-color: white;
}

.button:hover {
  background-color: whitesmoke;
}

.button--ghost {
  background: transparent;
}
.info-item {
  display: grid;
  gap: 2px;
}
</style>
