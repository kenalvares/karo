import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "Karo"
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "Login"
    }
  },
  {
    path: "/docs",
    name: "docs",
    component: () => import("@/views/Docs.vue"),
    meta: {
      title: "Docs"
    }
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/About.vue"),
    meta: {
      title: "About"
    }
  },
  {
    path: "/support",
    name: "support",
    component: () => import("@/views/Support.vue"),
    meta: {
      title: "Support"
    }
  },
  {
    path: "/sign-up",
    name: "signup",
    component: () => import("@/views/SignUp.vue"),
    meta: {
      title: "Sign Up"
    }
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
    meta: {
      title: "Dashboard"
    }
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("@/views/Projects.vue"),
    meta: {
      title: "Projects"
    }
  },
  {
    path: "/project/:id",
    name: "project",
    component: () => import("@/views/Project.vue"),
    meta: {
      title: "Karo"
    }
  },
  {
    path: "/chats",
    name: "chats",
    component: () => import("@/views/Chats.vue"),
    meta: {
      title: "Chats"
    }
  },
  {
    path: "/teams",
    name: "teams",
    component: () => import("@/views/Teams.vue"),
    meta: {
      title: "Teams"
    }
  },
  {
    path: "/team/:id",
    name: "team",
    component: () => import("@/views/Team.vue"),
    meta: {
      title: "Karo"
    }
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    meta: {
      title: "Profile"
    }
  },
  {
    path: "/account/:id",
    name: "account",
    component: () => import("@/views/Account.vue"),
    meta: {
      title: "Account"
    }
  },
  {
    path: "/sprint/:id",
    name: "sprint",
    component: () => import("@/views/Sprint.vue"),
    meta: {
      title: "Karo"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// Callback runs before every route change
router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);
  // const previousNearestWithMeta = from.matched
  //   .slice()
  //   .reverse()
  //   .find(r => r.meta && r.meta.metaTags);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  Array.from(document.querySelectorAll("[data-vue-router-controlled")).map(el =>
    el.parentNode.removeChild(el)
  );

  if (!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
