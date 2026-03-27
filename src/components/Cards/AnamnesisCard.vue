<script setup lang="ts">
import { ref } from "vue";

const editing = ref(false);

const anamnesis = ref({
  picadar: 7,
  clinicIndex: 5,
  situsInversus: "No",
  fertilityIssues: "Unknown",
  retinitisPigmentosa: "No",
  postnatal: {
    gestationAge: "38 weeks",
    pneumonia: "Yes",
    oxygenTherapy: "No",
    hydrocephalia: "No",
  },
  notes: "No additional remarks.",
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
      <h3>Anamnesis</h3>
      <div class="card-actions">
        <button v-if="!editing" class="button button--ghost" @click="editing = true">Edit</button>
        <button v-else class="button" @click="save">Save</button>
        <button v-if="editing" class="button button--ghost" @click="cancel">Cancel</button>
      </div>
    </div>

    <div v-if="!editing" class="info-grid">
      <div class="info-item"><span class="label">PICADAR</span><span>{{ anamnesis.picadar }}</span></div>
      <div class="info-item"><span class="label">Clinic Index</span><span>{{ anamnesis.clinicIndex }}</span></div>
      <div class="info-item"><span class="label">Situs Inversus</span><span>{{ anamnesis.situsInversus }}</span></div>
      <div class="info-item"><span class="label">Fertility Issues</span><span>{{ anamnesis.fertilityIssues }}</span></div>
      <div class="info-item"><span class="label">Retinitis Pigmentosa</span><span>{{ anamnesis.retinitisPigmentosa }}</span></div>

      <div class="info-item"><span class="label">Gestation Age</span><span>{{ anamnesis.postnatal.gestationAge }}</span></div>
      <div class="info-item"><span class="label">Pneumonia</span><span>{{ anamnesis.postnatal.pneumonia }}</span></div>
      <div class="info-item"><span class="label">Oxygen Therapy</span><span>{{ anamnesis.postnatal.oxygenTherapy }}</span></div>
      <div class="info-item"><span class="label">Hydrocephalia</span><span>{{ anamnesis.postnatal.hydrocephalia }}</span></div>

      <div class="info-item full"><span class="label">Notes</span><span>{{ anamnesis.notes }}</span></div>
    </div>

    <div v-else class="form-grid">
      <label class="field">
        <span class="label">PICADAR</span>
        <input v-model.number="anamnesis.picadar" type="number" class="input" />
      </label>

      <label class="field">
        <span class="label">Clinic Index</span>
        <input v-model.number="anamnesis.clinicIndex" type="number" class="input" />
      </label>

      <label class="field">
        <span class="label">Situs Inversus</span>
        <select v-model="anamnesis.situsInversus" class="input">
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Fertility Issues</span>
        <select v-model="anamnesis.fertilityIssues" class="input">
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Retinitis Pigmentosa</span>
        <select v-model="anamnesis.retinitisPigmentosa" class="input">
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Gestation Age</span>
        <input v-model="anamnesis.postnatal.gestationAge" type="text" class="input" />
      </label>

      <label class="field">
        <span class="label">Pneumonia</span>
        <select v-model="anamnesis.postnatal.pneumonia" class="input">
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Oxygen Therapy</span>
        <select v-model="anamnesis.postnatal.oxygenTherapy" class="input">
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </label>

      <label class="field">
        <span class="label">Hydrocephalia</span>
        <select v-model="anamnesis.postnatal.hydrocephalia" class="input">
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </label>

      <label class="field full">
        <span class="label">Notes</span>
        <textarea v-model="anamnesis.notes" rows="3" class="input"></textarea>
      </label>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 14px;
  padding: 18px;
}

h3 {
  font-size: 18px;
  margin: 12px 0px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  margin-bottom: 14px;
}

.card-actions {
  display: flex;
  gap: 8px;
}
.info-grid,
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.info-item,
.field {
  display: grid;
  gap: 6px;
}

.full {
  grid-column: 1 / -1;
}
.label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8b95a7;
  font-weight: 600;
}

.value {
  font-size: 14px;
  color: #1f2937;
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
  border-color: #4b6cff;
  box-shadow: 0 0 0 3px rgba(75,108,255,0.12);
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
.section-title {
  margin: 16px 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}

</style>
