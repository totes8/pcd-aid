import { createRouter, createWebHashHistory } from "vue-router";
import PatientListView from "./views/PatientListView.vue";

const routes = [
  { path: "/", redirect: "/patients" },
  { path: "/patients", name: "patients", component: PatientListView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
