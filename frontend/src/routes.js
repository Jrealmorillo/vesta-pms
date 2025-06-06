// Definición de las rutas principales y submenús de la aplicación 
// Cada objeto representa una sección del menú de navegación y sus rutas asociadas.
// Algunas rutas incluyen la propiedad adminOnly para restringir el acceso a administradores.

const routes = [
  { label: "Inicio", path: "/dashboard" },
  {
    label: "Usuarios",
    submenu: [
      { label: "Nuevo usuario", path: "/usuarios/nuevo", adminOnly: true },
      { label: "Buscar usuarios", path: "/usuarios/buscar", adminOnly: true },
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
  }, {
    label: "Habitaciones",
    submenu: [
      { label: "Nueva habitación", path: "/habitaciones/nueva", adminOnly: true },
      { label: "Mostrar habitaciones", path: "/habitaciones", exact: true, adminOnly: true },
      { label: "Planning", path: "/habitaciones/planning" },
      { label: "RoomRack", path: "/habitaciones/roomrack" },
      { label: "Calendario de Ocupación", path: "/habitaciones/calendario-ocupacion" },
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
      { label: "Buscar facturas", path: "/facturas/buscar" },
      { label: "Check-out", path: "/facturas/check-out" },
    ],
  },
  {
    label: "Informes",
    submenu: [
      { label: "Cargos por habitación", path: "/informes/cargos" },
      { label: "Clientes alojados actualmente", path: "/informes/clientes-alojados" },
      { label: "Consumo por forma de pago", path: "/informes/consumo-forma-pago" },
      { label: "Estado actual de habitaciones", path: "/informes/estado-habitaciones" },
      { label: "Facturación diaria", path: "/informes/facturacion-diaria" },
      { label: "Facturación entre fechas", path: "/informes/facturacion/rango" },
      { label: "Listado de llegadas por fecha", path: "/informes/llegadas" },
      { label: "Listado de salidas por fecha", path: "/informes/salidas" },
      { label: "Ocupación por día", path: "/informes/ocupacion" },
      { label: "Resumen de actividad diaria", path: "/informes/resumen-dia" },
    ],
  },
];

// Exporta la configuración de rutas para ser utilizada en el componente de navegación principal
export default routes;

