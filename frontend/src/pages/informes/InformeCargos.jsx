import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeCargos = () => {
  const [fecha, setFecha] = useState("");
  const [cargos, setCargos] = useState([]);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const token = localStorage.getItem("token");

  const obtenerInforme = async () => {
    if (!fecha) {
      toast.warning("Debes seleccionar una fecha");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/cargos`,
        {
          params: { fecha },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCargos(data);
      setConsultaRealizada(true);
      if (data.length === 0) {
        toast.info("No hay cargos en esa fecha.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe de cargos por habitación: ${error.message}`
      );
    }
  };

  const calcularTotal = () => {
    return cargos
      .reduce((sum, c) => sum + parseFloat(c.total || 0), 0)
      .toFixed(2);
  };  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header Principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="h4 mb-1 d-flex align-items-center">
                <i className="bi bi-receipt text-primary me-3"></i>
                Informe de Cargos
              </h2>
              <p className="text-muted mb-0">
                Consulta los cargos realizados por fecha específica
              </p>
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
      {cargos.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-clipboard-data text-primary fs-2 mb-2"></i>
                <h5 className="mb-1">{cargos.length}</h5>
                <small className="text-muted">Total Cargos</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-door-open text-info fs-2 mb-2"></i>
                <h5 className="mb-1">{new Set(cargos.map((c) => c.numero_habitacion)).size}</h5>
                <small className="text-muted">Habitaciones</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-bookmark text-warning fs-2 mb-2"></i>
                <h5 className="mb-1">{new Set(cargos.map((c) => c.id_reserva)).size}</h5>
                <small className="text-muted">Reservas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-currency-euro fs-2 mb-2"></i>
                <h5 className="mb-1">{calcularTotal()}€</h5>
                <small className="opacity-75">Total Facturado</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Cargos */}
      {cargos.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Detalle de Cargos
              <span className="badge bg-primary ms-2">{cargos.length} registros</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Fecha</th>
                    <th className="border-0 py-3">Reserva</th>
                    <th className="border-0 py-3">Habitación</th>
                    <th className="border-0 py-3">Concepto</th>
                    <th className="border-0 py-3 text-center">Cantidad</th>
                    <th className="border-0 py-3 text-end">Precio Unit.</th>
                    <th className="border-0 py-3 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cargos.map((c, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <span className="text-muted">
                          {new Date(c.fecha).toLocaleDateString("es-ES")}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-light text-dark">#{c.id_reserva}</span>
                      </td>
                      <td className="py-3">
                        <span className="fw-bold text-primary">{c.numero_habitacion}</span>
                      </td>
                      <td className="py-3">{c.concepto}</td>
                      <td className="py-3 text-center">
                        <span className="badge bg-secondary">{c.cantidad}</span>
                      </td>
                      <td className="py-3 text-end text-muted">
                        {parseFloat(c.precio_unitario).toFixed(2)}€
                      </td>
                      <td className="py-3 text-end">
                        <span className="fw-bold">
                          {parseFloat(c.total).toFixed(2)}€
                        </span>
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
      {cargos.length === 0 && consultaRealizada && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mb-2">No hay cargos registrados</h5>
            <p className="text-muted mb-0">
              No se encontraron cargos para la fecha seleccionada: <strong>{new Date(fecha).toLocaleDateString("es-ES")}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformeCargos;
