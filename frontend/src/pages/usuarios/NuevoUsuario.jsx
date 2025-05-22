// Página para registrar un nuevo usuario en el sistema.
// Permite introducir nombre, usuario, contraseña, email, rol y estado de actividad, mostrando feedback y validaciones.
// Realiza la petición a la API para crear el usuario y limpia el formulario tras el registro.

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import CampoPassword from "../../components/CampoPassword";

const NuevoUsuario = () => {
  // Estado local para los datos del nuevo usuario
  const [datos, setDatos] = useState({
    nombre: "",
    nombre_usuario: "",
    contraseña: "",
    email: "",
    activo: true,
    id_rol: 2, // Valor por defecto: Empleado
  });

  // Maneja cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({
      ...datos,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Envía la petición para registrar el usuario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/usuarios/registro`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Usuario registrado correctamente");
      setDatos({
        nombre: "",
        nombre_usuario: "",
        contraseña: "",
        email: "",
        activo: true,
        id_rol: 2,
      });
    } catch (error) {
      toast.error(`Error al registrar usuario: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 pt-5">Registrar nuevo usuario</h2>

      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "400px", textAlign: "left" }}
      >
        {/* Campo para el nombre completo */}
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={datos.nombre}
            onChange={manejarCambio}
            required
          />
        </div>

        {/* Campo para el nombre de usuario */}
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            name="nombre_usuario"
            className="form-control"
            value={datos.nombre_usuario}
            onChange={manejarCambio}
            required
          />
        </div>

        {/* Campo para la contraseña (con componente reutilizable) */}
        <div className="mb-3">
          <CampoPassword
            label="Contraseña"
            name="contraseña"
            value={datos.contraseña}
            onChange={manejarCambio}
          />
        </div>

        {/* Campo para el correo electrónico */}
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={datos.email}
            onChange={manejarCambio}
            required
          />
        </div>

        {/* Selector de rol */}
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            name="id_rol"
            className="form-select"
            value={datos.id_rol}
            onChange={manejarCambio}
          >
            <option value={1}>Administrador</option>
            <option value={2}>Empleado</option>
          </select>
        </div>

        {/* Checkbox para marcar usuario como activo o inactivo */}
        <div className="form-check mb-4">
          <input
            type="checkbox"
            className="form-check-input"
            name="activo"
            checked={datos.activo}
            onChange={manejarCambio}
            id="activoCheck"
          />
          <label className="form-check-label" htmlFor="activoCheck">
            Usuario activo
          </label>
        </div>

        {/* Botón para registrar el usuario */}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Registrar usuario
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoUsuario;
