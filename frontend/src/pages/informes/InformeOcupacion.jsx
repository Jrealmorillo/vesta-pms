// InformeOcupacion.jsx
// Vista para el informe de ocupación por rango de fechas
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
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResumen(data);
      if (!data.total_habitaciones) {
        toast.info("No hay datos de ocupación en ese periodo.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe: ${error.response?.data?.error || error.message}`
      );
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
                <i className="bi bi-bar-chart fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Informe de Ocupación</h2>
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
                    Selecciona un rango de fechas para calcular la ocupación promedio
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
          </div>

          {/* Resultados */}
          {resumen ? (
            <>
              {/* Métricas */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-percent fs-2 text-muted mb-2"></i>
                      <h3 className="mb-1">{resumen.porcentaje_ocupacion}%</h3>
                      <small className="text-muted">Ocupación Promedio</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-door-open fs-2 text-muted mb-2"></i>
                      <h4 className="mb-1">{resumen.total_habitaciones}</h4>
                      <small className="text-muted">Total Habitaciones</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-calendar-range fs-2 text-muted mb-2"></i>
                      <h5 className="mb-1">{resumen.dias_periodo}</h5>
                      <small className="text-muted">Días Analizados</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-calendar-check fs-2 text-muted mb-2"></i>
                      <h5 className="mb-1">{resumen.noches_ocupadas}</h5>
                      <small className="text-muted">Noches Ocupadas</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de detalle */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-light border-bottom">
                  <h5 className="mb-0">
                    <i className="bi bi-table me-2"></i>
                    Resumen de Ocupación
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="px-4 py-3">Métrica</th>
                          <th className="px-4 py-3 text-end">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3">
                            <span className="fw-medium">Período analizado</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            {new Date(desde).toLocaleDateString('es-ES')} - {new Date(hasta).toLocaleDateString('es-ES')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <span className="fw-medium">Total de habitaciones</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-primary fs-6">{resumen.total_habitaciones}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <span className="fw-medium">Días del período</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-light text-dark fs-6">{resumen.dias_periodo}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <span className="fw-medium">Noches ocupadas</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-light text-dark fs-6">{resumen.noches_ocupadas}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">
                            <span className="fw-medium">Noches disponibles</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-light text-dark fs-6">{resumen.noches_disponibles}</span>
                          </td>
                        </tr>
                        <tr className="table-active">
                          <td className="px-4 py-3">
                            <span className="fw-bold">Porcentaje de ocupación</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-primary fs-5">{resumen.porcentaje_ocupacion}%</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                <h5 className="text-muted">Selecciona un período</h5>
                <p className="text-muted mb-0">
                  Selecciona las fechas y haz clic en "Consultar" para ver el informe de ocupación
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformeOcupacion;
