import { defineStore } from "pinia";
import type { PatientListItem } from "./patients";
import { usePatientsStore } from "./patients";

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

function seededSessionFromListItem(item: PatientListItem): PatientDiagnosticsSession {
  const session = defaultSession();

  const nnoValue =
    item.status === "Confirmed PCD" ? 32 :
    item.status === "Highly Suspected" ? 58 :
    item.status === "PCD Unconfirmed" ? 118 :
    92;

  if (item.nno === "Done") {
    session.nno.push({
      id: `seed_nno_${item.id}`,
      valuePpb: nnoValue,
      date: item.lastUpdate,
      clinician: item.clinician,
    });
  }

  if (item.hsvm === "Done") {
    const report =
      item.status === "Confirmed PCD"
        ? "Persistent dyskinetic ciliary beat pattern with reduced coordination; findings support PCD."
        : item.status === "Highly Suspected"
          ? "Abnormal beat pattern observed in multiple fields; repeat sampling recommended for confirmation."
          : "HSVM largely preserved with occasional secondary dyskinesia; not strongly supportive of PCD.";

    session.hsvm.push({
      id: `seed_hsvm_${item.id}`,
      report,
      date: item.lastUpdate,
      clinician: item.clinician,
      attachment: null,
    });
  }

  if (item.if === "Done") {
    const report =
      item.status === "Confirmed PCD"
        ? "IF demonstrates absent/reduced axonemal protein signal consistent with ciliary structural defect."
        : "IF panel without definitive loss pattern; interpretation non-diagnostic.";

    session.if.push({
      id: `seed_if_${item.id}`,
      report,
      date: item.lastUpdate,
      clinician: item.clinician,
      attachment: null,
    });
  }

  if (item.genetics === "Done") {
    const report =
      item.status === "Confirmed PCD"
        ? "Pathogenic biallelic PCD-associated variants identified; molecular findings confirm diagnosis."
        : "No clearly pathogenic biallelic variants identified; result currently non-confirmatory.";

    session.genetics.push({
      id: `seed_genetics_${item.id}`,
      report,
      date: item.lastUpdate,
      clinician: item.clinician,
      attachment: null,
    });
  }

  return session;
}

export const usePatientDiagnosticsSessionStore = defineStore("patientDiagnosticsSession", {
  state: (): State => ({
    byPatientId: {},
  }),

  actions: {
    markDone(patientId: string, key: "nno" | "hsvm" | "if" | "genetics") {
      const patientsStore = usePatientsStore();
      const item = patientsStore.byId(patientId);
      if (!item) return;
      item[key] = "Done";
      item.lastUpdate = todayIso();
    },

    ensureFromListItem(item: PatientListItem) {
      if (!this.byPatientId[item.id]) {
        this.byPatientId[item.id] = seededSessionFromListItem(item);
      }
    },
    ensureFromList(items: PatientListItem[]) {
      for (const item of items) this.ensureFromListItem(item);
    },
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
      this.markDone(patientId, "nno");
    },

    updateNno(patientId: string, id: string, patch: Partial<Omit<NnoEntry, "id">>) {
      const list = this.getOrCreate(patientId).nno;
      const item = list.find((x) => x.id === id);
      if (!item) return;
      Object.assign(item, patch);
      this.markDone(patientId, "nno");
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
      this.markDone(patientId, "hsvm");
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
      this.markDone(patientId, "hsvm");
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
      this.markDone(patientId, "if");
    },

    updateIf(patientId: string, id: string, patch: Partial<Omit<IfEntry, "id">>) {
      const list = this.getOrCreate(patientId).if;
      const item = list.find((x) => x.id === id);
      if (!item) return;
      Object.assign(item, patch);
      this.markDone(patientId, "if");
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
      this.markDone(patientId, "genetics");
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
      this.markDone(patientId, "genetics");
    },
  },
});
