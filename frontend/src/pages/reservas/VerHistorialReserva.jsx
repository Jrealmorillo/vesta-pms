// Página para visualizar el historial de acciones realizadas sobre una reserva específica.
// Muestra una tabla con fecha, usuario, acción y detalles de cada cambio registrado en la reserva.
// Permite identificar fácilmente quién y cuándo se realizaron modificaciones relevantes.

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const VerHistorialReserva = () => {
  // Obtiene el id de la reserva desde la URL
  const { id } = useParams(); 
  // historial: array de registros de acciones sobre la reserva
  const [historial, setHistorial] = useState([]);
  // Token de autenticación
  const token = localStorage.getItem("token");

  // Carga el historial de la reserva al montar el componente o cambiar el id
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

      {/* Si no hay historial, muestra mensaje informativo */}
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
