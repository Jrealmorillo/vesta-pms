import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RutaProtegidaPorRol = ({ children, rolRequerido }) => {
  const { usuario } = useContext(AuthContext);

  // Si no hay sesión → redirige al login
  if (!usuario) return <Navigate to="/" />;

  // Si el rol no coincide → redirige al dashboard
  if (usuario.id_rol !== rolRequerido) return <Navigate to="/dashboard" />;

  return children;
}

export default RutaProtegidaPorRol;
