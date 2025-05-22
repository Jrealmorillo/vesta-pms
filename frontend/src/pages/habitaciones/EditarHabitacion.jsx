// Página para editar los datos de una habitación
// Permite cargar los datos actuales, modificarlos y guardarlos mediante un formulario controlado.
// Incluye validaciones, notificaciones y navegación tras la edición.

/* eslint-disable no-unused-vars */
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
        setHabitacion(res.data);
      } catch (error) {
        toast.error("Error al cargar la habitación");
        navigate("/habitaciones");
      }
    };

    obtenerHabitacion();
  }, [id, token, navigate]);

  // Maneja los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setHabitacion({ ...habitacion, [name]: value });
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
      toast.success("Habitación actualizada correctamente");
      navigate("/habitaciones");
    } catch (error) {
      toast.error(`Error al actualizar habitación: ${error.response?.data?.error || error.message}`);
    }
  };

  // Muestra un mensaje mientras se cargan los datos
  if (!habitacion)
    return <p className="text-center mt-5">Cargando habitación...</p>;

  return (
    <div className="container py-5 mt-1">
      <h2 className="text-center mb-4">Editar habitación</h2>
      {/* Formulario de edición de habitación */}
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "450px", textAlign: "left" }}
      >
        {/* Campos de datos de la habitación */}
        <div className="mb-3">
          <label className="form-label">Número de habitación</label>
          <input
            type="text"
            className="form-control"
            value={habitacion.numero_habitacion}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de habitación</label>
          <select
            name="tipo"
            className="form-select"
            value={habitacion.tipo}
            onChange={manejarCambio}
            required
          >
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Triple">Triple</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

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

        <div className="mb-4">
          <label className="form-label">Observaciones</label>
          <textarea
            name="notas"
            className="form-control"
            rows="3"
            value={habitacion.notas || ""}
            onChange={manejarCambio}
          ></textarea>
        </div>
        <div className="row button-row">
          <div className="col-5">
            <button type="submit" className="btn btn-success">
              Guardar cambios
            </button>
          </div>
          <div className="col-3">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/habitaciones")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditarHabitacion;
