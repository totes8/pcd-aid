<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { usePatientSessionStore, type AnamnesisModel } from "../../stores/patientSession";

const props = defineProps<{
  patientId: string;
}>();

const editing = ref(false);
const activeSubtab = ref<"picadar" | "clinicIndex" | "postnatal" | "anamnestic">(
  "picadar",
);

const sessionStore = usePatientSessionStore();
const anamnesis = sessionStore.getOrCreateAnamnesis(props.patientId);

const PICADAR_POINTS = {
  bornTerm: 2,
  neonatalChestSymptoms: 2,
  neonatalUnitAdmission: 2,
  situsAbnormality: 4,
  congenitalHeartDefect: 2,
  perennialRhinitis: 1,
  chronicEarOrHearingSymptoms: 1,
} as const;

const picadarScore = computed(() => {
  if (anamnesis.picadarAnswers.wetCough !== "Yes") return 0;
  let score = 0;

  // For this use case: being born at term contributes points (pre-term does not).
  if (anamnesis.picadarAnswers.born === "Term") score += PICADAR_POINTS.bornTerm;
  if (anamnesis.picadarAnswers.neonatalChestSymptoms === "Yes") {
    score += PICADAR_POINTS.neonatalChestSymptoms;
  }
  if (anamnesis.picadarAnswers.neonatalUnitAdmission === "Yes") {
    score += PICADAR_POINTS.neonatalUnitAdmission;
  }
  if (anamnesis.picadarAnswers.situsAbnormality === "Yes") {
    score += PICADAR_POINTS.situsAbnormality;
  }
  if (anamnesis.picadarAnswers.congenitalHeartDefect === "Yes") {
    score += PICADAR_POINTS.congenitalHeartDefect;
  }
  if (anamnesis.picadarAnswers.perennialRhinitis === "Yes") {
    score += PICADAR_POINTS.perennialRhinitis;
  }
  if (anamnesis.picadarAnswers.chronicEarOrHearingSymptoms === "Yes") {
    score += PICADAR_POINTS.chronicEarOrHearingSymptoms;
  }

  return score;
});

watch(
  () => anamnesis.picadarAnswers.wetCough,
  (wetCough) => {
    if (wetCough === "No") {
      anamnesis.picadarAnswers.born = null;
      anamnesis.picadarAnswers.neonatalChestSymptoms = null;
      anamnesis.picadarAnswers.neonatalUnitAdmission = null;
      anamnesis.picadarAnswers.situsAbnormality = null;
      anamnesis.picadarAnswers.congenitalHeartDefect = null;
      anamnesis.picadarAnswers.perennialRhinitis = null;
      anamnesis.picadarAnswers.chronicEarOrHearingSymptoms = null;
    }
  },
);

watch(
  () => picadarScore.value,
  (score) => {
    anamnesis.picadar = score;
  },
  { immediate: true },
);

let snapshot: AnamnesisModel | null = null;

function cloneCurrent(): AnamnesisModel {
  // Simple data model; JSON clone is fine here.
  return JSON.parse(JSON.stringify(anamnesis)) as AnamnesisModel;
}

function applySnapshot(s: AnamnesisModel) {
  anamnesis.picadar = s.picadar;
  anamnesis.clinicIndex = s.clinicIndex;
  anamnesis.picadarAnswers.wetCough = s.picadarAnswers.wetCough;
  anamnesis.picadarAnswers.born = s.picadarAnswers.born;
  anamnesis.picadarAnswers.neonatalChestSymptoms = s.picadarAnswers.neonatalChestSymptoms;
  anamnesis.picadarAnswers.neonatalUnitAdmission = s.picadarAnswers.neonatalUnitAdmission;
  anamnesis.picadarAnswers.situsAbnormality = s.picadarAnswers.situsAbnormality;
  anamnesis.picadarAnswers.congenitalHeartDefect = s.picadarAnswers.congenitalHeartDefect;
  anamnesis.picadarAnswers.perennialRhinitis = s.picadarAnswers.perennialRhinitis;
  anamnesis.picadarAnswers.chronicEarOrHearingSymptoms = s.picadarAnswers.chronicEarOrHearingSymptoms;
  anamnesis.situsInversus = s.situsInversus;
  anamnesis.fertilityIssues = s.fertilityIssues;
  anamnesis.retinitisPigmentosa = s.retinitisPigmentosa;
  anamnesis.postnatal.gestationAge = s.postnatal.gestationAge;
  anamnesis.postnatal.pneumonia = s.postnatal.pneumonia;
  anamnesis.postnatal.oxygenTherapy = s.postnatal.oxygenTherapy;
  anamnesis.postnatal.hydrocephalia = s.postnatal.hydrocephalia;
  anamnesis.notes = s.notes;
}

function startEdit() {
  snapshot = cloneCurrent();
  editing.value = true;
}

function save() {
  editing.value = false;
  // TODO: persist to store/API
  snapshot = null;
}

function cancel() {
  if (snapshot) applySnapshot(snapshot);
  editing.value = false;
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h3>Anamnesis</h3>
      <div class="card-actions">
        <button v-if="!editing" class="button button--ghost" @click="startEdit">Edit</button>
        <button v-else class="button" @click="save">Save</button>
        <button v-if="editing" class="button button--ghost" @click="cancel">Cancel</button>
      </div>
    </div>

    <div class="subtabs" role="tablist" aria-label="Anamnesis sections">
      <button
        class="subtab"
        :class="{ 'subtab--active': activeSubtab === 'picadar' }"
        @click="activeSubtab = 'picadar'"
      >
        PICADAR
      </button>
      <button
        class="subtab"
        :class="{ 'subtab--active': activeSubtab === 'clinicIndex' }"
        @click="activeSubtab = 'clinicIndex'"
      >
        Clinic Index
      </button>
      <button
        class="subtab"
        :class="{ 'subtab--active': activeSubtab === 'postnatal' }"
        @click="activeSubtab = 'postnatal'"
      >
        Postnatal
      </button>
      <button
        class="subtab"
        :class="{ 'subtab--active': activeSubtab === 'anamnestic' }"
        @click="activeSubtab = 'anamnestic'"
      >
        Anamnestic
      </button>
    </div>

    <!-- PICADAR -->
    <div v-if="activeSubtab === 'picadar'">
      <div class="score-row">
        <span class="label">Current PICADAR score</span>
        <span class="score-pill">{{ picadarScore }}</span>
      </div>

      <div v-if="!editing" class="qa">
        <div class="question">
          <div class="question-head">
            <div class="question-title">Wet cough?</div>
          </div>
          <div class="answer">{{ anamnesis.picadarAnswers.wetCough ?? "—" }}</div>
        </div>

        <template v-if="anamnesis.picadarAnswers.wetCough === 'Yes'">
          <div class="question">
            <div class="question-head">
              <div class="question-title">Was the patient born pre-term or full term?</div>
              <div class="points">+{{ PICADAR_POINTS.bornTerm }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.born ?? "—" }}</div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">
                Chest symptoms in neonatal period (e.g. tachypnoea, cough, pneumonia)?
              </div>
              <div class="points">+{{ PICADAR_POINTS.neonatalChestSymptoms }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.neonatalChestSymptoms ?? "—" }}</div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">Was the patient admitted to a neonatal unit?</div>
              <div class="points">+{{ PICADAR_POINTS.neonatalUnitAdmission }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.neonatalUnitAdmission ?? "—" }}</div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">
                Situs abnormality (situs inversus or heterotaxy)?
              </div>
              <div class="points">+{{ PICADAR_POINTS.situsAbnormality }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.situsAbnormality ?? "—" }}</div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">Congenital heart defect?</div>
              <div class="points">+{{ PICADAR_POINTS.congenitalHeartDefect }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.congenitalHeartDefect ?? "—" }}</div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">Persistent perennial rhinitis?</div>
              <div class="points">+{{ PICADAR_POINTS.perennialRhinitis }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.perennialRhinitis ?? "—" }}</div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">
                Chronic ear or hearing symptoms (e.g. glue ear, serous otitis media, hearing loss, ear perforation)?
              </div>
              <div class="points">+{{ PICADAR_POINTS.chronicEarOrHearingSymptoms }}</div>
            </div>
            <div class="answer">{{ anamnesis.picadarAnswers.chronicEarOrHearingSymptoms ?? "—" }}</div>
          </div>
        </template>
      </div>

      <div v-else class="qa">
        <div class="question">
          <div class="question-head">
            <div class="question-title">Wet cough?</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.picadarAnswers.wetCough" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.picadarAnswers.wetCough" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <template v-if="anamnesis.picadarAnswers.wetCough === 'Yes'">
          <div class="question">
            <div class="question-head">
              <div class="question-title">Was the patient born pre-term or full term?</div>
              <div class="points">+{{ PICADAR_POINTS.bornTerm }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input v-model="anamnesis.picadarAnswers.born" type="radio" value="Term" />
                Term
              </label>
              <label class="radio">
                <input v-model="anamnesis.picadarAnswers.born" type="radio" value="Pre-term" />
                Pre-term
              </label>
            </div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">
                Chest symptoms in neonatal period (e.g. tachypnoea, cough, pneumonia)?
              </div>
              <div class="points">+{{ PICADAR_POINTS.neonatalChestSymptoms }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.neonatalChestSymptoms"
                  type="radio"
                  value="Yes"
                />
                Yes
              </label>
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.neonatalChestSymptoms"
                  type="radio"
                  value="No"
                />
                No
              </label>
            </div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">Was the patient admitted to a neonatal unit?</div>
              <div class="points">+{{ PICADAR_POINTS.neonatalUnitAdmission }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.neonatalUnitAdmission"
                  type="radio"
                  value="Yes"
                />
                Yes
              </label>
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.neonatalUnitAdmission"
                  type="radio"
                  value="No"
                />
                No
              </label>
            </div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">
                Situs abnormality (situs inversus or heterotaxy)?
              </div>
              <div class="points">+{{ PICADAR_POINTS.situsAbnormality }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input v-model="anamnesis.picadarAnswers.situsAbnormality" type="radio" value="Yes" />
                Yes
              </label>
              <label class="radio">
                <input v-model="anamnesis.picadarAnswers.situsAbnormality" type="radio" value="No" />
                No
              </label>
            </div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">Congenital heart defect?</div>
              <div class="points">+{{ PICADAR_POINTS.congenitalHeartDefect }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.congenitalHeartDefect"
                  type="radio"
                  value="Yes"
                />
                Yes
              </label>
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.congenitalHeartDefect"
                  type="radio"
                  value="No"
                />
                No
              </label>
            </div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">Persistent perennial rhinitis?</div>
              <div class="points">+{{ PICADAR_POINTS.perennialRhinitis }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input v-model="anamnesis.picadarAnswers.perennialRhinitis" type="radio" value="Yes" />
                Yes
              </label>
              <label class="radio">
                <input v-model="anamnesis.picadarAnswers.perennialRhinitis" type="radio" value="No" />
                No
              </label>
            </div>
          </div>

          <div class="question">
            <div class="question-head">
              <div class="question-title">
                Chronic ear or hearing symptoms (e.g. glue ear, serous otitis media, hearing loss, ear perforation)?
              </div>
              <div class="points">+{{ PICADAR_POINTS.chronicEarOrHearingSymptoms }}</div>
            </div>
            <div class="options">
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.chronicEarOrHearingSymptoms"
                  type="radio"
                  value="Yes"
                />
                Yes
              </label>
              <label class="radio">
                <input
                  v-model="anamnesis.picadarAnswers.chronicEarOrHearingSymptoms"
                  type="radio"
                  value="No"
                />
                No
              </label>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Clinic Index -->
    <div v-else-if="activeSubtab === 'clinicIndex'">
      <div v-if="!editing" class="info-grid">
        <div class="info-item full">
          <span class="label">Clinic Index</span><span>{{ anamnesis.clinicIndex }}</span>
        </div>
      </div>
      <div v-else class="form-grid">
        <label class="field full">
          <span class="label">Clinic Index</span>
          <input
            v-model.number="anamnesis.clinicIndex"
            type="number"
            min="0"
            step="1"
            class="input"
          />
        </label>
      </div>
    </div>

    <!-- Postnatal -->
    <div v-else-if="activeSubtab === 'postnatal'">
      <div v-if="!editing" class="info-grid">
        <div class="info-item">
          <span class="label">Gestation Age</span><span>{{ anamnesis.postnatal.gestationAge }}</span>
        </div>
        <div class="info-item">
          <span class="label">Pneumonia</span><span>{{ anamnesis.postnatal.pneumonia }}</span>
        </div>
        <div class="info-item">
          <span class="label">Oxygen Therapy</span><span>{{ anamnesis.postnatal.oxygenTherapy }}</span>
        </div>
        <div class="info-item">
          <span class="label">Hydrocephalia</span><span>{{ anamnesis.postnatal.hydrocephalia }}</span>
        </div>
      </div>

      <div v-else class="form-grid">
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
      </div>
    </div>

    <!-- Anamnestic -->
    <div v-else>
      <div v-if="!editing" class="info-grid">
        <div class="info-item">
          <span class="label">Situs Inversus</span><span>{{ anamnesis.situsInversus }}</span>
        </div>
        <div class="info-item">
          <span class="label">Fertility Issues</span><span>{{ anamnesis.fertilityIssues }}</span>
        </div>
        <div class="info-item">
          <span class="label">Retinitis Pigmentosa</span><span>{{ anamnesis.retinitisPigmentosa }}</span>
        </div>
        <div class="info-item full">
          <span class="label">Notes</span><span>{{ anamnesis.notes }}</span>
        </div>
      </div>

      <div v-else class="form-grid">
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

        <label class="field full">
          <span class="label">Notes</span>
          <textarea v-model="anamnesis.notes" rows="3" class="input"></textarea>
        </label>
      </div>
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

.score-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fafbfe;
  margin-bottom: 12px;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e6e9ef;
  font-weight: 750;
  color: #111827;
}

.qa {
  display: grid;
  gap: 12px;
}

.question {
  border: 1px solid #eef1f6;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.question-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.question-title {
  font-weight: 650;
  color: #111827;
  line-height: 1.25;
}

.points {
  flex: none;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #e7f0ff;
  border: 1px solid #cfe0ff;
  color: #1d4ed8;
  white-space: nowrap;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}

.radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #eef1f6;
  border-radius: 10px;
  cursor: pointer;
  background: #fafbfe;
  user-select: none;
}

.radio input {
  accent-color: #4b6cff;
}

.answer {
  color: #4b5563;
  font-weight: 600;
}

.subtabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-bottom: 1px solid #eef1f6;
  padding-bottom: 10px;
  margin-bottom: 14px;
}

.subtab {
  padding: 6px 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-weight: 650;
  color: #6b7280;
  border-radius: 999px;
}

.subtab--active {
  color: #1f2937;
  background: #f4f6f9;
  border-color: #e6e9ef;
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
