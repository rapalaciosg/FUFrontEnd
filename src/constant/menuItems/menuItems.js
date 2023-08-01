export const menuItems = [
  {
    isHeadr: true,
    title: "menu",
  },
  // {
  //   title: "Dashboard",
  //   icon: "heroicons-outline:home",
  //   link: "home",
  // },
  {
    title: "Rutas",
    icon: "heroicons-outline:map",
    isOpen: true,
    child: [
      {
        childtitle: "Inicio",
        childlink: "home",
      },
      {
        childtitle: "Seguimiento de rutas",
        childlink: "tracking",
      },
      {
        childtitle: "Mantenimiento de rutas",
        childlink: "routes",
      },
      {
        childtitle: "Frecuencias",
        childlink: "frequency",
      },
    ],
  },
  {
    title: "Clientes",
    icon: "heroicons-outline:user-group",
    link: "#",
    child: [
      {
        childtitle: "Inicio",
        childlink: "clients",
      },
      {
        childtitle: "Precios especiales",
        childlink: "prices",
      },
    ],
  },
  {
    title: "Adm. de inventario",
    icon: "heroicons-outline:list-bullet",
    link: "#",
    child: [
      {
        childtitle: "Transferir inventario",
        childlink: "inventory",
      },
      {
        childtitle: "Productos",
        childlink: "products",
      },
    ],
  },
  {
    title: "Reportes",
    icon: "heroicons-outline:chart-bar",
    link: "#",
    child: [
      {
        childtitle: "Seguimiento de rutas",
        childlink: "reports",
      },
      {
        childtitle: "Ventas por cliente",
        childlink: "sells",
      },
    ],
  },
  {
    title: "Seguridad",
    icon: "ic:baseline-security",
    link: "#",
    child: [
      {
        childtitle: "Usuarios",
        childlink: "users",
      },
      {
        childtitle: "Roles",
        childlink: "roles",
      },
      {
        childtitle: "Permisos",
        childlink: "permissions",
      },
    ],
  },
  {
    title: "Administración",
    icon: "dashicons:admin-tools",
    link: "#",
    child: [
      {
        childtitle: "Compañia",
        childlink: "company",
      },
      {
        childtitle: "Sucursales",
        childlink: "branch-office",
      },
      {
        childtitle: "Conductores",
        childlink: "driver",
      },
      {
        childtitle: "Vehículo",
        childlink: "vehicle",
      },
    ],
  },
  {
    title: "Configuración",
    icon: "heroicons-outline:cog-8-tooth",
    link: "#",
    child: [
      {
        childtitle: "Configuración de estilos",
        childlink: "configuration",
      },
    ],
  },
];
