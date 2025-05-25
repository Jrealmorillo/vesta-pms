// InformeResumenDia.jsx
// Vista para el informe de resumen de actividad diaria
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeResumenDia = () => {
  const [fecha, setFecha] = useState("");
  const [resumen, setResumen] = useState(null);
  const token = localStorage.getItem("token");

  // Consulta el resumen de actividad diaria para una fecha
  const obtenerInforme = async () => {
    if (!fecha) {
      toast.warning("Debes seleccionar una fecha");
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/resumen-dia`,
        { params: { fecha }, headers: { Authorization: `Bearer ${token}` } }
      );
      setResumen(data);
      if (!data) {
        toast.info("No hay datos para esa fecha.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Resumen de actividad diaria</h2>
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
      {resumen && (
        <div className="table-responsive mt-5">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Llegadas</th>
                <th>Salidas</th>
                <th>Ocupadas</th>
                <th>Libres</th>
                <th>Facturación (€)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{resumen.fecha}</td>
                <td>{resumen.llegadas}</td>
                <td>{resumen.salidas}</td>
                <td>{resumen.ocupadas}</td>
                <td>{resumen.libres}</td>
                <td>{parseFloat(resumen.facturacion || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InformeResumenDia;
