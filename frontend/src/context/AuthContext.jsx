// Contexto global de autenticación para la aplicación Vesta PMS (Frontend)
// Proporciona el usuario autenticado, el token y funciones para login/logout a toda la app.
// Persiste la sesión en localStorage y restaura el estado al recargar la página.

import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // Estado del usuario autenticado
  const [token, setToken] = useState(localStorage.getItem("token") || null); // Token JWT
  const [cargando, setCargando] = useState(true); // Estado de carga inicial

  // Al cargar la app, intentamos leer el token y datos del usuario guardados en localStorage
  useEffect(() => {
    const tokenAlmacenado = localStorage.getItem("token");
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    const id_rol = localStorage.getItem("id_rol");
    const id_usuario = localStorage.getItem("id_usuario");

    if (tokenAlmacenado && nombre_usuario && id_rol && id_usuario) {
      setUsuario({
        nombre_usuario,
        id_rol: Number(id_rol),
        id_usuario: Number(id_usuario),
      });
      setToken(tokenAlmacenado);
    }
    setCargando(false); // Finaliza la carga inicial
  }, []);

  // Función para iniciar sesión y guardar datos en localStorage
  const login = (token, id_usuario, nombre_usuario, id_rol) => {
    localStorage.setItem("token", token);
    localStorage.setItem("id_usuario", id_usuario);
    localStorage.setItem("nombre_usuario", nombre_usuario);
    localStorage.setItem("id_rol", id_rol);
    setUsuario({
      id_usuario: Number(id_usuario),
      nombre_usuario,
      id_rol: Number(id_rol),
    });
    setToken(token);
  };

  // Función para cerrar sesión y limpiar datos de localStorage
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("id_rol");
    localStorage.removeItem("id_usuario");
    setUsuario(null);
    setToken(null);
  };

  // Provee el contexto de autenticación a toda la aplicación
  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}
