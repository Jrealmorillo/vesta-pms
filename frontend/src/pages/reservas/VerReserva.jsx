// Página para visualizar el detalle de una reserva concreta.
// Permite ver datos generales, líneas asociadas, estado, anular o recuperar la reserva y acceder al historial.
// Incluye feedback visual y navegación a edición o historial de la reserva.

import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const VerReserva = () => {
  // Obtiene el id de la reserva desde la URL
  const { id } = useParams();
  // Token de autenticación desde el contexto
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado local para la reserva
  const [reserva, setReserva] = useState(null);

  // Carga la reserva al montar el componente o cambiar id/token
  useEffect(() => {
    const obtenerReserva = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReserva(response.data);
      } catch (error) {
        toast.error(`Error al obtener la reserva: ${error.response?.data?.error || error.message}`);
      }
    };

    obtenerReserva();
  }, [id, token]);

  // Cambia el estado de la reserva a 'Confirmada' (recuperar)
  const recuperarReserva = async () => {
    const resultado = await Swal.fire({
      title: "¿Recuperar reserva?",
      text: "La reserva volverá a estado Confirmada",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, recuperar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    });

    if (!resultado.isConfirmed) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${
          reserva.id_reserva
        }/cambiar-estado`,
        { nuevoEstado: "Confirmada" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reserva recuperada correctamente");

      // Volver a cargar la reserva actualizada
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${reserva.id_reserva}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReserva(response.data);
    } catch (error) {
      toast.error(`Error al recuperar la reserva: ${error.response?.data?.error || error.message}`);
    }
  };

  // Cambia el estado de la reserva a 'Anulada'
  const anularReserva = async () => {
    const resultado = await Swal.fire({
      title: "¿Anular reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!resultado.isConfirmed) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${
          reserva.id_reserva
        }/cambiar-estado`,
        { nuevoEstado: "Anulada" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.warning("Reserva anulada correctamente");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${reserva.id_reserva}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReserva(response.data);
    } catch (error) {
      toast.error(`No se pudo anular la reserva: ${error.response?.data?.error || error.message}`);
    }
  };
  if (!reserva) {
    return (
      <div className="container py-5 mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando información de la reserva...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "900px" }}>
      {/* Header con información principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h1 className="h3 mb-2 text-dark">Reserva #{reserva.id_reserva}</h1>
                  <p className="text-muted mb-0">Información detallada de la reserva</p>
                </div>
                <div>
                  <span
                    className={`badge fs-6 px-3 py-2 ${
                      reserva.estado === "Anulada"
                        ? "bg-danger"
                        : reserva.estado === "Confirmada"
                        ? "bg-success"
                        : reserva.estado === "Check-in"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                    style={{ borderRadius: '20px' }}
                  >
                    {reserva.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Información principal de la reserva */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">Datos de la reserva</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Huésped principal</label>
                  <p className="fw-medium mb-3">
                    {reserva.nombre_huesped} {reserva.primer_apellido_huesped} {reserva.segundo_apellido_huesped}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Número de habitación</label>
                  <p className="fw-medium mb-3">{reserva.numero_habitacion || "Sin asignar"}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Fecha de entrada</label>
                  <p className="fw-medium mb-3">{new Date(reserva.fecha_entrada).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Fecha de salida</label>
                  <p className="fw-medium mb-3">{new Date(reserva.fecha_salida).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                {reserva.observaciones && (
                  <div className="col-12">
                    <label className="form-label text-muted small mb-1">Observaciones</label>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0">{reserva.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">Referencias</h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">ID Cliente</label>
                <p className="fw-medium mb-0">{reserva.id_cliente || "No asignado"}</p>
              </div>
              <div className="mb-0">
                <label className="form-label text-muted small mb-1">ID Empresa</label>
                <p className="fw-medium mb-0">{reserva.id_empresa || "No asignado"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Líneas de reserva */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">Líneas de reserva</h5>
            </div>
            <div className="card-body p-0">
              {reserva.lineas && reserva.lineas.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold text-muted">Fecha</th>
                        <th className="fw-semibold text-muted">Tipo habitación</th>
                        <th className="fw-semibold text-muted">Régimen</th>
                        <th className="fw-semibold text-muted text-center">Habitaciones</th>
                        <th className="fw-semibold text-muted text-center">Ocupación</th>
                        <th className="fw-semibold text-muted text-end">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reserva.lineas.map((linea, index) => (
                        <tr key={index} className="align-middle">
                          <td className="fw-medium">{linea.fecha}</td>
                          <td>{linea.tipo_habitacion}</td>
                          <td>{linea.regimen}</td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark">{linea.cantidad_habitaciones}</span>
                          </td>
                          <td className="text-center">
                            <small className="text-muted">
                              {linea.cantidad_adultos} ad / {linea.cantidad_ninos} ni
                            </small>
                          </td>
                          <td className="text-end fw-semibold">{linea.precio} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted mb-0">No hay líneas de reserva asociadas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>      {/* Acciones de la reserva */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">Acciones disponibles</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-center gap-3">
                  {/* Botón para modificar la reserva */}
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={() => {
                    if (reserva.estado === "Anulada") {
                      toast.warning(
                        "Esta reserva está anulada y no se puede modificar. Debe recuperarla primero para poder editarla.",
                        { autoClose: 5000 }
                      );
                      return;
                    }
                    navigate(`/reservas/editar/${reserva.id_reserva}`);
                  }}
                >
                  Modificar reserva
                </button>
                
                {/* Botón para recuperar reserva anulada */}
                {reserva.estado === "Anulada" && (
                  <button 
                    className="btn btn-warning px-4 py-2" 
                    onClick={recuperarReserva}
                  >
                    Recuperar reserva
                  </button>
                )}

                {/* Botón para anular reserva confirmada */}
                {reserva.estado === "Confirmada" && (
                  <button
                    className="btn btn-outline-danger px-4 py-2"
                    onClick={anularReserva}
                  >
                    Anular reserva
                  </button>
                )}
                
                {/* Enlace al historial de la reserva */}
                <Link
                  to={`/reservas/${reserva.id_reserva}/historial`}
                  className="btn btn-outline-secondary px-4 py-2"
                >
                  Ver historial
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerReserva;
