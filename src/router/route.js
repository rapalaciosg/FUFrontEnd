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
        component: () => import("@/views/index.vue"),
        meta: {
          hide: true,
        },
      },
      {
        path: "routes",
        name: "routes",
        component: () => import("@/views/Routes"),
        meta: {
          hide: true,
        },
      },
    ],
  },
];

export default routes;
