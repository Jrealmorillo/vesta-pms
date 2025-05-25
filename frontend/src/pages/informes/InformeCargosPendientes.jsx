import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeCargosPendientes = () => {
  const [fecha, setFecha] = useState("");
  const [cargos, setCargos] = useState([]);
  const token = localStorage.getItem("token");

  const obtenerInforme = async () => {
    if (!fecha) {
      toast.warning("Debes seleccionar una fecha");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/cargos-pendientes`,
        {
          params: { fecha },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCargos(data);
      if (data.length === 0) {
        toast.info("No hay cargos pendientes en esa fecha.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe de cargos pendientes: ${error.message}`
      );
    }
  };

  const calcularTotal = () => {
    return cargos
      .reduce((sum, c) => sum + parseFloat(c.total || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Cargos por habitación (Check-in)</h2>

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

      <div className="row pb-5 mb-4 d-flex justify-content-center">
        <div className="col-md-12">
          <button className="btn btn-lg btn-primary" onClick={obtenerInforme}>
            Consultar
          </button>
        </div>
      </div>

      {cargos.length > 0 && (
        <>
          <div className="table-responsive mt-5">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Reserva</th>
                  <th>Habitación</th>
                  <th>Concepto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario (€)</th>
                  <th>Total (€)</th>
                </tr>
              </thead>
              <tbody>
                {cargos.map((c, index) => (
                  <tr key={index}>
                    <td>{c.fecha}</td>
                    <td>{c.id_reserva}</td>
                    <td>{c.numero_habitacion}</td>
                    <td>{c.concepto}</td>
                    <td>{c.cantidad}</td>
                    <td>{parseFloat(c.precio_unitario).toFixed(2)}</td>
                    <td>{parseFloat(c.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end fw-bold mt-3">
            Total cargos: {calcularTotal()} €
          </div>
        </>
      )}
    </div>
  );
};

export default InformeCargosPendientes;
