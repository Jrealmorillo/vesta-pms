// Componente de layout general para la aplicación Vesta PMS (Frontend)
// Muestra la barra de navegación y el contenedor principal según la ruta actual.
// Oculta la barra de navegación en la pantalla de login.

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();
  const esLogin = location.pathname === "/"; // Detecta si estamos en la ruta de login

  return (
    <>
      {/* Muestra la barra de navegación solo si no es la pantalla de login */}
      {!esLogin && <Navbar />}
      {/* Contenedor principal, aplica clase especial salvo en login */}
      <main className={esLogin ? "" : "contenedor-general"}>
        <Outlet /> {/* Renderiza la ruta hija correspondiente */}
      </main>
    </>
  );
}

export default Layout;

