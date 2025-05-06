/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./BuscarUsuarios.css";
import { AuthContext } from "../../context/AuthContext";

function BuscarUsuarios() {
  const [idBuscado, setIdBuscado] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();


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
      toast.error("Usuario no encontrado");
      setUsuarios([]);
    }
  };

  const obtenerTodos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(res.data);
    } catch (error) {
      toast.error("Error al obtener usuarios");
    }
  };

  return (
    <div className="buscar-usuarios-container p-5">
      <h2 className="mb-4 py-5">Buscar usuarios</h2>

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
