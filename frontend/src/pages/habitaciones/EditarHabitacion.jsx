/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

function EditarHabitacion() {
  const { id } = useParams(); // Aquí el 'id' será el número de habitación
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [habitacion, setHabitacion] = useState(null);

  useEffect(() => {
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

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setHabitacion({ ...habitacion, [name]: value });
  };

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
      const msg =
        error.response?.data?.detalle || "Error al actualizar habitación";
      toast.error(msg);
    }
  };

  if (!habitacion)
    return <p className="text-center mt-5">Cargando habitación...</p>;

  return (
    <div className="container py-5 mt-1">
      <h2 className="text-center mb-4">Editar habitación</h2>
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "450px", textAlign: "left" }}
      >
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
        <div class="row button-row">
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
