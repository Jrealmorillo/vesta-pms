// Página para visualizar el historial de acciones realizadas sobre una reserva específica.
// Muestra una tabla con fecha, usuario, acción y detalles de cada cambio registrado en la reserva.
// Permite identificar fácilmente quién y cuándo se realizaron modificaciones relevantes.

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerHistorialReserva = () => {
  // Obtiene el id de la reserva desde la URL
  const { id } = useParams(); 
  const navigate = useNavigate();
  // historial: array de registros de acciones sobre la reserva
  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Token de autenticación
  const token = localStorage.getItem("token");
  // Carga el historial de la reserva al montar el componente o cambiar el id
  useEffect(() => {
    const cargarHistorial = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/${id}/historial`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistorial(data);
      } catch (error) {
        toast.error("Error al cargar historial de la reserva");
      } finally {
        setIsLoading(false);
      }
    };
    cargarHistorial();
  }, [id, token]);
  // Función para obtener el color del badge según la acción
  const getBadgeColor = (accion) => {
    switch (accion?.toLowerCase()) {
      case 'creada':
      case 'creación':
        return 'bg-success';
      case 'modificada':
      case 'modificación':
      case 'editada':
        return 'bg-primary';
      case 'anulada':
      case 'cancelada':
        return 'bg-danger';
      case 'confirmada':
        return 'bg-info';
      case 'check-in':
        return 'bg-warning text-dark';
      case 'check-out':
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando historial de la reserva...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      {/* Header con información principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h1 className="h3 mb-2 text-dark">Historial de la Reserva #{id}</h1>
                  <p className="text-muted mb-0">Registro completo de acciones y modificaciones</p>
                </div>
                <div>
                  <span className="badge bg-light text-dark fs-6 px-3 py-2" style={{ borderRadius: '20px' }}>
                    {historial.length} registro{historial.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del historial */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">Cronología de acciones</h5>
            </div>            {/* Si no hay historial, muestra mensaje informativo */}
            {historial.length === 0 ? (
              <div className="card-body p-5 text-center">
                <div className="text-muted mb-3">
                  <svg width="64" height="64" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1.001.025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </div>
                <h6 className="text-muted mb-2">Sin historial registrado</h6>
                <p className="text-muted mb-0">No hay acciones registradas para esta reserva.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold text-muted">Fecha y hora</th>
                      <th className="fw-semibold text-muted">Usuario</th>
                      <th className="fw-semibold text-muted">Acción</th>
                      <th className="fw-semibold text-muted">Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((registro) => (
                      <tr key={registro.id_historial} className="align-middle">
                        <td>
                          <div className="fw-medium">
                            {new Date(registro.fecha_accion).toLocaleDateString("es-ES", {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                          <small className="text-muted">
                            {new Date(registro.fecha_accion).toLocaleTimeString("es-ES", {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </td>
                        <td className="fw-medium">{registro.nombre_usuario}</td>
                        <td>
                          <span className={`badge ${getBadgeColor(registro.accion)} px-3 py-2`} style={{ borderRadius: '15px' }}>
                            {registro.accion}
                          </span>
                        </td>
                        <td>
                          {registro.detalles ? (
                            <div className="small">
                              {registro.detalles}
                            </div>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón de navegación */}
      <div className="row mt-4">
        <div className="col-12">
          <button
            className="btn btn-light shadow-sm px-4 py-2"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate(`/reservas/ver/${id}`);
              }
            }}
            style={{ 
              borderRadius: '20px',
              border: '1px solid #dee2e6',
              fontWeight: '500'
            }}
          >
            ← Volver a la reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerHistorialReserva;
