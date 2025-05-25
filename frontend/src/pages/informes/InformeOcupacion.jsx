/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeOcupacion = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [resumen, setResumen] = useState(null);
  const token = localStorage.getItem("token");

  const obtenerInforme = async () => {
    if (!desde || !hasta) {
      toast.warning("Debes seleccionar ambas fechas");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/ocupacion`,
        {
          params: { desde, hasta },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResumen(data);
      if (Object.keys(data).length === 0) {
        toast.info("No hay datos de ocupación en ese periodo.");
      }
    } catch (error) {
      toast.error(`Error al obtener informe de ocupación: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Informe de Ocupación</h2>

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

      {resumen && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Habitaciones Ocupadas</th>
                <th>Habitaciones Disponibles</th>
                <th>Adultos</th>
                <th>Niños</th>
                <th>Total Huéspedes</th>
                <th>Ocupación (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resumen).map(([fecha, datos]) => (
                <tr key={fecha}>
                  <td>{new Date(fecha).toLocaleDateString("es-ES")}</td>
                  <td>{datos.habitaciones_ocupadas}</td>
                  <td>{datos.habitaciones_disponibles}</td>
                  <td>{datos.adultos}</td>
                  <td>{datos.ninos}</td>
                  <td>{datos.huespedes}</td>
                  <td>{datos.porcentaje_ocupacion} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InformeOcupacion;
