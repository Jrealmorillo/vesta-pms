import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, intentamos leer el token guardado
  useEffect(() => {
    const tokenAlmacenado = localStorage.getItem("token");
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    const id_rol = localStorage.getItem("id_rol");

    if (tokenAlmacenado && nombre_usuario && id_rol) {
      setUsuario({ nombre_usuario, id_rol: Number(id_rol) });
      setToken(tokenAlmacenado);
    }

    setCargando(false);
  }, []);

  const login = (token, nombre_usuario, id_rol) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nombre_usuario", nombre_usuario);
    localStorage.setItem("id_rol", id_rol);

    setUsuario({ nombre_usuario, id_rol: Number(id_rol) });
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("id_rol");

    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}
