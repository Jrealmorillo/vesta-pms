// InformeLlegadas.jsx
// Vista para el informe de llegadas por fecha
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeLlegadas = () => {
  const [fecha, setFecha] = useState("");
  const [reservas, setReservas] = useState([]);
  const token = localStorage.getItem("token");

  // Consulta las llegadas para una fecha
  const obtenerInforme = async () => {
    if (!fecha) {
      toast.warning("Debes seleccionar una fecha");
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/llegadas`,
        { params: { fecha }, headers: { Authorization: `Bearer ${token}` } }
      );
      setReservas(data);
      if (data.length === 0) {
        toast.info("No hay llegadas para esa fecha.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          {" "}
          {/* Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar-check fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Llegadas por Fecha</h2>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Filtros */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    <i className="bi bi-calendar3 me-2"></i>
                    Fecha de llegada
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6"></div>
                <div className="col-md-3 text-end">
                  <button
                    className="btn btn-primary btn-lg px-4"
                    onClick={obtenerInforme}
                    disabled={!fecha}
                  >
                    <i className="bi bi-search me-2"></i>
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Resultados */}
          {reservas.length > 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Llegadas del {new Date(fecha).toLocaleDateString("es-ES")}
                  </h5>
                  <span className="badge bg-primary fs-6">
                    {reservas.length} llegada{reservas.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">Reserva</th>
                        <th className="px-4 py-3">Habitación</th>
                        <th className="px-4 py-3">Huésped</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Entrada</th>
                        <th className="px-4 py-3">Salida</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((r) => (
                        <tr key={r.id_reserva}>
                          <td className="px-4 py-3">
                            <span className="badge bg-primary fs-6">
                              #{r.id_reserva}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="badge bg-success fs-6">
                              {r.numero_habitacion || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <span className="fw-medium">
                                {r.nombre_huesped} {r.primer_apellido_huesped}
                              </span>
                              {r.segundo_apellido_huesped && (
                                <span className="text-muted ms-1">
                                  {r.segundo_apellido_huesped}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {r.cliente ? (
                              <div>
                                <span className="fw-medium">
                                  {r.cliente.nombre} {r.cliente.primer_apellido}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted fst-italic">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`badge fs-6 ${
                                r.estado === "Confirmada"
                                  ? "bg-warning text-dark"
                                  : r.estado === "Check-in"
                                  ? "bg-success"
                                  : r.estado === "Check-out"
                                  ? "bg-info"
                                  : "bg-secondary"
                              }`}
                            >
                              {r.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <small className="text-muted">
                              {new Date(r.fecha_entrada).toLocaleDateString(
                                "es-ES"
                              )}
                            </small>
                          </td>
                          <td className="px-4 py-3">
                            <small className="text-muted">
                              {new Date(r.fecha_salida).toLocaleDateString(
                                "es-ES"
                              )}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>{" "}
            </div>
          ) : fecha ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">No hay llegadas programadas</h5>
                <p className="text-muted mb-0">
                  No se encontraron reservas con entrada para el{" "}
                  {new Date(fecha).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">Selecciona una fecha</h5>
                <p className="text-muted mb-0">
                  Selecciona una fecha para consultar las llegadas programadas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformeLlegadas;
