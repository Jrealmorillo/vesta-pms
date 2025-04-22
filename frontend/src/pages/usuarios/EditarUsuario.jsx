/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function EditarUsuario() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    nombre: "",
    nombre_usuario: "",
    mail: "",
    id_rol: 2,
    activo: true,
  });

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
          nombre: u.nombre_completo || "",
          nombre_usuario: u.nombre_usuario || "",
          mail: u.mail || "",
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

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({
      ...datos,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${id}`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Usuario actualizado correctamente");
      navigate("/usuarios/buscar");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Error al actualizar el usuario");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Editar usuario</h2>
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px", textAlign: "left" }}
      >
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

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="mail"
            className="form-control"
            value={datos.mail}
            onChange={manejarCambio}
            required
          />
        </div>

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

        <div className="d-grid">
          <button type="submit" className="btn btn-success">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;
