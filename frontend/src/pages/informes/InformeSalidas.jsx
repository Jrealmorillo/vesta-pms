// InformeSalidas.jsx
// Vista para el informe de salidas por fecha
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeSalidas = () => {
  const [fecha, setFecha] = useState("");
  const [reservas, setReservas] = useState([]);
  const token = localStorage.getItem("token");

  // Consulta las salidas para una fecha
  const obtenerInforme = async () => {
    if (!fecha) {
      toast.warning("Debes seleccionar una fecha");
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/salidas`,
        { params: { fecha }, headers: { Authorization: `Bearer ${token}` } }
      );
      setReservas(data);
      if (data.length === 0) {
        toast.info("No hay salidas para esa fecha.");
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
      {/* Header Principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="h4 mb-1 d-flex align-items-center">
                <i className="bi bi-calendar-x text-primary me-3"></i>
                Salidas por Fecha
              </h2>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="flex-grow-1">
                  <label className="form-label text-muted small mb-1">
                    Fecha de salida
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <div className="align-self-end">
                  <button
                    className="btn btn-primary px-4"
                    onClick={obtenerInforme}
                    disabled={!fecha}
                  >
                    <i className="bi bi-search me-2"></i>
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de Resumen */}
      {reservas.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-x fs-2 mb-2"></i>
                <h4 className="mb-1">{reservas.length}</h4>
                <small className="opacity-75">Total Salidas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-door-open text-info fs-2 mb-2"></i>
                <h5 className="mb-1">
                  {new Set(reservas.map((r) => r.numero_habitacion)).size}
                </h5>
                <small className="text-muted">Habitaciones</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-check-circle text-success fs-2 mb-2"></i>
                <h5 className="mb-1">
                  {reservas.filter((r) => r.estado === "Check-out").length}
                </h5>
                <small className="text-muted">Check-out</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-clock text-warning fs-2 mb-2"></i>
                <h5 className="mb-1">
                  {reservas.filter((r) => r.estado === "Check-in").length}
                </h5>
                <small className="text-muted">Pendientes</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Salidas */}
      {reservas.length > 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Salidas del {new Date(fecha).toLocaleDateString("es-ES")}
              <span className="badge bg-primary ms-2">
                {reservas.length} salidas
              </span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Reserva</th>
                    <th className="border-0 py-3">Habitación</th>
                    <th className="border-0 py-3">Huésped</th>
                    <th className="border-0 py-3">Cliente</th>
                    <th className="border-0 py-3 text-center">Estado</th>
                    <th className="border-0 py-3">Entrada</th>
                    <th className="border-0 py-3">Salida</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id_reserva}>
                      <td className="py-3">
                        <span className="badge bg-light text-dark">
                          #{r.id_reserva}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="fw-bold text-primary">
                          {r.numero_habitacion || "Sin asignar"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="fw-medium">
                          {r.nombre_huesped} {r.primer_apellido_huesped}
                          {r.segundo_apellido_huesped && (
                            <span className="text-muted ms-1">
                              {r.segundo_apellido_huesped}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        {r.cliente ? (
                          <div className="fw-medium">
                            {r.cliente.nombre} {r.cliente.primer_apellido}
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`badge ${
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
                      <td className="py-3">
                        <span className="text-muted">
                          {new Date(r.fecha_entrada).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-muted">
                          {new Date(r.fecha_salida).toLocaleDateString("es-ES")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : fecha ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-calendar-x text-muted mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="text-muted mb-2">No hay salidas programadas</h5>
            <p className="text-muted mb-0">
              No se encontraron reservas con salida para el{" "}
              <strong>{new Date(fecha).toLocaleDateString("es-ES")}</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-calendar-event text-muted mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="text-muted mb-2">Selecciona una fecha</h5>
            <p className="text-muted mb-0">
              Elige una fecha para consultar las salidas programadas
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformeSalidas;
