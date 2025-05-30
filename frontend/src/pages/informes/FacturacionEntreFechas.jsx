import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FacturacionEntreFechas = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [resumen, setResumen] = useState({});
  const [consultaRealizada, setConsultaRealizada] = useState(false);
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
      setConsultaRealizada(true);
      if (Object.keys(data).length === 0) {
        toast.info("No se encontraron facturas en ese rango de fechas.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe de facturación: ${
          error.response?.data?.error || error.message
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

  const calcularTotalPorFecha = (pagos) => {
    return Object.values(pagos).reduce((sum, total) => sum + total, 0).toFixed(2);
  };

  const contarFechas = () => {
    return Object.keys(resumen).length;
  };

  const contarFormasPago = () => {
    const formas = new Set();
    Object.values(resumen).forEach(pagos => {
      Object.keys(pagos).forEach(forma => formas.add(forma));
    });
    return formas.size;
  };

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
      {/* Header Principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="h4 mb-1 d-flex align-items-center">
                <i className="bi bi-calendar-range text-primary me-3"></i>
                Facturación Entre Fechas
              </h2>
              <p className="text-muted mb-0">
                Análisis de facturación agrupado por fecha y forma de pago
              </p>
            </div>
            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                  />
                </div>
                <div className="col-md-4 align-self-end">
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={obtenerInforme}
                    disabled={!desde || !hasta}
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
      {Object.keys(resumen).length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-currency-euro fs-2 mb-2"></i>
                <h4 className="mb-1">{calcularTotalGlobal()}€</h4>
                <small className="opacity-75">Total Facturado</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-event text-info fs-2 mb-2"></i>
                <h5 className="mb-1">{contarFechas()}</h5>
                <small className="text-muted">Días con Facturación</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-credit-card text-warning fs-2 mb-2"></i>
                <h5 className="mb-1">{contarFormasPago()}</h5>
                <small className="text-muted">Formas de Pago</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-range text-success fs-2 mb-2"></i>
                <h6 className="mb-1">{desde} / {hasta}</h6>
                <small className="text-muted">Período Consultado</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Facturación */}
      {Object.keys(resumen).length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Detalle por Fecha y Forma de Pago
              <span className="badge bg-primary ms-2">{contarFechas()} fechas</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Fecha</th>
                    <th className="border-0 py-3">Forma de Pago</th>
                    <th className="border-0 py-3 text-end">Total (€)</th>
                    <th className="border-0 py-3 text-end">Total Día</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(resumen)
                    .sort(([a], [b]) => new Date(a) - new Date(b)) // Ordenar por fecha
                    .map(([fecha, pagos]) =>
                      Object.entries(pagos)
                        .sort(([,a], [,b]) => b - a) // Ordenar por total descendente
                        .map(([forma, total], index) => (
                          <tr key={`${fecha}-${forma}`}>
                            {index === 0 && (
                              <td className="py-3 fw-bold border-end" rowSpan={Object.keys(pagos).length}>
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-calendar3 text-primary me-2"></i>
                                  {new Date(fecha).toLocaleDateString("es-ES")}
                                </div>
                              </td>
                            )}
                            <td className="py-3">
                              <div className="d-flex align-items-center">
                                <i className={`bi ${getIconoFormaPago(forma)} text-primary me-3`}></i>
                                <span className="fw-medium">{forma}</span>
                              </div>
                            </td>
                            <td className="py-3 text-end">
                              <span className="fw-bold">
                                {total.toFixed(2)}€
                              </span>
                            </td>
                            {index === 0 && (
                              <td className="py-3 text-end border-start" rowSpan={Object.keys(pagos).length}>
                                <div className="badge bg-primary fs-6">
                                  {calcularTotalPorFecha(pagos)}€
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Estado Vacío */}
      {Object.keys(resumen).length === 0 && consultaRealizada && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-x text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mb-2">No hay facturación registrada</h5>
            <p className="text-muted mb-0">
              No se encontraron facturas en el período seleccionado:<br/>
              <strong>{new Date(desde).toLocaleDateString("es-ES")} - {new Date(hasta).toLocaleDateString("es-ES")}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturacionEntreFechas;
