// Página de inicio de sesión
// Permite al usuario autenticarse introduciendo usuario y contraseña, mostrando feedback y gestionando el estado global de autenticación.
// Realiza la petición a la API, guarda el usuario en localStorage y redirige al dashboard tras el login exitoso.

import "./Login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import CampoPassword from "../components/CampoPassword";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  // datos: estado local para usuario y contraseña
  const [datos, setDatos] = useState({
    nombre_usuario: "",
    contraseña: "",
    id_rol: "",
  });
  // login: función de contexto para actualizar el estado global de autenticación
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Maneja cambios en los campos del formulario
  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  // Envía la petición de login y gestiona el flujo de autenticación
  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/usuarios/login`, datos);
      const { token, usuario } = res.data;
      // Actualiza el contexto y localStorage con los datos del usuario
      login(token, usuario.id_usuario, usuario.nombre_usuario, usuario.id_rol);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      toast.success("Bienvenido a Vesta PMS");
      navigate("/dashboard");
    } catch {
      toast.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-pantalla">
      <div className="login-imagen"></div>

      <div className="login-formulario">
        <div className="login-card">
          <h2 className="mb-4 text-center">Iniciar sesión</h2>
          <form onSubmit={manejarSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                name="nombre_usuario"
                className="form-control"
                value={datos.nombre_usuario}
                onChange={manejarCambio}
                required
              />
            </div>
            <div className="mb-3">
              {/* Campo de contraseña reutilizable */}
              <CampoPassword
                label="Contraseña"
                name="contraseña"
                value={datos.contraseña}
                onChange={manejarCambio}
              />
            </div>
            <button className="btn btn-primary w-100">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
