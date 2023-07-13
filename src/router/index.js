import { createRouter, createWebHistory } from "vue-router";
import keycloak from "@/security/KeycloakService";

import routes from "./route";

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  base: import.meta.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authenticated = await keycloak.init({ onLoad: 'check-sso'})
    if (authenticated) {
      next();
    } else {
      keycloak.login();
    }
  } else {
    next();
  }
  // const titleText = to.name;
  // const words = titleText.split(" ");
  // const wordslength = words.length;
  // for (let i = 0; i < wordslength; i++) {
  //   words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  // }

  // document.title = "Dashcode  - " + words;

  // next();
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
