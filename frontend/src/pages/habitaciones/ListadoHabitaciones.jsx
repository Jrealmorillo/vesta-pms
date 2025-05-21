// Página para listar, editar y eliminar habitaciones
// Muestra una tabla con todas las habitaciones y permite acciones de edición y eliminación.
// Incluye confirmaciones, notificaciones y recarga automática tras eliminar.

/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
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
  const obtenerHabitaciones = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/habitaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabitaciones(res.data.habitaciones); // Actualiza el estado con la lista de habitaciones
    } catch (error) {
      toast.error(`Error al obtener habitaciones: ${error.response?.data?.detalle || error.message}`);
    }
  };

  useEffect(() => {
    obtenerHabitaciones(); // Carga la lista al montar el componente
  }, []);

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
      toast.success("Habitación eliminada correctamente");
      obtenerHabitaciones(); // Actualiza la lista
    } catch (error) {
      const msg = error.response?.data?.detalle || "Error al eliminar habitación";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-5 mt-1">
      <h2 className="mb-4 text-center">Listado de habitaciones</h2>

      {habitaciones.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Nº Habitación</th>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>Precio oficial (€)</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {habitaciones.map((h) => (
                <tr key={h.numero_habitacion}>
                  <td>{h.numero_habitacion}</td>
                  <td>{h.tipo}</td>
                  <td>{`min: ${h.capacidad_minima}, max: ${h.capacidad_maxima}`}</td>
                  <td>{parseFloat(h.precio_oficial).toFixed(2)}</td>
                  <td>{h.notas || "-"}</td>
                  <td className="d-flex justify-content-around"
                      >
                    <button
                      className="btn btn-sm btn-outline-primary mx-2 d-flex align-items-center px-3"
                      style={{ width: '100px' }}
                      onClick={() => irAEditar(h.numero_habitacion)}
                    >
                     <i className="bi bi-pencil-fill m-1"></i>Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger mx-2 d-flex align-items-center px-3"
                      style={{ width: '100px' }}
                      onClick={() => confirmarEliminacionHabitacion(h.numero_habitacion)}
                    >
                     <i className="bi bi-trash3-fill me-2"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No hay habitaciones registradas.</p>
      )}
    </div>
  );
}

export default ListadoHabitaciones;

