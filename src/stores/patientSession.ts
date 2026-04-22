import { defineStore } from "pinia";
import type { PatientListItem } from "./patients";

export type YesNo = "Yes" | "No";

export type PicadarAnswers = {
  wetCough: YesNo | null;
  born: "Pre-term" | "Term" | null;
  neonatalChestSymptoms: YesNo | null;
  neonatalUnitAdmission: YesNo | null;
  situsAbnormality: YesNo | null;
  congenitalHeartDefect: YesNo | null;
  perennialRhinitis: YesNo | null;
  chronicEarOrHearingSymptoms: YesNo | null;
};

export type ClinicalIndexAnswers = {
  respiratoryDifficultiesAfterBirth: YesNo | null;
  earlyRhinitisOrMucus: YesNo | null;
  pneumonia: YesNo | null;
  threePlusBronchitisEpisodes: YesNo | null;
  chronicOtitisOrThreePlusAcuteOtitis: YesNo | null;
  yearRoundNasalDischargeOrObstruction: YesNo | null;
  antibioticsForAuriThreePlus: YesNo | null;
};

export type AnamnesisModel = {
  picadar: number;
  clinicalIndex: number;
  picadarAnswers: PicadarAnswers;
  clinicalIndexAnswers: ClinicalIndexAnswers;
  organPositionDisorder: "Not present" | "Situs inversus" | "Heterotaxy" | "Unknown";
  congenitalHeartDefect: "Yes" | "No" | "Unknown";
  congenitalHeartDefectDetails: string;
  ciliaryDisorderInCns: "Yes" | "No" | "Unknown";
  retinitisPigmentosa: "Yes" | "No" | "Unknown";
  renalProblems: "Yes" | "No" | "Unknown";
  fertilityDisorder: "Not present" | "Subfertility" | "Infertility" | "Unknown";
  otherComorbidities: "Yes" | "No" | null;
  otherComorbiditiesDetails: string;
  postnatal: {
    gestationAge: string;
    neonatalRds: "Yes" | "No" | "Unknown";
    cough: "Yes" | "No" | "Unknown";
    rhinitis: "Yes" | "No" | "Unknown";
    pneumonia: "Yes" | "No" | "Unknown";
    hydrocephalus: "Yes" | "No" | "Unknown";
    hospitalizationAtNeoJip: "Yes" | "No" | "Unknown";
    oxygenTherapy: "Yes" | "No" | "Unknown";
    lungVentilation: "Yes" | "No" | "Unknown";
  };
  notes: string;
};

type PatientSession = {
  anamnesis: AnamnesisModel;
};

type SessionState = {
  byPatientId: Record<string, PatientSession>;
};

function templateFromListItem(item: PatientListItem): AnamnesisModel {
  const base = defaultAnamnesis();

  if (item.status === "Confirmed PCD") {
    return {
      ...base,
      picadar: 8,
      clinicalIndex: 6,
      picadarAnswers: {
        wetCough: "Yes",
        born: "Term",
        neonatalChestSymptoms: "Yes",
        neonatalUnitAdmission: "Yes",
        situsAbnormality: "Yes",
        congenitalHeartDefect: "No",
        perennialRhinitis: "Yes",
        chronicEarOrHearingSymptoms: "Yes",
      },
      clinicalIndexAnswers: {
        respiratoryDifficultiesAfterBirth: "Yes",
        earlyRhinitisOrMucus: "Yes",
        pneumonia: "Yes",
        threePlusBronchitisEpisodes: "Yes",
        chronicOtitisOrThreePlusAcuteOtitis: "Yes",
        yearRoundNasalDischargeOrObstruction: "Yes",
        antibioticsForAuriThreePlus: "No",
      },
      organPositionDisorder: "Situs inversus",
      congenitalHeartDefect: "No",
      ciliaryDisorderInCns: "No",
      retinitisPigmentosa: "No",
      renalProblems: "No",
      fertilityDisorder: "Unknown",
      otherComorbidities: "No",
      postnatal: {
        gestationAge: "39 weeks",
        neonatalRds: "Yes",
        cough: "Yes",
        rhinitis: "Yes",
        pneumonia: "Yes",
        hydrocephalus: "No",
        hospitalizationAtNeoJip: "Yes",
        oxygenTherapy: "Yes",
        lungVentilation: "No",
      },
      notes: "Pattern compatible with chronic sinopulmonary disease from early infancy.",
    };
  }

  if (item.status === "Highly Suspected") {
    return {
      ...base,
      picadar: 5,
      clinicalIndex: 5,
      picadarAnswers: {
        wetCough: "Yes",
        born: "Term",
        neonatalChestSymptoms: "Yes",
        neonatalUnitAdmission: "No",
        situsAbnormality: "No",
        congenitalHeartDefect: "No",
        perennialRhinitis: "Yes",
        chronicEarOrHearingSymptoms: "Yes",
      },
      clinicalIndexAnswers: {
        respiratoryDifficultiesAfterBirth: "Yes",
        earlyRhinitisOrMucus: "Yes",
        pneumonia: "No",
        threePlusBronchitisEpisodes: "Yes",
        chronicOtitisOrThreePlusAcuteOtitis: "Yes",
        yearRoundNasalDischargeOrObstruction: "Yes",
        antibioticsForAuriThreePlus: "No",
      },
      organPositionDisorder: "Not present",
      congenitalHeartDefect: "No",
      ciliaryDisorderInCns: "Unknown",
      retinitisPigmentosa: "No",
      renalProblems: "Unknown",
      fertilityDisorder: "Unknown",
      otherComorbidities: "No",
      postnatal: {
        gestationAge: "38 weeks",
        neonatalRds: "Unknown",
        cough: "Yes",
        rhinitis: "Yes",
        pneumonia: "No",
        hydrocephalus: "No",
        hospitalizationAtNeoJip: "Unknown",
        oxygenTherapy: "Unknown",
        lungVentilation: "No",
      },
      notes: "Clinical picture suggests PCD; confirmatory testing pending.",
    };
  }

  if (item.status === "PCD Unconfirmed") {
    return {
      ...base,
      picadar: 2,
      clinicalIndex: 2,
      picadarAnswers: {
        wetCough: "Yes",
        born: "Pre-term",
        neonatalChestSymptoms: "No",
        neonatalUnitAdmission: "No",
        situsAbnormality: "No",
        congenitalHeartDefect: "No",
        perennialRhinitis: "Yes",
        chronicEarOrHearingSymptoms: "No",
      },
      clinicalIndexAnswers: {
        respiratoryDifficultiesAfterBirth: "No",
        earlyRhinitisOrMucus: "No",
        pneumonia: "No",
        threePlusBronchitisEpisodes: "Yes",
        chronicOtitisOrThreePlusAcuteOtitis: "No",
        yearRoundNasalDischargeOrObstruction: "Yes",
        antibioticsForAuriThreePlus: "No",
      },
      organPositionDisorder: "Not present",
      congenitalHeartDefect: "No",
      ciliaryDisorderInCns: "No",
      retinitisPigmentosa: "No",
      renalProblems: "No",
      fertilityDisorder: "Unknown",
      otherComorbidities: "No",
      postnatal: {
        gestationAge: "36 weeks",
        neonatalRds: "No",
        cough: "Unknown",
        rhinitis: "Yes",
        pneumonia: "No",
        hydrocephalus: "No",
        hospitalizationAtNeoJip: "No",
        oxygenTherapy: "No",
        lungVentilation: "No",
      },
      notes: "Current evidence does not support confirmed PCD diagnosis.",
    };
  }

  // Not diagnosed (new patients): keep unknown/blank defaults as requested.
  return base;
}

function normalizeAnamnesisShape(a: any): asserts a is AnamnesisModel {
  if (!a.picadarAnswers) a.picadarAnswers = defaultAnamnesis().picadarAnswers;
  if (!a.clinicalIndexAnswers) a.clinicalIndexAnswers = defaultAnamnesis().clinicalIndexAnswers;
  if (!a.postnatal) a.postnatal = defaultAnamnesis().postnatal;

  const defaults = defaultAnamnesis().postnatal;
  if (!a.postnatal.gestationAge) a.postnatal.gestationAge = defaults.gestationAge;
  if (!a.postnatal.neonatalRds) a.postnatal.neonatalRds = defaults.neonatalRds;
  if (!a.postnatal.cough) a.postnatal.cough = defaults.cough;
  if (!a.postnatal.rhinitis) a.postnatal.rhinitis = defaults.rhinitis;
  if (!a.postnatal.pneumonia) a.postnatal.pneumonia = defaults.pneumonia;
  if (!a.postnatal.hydrocephalus) a.postnatal.hydrocephalus = defaults.hydrocephalus;
  if (!a.postnatal.hospitalizationAtNeoJip) {
    a.postnatal.hospitalizationAtNeoJip = defaults.hospitalizationAtNeoJip;
  }
  if (!a.postnatal.oxygenTherapy) a.postnatal.oxygenTherapy = defaults.oxygenTherapy;
  if (!a.postnatal.lungVentilation) a.postnatal.lungVentilation = defaults.lungVentilation;

  const baseDefaults = defaultAnamnesis();
  if (!a.organPositionDisorder) a.organPositionDisorder = baseDefaults.organPositionDisorder;
  if (!a.congenitalHeartDefect) a.congenitalHeartDefect = baseDefaults.congenitalHeartDefect;
  if (a.congenitalHeartDefectDetails == null) {
    a.congenitalHeartDefectDetails = baseDefaults.congenitalHeartDefectDetails;
  }
  if (!a.ciliaryDisorderInCns) a.ciliaryDisorderInCns = baseDefaults.ciliaryDisorderInCns;
  if (!a.retinitisPigmentosa) a.retinitisPigmentosa = baseDefaults.retinitisPigmentosa;
  if (!a.renalProblems) a.renalProblems = baseDefaults.renalProblems;
  if (!a.fertilityDisorder) a.fertilityDisorder = baseDefaults.fertilityDisorder;
  if (!a.otherComorbidities) a.otherComorbidities = baseDefaults.otherComorbidities;
  if (a.otherComorbiditiesDetails == null) {
    a.otherComorbiditiesDetails = baseDefaults.otherComorbiditiesDetails;
  }
}

function defaultAnamnesis(): AnamnesisModel {
  return {
    picadar: 0,
    clinicalIndex: 0,
    picadarAnswers: {
      wetCough: null,
      born: null,
      neonatalChestSymptoms: null,
      neonatalUnitAdmission: null,
      situsAbnormality: null,
      congenitalHeartDefect: null,
      perennialRhinitis: null,
      chronicEarOrHearingSymptoms: null,
    },
    clinicalIndexAnswers: {
      respiratoryDifficultiesAfterBirth: null,
      earlyRhinitisOrMucus: null,
      pneumonia: null,
      threePlusBronchitisEpisodes: null,
      chronicOtitisOrThreePlusAcuteOtitis: null,
      yearRoundNasalDischargeOrObstruction: null,
      antibioticsForAuriThreePlus: null,
    },
    organPositionDisorder: "Unknown",
    congenitalHeartDefect: "Unknown",
    congenitalHeartDefectDetails: "",
    ciliaryDisorderInCns: "Unknown",
    retinitisPigmentosa: "Unknown",
    renalProblems: "Unknown",
    fertilityDisorder: "Unknown",
    otherComorbidities: null,
    otherComorbiditiesDetails: "",
    postnatal: {
      gestationAge: "",
      neonatalRds: "Unknown",
      cough: "Unknown",
      rhinitis: "Unknown",
      pneumonia: "Unknown",
      hydrocephalus: "Unknown",
      hospitalizationAtNeoJip: "Unknown",
      oxygenTherapy: "Unknown",
      lungVentilation: "Unknown",
    },
    notes: "No additional remarks.",
  };
}

export const usePatientSessionStore = defineStore("patientSession", {
  state: (): SessionState => ({
    byPatientId: {},
  }),

  actions: {
    ensureFromListItem(item: PatientListItem) {
      if (!this.byPatientId[item.id]) {
        this.byPatientId[item.id] = { anamnesis: templateFromListItem(item) };
      }
      normalizeAnamnesisShape(this.byPatientId[item.id].anamnesis as any);
    },
    ensureFromList(items: PatientListItem[]) {
      for (const item of items) this.ensureFromListItem(item);
    },
    getOrCreate(patientId: string): PatientSession {
      if (!this.byPatientId[patientId]) {
        this.byPatientId[patientId] = { anamnesis: defaultAnamnesis() };
      }

      // Forward-compatible for users who already have session state in memory.
      normalizeAnamnesisShape(this.byPatientId[patientId].anamnesis as any);
      return this.byPatientId[patientId];
    },
    getOrCreateAnamnesis(patientId: string): AnamnesisModel {
      return this.getOrCreate(patientId).anamnesis;
    },
  },
});
