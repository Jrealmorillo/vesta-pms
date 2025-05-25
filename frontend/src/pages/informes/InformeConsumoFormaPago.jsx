// InformeConsumoFormaPago.jsx
// Vista para el informe de consumo por forma de pago
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeConsumoFormaPago = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [resumen, setResumen] = useState({});
  const token = localStorage.getItem("token");

  // Consulta el consumo por forma de pago en un rango de fechas
  const obtenerInforme = async () => {
    if (!desde || !hasta) {
      toast.warning("Debes seleccionar ambas fechas");
      return;
    }
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/consumo-forma-pago`,
        { params: { desde, hasta }, headers: { Authorization: `Bearer ${token}` } }
      );
      setResumen(data);
      if (Object.keys(data).length === 0) {
        toast.info("No hay consumo registrado en ese periodo.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe: ${error.response?.data?.error || error.message}`
      );
    }
  };

  // Calcula el total global de consumo
  const calcularTotal = () => {
    let total = 0;
    for (const forma in resumen) {
      total += resumen[forma];
    }
    return total.toFixed(2);
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Consumo por forma de pago</h2>
      <div className="row pt-5 pb-3 d-flex justify-content-center">
        <div className="col-md-2">
          <label>Desde</label>
          <input
            type="date"
            className="form-control"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <label>Hasta</label>
          <input
            type="date"
            className="form-control"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
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
      {Object.keys(resumen).length > 0 && (
        <>
          <div className="table-responsive mt-5">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Forma de pago</th>
                  <th>Total (€)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(resumen).map(([forma, total]) => (
                  <tr key={forma}>
                    <td>{forma}</td>
                    <td>{parseFloat(total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end fw-bold mt-3">
            Total global: {calcularTotal()} €
          </div>
        </>
      )}
    </div>
  );
};

export default InformeConsumoFormaPago;
