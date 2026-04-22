<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { usePatientSessionStore, type AnamnesisModel } from "../../stores/patientSession";

const props = defineProps<{
  patientId: string;
}>();

const editing = ref(false);
const activeSubtab = ref<"picadar" | "clinicalIndex" | "postnatal" | "anamnestic">(
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
  () => anamnesis.otherComorbidities,
  (val) => {
    if (val === "No") anamnesis.otherComorbiditiesDetails = "";
  },
);

watch(
  () => anamnesis.congenitalHeartDefect,
  (val) => {
    if (val !== "Yes") anamnesis.congenitalHeartDefectDetails = "";
  },
);

watch(
  () => picadarScore.value,
  (score) => {
    anamnesis.picadar = score;
  },
  { immediate: true },
);

const clinicalIndexScore = computed(() => {
  const answers = anamnesis.clinicalIndexAnswers;
  const keys = Object.keys(answers) as (keyof typeof answers)[];
  let score = 0;
  for (const k of keys) {
    if (answers[k] === "Yes") score += 1;
  }
  return score;
});

watch(
  () => clinicalIndexScore.value,
  (score) => {
    anamnesis.clinicalIndex = score;
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
  anamnesis.clinicalIndex = s.clinicalIndex;
  anamnesis.picadarAnswers.wetCough = s.picadarAnswers.wetCough;
  anamnesis.picadarAnswers.born = s.picadarAnswers.born;
  anamnesis.picadarAnswers.neonatalChestSymptoms = s.picadarAnswers.neonatalChestSymptoms;
  anamnesis.picadarAnswers.neonatalUnitAdmission = s.picadarAnswers.neonatalUnitAdmission;
  anamnesis.picadarAnswers.situsAbnormality = s.picadarAnswers.situsAbnormality;
  anamnesis.picadarAnswers.congenitalHeartDefect = s.picadarAnswers.congenitalHeartDefect;
  anamnesis.picadarAnswers.perennialRhinitis = s.picadarAnswers.perennialRhinitis;
  anamnesis.picadarAnswers.chronicEarOrHearingSymptoms = s.picadarAnswers.chronicEarOrHearingSymptoms;
  anamnesis.clinicalIndexAnswers.respiratoryDifficultiesAfterBirth =
    s.clinicalIndexAnswers.respiratoryDifficultiesAfterBirth;
  anamnesis.clinicalIndexAnswers.earlyRhinitisOrMucus = s.clinicalIndexAnswers.earlyRhinitisOrMucus;
  anamnesis.clinicalIndexAnswers.pneumonia = s.clinicalIndexAnswers.pneumonia;
  anamnesis.clinicalIndexAnswers.threePlusBronchitisEpisodes =
    s.clinicalIndexAnswers.threePlusBronchitisEpisodes;
  anamnesis.clinicalIndexAnswers.chronicOtitisOrThreePlusAcuteOtitis =
    s.clinicalIndexAnswers.chronicOtitisOrThreePlusAcuteOtitis;
  anamnesis.clinicalIndexAnswers.yearRoundNasalDischargeOrObstruction =
    s.clinicalIndexAnswers.yearRoundNasalDischargeOrObstruction;
  anamnesis.clinicalIndexAnswers.antibioticsForAuriThreePlus =
    s.clinicalIndexAnswers.antibioticsForAuriThreePlus;
  anamnesis.organPositionDisorder = s.organPositionDisorder;
  anamnesis.congenitalHeartDefect = s.congenitalHeartDefect;
  anamnesis.congenitalHeartDefectDetails = s.congenitalHeartDefectDetails;
  anamnesis.ciliaryDisorderInCns = s.ciliaryDisorderInCns;
  anamnesis.retinitisPigmentosa = s.retinitisPigmentosa;
  anamnesis.renalProblems = s.renalProblems;
  anamnesis.fertilityDisorder = s.fertilityDisorder;
  anamnesis.otherComorbidities = s.otherComorbidities;
  anamnesis.otherComorbiditiesDetails = s.otherComorbiditiesDetails;
  anamnesis.postnatal.gestationAge = s.postnatal.gestationAge;
  anamnesis.postnatal.neonatalRds = s.postnatal.neonatalRds;
  anamnesis.postnatal.cough = s.postnatal.cough;
  anamnesis.postnatal.rhinitis = s.postnatal.rhinitis;
  anamnesis.postnatal.pneumonia = s.postnatal.pneumonia;
  anamnesis.postnatal.hydrocephalus = s.postnatal.hydrocephalus;
  anamnesis.postnatal.hospitalizationAtNeoJip = s.postnatal.hospitalizationAtNeoJip;
  anamnesis.postnatal.oxygenTherapy = s.postnatal.oxygenTherapy;
  anamnesis.postnatal.lungVentilation = s.postnatal.lungVentilation;
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
        <button v-else class="save-button" @click="save">Save</button>
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
        :class="{ 'subtab--active': activeSubtab === 'clinicalIndex' }"
        @click="activeSubtab = 'clinicalIndex'"
      >
        Clinical Index
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

    <!-- Clinical Index -->
    <div v-else-if="activeSubtab === 'clinicalIndex'">
      <div class="score-row">
        <span class="label">Current Clinical Index score</span>
        <span class="score-pill">{{ clinicalIndexScore }}</span>
      </div>

      <div v-if="!editing" class="qa">
        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Did the child manifest with significant respiratory difficulties with breathing after birth?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.respiratoryDifficultiesAfterBirth ?? "—" }}</div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Did the child have rhinitis or excessive mucus production in the first 2 months of life?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.earlyRhinitisOrMucus ?? "—" }}</div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">Did the child suffer from pneumonia?</div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.pneumonia ?? "—" }}</div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">Did the child present with 3 or more episodes of bronchitis?</div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.threePlusBronchitisEpisodes ?? "—" }}</div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Was the child treated for chronic secretoric otitis or suffered from &gt;3 episodes of acute otitis?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.chronicOtitisOrThreePlusAcuteOtitis ?? "—" }}</div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Does the child have a year-round nasal discharge or nasal obstruction?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.yearRoundNasalDischargeOrObstruction ?? "—" }}</div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Was the child treated with antibiotics for acute upper respiratory tract infection &gt;3 times?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="answer">{{ anamnesis.clinicalIndexAnswers.antibioticsForAuriThreePlus ?? "—" }}</div>
        </div>
      </div>

      <div v-else class="qa">
        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Did the child manifest with significant respiratory difficulties with breathing after birth?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.respiratoryDifficultiesAfterBirth" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.respiratoryDifficultiesAfterBirth" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Did the child have rhinitis or excessive mucus production in the first 2 months of life?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.earlyRhinitisOrMucus" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.earlyRhinitisOrMucus" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">Did the child suffer from pneumonia?</div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.pneumonia" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.pneumonia" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">Did the child present with 3 or more episodes of bronchitis?</div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.threePlusBronchitisEpisodes" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.threePlusBronchitisEpisodes" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Was the child treated for chronic secretoric otitis or suffered from &gt;3 episodes of acute otitis?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.chronicOtitisOrThreePlusAcuteOtitis" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.chronicOtitisOrThreePlusAcuteOtitis" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Does the child have a year-round nasal discharge or nasal obstruction?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.yearRoundNasalDischargeOrObstruction" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.yearRoundNasalDischargeOrObstruction" type="radio" value="No" />
              No
            </label>
          </div>
        </div>

        <div class="question">
          <div class="question-head">
            <div class="question-title">
              Was the child treated with antibiotics for acute upper respiratory tract infection &gt;3 times?
            </div>
            <div class="points">+1</div>
          </div>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.antibioticsForAuriThreePlus" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.clinicalIndexAnswers.antibioticsForAuriThreePlus" type="radio" value="No" />
              No
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Postnatal -->
    <div v-else-if="activeSubtab === 'postnatal'">
      <div class="postnatal">
        <div class="gestation">
          <span class="label">Gestation Age</span>
          <span v-if="!editing" class="gestation-value">{{ anamnesis.postnatal.gestationAge }}</span>
          <input
            v-else
            v-model="anamnesis.postnatal.gestationAge"
            type="text"
            class="input"
            placeholder="e.g. 38 weeks"
          />
        </div>

        <div class="postnatal-list">
          <div class="postnatal-row">
            <span class="postnatal-label">Neonatal RDS</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.neonatalRds }}</span>
            <select v-else v-model="anamnesis.postnatal.neonatalRds" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Cough</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.cough }}</span>
            <select v-else v-model="anamnesis.postnatal.cough" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Rhinitis</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.rhinitis }}</span>
            <select v-else v-model="anamnesis.postnatal.rhinitis" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Pneumonia</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.pneumonia }}</span>
            <select v-else v-model="anamnesis.postnatal.pneumonia" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Hydrocephalus</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.hydrocephalus }}</span>
            <select v-else v-model="anamnesis.postnatal.hydrocephalus" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Hospitalization at neoJIP</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.hospitalizationAtNeoJip }}</span>
            <select v-else v-model="anamnesis.postnatal.hospitalizationAtNeoJip" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Oxygen therapy</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.oxygenTherapy }}</span>
            <select v-else v-model="anamnesis.postnatal.oxygenTherapy" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>

          <div class="postnatal-row">
            <span class="postnatal-label">Lung ventilation</span>
            <span v-if="!editing" class="postnatal-value">{{ anamnesis.postnatal.lungVentilation }}</span>
            <select v-else v-model="anamnesis.postnatal.lungVentilation" class="input input--compact">
              <option>Yes</option>
              <option>No</option>
              <option>Unknown</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Anamnestic -->
    <div v-else>
      <div v-if="!editing" class="postnatal-list">
        <div class="postnatal-row">
          <span class="postnatal-label">Organ position disorder</span>
          <span class="postnatal-value">{{ anamnesis.organPositionDisorder }}</span>
        </div>

        <div class="postnatal-row">
          <span class="postnatal-label">Congenital heart defect</span>
          <span class="postnatal-value">
            {{ anamnesis.congenitalHeartDefect }}
            <span v-if="anamnesis.congenitalHeartDefect === 'Yes' && anamnesis.congenitalHeartDefectDetails">
              — {{ anamnesis.congenitalHeartDefectDetails }}
            </span>
          </span>
        </div>

        <div class="postnatal-row">
          <span class="postnatal-label">Ciliary disorder in the CNS</span>
          <span class="postnatal-value">{{ anamnesis.ciliaryDisorderInCns }}</span>
        </div>

        <div class="postnatal-row">
          <span class="postnatal-label">Retinitis pigmentosa</span>
          <span class="postnatal-value">{{ anamnesis.retinitisPigmentosa }}</span>
        </div>

        <div class="postnatal-row">
          <span class="postnatal-label">Renal problems</span>
          <span class="postnatal-value">{{ anamnesis.renalProblems }}</span>
        </div>

        <div class="postnatal-row">
          <span class="postnatal-label">Fertility disorder</span>
          <span class="postnatal-value">{{ anamnesis.fertilityDisorder }}</span>
        </div>

        <div class="postnatal-row">
          <span class="postnatal-label">Other comorbidities</span>
          <span class="postnatal-value">
            {{ anamnesis.otherComorbidities ?? "—" }}
            <span v-if="anamnesis.otherComorbidities === 'Yes' && anamnesis.otherComorbiditiesDetails">
              — {{ anamnesis.otherComorbiditiesDetails }}
            </span>
          </span>
        </div>
      </div>

      <div v-else class="form-grid">
        <label class="field">
          <span class="label">Organ position disorder</span>
          <select v-model="anamnesis.organPositionDisorder" class="input">
            <option>Not present</option>
            <option>Situs inversus</option>
            <option>Heterotaxy</option>
            <option>Unknown</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Congenital heart defect</span>
          <select v-model="anamnesis.congenitalHeartDefect" class="input">
            <option>Yes</option>
            <option>No</option>
            <option>Unknown</option>
          </select>
        </label>

        <label v-if="anamnesis.congenitalHeartDefect === 'Yes'" class="field full">
          <span class="label">What defect?</span>
          <input v-model="anamnesis.congenitalHeartDefectDetails" type="text" class="input" placeholder="Describe the defect" />
        </label>

        <label class="field">
          <span class="label">Ciliary disorder in the CNS</span>
          <select v-model="anamnesis.ciliaryDisorderInCns" class="input">
            <option>Yes</option>
            <option>No</option>
            <option>Unknown</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Retinitis pigmentosa</span>
          <select v-model="anamnesis.retinitisPigmentosa" class="input">
            <option>Yes</option>
            <option>No</option>
            <option>Unknown</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Renal problems</span>
          <select v-model="anamnesis.renalProblems" class="input">
            <option>Yes</option>
            <option>No</option>
            <option>Unknown</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Fertility disorder</span>
          <select v-model="anamnesis.fertilityDisorder" class="input">
            <option>Not present</option>
            <option>Subfertility</option>
            <option>Infertility</option>
            <option>Unknown</option>
          </select>
        </label>

        <label class="field">
          <span class="label">Other comorbidities</span>
          <div class="options">
            <label class="radio">
              <input v-model="anamnesis.otherComorbidities" type="radio" value="Yes" />
              Yes
            </label>
            <label class="radio">
              <input v-model="anamnesis.otherComorbidities" type="radio" value="No" />
              No
            </label>
          </div>
        </label>

        <label v-if="anamnesis.otherComorbidities === 'Yes'" class="field full">
          <span class="label">Which comorbidities?</span>
          <textarea v-model="anamnesis.otherComorbiditiesDetails" rows="3" class="input" placeholder="List other comorbidities"></textarea>
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
  margin-bottom: 6px;
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

.save-button { 
  background-color: var(--accent);
  border-color: #4b6cff;
  color: white;
padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e1e5ea;
}

.save-button:hover {
  background-color: var(--accent-hover);
}

.postnatal {
  display: grid;
  gap: 12px;
}

.gestation {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fff;
}

.gestation-value {
  color: #111827;
  font-weight: 650;
}

.postnatal-list {
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.postnatal-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid #eef1f6;
}

.postnatal-row:first-child {
  border-top: none;
}

.postnatal-label {
  color: #111827;
  font-weight: 600;
}

.postnatal-value {
  color: #4b5563;
  font-weight: 650;
}

.postnatal-row .input--compact {
  max-width: 180px;
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
