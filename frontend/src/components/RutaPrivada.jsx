// Componente para proteger rutas privadas en la aplicación 
// Solo permite el acceso a usuarios autenticados; si no hay sesión, redirige al login.
// Muestra null mientras se verifica el estado de autenticación (cargando).

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RutaPrivada = ({ children }) => {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) return null; // Espera a que termine la comprobación de sesión

  // Si hay sesión activa, permite acceso. Si no, redirige al login
  return usuario ? children : <Navigate to="/" />;
}

export default RutaPrivada;
