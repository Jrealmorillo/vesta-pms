import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CheckIn = () => {
  const [reservasHoy, setReservasHoy] = useState([]);
  const token = localStorage.getItem("token");

  const obtenerFechaActual = () => {
    return new Date().toISOString().split("T")[0];
  };

  const cargarReservasHoy = async () => {
    try {
      const fechaHoy = obtenerFechaActual();
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/fecha/${fechaHoy}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReservasHoy(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las reservas del día");
    }
  };

  const hacerCheckIn = async (id_reserva) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id_reserva}/estado`,
        { nuevoEstado: "Check-in" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Check-in realizado correctamente");
      cargarReservasHoy(); // Recargar lista
    } catch (error) {
      console.error(error);
      toast.error("No se pudo realizar el check-in");
    }
  };

  useEffect(() => {
    cargarReservasHoy();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Check-in de hoy ({obtenerFechaActual()})</h2>
      {reservasHoy.length === 0 ? (
        <p className="text-muted">No hay reservas para hoy.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Reserva</th>
                <th>Huésped</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservasHoy.map((reserva) => (
                <tr key={reserva.id_reserva}>
                  <td>{reserva.id_reserva}</td>
                  <td>{reserva.nombre_huesped}</td>
                  <td>{reserva.fecha_entrada}</td>
                  <td>{reserva.fecha_salida}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        reserva.estado === "Check-in"
                          ? "success"
                          : reserva.estado === "Anulada"
                          ? "danger"
                          : "secondary"
                      }`}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                  <td>
                    {reserva.estado === "Confirmada" ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => hacerCheckIn(reserva.id_reserva)}
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