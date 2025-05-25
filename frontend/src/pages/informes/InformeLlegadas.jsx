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
        `Error al obtener el informe: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Listado de llegadas por fecha</h2>
      <div className="row pt-5 pb-3 d-flex justify-content-center">
        <div className="col-md-2">
          <label>Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-4 pb-5 d-flex justify-content-center">
        <div className="col-md-12">
          <button className="btn btn-lg btn-primary" onClick={obtenerInforme}>
            Consultar
          </button>
        </div>
      </div>
      {reservas.length > 0 && (
        <div className="table-responsive mt-5">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Reserva</th>
                <th>Habitación</th>
                <th>Nombre huésped</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Fecha entrada</th>
                <th>Fecha salida</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.numero_habitacion}</td>
                  <td>{`${r.nombre_huesped} ${r.primer_apellido_huesped} ${r.segundo_apellido_huesped || ""}`}</td>
                  <td>{r.cliente ? `${r.cliente.nombre} ${r.cliente.primer_apellido}` : "—"}</td>
                  <td>{r.estado}</td>
                  <td>{r.fecha_entrada}</td>
                  <td>{r.fecha_salida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InformeLlegadas;
