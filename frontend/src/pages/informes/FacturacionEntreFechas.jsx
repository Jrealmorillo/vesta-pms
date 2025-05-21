import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FacturacionEntreFechas = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [resumen, setResumen] = useState({});
  const token = localStorage.getItem("token");

  const obtenerInforme = async () => {
    if (!desde || !hasta) {
      toast.warning("Debes seleccionar ambas fechas");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/facturacion/rango`,
        {
          params: { desde, hasta },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResumen(data);
      if (Object.keys(data).length === 0) {
        toast.info("No se encontraron facturas en ese rango de fechas.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe de facturación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const calcularTotalGlobal = () => {
    let total = 0;
    for (const fecha in resumen) {
      for (const forma in resumen[fecha]) {
        total += resumen[fecha][forma];
      }
    }
    return total.toFixed(2);
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Facturación entre fechas</h2>

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
                  <th>Fecha</th>
                  <th>Forma de pago</th>
                  <th>Total (€)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(resumen).map(([fecha, pagos]) =>
                  Object.entries(pagos).map(([forma, total], index) => (
                    <tr key={`${fecha}-${forma}`}>
                      {index === 0 && (
                        <td rowSpan={Object.keys(pagos).length}>{fecha}</td>
                      )}
                      <td>{forma}</td>
                      <td>{total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-end fw-bold mt-3">
            Total general: {calcularTotalGlobal()} €
          </div>
        </>
      )}
    </div>
  );
};

export default FacturacionEntreFechas;
