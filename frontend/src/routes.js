const routes = [
  { label: "Inicio", path: "/dashboard" },
  {
    label: "Usuarios",
    submenu: [
      { label: "Nuevo usuario", path: "/usuarios/nuevo" },
      { label: "Buscar usuarios", path: "/usuarios/buscar" },
    ],
  },
  {
    label: "Clientes",
    submenu: [
      { label: "Nuevo cliente", path: "/clientes/nuevo" },
      { label: "Buscar clientes", path: "/clientes/buscar" },
    ],
  },
  {
    label: "Empresas",
    submenu: [
      { label: "Nueva empresa", path: "/empresas/nueva" },
      { label: "Buscar empresas", path: "/empresas/buscar" },
    ],
  },
  {
    label: "Habitaciones",
    submenu: [
      { label: "Nueva habitación", path: "/habitaciones/nueva" },
      { label: "Mostrar habitaciones", path: "/habitaciones", exact: true },
    ],
  },
  {
    label: "Reservas",
    submenu: [
      { label: "Nueva reserva", path: "/reservas/nueva" },
      { label: "Buscar reservas", path: "/reservas/buscar" },
      { label: "Check-in", path: "/reservas/check-in" },
    ],
  },
  {
    label: "Facturación",
    submenu: [
      { label: "Emitir factura", path: "/facturas/nueva" },
      { label: "Buscar facturas", path: "/facturas/buscar" },
      { label: "Check-out", path: "/facturas/check-out" },
    ],
  },
  {
    label: "Informes",
    submenu: [
      { label: "Reservas por fecha", path: "/informes/reservas" },
      { label: "Ocupación por día", path: "/informes/ocupacion" },
      { label: "Facturación por mes", path: "/informes/facturacion" },
    ],
  },
];


export default routes;

  