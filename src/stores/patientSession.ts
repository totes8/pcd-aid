import { defineStore } from "pinia";

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

export type AnamnesisModel = {
  picadar: number;
  clinicIndex: number;
  picadarAnswers: PicadarAnswers;
  situsInversus: "Yes" | "No" | "Unknown";
  fertilityIssues: "Yes" | "No" | "Unknown";
  retinitisPigmentosa: "Yes" | "No" | "Unknown";
  postnatal: {
    gestationAge: string;
    pneumonia: "Yes" | "No" | "Unknown";
    oxygenTherapy: "Yes" | "No" | "Unknown";
    hydrocephalia: "Yes" | "No" | "Unknown";
  };
  notes: string;
};

type PatientSession = {
  anamnesis: AnamnesisModel;
};

type SessionState = {
  byPatientId: Record<string, PatientSession>;
};

function defaultAnamnesis(): AnamnesisModel {
  return {
    picadar: 0,
    clinicIndex: 5,
    picadarAnswers: {
      wetCough: "No",
      born: null,
      neonatalChestSymptoms: null,
      neonatalUnitAdmission: null,
      situsAbnormality: null,
      congenitalHeartDefect: null,
      perennialRhinitis: null,
      chronicEarOrHearingSymptoms: null,
    },
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
  };
}

export const usePatientSessionStore = defineStore("patientSession", {
  state: (): SessionState => ({
    byPatientId: {},
  }),

  actions: {
    getOrCreate(patientId: string): PatientSession {
      if (!this.byPatientId[patientId]) {
        this.byPatientId[patientId] = { anamnesis: defaultAnamnesis() };
      }
      return this.byPatientId[patientId];
    },
    getOrCreateAnamnesis(patientId: string): AnamnesisModel {
      return this.getOrCreate(patientId).anamnesis;
    },
  },
});

