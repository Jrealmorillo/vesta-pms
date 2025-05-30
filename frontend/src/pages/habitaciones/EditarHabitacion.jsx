// Página para editar los datos de una habitación
// Permite cargar los datos actuales, modificarlos y guardarlos mediante un formulario controlado.
// Incluye validaciones, notificaciones y navegación tras la edición.

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const EditarHabitacion = () => {
  // Obtiene el número de habitación desde la URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [habitacion, setHabitacion] = useState(null); // Estado de la habitación a editar
  useEffect(() => {
    // Carga los datos de la habitación al montar el componente
    const obtenerHabitacion = async () => {
      try {        
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/habitaciones/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // El backend devuelve { mensaje, habitacion }, necesitamos extraer solo habitacion
        const habitacionData = res.data.habitacion || res.data;
        setHabitacion(habitacionData);
      } catch (error) {
        console.error("Error al cargar habitación:", error); // Debug
        toast.error("Error al cargar la habitación");
        navigate("/habitaciones");
      }
    };

    if (id && token) {
      obtenerHabitacion();
    }
  }, [id, token, navigate]);
  // Maneja los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setHabitacion(prevHabitacion => ({ 
      ...prevHabitacion, 
      [name]: value 
    }));
  };

  // Envía el formulario para actualizar la habitación
  const manejarSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/habitaciones/${id}`,
        habitacion,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Habitación ${habitacion.numero_habitacion} actualizada correctamente`);
      navigate("/habitaciones");
    } catch (error) {
      toast.error(`${error.response?.data?.error || error.message}`);
    }
  };  // Muestra un mensaje mientras se cargan los datos
  if (!habitacion) {
    return (
      <div className="container-fluid py-5 mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h4 className="text-muted mt-3">Cargando datos de la habitación...</h4>
                <p className="text-muted">Por favor espera un momento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-pencil-square fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Editar Habitación</h2>
                  <p className="text-muted mb-0">Habitación #{habitacion.numero_habitacion} - Modifica los datos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={manejarSubmit}>
                <div className="row">
                  {/* Número de habitación (solo lectura) */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-door-closed me-2"></i>
                      Número de habitación
                    </label>
                    <input
                      type="text"
                      className="form-control rounded bg-light"
                      value={habitacion?.numero_habitacion || ''}
                      disabled
                      style={{ cursor: 'not-allowed' }}
                    />
                    <small className="text-muted">El número de habitación no se puede modificar</small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-house me-2"></i>
                      Tipo de habitación *
                    </label>
                    <select
                      name="tipo"
                      className="form-select rounded"
                      value={habitacion?.tipo || 'Individual'}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="Individual">Individual</option>
                      <option value="Doble">Doble</option>
                      <option value="Triple">Triple</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-people me-2"></i>
                      Capacidad máxima *
                    </label>
                    <select
                      name="capacidad_maxima"
                      className="form-select rounded"
                      value={habitacion?.capacidad_maxima || 1}
                      onChange={manejarCambio}
                      required
                    >
                      <option value={1}>1 persona</option>
                      <option value={2}>2 personas</option>
                      <option value={3}>3 personas</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-currency-euro me-2"></i>
                      Precio oficial *
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="precio_oficial"
                        className="form-control rounded"
                        step="0.01"
                        min="0"
                        value={habitacion?.precio_oficial || ''}
                        onChange={manejarCambio}
                        required
                      />
                      <span className="input-group-text">€</span>
                    </div>
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-journal-text me-2"></i>
                      Observaciones
                    </label>
                    <textarea
                      name="notas"
                      className="form-control rounded"
                      rows="3"
                      placeholder="Notas adicionales sobre la habitación..."
                      value={habitacion?.notas || ""}
                      onChange={manejarCambio}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-success px-4 py-2">
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2"
                    onClick={() => {
                      navigate("/habitaciones");
                      toast.info(`Edición de habitación ${habitacion.numero_habitacion} cancelada`);
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarHabitacion;
