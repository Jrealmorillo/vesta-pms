// InformeClientesAlojados.jsx
// Vista para el informe de clientes alojados actualmente
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const InformeClientesAlojados = () => {
  const [clientes, setClientes] = useState([]);
  const token = localStorage.getItem("token");

  // Consulta los clientes actualmente alojados
  const obtenerInforme = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/clientes-alojados`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientes(data);
      if (data.length === 0) {
        toast.info("No hay clientes alojados actualmente.");
      }
    } catch (error) {
      toast.error(
        `Error al obtener el informe: ${
          error.response?.data?.error || error.message
        }`
      );
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
                <i className="bi bi-people text-primary me-3"></i>
                Clientes Alojados
              </h2>
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-primary px-4" onClick={obtenerInforme}>
                <i className="bi bi-search me-2"></i>
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de Resumen */}
      {clientes.length > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-primary text-white h-100">
              <div className="card-body text-center">
                <i className="bi bi-people fs-2 mb-2"></i>
                <h4 className="mb-1">{clientes.length}</h4>
                <small className="opacity-75">Clientes Alojados</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-door-open text-info fs-2 mb-2"></i>
                <h5 className="mb-1">
                  {new Set(clientes.map((c) => c.numero_habitacion)).size}
                </h5>
                <small className="text-muted">Habitaciones Ocupadas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-check text-success fs-2 mb-2"></i>
                <h5 className="mb-1">
                  {
                    clientes.filter(
                      (c) =>
                        new Date(c.fecha_entrada).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </h5>
                <small className="text-muted">Llegadas Hoy</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-light h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-x text-warning fs-2 mb-2"></i>
                <h5 className="mb-1">
                  {
                    clientes.filter(
                      (c) =>
                        new Date(c.fecha_salida).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </h5>
                <small className="text-muted">Salidas Hoy</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Clientes */}
      {clientes.length > 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="bi bi-table text-muted me-2"></i>
              Clientes Hospedados
              <span className="badge bg-primary ms-2">
                {clientes.length} huéspedes
              </span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Reserva</th>
                    <th className="border-0 py-3">Habitación</th>
                    <th className="border-0 py-3">Cliente</th>
                    <th className="border-0 py-3">Entrada</th>
                    <th className="border-0 py-3">Salida</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id_reserva}>
                      <td className="py-3">
                        <span className="badge bg-light text-dark">
                          #{c.id_reserva}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="fw-bold text-primary">
                          {c.numero_habitacion || "Sin asignar"}
                        </span>
                      </td>
                      <td className="py-3">
                        {c.cliente ? (
                          <div className="fw-medium">
                            {c.cliente.nombre} {c.cliente.primer_apellido}{" "}
                            {c.cliente.segundo_apellido}
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="text-muted">
                          {new Date(c.fecha_entrada).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-muted">
                          {new Date(c.fecha_salida).toLocaleDateString("es-ES")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-people text-muted mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="text-muted mb-2">No hay clientes alojados</h5>
            <p className="text-muted mb-0">
              Haz clic en "Consultar" para obtener el listado actual de
              huéspedes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformeClientesAlojados;
