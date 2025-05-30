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
      toast.error(`${error.response?.data?.error || error.message}`);
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
      toast.error(`${error.response?.data?.error || error.message}`);
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-people text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Gestión de Usuarios</h4>
                  <small className="text-muted">Buscar y administrar usuarios del sistema</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Card: Búsqueda */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-search me-2 text-primary"></i>
                Búsqueda de Usuarios
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    Buscar por ID
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control rounded-start"
                      placeholder="Introduce el ID del usuario"
                      value={idBuscado}
                      onChange={(e) => setIdBuscado(e.target.value)}
                      onKeyDown={(e) => {
                        if(e.key === "Enter") {
                          e.preventDefault();
                          buscarPorId();
                        }
                      }}
                    />
                    <button className="btn btn-primary rounded-end" onClick={buscarPorId}>
                      <i className="bi bi-search me-1"></i>
                      Buscar
                    </button>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <button className="btn btn-outline-secondary w-100" onClick={obtenerTodos}>
                    <i className="bi bi-list-ul me-2"></i>
                    Mostrar todos los usuarios
                  </button>
                </div>
              </div>
            </div>
          </div>          {/* Card: Resultados */}
          {usuarios.length > 0 ? (
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-table me-2 text-primary"></i>
                  Resultados de la búsqueda
                  <span className="badge bg-primary ms-2">{usuarios.length}</span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">ID</th>
                        <th className="fw-semibold">Nombre</th>
                        <th className="fw-semibold">Usuario</th>
                        <th className="fw-semibold">Rol</th>
                        <th className="fw-semibold">Estado</th>
                        <th className="fw-semibold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u.id_usuario}>
                          <td className="fw-medium">{u.id_usuario}</td>
                          <td>{u.nombre}</td>
                          <td className="text-muted">{u.nombre_usuario}</td>
                          <td>
                            <span className={`badge ${u.rol.id_rol == 1 ? 'bg-danger-subtle text-danger' : 'bg-info-subtle text-info'}`}>
                              {u.rol.id_rol == 1 ? "Administrador" : "Empleado"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.activo ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                              {u.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary rounded"
                              onClick={() => navigate(`/usuarios/editar/${u.id_usuario}`)}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
                <h6 className="mt-3 text-muted">No hay usuarios para mostrar</h6>
                <p className="text-muted mb-0">Realiza una búsqueda o consulta todos los usuarios</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuscarUsuarios;
