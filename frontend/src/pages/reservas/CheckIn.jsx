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

  // Carga las reservas con entrada hoy desde la API
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
      }
      );

      setReservasHoy(reservasOrdenadasPorApellido);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las reservas del día");
    }
  };

  // Carga reservas al montar el componente
  useEffect(() => {
    cargarReservasHoy();
  }, []);

  return (
    <div className="container py-5 mt-4">
      <h2 className="mb-5">Check-in de hoy ({obtenerFechaActual()})</h2>
      {/* Si no hay reservas, muestra mensaje informativo */}
      {reservasHoy.length === 0 ? (
        <p className="text-muted">No hay reservas para hoy.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Nº Reserva</th>
                <th>Huésped</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
                <th>Habitación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservasHoy.map((reserva) => (
                <tr key={reserva.id_reserva}>
                  <td>{reserva.id_reserva}</td>
                  <td>{reserva.primer_apellido_huesped} {reserva.segundo_apellido_huesped}, {reserva.nombre_huesped} </td>
                  <td>{reserva.fecha_entrada}</td>
                  <td>{reserva.fecha_salida}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        reserva.estado === "Confirmada"
                          ? "success"
                          : reserva.estado === "Anulada"
                          ? "danger"
                          : reserva.estado === "Check-in"
                          ? "primary"
                          : "secondary"
                      }`}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                  <td>{reserva.numero_habitacion || "-"}</td>
                  <td>
                    {/* Si la reserva está confirmada, permite hacer check-in */}
                    {reserva.estado === "Confirmada" ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/reservas/check-in/${reserva.id_reserva}`)}
                      >
                        Realizar check-in
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" disabled>
                        No disponible
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckIn;