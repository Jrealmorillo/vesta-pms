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
      toast.success("Habitación registrada correctamente");
      setHabitacion({
        numero_habitacion: "",
        tipo: "",
        capacidad_maxima: 1,
        precio_oficial: "",
        notas: "",
        capacidad_minima: 1,
      });
    } catch (error) {
      const msg = error.response?.data?.error || "Error al registrar habitación";
      toast.error(msg);
    }
  };

  return (
    <div className="container py-5 mt-1">
      <h2 className="text-center mb-4">Registrar nueva habitación</h2>
      {/* Formulario de registro de habitación */}
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "450px", textAlign: "left" }}
      >
        {/* Campo para el número de habitación */}
        <div className="mb-3">
          <label className="form-label">Número de habitación</label>
          <input
            type="text"
            name="numero_habitacion"
            className="form-control"
            value={habitacion.numero_habitacion}
            onChange={manejarCambio}
            required
          />
        </div>

        {/* Selector de tipo de habitación */}
        <div className="mb-3">
          <label className="form-label">Tipo de habitación</label>
          <select
            name="tipo"
            className="form-select"
            value={habitacion.tipo}
            onChange={manejarCambio}
            required
          >
            <option value="" disabled>-- Selecciona tipo --</option>
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Triple">Triple</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        {/* Selector de capacidad máxima */}
        <div className="mb-3">
          <label className="form-label">Capacidad máxima</label>
          <select
            name="capacidad_maxima"
            className="form-select"
            value={habitacion.capacidad_maxima}
            onChange={manejarCambio}
            required
          >
            <option value={1}>1 persona</option>
            <option value={2}>2 personas</option>
            <option value={3}>3 personas</option>
          </select>
        </div>

        {/* Campo para el precio oficial */}
        <div className="mb-3">
          <label className="form-label">Precio oficial (€)</label>
          <input
            type="number"
            name="precio_oficial"
            className="form-control"
            step="0.01"
            min="0"
            value={habitacion.precio_oficial}
            onChange={manejarCambio}
            required
          />
        </div>

        {/* Campo para observaciones */}
        <div className="mb-4">
          <label className="form-label">Observaciones</label>
          <textarea
            name="notas"
            className="form-control"
            rows="3"
            value={habitacion.notas}
            onChange={manejarCambio}
          ></textarea>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Registrar habitación
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevaHabitacion;
