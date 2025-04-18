import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RutaPrivada from "./components/RutaPrivada";
import RutaProtegidaPorRol from "./components/RutaProtegidaPorRol";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NuevoUsuario from "./pages/usuarios/NuevoUsuario";
import BuscarUsuarios from "./pages/usuarios/BuscarUsuarios";
import NuevoCliente from "./pages/clientes/NuevoCliente";
import BuscarClientes from "./pages/clientes/BuscarClientes";
import NuevaEmpresa from "./pages/empresas/NuevaEmpresa";
import BuscarEmpresas from "./pages/empresas/BuscarEmpresas";
import NuevaHabitacion from "./pages/habitaciones/NuevaHabitacion";
import ListadoHabitaciones from "./pages/habitaciones/ListadoHabitaciones";
import NuevaReserva from "./pages/reservas/NuevaReserva";
import BuscarReservas from "./pages/reservas/BuscarReservas";
import CheckIn from "./pages/reservas/CheckIn";
import NuevaFactura from "./pages/facturas/NuevaFactura";
import BuscarFacturas from "./pages/facturas/BuscarFacturas";
import CheckOut from "./pages/facturas/CheckOut";
import InformeReservas from "./pages/informes/InformeReservas";
import InformeOcupacion from "./pages/informes/InformeOcupacion";
import InformeFacturacion from "./pages/informes/InformeFacturacion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
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
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/clientes/buscar" element={<BuscarClientes />} />
          <Route path="/empresas/nueva" element={<NuevaEmpresa />} />
          <Route path="/empresas/buscar" element={<BuscarEmpresas />} />
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
          <Route path="/reservas/nueva" element={<NuevaReserva />} />
          <Route path="/reservas/buscar" element={<BuscarReservas />} />
          <Route path="/reservas/check-in" element={<CheckIn />} />
          <Route path="/facturas/nueva" element={<NuevaFactura />} />
          <Route path="/facturas/buscar" element={<BuscarFacturas />} />
          <Route path="/facturas/check-out" element={<CheckOut />} />
          <Route path="/informes/reservas" element={<InformeReservas />} />
          <Route path="/informes/ocupacion" element={<InformeOcupacion />} />
          <Route
            path="/informes/facturacion"
            element={<InformeFacturacion />}
          />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
