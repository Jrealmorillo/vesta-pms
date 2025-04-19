import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, intentamos leer el token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    const id_rol = localStorage.getItem("id_rol");
    if (token && nombre_usuario && id_rol) {
      setUsuario({ nombre_usuario, id_rol: Number(id_rol) });
    }
    setCargando(false);
  }, []);

  const login = (token, nombre_usuario, id_rol) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nombre_usuario", nombre_usuario);
    localStorage.setItem("id_rol", id_rol);
    setUsuario({ nombre_usuario, id_rol: Number(id_rol) });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("id_rol");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}
