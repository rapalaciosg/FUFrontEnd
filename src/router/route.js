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
    ],
  },
];

export default routes;
