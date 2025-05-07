import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Planning.css"; // Puedes añadir estilos aquí

const Planning = () => {
  const { token } = useContext(AuthContext);
  const [habitaciones, setHabitaciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [fechas, setFechas] = useState([]);

  // Generar los próximos 15 días desde hoy
  useEffect(() => {
    const hoy = new Date();
    const lista = [];

    for (let i = 0; i < 15; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      lista.push(fecha.toISOString().split("T")[0]);
    }

    setFechas(lista);
  }, []);

  // Cargar habitaciones
  useEffect(() => {
    const cargarHabitaciones = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/habitaciones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabitaciones(res.data);
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
      }
    };

    cargarHabitaciones();
  }, [token]);

  // Cargar reservas
  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservas(res.data.filter(r => r.estado !== "Anulada" && r.numero_habitacion));
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };

    cargarReservas();
  }, [token]);

  // Verificar si una habitación está ocupada en una fecha
  const estaOcupada = (habitacion, fecha) => {
    return reservas.some((reserva) => {
      return (
        reserva.numero_habitacion === habitacion.numero_habitacion &&
        fecha >= reserva.fecha_entrada &&
        fecha < reserva.fecha_salida
      );
    });
  };

  return (
    <div className="container py-5 mt-4">
      <h2 className="mb-3">Planning de Habitaciones</h2>
      <div className="table-responsive mt-2">
        <table className="table table-bordered text-center align-middle small">
          <thead className="table-light sticky-top">
            <tr>
              <th>Habitación</th>
              {fechas.map((fecha) => (
                <th key={fecha}>{fecha.slice(5)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habitaciones.map((hab) => (
              <tr key={hab.numero_habitacion}>
                <td>
                  <strong>{hab.numero_habitacion}</strong> <br />
                  <small>{hab.tipo}</small>
                </td>
                {fechas.map((fecha) => (
                  <td
                    key={fecha}
                    className={estaOcupada(hab, fecha) ? "bg-danger text-white" : "bg-success-subtle"}
                  >
                    {estaOcupada(hab, fecha) ? "Ocupada" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Planning;
