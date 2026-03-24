import { defineStore } from "pinia";

export type PatientListItem = {
  id: string;
  dob: string;         // YYYY-MM-DD
  age: number; 
  status: "Active" | "Pending" | "Inactive" | "Archived";
  hsvm?: "Done" | "Pending" | "N/A" | "Unknown";
  nno?: "Done" | "Pending" | "N/A" | "Unknown";
  tem?: "Positive" | "Negative" | "N/A";
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

    // Replace with real API call later
    async fetchList() {
      try {
        this.loading = true;
        this.error = null;

        // mock data for now
        const data: PatientListItem[] = [
          {
            id: "0001",
            dob: "1989-07-14",
            age: calcAge("1989-07-14"),
            status: "Active",
            hsvm: "Done",
            nno: "Pending",
            tem: "Positive",
            if: "Done",
            genetics: "Unknown",
            dateAdded: "2024-01-05",
            lastUpdate: "2024-03-01",
          },
          {
            id: "0002",
            dob: "2001-07-18",
            age: calcAge("2001-07-18"),
            status: "Archived",
            hsvm: "Done",
            nno: "Pending",
            tem: "N/A",
            if: "Done",
            genetics: "Unknown",
            dateAdded: "2024-01-05",
            lastUpdate: "2024-03-01",
          }
        ];

        this.items = data;
      } catch (e: any) {
        this.error = e?.message ?? "Failed to load patients";
      } finally {
        this.loading = false;
      }
    },
  },
});
