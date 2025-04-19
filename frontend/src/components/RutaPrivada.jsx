import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function RutaPrivada({ children }) {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) return null;

  // Si hay sesión activa, permite acceso. Si no, redirige al login
  return usuario ? children : <Navigate to="/" />;
}

export default RutaPrivada;
