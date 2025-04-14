import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Al cargar la app, intentamos leer el token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre_usuario = localStorage.getItem("nombre_usuario");
    if (token && nombre_usuario) {
      setUsuario({ nombre_usuario });
    }
  }, []);

  const login = (token, nombre_usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nombre_usuario", nombre_usuario);
    setUsuario({ nombre_usuario });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
