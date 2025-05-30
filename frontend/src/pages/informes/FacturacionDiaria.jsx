import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const FacturacionDiaria = () => {
  const [fecha, setFecha] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
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
      setConsultaRealizada(true);
      if (data.length === 0) {
        toast.info("No hay facturas emitidas en esa fecha.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe de facturación: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const calcularTotal = () => {
    return facturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0).toFixed(2);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "Pagada":
        return "bg-success";
      case "Pendiente":
        return "bg-warning text-dark";
      case "Cancelada":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const contarPorEstado = (estado) => {
    return facturas.filter(f => f.estado === estado).length;
  };

  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header Principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="h4 mb-1 d-flex align-items-center">
                <i className="bi bi-receipt text-primary me-3"></i>
                Facturación Diaria
              </h2>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="flex-grow-1">
                  <label className="form-label text-muted small mb-1">
                    Seleccionar fecha
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <div className="align-self-end">
                  <button
                    className="btn btn-primary px-4"
                    onClick={obtenerInforme}
                    disabled={!fecha}
                  >
                    <i className="bi bi-search me-2"></i>
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de Resumen */}
      {facturas.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-currency-euro fs-2 mb-2"></i>
                <h4 className="mb-1">{calcularTotal()}€</h4>
                <small className="opacity-75">Total Facturado</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-receipt text-info fs-2 mb-2"></i>
                <h5 className="mb-1">{facturas.length}</h5>
                <small className="text-muted">Total Facturas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-success text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-check-circle fs-2 mb-2"></i>
                <h5 className="mb-1">{contarPorEstado("Pagada")}</h5>
                <small className="opacity-75">Pagadas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-warning text-dark h-100">
              <div className="card-body text-center">
                <i className="bi bi-clock fs-2 mb-2"></i>
                <h5 className="mb-1">{contarPorEstado("Pendiente")}</h5>
                <small>Pendientes</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Facturas */}
      {facturas.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Detalle de Facturas
              <span className="badge bg-primary ms-2">{facturas.length} facturas</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3"># Factura</th>
                    <th className="border-0 py-3">Fecha</th>
                    <th className="border-0 py-3">Reserva</th>
                    <th className="border-0 py-3">Cliente</th>
                    <th className="border-0 py-3">Forma de Pago</th>
                    <th className="border-0 py-3 text-end">Total</th>
                    <th className="border-0 py-3 text-center">Estado</th>
                    <th className="border-0 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((f) => (
                    <tr key={f.id_factura}>
                      <td className="py-3">
                        <span className="fw-bold text-primary">#{f.id_factura}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-muted">
                          {new Date(f["fecha_emision"]).toLocaleDateString("es-ES")}
                        </span>
                      </td>
                      <td className="py-3">
                        {f.id_reserva ? (
                          <span className="badge bg-light text-dark">#{f.id_reserva}</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="fw-medium">
                          {f.cliente
                            ? `${f.cliente.nombre} ${f.cliente.primer_apellido ?? ""} ${f.cliente.segundo_apellido ?? ""}`
                            : f.nombre_huesped || "—"}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-credit-card me-1"></i>
                          {f.forma_pago}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <span className="fw-bold fs-6">
                          {parseFloat(f.total).toFixed(2)}€
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`badge ${getEstadoBadgeClass(f.estado)}`}>
                          {f.estado}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/facturas/${f.id_factura}`)}
                          title="Ver factura"
                        >
                          <i className="bi bi-eye me-1"></i>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Estado Vacío */}
      {facturas.length === 0 && consultaRealizada && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-receipt text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mb-2">No hay facturas emitidas</h5>
            <p className="text-muted mb-0">
              No se encontraron facturas para la fecha seleccionada: <strong>{new Date(fecha).toLocaleDateString("es-ES")}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturacionDiaria;
