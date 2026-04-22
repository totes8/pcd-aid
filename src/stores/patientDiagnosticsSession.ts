import { defineStore } from "pinia";

export type NnoEntry = {
  id: string;
  valuePpb: number;
  date: string; // YYYY-MM-DD
  clinician: string;
};

export type HsvmAttachment = {
  name: string;
  type: string;
  size: number;
  url: string; // Object URL for in-session download/preview
};

export type HsvmEntry = {
  id: string;
  report: string;
  date: string; // YYYY-MM-DD
  clinician: string;
  attachment?: HsvmAttachment | null;
};

export type IfEntry = {
  id: string;
  report: string;
  date: string; // YYYY-MM-DD
  clinician: string;
  attachment?: HsvmAttachment | null;
};

export type GeneticsEntry = {
  id: string;
  report: string;
  date: string; // YYYY-MM-DD
  clinician: string;
  attachment?: HsvmAttachment | null;
};

type PatientDiagnosticsSession = {
  nno: NnoEntry[];
  hsvm: HsvmEntry[];
  if: IfEntry[];
  genetics: GeneticsEntry[];
};

type State = {
  byPatientId: Record<string, PatientDiagnosticsSession>;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultSession(): PatientDiagnosticsSession {
  return { nno: [], hsvm: [], if: [], genetics: [] };
}

export const usePatientDiagnosticsSessionStore = defineStore("patientDiagnosticsSession", {
  state: (): State => ({
    byPatientId: {},
  }),

  actions: {
    getOrCreate(patientId: string): PatientDiagnosticsSession {
      if (!this.byPatientId[patientId]) {
        this.byPatientId[patientId] = defaultSession();
      }
      return this.byPatientId[patientId];
    },

    listNno(patientId: string): NnoEntry[] {
      return this.getOrCreate(patientId).nno;
    },

    addNno(patientId: string, payload: { valuePpb: number; clinician: string; date?: string }) {
      const entry: NnoEntry = {
        id: `nno_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        valuePpb: payload.valuePpb,
        clinician: payload.clinician,
        date: payload.date ?? todayIso(),
      };
      this.getOrCreate(patientId).nno.unshift(entry);
    },

    updateNno(patientId: string, id: string, patch: Partial<Omit<NnoEntry, "id">>) {
      const list = this.getOrCreate(patientId).nno;
      const item = list.find((x) => x.id === id);
      if (!item) return;
      Object.assign(item, patch);
    },

    listHsvm(patientId: string): HsvmEntry[] {
      return this.getOrCreate(patientId).hsvm;
    },

    addHsvm(
      patientId: string,
      payload: { report: string; clinician: string; date?: string; attachment?: HsvmAttachment | null },
    ) {
      const entry: HsvmEntry = {
        id: `hsvm_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        report: payload.report,
        clinician: payload.clinician,
        date: payload.date ?? todayIso(),
        attachment: payload.attachment ?? null,
      };
      this.getOrCreate(patientId).hsvm.unshift(entry);
    },

    updateHsvm(
      patientId: string,
      id: string,
      patch: Partial<Omit<HsvmEntry, "id">>,
    ) {
      const list = this.getOrCreate(patientId).hsvm;
      const item = list.find((x) => x.id === id);
      if (!item) return;
      Object.assign(item, patch);
    },

    listIf(patientId: string): IfEntry[] {
      return this.getOrCreate(patientId).if;
    },

    addIf(
      patientId: string,
      payload: { report: string; clinician: string; date?: string; attachment?: HsvmAttachment | null },
    ) {
      const entry: IfEntry = {
        id: `if_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        report: payload.report,
        clinician: payload.clinician,
        date: payload.date ?? todayIso(),
        attachment: payload.attachment ?? null,
      };
      this.getOrCreate(patientId).if.unshift(entry);
    },

    updateIf(patientId: string, id: string, patch: Partial<Omit<IfEntry, "id">>) {
      const list = this.getOrCreate(patientId).if;
      const item = list.find((x) => x.id === id);
      if (!item) return;
      Object.assign(item, patch);
    },

    listGenetics(patientId: string): GeneticsEntry[] {
      return this.getOrCreate(patientId).genetics;
    },

    addGenetics(
      patientId: string,
      payload: { report: string; clinician: string; date?: string; attachment?: HsvmAttachment | null },
    ) {
      const entry: GeneticsEntry = {
        id: `genetics_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        report: payload.report,
        clinician: payload.clinician,
        date: payload.date ?? todayIso(),
        attachment: payload.attachment ?? null,
      };
      this.getOrCreate(patientId).genetics.unshift(entry);
    },

    updateGenetics(
      patientId: string,
      id: string,
      patch: Partial<Omit<GeneticsEntry, "id">>,
    ) {
      const list = this.getOrCreate(patientId).genetics;
      const item = list.find((x) => x.id === id);
      if (!item) return;
      Object.assign(item, patch);
    },
  },
});
