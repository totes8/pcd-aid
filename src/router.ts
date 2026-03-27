import { createRouter, createWebHashHistory } from "vue-router";
import PatientListView from "./views/PatientListView.vue";
import PatientProfileView from "./views/PatientProfileView.vue";
import BlankView from "./views/BlankView.vue";

const routes = [
  { path: "/", redirect: "/patients" },
  { path: "/patients", name: "patients", component: PatientListView },
  { path: "/patients/:id", name: "patientProfile", component: PatientProfileView },
  { path: "/organization", name: "organization", component: BlankView },
  { path: "/collaboration", name: "collaboration", component: BlankView },
  { path: "/settings", name: "settings", component: BlankView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
