import { defineStore } from "pinia";

export type PatientListItem = {
  id: string;
  dob: string;         // YYYY-MM-DD
  status: "Active" | "Pending" | "Inactive" | "Archived";
  hsvm?: "Done" | "Pending" | "N/A" | "Unknown";
  nno?: "Done" | "Pending" | "N/A" | "Unknown";
  tem?: "Done" | "Pending" | "N/A" | "Unknown";
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
            id: "P-0001",
            dob: "1989-07-14",
            status: "Active",
            hsvm: "Done",
            nno: "Pending",
            tem: "N/A",
            if: "Done",
            genetics: "Unknown",
            dateAdded: "2024-01-05",
            lastUpdate: "2024-03-01",
          },
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
