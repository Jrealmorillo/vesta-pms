// Página para mostrar y gestionar los check-in del día actual.
// Lista las reservas con entrada hoy y permite realizar el check-in si la reserva está confirmada.
// Incluye feedback visual y navegación al proceso de check-in.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CheckIn = () => {
  // reservasHoy: array de reservas con entrada hoy
  const [reservasHoy, setReservasHoy] = useState([]);
  // Token de autenticación
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // Devuelve la fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Carga reservas al montar el componente
  useEffect(() => {
    const cargarReservasHoy = async () => {
      try {
        const fechaHoy = obtenerFechaActual();
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/entrada/${fechaHoy}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Ordena por primer apellido del huésped
        const reservasOrdenadasPorApellido = data.sort((a, b) => {
          const apellidoA = a.primer_apellido_huesped.toLowerCase();
          const apellidoB = b.primer_apellido_huesped.toLowerCase();
          return apellidoA.localeCompare(apellidoB);
        });

        setReservasHoy(reservasOrdenadasPorApellido);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar las reservas del día");
      }
    };

    cargarReservasHoy();
  }, [token]);

  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-11">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-box-arrow-in-down-left text-primary me-3"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div>
                    <h4 className="mb-0 fw-semibold">Check-in de Hoy</h4>
                    <small className="text-muted">
                      {new Date().toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                </div>
                {reservasHoy.length > 0 && (
                  <span className="badge bg-primary fs-6">
                    {reservasHoy.length} reserva
                    {reservasHoy.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Si no hay reservas, muestra mensaje informativo */}
          {reservasHoy.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i
                  className="bi bi-calendar-check text-muted mb-3"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h5 className="text-muted mb-2">No hay reservas para hoy</h5>
                <p className="text-muted mb-0">
                  No se encontraron reservas con entrada programada para hoy.
                </p>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-list-ul me-2 text-primary"></i>
                  Reservas con Entrada Hoy
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="100">Nº Reserva</th>
                        <th>Huésped</th>
                        <th width="120">Entrada</th>
                        <th width="120">Salida</th>
                        <th width="100">Estado</th>
                        <th width="100">Habitación</th>
                        <th width="150">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservasHoy.map((reserva) => (
                        <tr key={reserva.id_reserva}>
                          <td className="fw-medium">#{reserva.id_reserva}</td>
                          <td>
                            <div>
                              <div className="fw-semibold">
                                {reserva.primer_apellido_huesped}{" "}
                                {reserva.segundo_apellido_huesped}
                              </div>
                              <small className="text-muted">
                                {reserva.nombre_huesped}
                              </small>
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(
                                reserva.fecha_entrada + "T00:00:00"
                              ).toLocaleDateString("es-ES")}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(
                                reserva.fecha_salida + "T00:00:00"
                              ).toLocaleDateString("es-ES")}
                            </small>
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                reserva.estado === "Confirmada"
                                  ? "bg-success"
                                  : reserva.estado === "Anulada"
                                  ? "bg-danger"
                                  : reserva.estado === "Check-in"
                                  ? "bg-primary"
                                  : "bg-secondary"
                              }`}
                            >
                              {reserva.estado}
                            </span>
                          </td>
                          <td className="text-center">
                            {reserva.numero_habitacion ? (
                              <span className="badge bg-light text-dark">
                                {reserva.numero_habitacion}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {/* Si la reserva está confirmada, permite hacer check-in */}
                            {reserva.estado === "Confirmada" ? (
                              <button
                                className="btn btn-sm btn-primary rounded"
                                onClick={() =>
                                  navigate(
                                    `/reservas/check-in/${reserva.id_reserva}`
                                  )
                                }
                              >
                                <i className="bi bi-box-arrow-in-down me-1"></i>
                                Check-in
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-secondary rounded"
                                disabled
                              >
                                <i className="bi bi-slash-circle me-1"></i>
                                No disponible
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
