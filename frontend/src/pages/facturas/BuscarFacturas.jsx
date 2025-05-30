// Página para buscar facturas en el sistema
// Permite filtrar por ID de factura, ID de reserva o fecha de emisión y muestra los resultados en una tabla.
// Incluye validaciones, notificaciones y acceso a la visualización de cada factura.

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuscarFacturas = () => {
  const [filtros, setFiltros] = useState({
    id_factura: "",
    id_reserva: "",
    fecha_emision: "",
  });

  const [resultados, setResultados] = useState([]); // Resultados de la búsqueda
  const token = localStorage.getItem("token"); // Token de autenticación
  const navigate = useNavigate();

  // Actualiza los filtros según el input del usuario
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Realiza la búsqueda de facturas según los filtros
  const buscarFacturas = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/facturas/buscar`,
        {
          params: filtros,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResultados(data);
      if (data.length === 0) {
        toast.info("No se encontraron facturas con esos criterios.");
      }
    } catch (error) {
      toast.error(`Error al buscar facturas: ${error.response?.data?.error || error.message}`);	
    }
  };  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-receipt text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Gestión de Facturas</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Card: Búsqueda */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-search me-2 text-primary"></i>
                Búsqueda de Facturas
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="id_factura" className="form-label text-muted fw-medium">
                    ID Factura
                  </label>
                  <input
                    type="number"
                    name="id_factura"
                    className="form-control rounded"
                    placeholder="Introduce el ID de la factura"
                    value={filtros.id_factura}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="id_reserva" className="form-label text-muted fw-medium">
                    ID Reserva
                  </label>
                  <input
                    type="number"
                    name="id_reserva"
                    className="form-control rounded"
                    placeholder="Introduce el ID de la reserva"
                    value={filtros.id_reserva}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="fecha_emision" className="form-label text-muted fw-medium">
                    Fecha de Emisión
                  </label>
                  <input
                    type="date"
                    name="fecha_emision"
                    className="form-control rounded"
                    value={filtros.fecha_emision}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <button className="btn btn-primary w-100 rounded" onClick={buscarFacturas}>
                    <i className="bi bi-search me-1"></i>
                    Buscar Facturas
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Resultados */}
          {resultados.length > 0 ? (
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-table me-2 text-primary"></i>
                  Resultados de la búsqueda
                  <span className="badge bg-primary ms-2">{resultados.length}</span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">ID</th>
                        <th className="fw-semibold">Fecha</th>
                        <th className="fw-semibold">Reserva</th>
                        <th className="fw-semibold">Huésped</th>
                        <th className="fw-semibold">Total</th>
                        <th className="fw-semibold">Estado</th>
                        <th className="fw-semibold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((factura) => (
                        <tr key={factura.id_factura}>
                          <td className="fw-medium">{factura.id_factura}</td>
                          <td>
                            {new Date(factura.fecha_emision).toLocaleDateString("es-ES")}
                          </td>
                          <td className="text-muted">#{factura.id_reserva}</td>
                          <td>
                            {factura.cliente
                              ? `${factura.cliente.nombre} ${
                                  factura.cliente.primer_apellido ?? ""
                                } ${factura.cliente.segundo_apellido ?? ""}`
                              : "—"}
                          </td>
                          <td className="fw-medium">{parseFloat(factura.total).toFixed(2)}€</td>
                          <td>
                            <span
                              className={`badge ${
                                factura.estado === "Pagada"
                                  ? "bg-success-subtle text-success"
                                  : factura.estado === "Pendiente"
                                  ? "bg-warning-subtle text-warning"
                                  : "bg-danger-subtle text-danger"
                              }`}
                            >
                              {factura.estado}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary rounded"
                              onClick={() => navigate(`/facturas/${factura.id_factura}`)}
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
          ) : (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }}></i>
                <h6 className="mt-3 text-muted">No hay facturas para mostrar</h6>
                <p className="text-muted mb-0">Realiza una búsqueda para encontrar facturas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarFacturas;
