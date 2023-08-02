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
        component: () => import("@/views/Routes/RoutesManagement"),
        meta: {
          hide: true,
        },
      },
      {
        path: "tracking",
        name: "tracking",
        component: () => import("@/views/Routes/Tracking"),
        meta: {
          hide: true,
        },
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("@/views/Clients/Customers"),
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
        path: "products",
        name: "products",
        component: () => import("@/views/Inventory/Products"),
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
        path: "sells",
        name: "sells",
        component: () => import("@/views/Reports/SellsClientsReport"),
        meta: {
          hide: true,
        },
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/views/Security/Users"),
        meta: {
          hide: true,
        },
      },
      {
        path: "roles",
        name: "roles",
        component: () => import("@/views/Security/Roles"),
        meta: {
          hide: true,
        },
      },
      {
        path: "permissions",
        name: "permissions",
        component: () => import("@/views/Security/Permissions"),
        meta: {
          hide: true,
        },
      },
      {
        path: "company",
        name: "company",
        component: () => import("@/views/Administration/Company"),
        meta: {
          hide: true,
        },
      },
      {
        path: "branch-office",
        name: "branch-office",
        component: () => import("@/views/Administration/BranchOffice"),
        meta: {
          hide: true,
        },
      },
      {
        path: "driver",
        name: "driver",
        component: () => import("@/views/Administration/Driver"),
        meta: {
          hide: true,
        },
      },
      {
        path: "vehicle",
        name: "vehicle",
        component: () => import("@/views/Administration/Vehicle"),
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
