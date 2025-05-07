/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ListadoHabitaciones = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [habitaciones, setHabitaciones] = useState([]);

  const obtenerHabitaciones = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/habitaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabitaciones(res.data);
    } catch (error) {
      toast.error("Error al obtener habitaciones");
    }
  };

  useEffect(() => {
    obtenerHabitaciones();
  });

  const irAEditar = (id) => {
    navigate(`/habitaciones/editar/${id}`);
  };

  const confirmarEliminacionHabitacion = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>¿Seguro que deseas eliminar esta habitación?</p>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                eliminarHabitacion(id);
                closeToast();
              }}
            >
              Sí, eliminar
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={closeToast}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };
  
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
                  <td className="d-flex justify-content-around">
                    <button
                      className="btn btn-sm btn-outline-primary mx-2 d-flex align-items-center"
                      onClick={() => irAEditar(h.numero_habitacion)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger mx-2 d-flex align-items-center"
                      onClick={() => confirmarEliminacionHabitacion(h.numero_habitacion)}
                    >
                     <i className="bi bi-trash3-fill"></i>
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

  