// Componente principal de la aplicación
// Define la estructura de rutas protegidas y públicas usando React Router.
// Aplica protección por autenticación y por rol en rutas sensibles.
// Incluye el layout general y el sistema de notificaciones globales.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RutaPrivada from "./components/RutaPrivada";
import RutaProtegidaPorRol from "./components/RutaProtegidaPorRol";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NuevoUsuario from "./pages/usuarios/NuevoUsuario";
import BuscarUsuarios from "./pages/usuarios/BuscarUsuarios";
import EditarUsuario from "./pages/usuarios/EditarUsuario";
import CambiarPassword from "./pages/usuarios/CambiarPassword";
import NuevoCliente from "./pages/clientes/NuevoCliente";
import BuscarClientes from "./pages/clientes/BuscarClientes";
import EditarCliente from "./pages/clientes/EditarCliente";
import NuevaEmpresa from "./pages/empresas/NuevaEmpresa";
import BuscarEmpresas from "./pages/empresas/BuscarEmpresas";
import EditarEmpresa from "./pages/empresas/EditarEmpresa";
import VerReserva from "./pages/reservas/VerReserva";
import EditarReserva from "./pages/reservas/EditarReserva";
import NuevaHabitacion from "./pages/habitaciones/NuevaHabitacion";
import ListadoHabitaciones from "./pages/habitaciones/ListadoHabitaciones";
import EditarHabitacion from "./pages/habitaciones/EditarHabitacion";
import Planning from "./pages/habitaciones/Planning";
import RoomRack from "./pages/habitaciones/RoomRack";
import CalendarioOcupacion from "./pages/habitaciones/CalendarioOcupacion";
import NuevaReserva from "./pages/reservas/NuevaReserva";
import BuscarReservas from "./pages/reservas/BuscarReservas";
import CheckIn from "./pages/reservas/CheckIn";
import CheckInReserva from "./pages/reservas/CheckInReserva";
import VerHistorialReserva from "./pages/reservas/VerHistorialReserva";
import BuscarFacturas from "./pages/facturas/BuscarFacturas";
import CheckOut from "./pages/facturas/CheckOut";
import VerFactura from "./pages/facturas/VerFactura";
import InformeOcupacion from "./pages/informes/InformeOcupacion";
import FacturacionDiaria from "./pages/informes/FacturacionDiaria";
import FacturacionEntreFechas from "./pages/informes/FacturacionEntreFechas";
import InformeCargos from "./pages/informes/InformeCargos";
import InformeEstadoHabitaciones from "./pages/informes/InformeEstadoHabitaciones";
import InformeClientesAlojados from "./pages/informes/InformeClientesAlojados";
import InformeLlegadas from "./pages/informes/InformeLlegadas";
import InformeSalidas from "./pages/informes/InformeSalidas";
import InformeResumenDia from "./pages/informes/InformeResumenDia";
import InformeConsumoFormaPago from "./pages/informes/InformeConsumoFormaPago";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login es pública */}
        <Route path="/" element={<Login />} />
        {/* Todas las rutas privadas van envueltas aquí */}
        <Route
          element={
            <RutaPrivada>
              <Layout />
            </RutaPrivada>
          }
        >
          {/* Rutas protegidas por rol de administrador (rolRequerido={1}) */}
          {/* Usuarios */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/usuarios/nuevo"
            element={
              <RutaProtegidaPorRol rolRequerido={1}>
                <NuevoUsuario />
              </RutaProtegidaPorRol>
            }
          />
          <Route
            path="/usuarios/buscar"
            element={
              <RutaProtegidaPorRol rolRequerido={1}>
                <BuscarUsuarios />
              </RutaProtegidaPorRol>
            }
          />
          <Route
            path="/usuarios/editar/:id"
            element={
              <RutaProtegidaPorRol rolRequerido={1}>
                <EditarUsuario />
              </RutaProtegidaPorRol>
            }
          />
          {/* Cambio de contraseña (accesible para cualquier usuario autenticado) */}
          <Route
            path="/usuarios/cambiar-password"
            element={<CambiarPassword />}
          />
          {/* Clientes */}
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/clientes/buscar" element={<BuscarClientes />} />
          <Route path="/clientes/editar/:id" element={<EditarCliente />} />
          {/* Empresas */}
          <Route path="/empresas/nueva" element={<NuevaEmpresa />} />
          <Route path="/empresas/buscar" element={<BuscarEmpresas />} />
          <Route path="/empresas/editar/:id" element={<EditarEmpresa />} />
          {/* Habitaciones (solo admin) */}
          <Route
            path="/habitaciones/nueva"
            element={
              <RutaProtegidaPorRol rolRequerido={1}>
                <NuevaHabitacion />
              </RutaProtegidaPorRol>
            }
          />
          <Route
            path="/habitaciones"
            element={
              <RutaProtegidaPorRol rolRequerido={1}>
                <ListadoHabitaciones />
              </RutaProtegidaPorRol>
            }
          />
          <Route
            path="/habitaciones/editar/:id"
            element={
              <RutaProtegidaPorRol rolRequerido={1}>
                <EditarHabitacion />
              </RutaProtegidaPorRol>
            }
          />
          {/* Habitaciones: planning y roomrack (accesibles para usuarios autenticados) */}
          <Route path="/habitaciones/planning" element={<Planning />} />
          <Route path="habitaciones/roomrack" element={<RoomRack />} />
          <Route path="/habitaciones/calendario-ocupacion" element={<CalendarioOcupacion />} />
          {/* Reservas */}
          <Route path="/reservas/nueva" element={<NuevaReserva />} />
          <Route path="/reservas/buscar" element={<BuscarReservas />} />
          <Route path="/reservas/editar/:id" element={<EditarReserva />} />
          <Route path="/reservas/:id" element={<VerReserva />} />
          <Route
            path="/reservas/:id/historial"
            element={<VerHistorialReserva />}
          />
          <Route path="/reservas/check-in" element={<CheckIn />} />
          <Route path="/reservas/check-in/:id" element={<CheckInReserva />} />
          {/* Facturación */}
          <Route path="/facturas/buscar" element={<BuscarFacturas />} />
          <Route path="/facturas/check-out" element={<CheckOut />} />
          <Route path="/facturas/:id" element={<VerFactura />} />
          {/* Informes */}
          <Route path="/informes/ocupacion" element={<InformeOcupacion />} />
          <Route
            path="/informes/facturacion-diaria"
            element={<FacturacionDiaria />}
          />
          <Route path="/informes/facturacion/rango" element={<FacturacionEntreFechas />} />
<Route path="/informes/cargos" element={<InformeCargos />} />
<Route path="/informes/estado-habitaciones" element={<InformeEstadoHabitaciones />} />
<Route path="/informes/clientes-alojados" element={<InformeClientesAlojados />} />
<Route path="/informes/llegadas" element={<InformeLlegadas />} />
<Route path="/informes/salidas" element={<InformeSalidas />} />
<Route path="/informes/resumen-dia" element={<InformeResumenDia />} />
<Route path="/informes/consumo-forma-pago" element={<InformeConsumoFormaPago />} />

        </Route>
      </Routes>
      {/* Contenedor global para notificaciones tipo toast */}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </BrowserRouter>
  );
};

export default App;
