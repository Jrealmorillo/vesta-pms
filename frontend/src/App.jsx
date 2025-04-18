import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RutaPrivada from "./components/RutaPrivada";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

// Páginas vacías temporales
const Placeholder = ({ titulo }) => <h2>{titulo}</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login es pública */}
        <Route path="/login" element={<Login />} />
        {/* Todas las rutas privadas van envueltas aquí */}
        <Route
          element={
            <RutaPrivada>
              <Layout />
            </RutaPrivada>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Placeholder titulo="Usuarios" />} />
          <Route path="/clientes" element={<Placeholder titulo="Clientes" />} />
          <Route path="/empresas" element={<Placeholder titulo="Empresas" />} />
          <Route
            path="/habitaciones"
            element={<Placeholder titulo="Habitaciones" />}
          />
          <Route path="/reservas" element={<Placeholder titulo="Reservas" />} />
          <Route
            path="/facturas"
            element={<Placeholder titulo="Facturación" />}
          />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
