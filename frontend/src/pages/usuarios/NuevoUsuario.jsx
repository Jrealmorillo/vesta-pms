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
      toast.success(`Usuario ${datos.nombre} registrado correctamente`);
      setDatos({
        nombre: "",
        nombre_usuario: "",
        contraseña: "",
        email: "",
        activo: true,
        id_rol: 2,
      });
    } catch (error) {
      toast.error(
        `Error al registrar usuario: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-person-plus text-primary me-3"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Registrar Nuevo Usuario</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-person-fill me-2 text-primary"></i>
                Datos del Usuario
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={manejarSubmit}>
                <div className="row">
                  {/* Campo para el nombre completo */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control rounded"
                      placeholder="Nombre completo del usuario"
                      value={datos.nombre}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  {/* Campo para el nombre de usuario */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      Nombre de usuario *
                    </label>
                    <input
                      type="text"
                      name="nombre_usuario"
                      className="form-control rounded"
                      placeholder="Nombre de usuario para login"
                      value={datos.nombre_usuario}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  {/* Campo para la contraseña */}
                  <div className="col-md-6 mb-3">
                    <CampoPassword
                      label="Contraseña *"
                      name="contraseña"
                      value={datos.contraseña}
                      onChange={manejarCambio}
                    />
                  </div>

                  {/* Campo para el correo electrónico */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded"
                      placeholder="correo@ejemplo.com"
                      value={datos.email}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  {/* Selector de rol */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      Rol del usuario *
                    </label>
                    <select
                      name="id_rol"
                      className="form-select rounded"
                      value={datos.id_rol}
                      onChange={manejarCambio}
                    >
                      <option value={1}>Administrador</option>
                      <option value={2}>Empleado</option>
                    </select>
                  </div>

                  {/* Estado activo */}
                  <div className="col-md-6 mb-3 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="activo"
                        checked={datos.activo}
                        onChange={manejarCambio}
                        id="activoCheck"
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor="activoCheck"
                      >
                        Usuario activo
                      </label>
                    </div>
                  </div>
                </div>

                {/* Botón para registrar el usuario */}
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoUsuario;
