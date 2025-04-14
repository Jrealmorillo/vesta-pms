import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

// Páginas vacías temporales (puedes crear más después)
const Placeholder = ({ titulo }) => <h2>{titulo}</h2>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
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
    </BrowserRouter>
  );
}

export default App;
