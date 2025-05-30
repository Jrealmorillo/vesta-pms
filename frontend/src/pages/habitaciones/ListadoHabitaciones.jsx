// Página para listar, editar y eliminar habitaciones
// Muestra una tabla con todas las habitaciones y permite acciones de edición y eliminación.
// Incluye confirmaciones, notificaciones y recarga automática tras eliminar.

import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ListadoHabitaciones = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [habitaciones, setHabitaciones] = useState([]); // Estado de la lista de habitaciones
  // Obtiene todas las habitaciones del backend
  const obtenerHabitaciones = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/habitaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabitaciones(res.data.habitaciones); // Actualiza el estado con la lista de habitaciones
    } catch (error) {
      toast.error(`Error al obtener habitaciones: ${error.response?.data?.error || error.message}`);
    }
  }, [token]);

  useEffect(() => {
    obtenerHabitaciones(); // Carga la lista al montar el componente
  }, [obtenerHabitaciones]);

  // Navega a la pantalla de edición de la habitación seleccionada
  const irAEditar = (id) => {
    navigate(`/habitaciones/editar/${id}`);
  };

  // Muestra confirmación antes de eliminar una habitación
  const confirmarEliminacionHabitacion = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar habitación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });
  
    if (confirmacion.isConfirmed) {
      eliminarHabitacion(id);
    }
  };
  
  // Elimina la habitación seleccionada y recarga la lista
  const eliminarHabitacion = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/habitaciones/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Habitación ${id} eliminada correctamente`);
      obtenerHabitaciones(); // Actualiza la lista
    } catch (error) {
      toast.error(`Error al eliminar habitación: ${error.response?.data?.error || error.message}`);
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-door-open fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Listado de Habitaciones</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {habitaciones.length > 0 ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th><i className="bi bi-door-closed me-2"></i>Nº Habitación</th>
                        <th><i className="bi bi-house me-2"></i>Tipo</th>
                        <th><i className="bi bi-people me-2"></i>Capacidad</th>
                        <th><i className="bi bi-currency-euro me-2"></i>Precio oficial</th>
                        <th><i className="bi bi-journal-text me-2"></i>Observaciones</th>
                        <th><i className="bi bi-gear me-2"></i>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {habitaciones.map((h) => (
                        <tr key={h.numero_habitacion}>
                          <td>
                            <span className="badge bg-primary fs-6">{h.numero_habitacion}</span>
                          </td>
                          <td>
                            <span className="fw-medium">{h.tipo}</span>
                          </td>
                          <td>
                            <small className="text-muted">min:</small> {h.capacidad_minima}, 
                            <small className="text-muted"> max:</small> {h.capacidad_maxima}
                          </td>
                          <td>
                            <span className="fw-bold text-success">{parseFloat(h.precio_oficial).toFixed(2)} €</span>
                          </td>
                          <td>
                            <span className={h.notas ? "text-dark" : "text-muted"}>
                              {h.notas || "Sin observaciones"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                onClick={() => irAEditar(h.numero_habitacion)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={() => confirmarEliminacionHabitacion(h.numero_habitacion)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Eliminar
                              </button>
                            </div>
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
                <i className="bi bi-door-closed text-muted" style={{ fontSize: "4rem" }}></i>
                <h4 className="text-muted mt-3">No hay habitaciones registradas</h4>
                <p className="text-muted">Comienza registrando tu primera habitación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListadoHabitaciones;

