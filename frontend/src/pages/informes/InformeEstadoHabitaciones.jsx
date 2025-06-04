// InformeEstadoHabitaciones.jsx
// Vista para el informe de estado actual de habitaciones
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeEstadoHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const token = localStorage.getItem("token");

  // Consulta el estado actual de todas las habitaciones
  const obtenerInforme = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/estado-habitaciones`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabitaciones(data);
      if (data.length === 0) {
        toast.info("No hay habitaciones registradas.");
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
                <i className="bi bi-door-open-fill text-primary fs-2 me-3"></i>
                <div>
                  <h2 className="mb-1">Estado de Habitaciones</h2>
                </div>
                <div className="col-md-6 text-end">
                  <button
                    className="btn btn-primary btn-lg px-4"
                    onClick={obtenerInforme}
                  >
                    <i className="bi bi-search me-2"></i>
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Resultados */}
          {habitaciones.length > 0 ? (
            <div className="card border-0 shadow-sm">
              {" "}
              <div className="card-header bg-light border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Estado de Habitaciones
                  </h5>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark fs-6">
                      {habitaciones.filter((h) => h.estado === "Libre").length}{" "}
                      Libres
                    </span>
                    <span className="badge bg-primary fs-6">
                      {
                        habitaciones.filter((h) => h.estado === "Ocupada")
                          .length
                      }{" "}
                      Ocupadas
                    </span>
                    <span className="badge bg-info fs-6">
                      {habitaciones
                        .filter((h) => h.ocupacion_actual)
                        .reduce(
                          (total, h) =>
                            total + h.ocupacion_actual.total_huespedes,
                          0
                        )}{" "}
                      Huéspedes
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">Nº Habitación</th>
                        <th className="px-4 py-3">Tipo</th>
                        <th className="px-4 py-3">Ocupación Actual</th>
                        <th className="px-4 py-3">Checkout</th>
                        <th className="px-4 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {habitaciones.map((h) => (
                        <tr key={h.numero_habitacion}>
                          <td className="px-4 py-3">
                            <span className="badge bg-primary fs-6">
                              {h.numero_habitacion}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="fw-medium">{h.tipo}</span>
                          </td>
                          <td className="px-4 py-3">
                            {h.ocupacion_actual ? (
                              <div>
                                <span className="fw-bold">
                                  {h.ocupacion_actual.total_huespedes} huéspedes
                                </span>
                                <br />
                                <small className="text-muted">
                                  {h.ocupacion_actual.adultos}A +{" "}
                                  {h.ocupacion_actual.ninos}N
                                </small>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 fw-bold">
                            {h.ocupacion_actual?.fecha_checkout ? (
                              <span className="fw-medium">
                                {new Date(
                                  h.ocupacion_actual.fecha_checkout
                                ).toLocaleDateString("es-ES")}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`badge fs-6 ${
                                h.estado === "Ocupada"
                                  ? "bg-danger"
                                  : "bg-success"
                              }`}
                            >
                              <i
                                className={`bi ${
                                  h.estado === "Ocupada"
                                    ? "bi-person-fill"
                                    : "bi-door-open"
                                } me-1`}
                              ></i>
                              {h.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">No hay datos para mostrar</h5>
                <p className="text-muted mb-0">
                  Haz clic en "Consultar" para obtener el estado de las
                  habitaciones
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformeEstadoHabitaciones;
