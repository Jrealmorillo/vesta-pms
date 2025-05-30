// Página para registrar una nueva habitación
// Permite ingresar los datos de la habitación y enviarlos al backend para su registro.
// Incluye validaciones, notificaciones y reseteo del formulario tras el registro exitoso.

import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const NuevaHabitacion = () => {
  const { token } = useContext(AuthContext);

  // Estado inicial para los datos de la habitación
  const [habitacion, setHabitacion] = useState({
    numero_habitacion: "",
    tipo: "",
    capacidad_maxima: 1,
    precio_oficial: "",
    notas: "",
    capacidad_minima: 1, // Fija, no se modifica
  });

  // Maneja los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setHabitacion({ ...habitacion, [name]: value });
  };

  // Maneja el envío del formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/habitaciones/registro`,
        habitacion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Habitación ${habitacion.numero_habitacion} registrada correctamente`);
      setHabitacion({
        numero_habitacion: "",
        tipo: "",
        capacidad_maxima: 1,
        precio_oficial: "",
        notas: "",
        capacidad_minima: 1,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-door-closed-fill fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Nueva Habitación</h2>
                  <p className="text-muted mb-0">Registra una nueva habitación en el hotel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={manejarSubmit}>
                <div className="row">
                  {/* Datos principales */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-door-closed me-2"></i>
                      Número de habitación *
                    </label>
                    <input
                      type="text"
                      name="numero_habitacion"
                      className="form-control rounded"
                      placeholder="Ej: 101, 201A..."
                      value={habitacion.numero_habitacion}
                      onChange={manejarCambio}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">
                      <i className="bi bi-house me-2"></i>
                      Tipo de habitación *
                    </label>
                    <select
                      name="tipo"
                      className="form-select rounded"
                      value={habitacion.tipo}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="" disabled>Selecciona el tipo</option>
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
                      value={habitacion.capacidad_maxima}
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
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        value={habitacion.precio_oficial}
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
                      value={habitacion.notas}
                      onChange={manejarCambio}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary px-4 py-2">
                    <i className="bi bi-plus-circle me-2"></i>
                    Registrar habitación
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

export default NuevaHabitacion;
