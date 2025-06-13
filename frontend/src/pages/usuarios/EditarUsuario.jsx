// Página para editar los datos de un usuario existente.
// Permite modificar nombre, usuario, correo, rol y estado de actividad, mostrando feedback y validaciones.
// Realiza la petición a la API para actualizar los datos y redirige tras guardar.

/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const EditarUsuario = () => {
  // Obtiene el id del usuario desde la URL
  const { id } = useParams();
  // Token de autenticación desde el contexto
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado local para los datos del usuario
  const [datos, setDatos] = useState({
    nombre: "",
    nombre_usuario: "",
    mail: "",
    id_rol: 2,
    activo: true,
  });

  // Carga los datos del usuario al montar el componente o cambiar id/token
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/usuarios/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const u = res.data;
        setDatos({
          nombre: u.nombre || "",
          nombre_usuario: u.nombre_usuario || "",
          mail: u.email || "",
          id_rol: u.rol?.id_rol || 2,
          activo: u.activo,
        });
      } catch (error) {
        toast.error("No se pudo cargar el usuario");
        navigate("/usuarios/buscar");
      }
    };

    cargarUsuario();
  }, [id, token, navigate]);

  // Maneja cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({
      ...datos,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Envía la petición para actualizar el usuario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, datos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(
        `Usuario ${datos.nombre_usuario} actualizado correctamente`
      );
      navigate("/usuarios/buscar");
    } catch (error) {
      toast.error(
        `Error al actualizar el usuario: ${
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
                  className="bi bi-person-gear text-primary me-3"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Editar Usuario</h4>
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

                  {/* Campo para el correo electrónico */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      name="mail"
                      className="form-control rounded"
                      placeholder="correo@ejemplo.com"
                      value={datos.mail}
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
                  <div className="col-3 mb-4">
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

                {/* Botones de acción */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg w-100 rounded"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Guardar Cambios
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg w-100 rounded"
                      onClick={() => {
                        navigate("/usuarios/buscar");
                        toast.info(
                          `Edición de usuario ${datos.nombre_usuario} cancelada`
                        );
                      }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;
