// import auth from "@/middleware/auth";

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/Layout/index.vue"),
    meta: {
      // middleware: [auth],
    },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/Routes"),
        meta: {
          hide: true,
        },
      },
      {
        path: "frequency",
        name: "frequency",
        component: () => import("@/views/Routes/Frequency"),
        meta: {
          hide: true,
        },
      },
      {
        path: "routes",
        name: "routes",
        component: () => import("@/views/Routes/Tracking"),
        meta: {
          hide: true,
        },
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("@/views/Clients"),
        meta: {
          hide: true,
        },
      },
      {
        path: "prices",
        name: "prices",
        component: () => import("@/views/Clients/SpecialPrices"),
        meta: {
          hide: true,
        },
      },
      {
        path: "inventory",
        name: "inventory",
        component: () => import("@/views/Inventory"),
        meta: {
          hide: true,
        },
      },
      {
        path: "reports",
        name: "reports",
        component: () => import("@/views/Reports"),
        meta: {
          hide: true,
        },
      },
      {
        path: "configuration",
        name: "configuration",
        component: () => import("@/views/Configuration"),
        meta: {
          hide: true,
        },
      },
    ],
  },
];

export default routes;
