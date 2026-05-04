import { defineStore } from "pinia";
import type { PatientListItem, PatientStatus } from "./patients";

export type PatientProfileData = {
  id: string;
  dob: string;
  clinician: string;
  status: PatientStatus;
  siblings: number;
  siblingNote: string;
  ageAtDiagnosis: number;
  bloodRelativesWithPCD: number;
};

type State = {
  byId: Record<string, PatientProfileData>;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function deriveProfileFromListItem(item: PatientListItem): PatientProfileData {
  // Lightweight Wizard-of-Oz defaults consistent with typical PCD workflow states.
  let siblings = 0;
  let ageAtDiagnosis = 0;
  let bloodRelativesWithPCD = 0;

  if (item.status === "Confirmed PCD") {
    siblings = 2;
    ageAtDiagnosis = clamp(Math.round(item.age * 0.35), 2, 18);
    bloodRelativesWithPCD = 1;
  } else if (item.status === "Highly Suspected") {
    siblings = 1;
    ageAtDiagnosis = 0;
    bloodRelativesWithPCD = 1;
  } else if (item.status === "PCD Excluded") {
    siblings = 1;
    ageAtDiagnosis = clamp(Math.round(item.age * 0.4), 2, 20);
    bloodRelativesWithPCD = 0;
  }

  return {
    id: item.id,
    dob: item.dob,
    clinician: item.clinician || "Janko Mrkvička",
    status: item.status,
    siblings,
    siblingNote: "",
    ageAtDiagnosis,
    bloodRelativesWithPCD,
  };
}

export const usePatientProfilesStore = defineStore("patientProfiles", {
  state: (): State => ({
    byId: {},
  }),

  getters: {
    getById: (state) => (id: string) => state.byId[id],
  },

  actions: {
    ensureFromListItem(item: PatientListItem) {
      if (!this.byId[item.id]) {
        this.byId[item.id] = deriveProfileFromListItem(item);
      }
    },

    ensureFromList(items: PatientListItem[]) {
      for (const item of items) {
        this.ensureFromListItem(item);
      }
    },

    updateBasicInfo(
      id: string,
      patch: Partial<Pick<PatientProfileData, "dob" | "status" | "ageAtDiagnosis">>,
    ) {
      const item = this.byId[id];
      if (!item) return;
      Object.assign(item, patch);
    },

    updateFamilyHistory(
      id: string,
      patch: Partial<Pick<PatientProfileData, "siblings" | "siblingNote" | "bloodRelativesWithPCD">>,
    ) {
      const item = this.byId[id];
      if (!item) return;
      Object.assign(item, patch);
    },
  },
});
