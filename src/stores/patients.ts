import { defineStore } from "pinia";

export type PatientStatus =
  | "Not Diagnosed"
  | "Highly Suspected"
  | "Confirmed PCD"
  | "PCD Unconfirmed";

export type PatientListItem = {
  id: string;
  dob: string;         // YYYY-MM-DD
  age: number; 
  clinician: string;
  status: PatientStatus;
  hsvm?: "Done" | "Pending" | "N/A" | "Unknown";
  nno?: "Done" | "Pending" | "N/A" | "Unknown";
  tem?: "Done" | "Pending" | "N/A";
  if?: "Done" | "Pending" | "N/A" | "Unknown";
  genetics?: "Done" | "Pending" | "N/A" | "Unknown";
  dateAdded: string;   // YYYY-MM-DD
  lastUpdate: string;  // YYYY-MM-DD
};

type ListState = {
  items: PatientListItem[];
  loading: boolean;
  error: string | null;
};

// UTILITIES 

function calcAge(dob: string): number {
  // dob expected as YYYY-MM-DD
  const [y, m, d] = dob.split("-").map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasHadBirthday) age -= 1;
  return age;
}

export const usePatientsStore = defineStore("patients", {
  state: (): ListState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId: (state) => (id: string) => state.items.find((p) => p.id === id),
    sortedByLastUpdate: (state) =>
      [...state.items].sort((a, b) => (a.lastUpdate < b.lastUpdate ? 1 : -1)),
    withAge: (state) =>
      state.items.map((p) => ({
        ...p,
        age: calcAge(p.dob),
      })),
  },

  actions: {
    setItems(items: PatientListItem[]) {
      this.items = items;
    },
    addPatient(payload: { id: string; dob: string; clinician?: string; status?: PatientStatus }) {
  const age = calcAge(payload.dob);
  const today = new Date().toISOString().slice(0, 10);

  this.items.unshift({
    id: payload.id,
    dob: payload.dob,
    age,
    clinician: payload.clinician ?? "Janko Mrkvička",
    status: payload.status ?? "Not Diagnosed",
    hsvm: "Unknown",
    nno: "Unknown",
    tem: "N/A",
    if: "Unknown",
    genetics: "Unknown",
    dateAdded: today,
    lastUpdate: today,
  });
},

    async fetchList() {
  try {
    this.loading = true;
    this.error = null;

    const data: PatientListItem[] = [
      {
        id: "0001",
        dob: "1989-07-14",
        age: calcAge("1989-07-14"),
        clinician: "Dr. Smith",
        status: "Confirmed PCD",
        hsvm: "Done",
        nno: "Done",
        tem: "Done",
        if: "Done",
        genetics: "Done",
        dateAdded: "2024-01-05",
        lastUpdate: "2024-03-01",
      },
      {
        id: "0002",
        dob: "2001-07-18",
        age: calcAge("2001-07-18"),
        clinician: "Dr. Smith",
        status: "PCD Unconfirmed",
        hsvm: "Done",
        nno: "Done",
        tem: "Done",
        if: "Done",
        genetics: "Done",
        dateAdded: "2024-01-05",
        lastUpdate: "2024-03-01",
      },
      {
        id: "0003",
        dob: "2020-07-18",
        age: calcAge("2020-07-18"),
        clinician: "Dr. Smith",
        status: "Not Diagnosed",
        hsvm: "Done",
        nno: "Done",
        tem: "Pending",
        if: "Pending",
        genetics: "Pending",
        dateAdded: "2024-01-05",
        lastUpdate: "2024-03-01",
      }
    ];

    // merge: keep existing items, add missing mock ones
    const existingById = new Map(this.items.map((p) => [p.id, p]));
    for (const p of data) {
      if (!existingById.has(p.id)) {
        this.items.push(p);
      }
    }
  } catch (e: any) {
    this.error = e?.message ?? "Failed to load patients";
  } finally {
    this.loading = false;
  }
},

    
  },
});
