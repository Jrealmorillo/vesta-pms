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
        `Error al obtener el informe: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Estado actual de habitaciones</h2>
      <div className="row mb-4 pb-5 d-flex justify-content-center">
        <div className="col-md-12">
          <button className="btn btn-lg btn-primary" onClick={obtenerInforme}>
            Consultar
          </button>
        </div>
      </div>
      {habitaciones.length > 0 && (
        <div className="table-responsive mt-5">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Nº Habitación</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {habitaciones.map((h) => (
                <tr key={h.numero_habitacion}>
                  <td>{h.numero_habitacion}</td>
                  <td>{h.tipo}</td>
                  <td>
                    <span className={`badge ${h.estado === "Ocupada" ? "bg-danger" : "bg-success"}`}>
                      {h.estado}
                    </span>
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

export default InformeEstadoHabitaciones;
