// InformeConsumoFormaPago.jsx
// Vista para el informe de consumo por forma de pago
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeConsumoFormaPago = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [resumen, setResumen] = useState({});
  const [consultaRealizada, setConsultaRealizada] = useState(false);
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
      setConsultaRealizada(true);
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

  // Obtiene el ícono según la forma de pago
  const getIconoFormaPago = (forma) => {
    switch (forma.toLowerCase()) {
      case 'efectivo':
        return 'bi-cash-coin';
      case 'tarjeta':
      case 'tarjeta de credito':
      case 'tarjeta de débito':
        return 'bi-credit-card';
      case 'transferencia':
        return 'bi-bank';
      case 'cheque':
        return 'bi-file-text';
      default:
        return 'bi-currency-euro';
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          {/* Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-pie-chart fs-2 text-muted me-3"></i>
                <div>
                  <h2 className="mb-1">Consumo por Forma de Pago</h2>
                  <p className="text-muted mb-0">Análisis de ingresos agrupados por método de pago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <p className="text-muted small mb-3">
                    Selecciona un rango de fechas para consultar el consumo por forma de pago
                  </p>
                </div>
                <div className="col-md-2 text-end">
                  <button 
                    className="btn btn-primary btn-lg px-4" 
                    onClick={obtenerInforme}
                    disabled={!desde || !hasta}
                  >
                    <i className="bi bi-search me-2"></i>
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          </div>      {/* Resumen Total */}
      {Object.keys(resumen).length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-currency-euro fs-2 text-muted mb-2"></i>
                <h4 className="mb-1">{calcularTotal()}€</h4>
                <small className="text-muted">Total Facturado</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-credit-card text-muted fs-2 mb-2"></i>
                <h5 className="mb-1">{Object.keys(resumen).length}</h5>
                <small className="text-muted">Formas de Pago</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-range text-muted fs-2 mb-2"></i>
                <h6 className="mb-1">{desde}</h6>
                <small className="text-muted">Fecha Inicio</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-check text-muted fs-2 mb-2"></i>
                <h6 className="mb-1">{hasta}</h6>
                <small className="text-muted">Fecha Fin</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Formas de Pago */}
      {Object.keys(resumen).length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Detalle por Forma de Pago
              <span className="badge bg-primary ms-2">{Object.keys(resumen).length} métodos</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Forma de Pago</th>
                    <th className="border-0 py-3 text-end">Total (€)</th>
                    <th className="border-0 py-3 text-center">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(resumen)
                    .sort(([,a], [,b]) => b - a) // Ordenar por total descendente
                    .map(([forma, total]) => {
                      const porcentaje = ((total / parseFloat(calcularTotal())) * 100).toFixed(1);
                      return (
                        <tr key={forma}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <i className={`bi ${getIconoFormaPago(forma)} text-primary me-3 fs-5`}></i>
                              <span className="fw-medium">{forma}</span>
                            </div>
                          </td>
                          <td className="py-3 text-end">
                            <span className="fw-bold fs-5">
                              {parseFloat(total).toFixed(2)}€
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <div className="d-flex align-items-center justify-content-center">
                              <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  role="progressbar" 
                                  style={{ width: `${porcentaje}%` }}
                                ></div>
                              </div>
                              <span className="badge bg-light text-dark">{porcentaje}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>        </div>
      )}

      {/* Estado Vacío */}
      {Object.keys(resumen).length === 0 && consultaRealizada && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-pie-chart fs-1 text-muted mb-3"></i>
            <h5 className="text-muted mb-2">No hay consumo registrado</h5>
            <p className="text-muted mb-0">
              No se encontraron transacciones en el período seleccionado:<br/>
              <strong>{new Date(desde).toLocaleDateString("es-ES")} - {new Date(hasta).toLocaleDateString("es-ES")}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Estado inicial */}
      {Object.keys(resumen).length === 0 && !consultaRealizada && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
            <h5 className="text-muted">Selecciona un período</h5>
            <p className="text-muted mb-0">
              Selecciona las fechas y haz clic en "Consultar" para ver el consumo por forma de pago
            </p>
          </div>        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default InformeConsumoFormaPago;
