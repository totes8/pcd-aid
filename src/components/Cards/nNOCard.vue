<template lang="html">
    <div>
        <section class="card">
    <div class="card-header">
      <h3>nNO Result</h3>
      <div class="card-actions">
        <button v-if="!editing" class="button button--ghost" @click="editing = true">Edit</button>
        <button v-else class="button" @click="save">Save</button>
        <button v-if="editing" class="button button--ghost" @click="cancel">Cancel</button>
      </div>
    </div>

    <div v-if="!editing" class="info-grid">
      <div class="info-item">
        <span class="label">Status</span>
        <span>{{ form.status }}</span>
      </div>
      <div class="info-item">
        <span class="label">Value</span>
        <span>{{ form.value }} {{ form.unit }}</span>
      </div>
      <div class="info-item">
        <span class="label">Test Date</span>
        <span>{{ form.testDate }}</span>
      </div>
      <div class="info-item">
        <span class="label">Method</span>
        <span>{{ form.method }}</span>
      </div>
      <div class="info-item full">
        <span class="label">Notes</span>
        <span>{{ form.notes }}</span>
      </div>
    </div>

    <div v-else class="form-grid">
      <label class="field">
        <span class="label">Status</span>
        <select v-model="form.status" class="input">
          <option>Positive</option>
          <option>Negative</option>
          <option>Pending</option>
          <option>N/A</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Value</span>
        <input v-model.number="form.value" type="number" class="input" />
      </label>

      <label class="field">
        <span class="label">Unit</span>
        <input v-model="form.unit" type="text" class="input" />
      </label>

      <label class="field">
        <span class="label">Test Date</span>
        <input v-model="form.testDate" type="date" class="input" />
      </label>

      <label class="field">
        <span class="label">Method</span>
        <input v-model="form.method" type="text" class="input" />
      </label>

      <label class="field full">
        <span class="label">Notes</span>
        <textarea v-model="form.notes" rows="3" class="input"></textarea>
      </label>
    </div>
  </section>

    </div>
</template>
<script setup>
    
import { ref } from "vue";

const editing = ref(false);

// Replace these with real data or props
const form = ref({
  status: "Positive",
  value: 25,
  unit: "ppb",
  testDate: "2026-03-20",
  method: "Standard",
  notes: "Consistent with PCD patterns.",
});

function save() {
  editing.value = false;
}

function cancel() {
  editing.value = false;
}
</script>
<style lang="css" scoped>
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
  margin-right: 4px;
}
.input {
  border: 1px solid #e1e5ea;
  padding: 8px 10px;
  border-radius: 8px;
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

.info-item {
  display: grid;
  gap: 2px;
}

</style>