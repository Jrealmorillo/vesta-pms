import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const FacturacionDiaria = () => {
  const [fecha, setFecha] = useState("");
  const [facturas, setFacturas] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const obtenerInforme = async () => {
    if (!fecha) {
      toast.warning("Debes seleccionar una fecha");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/facturacion`,
        {
          params: { fecha },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFacturas(data);
      if (data.length === 0) {
        toast.info("No hay facturas emitidas en esa fecha.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe de facturación: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="container py-5 mt-5">
      <h2>Facturación diaria</h2>

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

      {facturas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#Factura</th>
                <th>Fecha</th>
                <th>Reserva</th>
                <th>Cliente</th>
                <th>Forma de pago</th>
                <th>Total (€)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id_factura}>
                  <td>{f.id_factura}</td>
                  <td>
                    {new Date(f["fecha_emision"]).toLocaleDateString("es-ES")}
                  </td>
                  <td>{f.id_reserva || "—"}</td>
                  <td>
                    {f.cliente
                      ? `${f.cliente.nombre} ${
                          f.cliente.primer_apellido ?? ""
                        } ${f.cliente.segundo_apellido ?? ""}`
                      : f.nombre_huesped || "—"}
                  </td>
                  <td>{f.forma_pago}</td>
                  <td>{parseFloat(f.total).toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        f.estado === "Pagada"
                          ? "bg-success"
                          : f.estado === "Pendiente"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {f.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/facturas/${f.id_factura}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end fw-bold mt-3">
            Total facturado:{" "}
            {facturas
              .reduce((sum, f) => sum + parseFloat(f.total || 0), 0)
              .toFixed(2)}{" "}
            €
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturacionDiaria;
