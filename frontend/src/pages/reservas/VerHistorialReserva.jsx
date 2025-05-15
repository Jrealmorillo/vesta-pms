/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const VerHistorialReserva = () => {
  const { id } = useParams(); 
  const [historial, setHistorial] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/${id}/historial`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistorial(data);
      } catch (error) {
        toast.error("Error al cargar historial de la reserva");
      }
    };
    cargarHistorial();
  }, [id]);

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2>Historial de la Reserva #{id}</h2>

      {historial.length === 0 ? (
        <p>No hay acciones registradas para esta reserva.</p>
      ) : (
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((registro) => (
              <tr key={registro.id_historial}>
                <td>{new Date(registro.fecha_accion).toLocaleString("es-ES")}</td>
                <td>{registro.nombre_usuario}</td>
                <td>
                  <span className="badge bg-secondary">{registro.accion}</span>
                </td>
                <td>{registro.detalles || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerHistorialReserva;
