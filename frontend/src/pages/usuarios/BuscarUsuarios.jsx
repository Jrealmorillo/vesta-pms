// Página para buscar usuarios por ID o mostrar todos los usuarios del sistema.
// Permite filtrar por ID, muestra los resultados en una tabla y permite navegar a la edición de cada usuario.
// Incluye feedback visual y validaciones de entrada.

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./BuscarUsuarios.css";
import { AuthContext } from "../../context/AuthContext";

const BuscarUsuarios = () => {
  // idBuscado: valor del input para buscar por ID
  // usuarios: array de usuarios encontrados
  const [idBuscado, setIdBuscado] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Busca un usuario por ID y actualiza la tabla
  const buscarPorId = async () => {
    if (!idBuscado.trim()) {
      toast.warning("Introduce un ID válido");
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/${idBuscado}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsuarios([res.data]); // Convertimos en array para mostrar en la tabla
    } catch (error) {
      toast.error(`Usuario no encontrado: ${error.response?.data?.error || error.message}`);
      setUsuarios([]);
    }
  };

  // Obtiene todos los usuarios del sistema
  const obtenerTodos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(res.data);
    } catch (error) {
      toast.error(`Error al obtener usuarios: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="buscar-usuarios-container p-5">
      <h2 className="mb-4 py-5">Buscar usuarios</h2>

      {/* Formulario de búsqueda por ID y botón para mostrar todos */}
      <div className="buscar-usuarios-form">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por ID"
          value={idBuscado}
          onChange={(e) => setIdBuscado(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              e.preventDefault();
              buscarPorId();
            }
          }}
        />
        <button className="btn btn-primary" onClick={buscarPorId}>
          Buscar
        </button>
        <button className="btn btn-secondary" onClick={obtenerTodos}>
          Mostrar todos
        </button>
      </div>

      {/* Tabla de resultados o mensaje si no hay usuarios */}
      {usuarios.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.nombre_usuario}</td>
                  <td>{u.rol.id_rol == 1 ? "Administrador" : "Empleado"}</td>
                  <td>{u.activo ? "Sí" : "No"}</td>
                  <td>
                    {/* Botón para navegar a la edición del usuario */}
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        navigate(`/usuarios/editar/${u.id_usuario}`)
                      }
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mensaje-vacio">No hay usuarios para mostrar.</p>
      )}
    </div>
  );
}

export default BuscarUsuarios;
