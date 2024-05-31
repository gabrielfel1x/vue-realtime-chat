// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import GroupSelection from "../components/GroupSelection.vue";
import ChatBox from "../components/ChatBox.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
  },
  {
    path: "/group-selection",
    name: "GroupSelection",
    component: GroupSelection,
    props: (route) => ({
      username: route.query.username,
      groups: ["Vue Brasil", "Grupo Amigos", "Viagem"],
    }),
  },
  {
    path: "/chat",
    name: "ChatBox",
    component: ChatBox,
    props: (route) => ({
      username: route.query.username,
      group: route.query.group,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
