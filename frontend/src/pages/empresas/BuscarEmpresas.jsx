// Página para buscar empresas en el sistema Vesta PMS (Frontend)
// Permite buscar por ID, CIF o nombre y muestra los resultados en una tabla ordenada.
// Incluye validaciones, notificaciones y acceso a la edición de empresas.

import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuscarEmpresas = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [criterio, setCriterio] = useState(""); // Valor de búsqueda
  const [tipoBusqueda, setTipoBusqueda] = useState("id"); // Tipo de búsqueda seleccionada
  const [empresas, setEmpresas] = useState([]); // Resultados

  // Realiza la búsqueda según el tipo y criterio
  const buscar = async () => {
    if (!criterio.trim()) {
      toast.warning("Introduce un valor de búsqueda"); // Validación de campo vacío
      return;
    }

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/empresas/${tipoBusqueda}/${encodeURIComponent(criterio)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // El backend puede devolver una única empresa o un array
      const resultado = Array.isArray(res.data) ? res.data : [res.data];
      // Ordenar las empresas por nombre para mejor visualización
      const empresasOrdenadas = resultado.sort((a, b) => {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();
        return nombreA.localeCompare(nombreB);
      });
      setEmpresas(empresasOrdenadas);
    } catch (error) {
      toast.error(`${error.response?.data?.error || error.message}`);
      setEmpresas([]);
    }
  };

  // Navega a la pantalla de edición de la empresa seleccionada
  const irAEditar = (id) => {
    navigate(`/empresas/editar/${id}`);
  };
  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-building text-primary me-3"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Gestión de Empresas</h4>
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
                Búsqueda de Empresas
              </h5>
            </div>
            <div className="card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  buscar();
                }}
              >
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label text-muted fw-medium">
                      Tipo de búsqueda
                    </label>
                    <select
                      className="form-select rounded"
                      value={tipoBusqueda}
                      onChange={(e) => setTipoBusqueda(e.target.value)}
                    >
                      <option value="id">Buscar por ID</option>
                      <option value="cif">Buscar por CIF</option>
                      <option value="nombre">Buscar por nombre</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium">
                      Valor de búsqueda
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Introduce el valor"
                        className="form-control rounded-start"
                        value={criterio}
                        onChange={(e) => setCriterio(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary rounded-end"
                      >
                        <i className="bi bi-search me-1"></i>
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>{" "}
          {/* Card: Resultados */}
          {empresas.length > 0 ? (
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-table me-2 text-primary"></i>
                  Resultados de la búsqueda
                  <span className="badge bg-primary ms-2">
                    {empresas.length}
                  </span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">ID</th>
                        <th className="fw-semibold">Nombre</th>
                        <th className="fw-semibold">CIF</th>
                        <th className="fw-semibold">Dirección</th>
                        <th className="fw-semibold">Ciudad</th>
                        <th className="fw-semibold">País</th>
                        <th className="fw-semibold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empresas.map((e) => (
                        <tr key={e.id_empresa}>
                          <td className="fw-medium">{e.id_empresa}</td>
                          <td>{e.nombre}</td>
                          <td>
                            <span className="badge bg-info-subtle text-info">
                              {e.cif}
                            </span>
                          </td>
                          <td className="text-muted">{e.direccion || "-"}</td>
                          <td className="text-muted">{e.ciudad || "-"}</td>
                          <td className="text-muted">{e.pais || "-"}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary rounded"
                              onClick={() => irAEditar(e.id_empresa)}
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
                <i
                  className="bi bi-building-x text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h6 className="mt-3 text-muted">
                  No hay empresas para mostrar
                </h6>
                <p className="text-muted mb-0">
                  Realiza una búsqueda para encontrar empresas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarEmpresas;
