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
  };  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header Principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="h4 mb-1 d-flex align-items-center">
                <i className="bi bi-calendar-day text-primary me-3"></i>
                Resumen del Día
              </h2>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="flex-grow-1">
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
      {resumen && (
        <div className="row g-3 mb-4">
          <div className="col-md-2">
            <div className="card border-0 bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-check fs-2 mb-2"></i>
                <h4 className="mb-1">{resumen.llegadas}</h4>
                <small className="opacity-75">Llegadas</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-x text-warning fs-2 mb-2"></i>
                <h5 className="mb-1">{resumen.salidas}</h5>
                <small className="text-muted">Salidas</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-door-closed text-danger fs-2 mb-2"></i>
                <h5 className="mb-1">{resumen.ocupadas}</h5>
                <small className="text-muted">Ocupadas</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-door-open text-success fs-2 mb-2"></i>
                <h5 className="mb-1">{resumen.libres}</h5>
                <small className="text-muted">Libres</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-currency-euro text-info fs-2 mb-2"></i>
                <h5 className="mb-1">{parseFloat(resumen.facturacion || 0).toFixed(2)}€</h5>
                <small className="text-muted">Facturación Total</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Resumen */}
      {resumen ? (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Resumen del {new Date(fecha).toLocaleDateString('es-ES')}
              <span className="badge bg-primary ms-2">Informe Diario</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Fecha</th>
                    <th className="border-0 py-3 text-center">Llegadas</th>
                    <th className="border-0 py-3 text-center">Salidas</th>
                    <th className="border-0 py-3 text-center">Ocupadas</th>
                    <th className="border-0 py-3 text-center">Libres</th>
                    <th className="border-0 py-3 text-end">Facturación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3">
                      <span className="fw-medium">
                        {new Date(resumen.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="badge bg-primary">
                        {resumen.llegadas}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="badge bg-warning text-dark">
                        {resumen.salidas}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="badge bg-danger">
                        {resumen.ocupadas}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="badge bg-success">
                        {resumen.libres}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <span className="fw-bold">
                        {parseFloat(resumen.facturacion || 0).toFixed(2)}€
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : fecha ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-day text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mb-2">No hay datos disponibles</h5>
            <p className="text-muted mb-0">
              No se encontraron datos para el <strong>{new Date(fecha).toLocaleDateString('es-ES')}</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-event text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mb-2">Selecciona una fecha</h5>
            <p className="text-muted mb-0">
              Elige una fecha para obtener el resumen de actividad
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformeResumenDia;
