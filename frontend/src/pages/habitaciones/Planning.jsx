// Página de planificación visual de ocupación de habitaciones en el hotel.
// Permite seleccionar una fecha de inicio y muestra el estado de cada habitación durante 15 días.
// Incluye leyenda de colores para interpretar el estado de cada celda.

/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Planning.css";

// Suma 'dias' días a una fecha dada y retorna la nueva fecha
const addDays = (fecha, dias) => {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
};

// Formatea una fecha a 'YYYY-MM-DD' para inputs tipo date
const formatearFechaInput = (fecha) => {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Formatea una fecha a 'DD/MM' para mostrar en la cabecera de la tabla
const formatearDiaMes = (fecha) => {
  return `${String(fecha.getDate()).padStart(2, "0")}/${String(
    fecha.getMonth() + 1
  ).padStart(2, "0")}`;
};

const Planning = () => {
  // Estado para habitaciones, reservas y fecha de inicio del planning
  const [habitaciones, setHabitaciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [estadosHabitaciones, setEstadosHabitaciones] = useState([]);
  const [bloqueos, setBloqueos] = useState([]); // Nuevo estado para bloqueos con fechas

  // Token de autenticación para las peticiones
  const token = localStorage.getItem("token");
  // Array de fechas a mostrar (15 días a partir de la fecha de inicio)
  const fechas = Array.from({ length: 15 }, (_, i) => addDays(fechaInicio, i));

  // Obtiene habitaciones desde la API
  const cargarHabitaciones = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/habitaciones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabitaciones(res.data.habitaciones);
    } catch (error) {
      console.error("Error al cargar habitaciones");
    }
  }, [token]);

  // Obtiene reservas para el rango de fechas mostrado
  const cargarReservas = useCallback(async () => {
    const desde = formatearFechaInput(fechaInicio);
    const hasta = formatearFechaInput(addDays(fechaInicio, 15));

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/reservas/asignadas?desde=${desde}&hasta=${hasta}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReservas(res.data);
    } catch (error) {
      console.error("Error al cargar reservas para el planning");
    }
  }, [fechaInicio, token]);

  // Carga los estados de habitaciones desde localStorage
  const cargarEstadosHabitaciones = useCallback(() => {
    const guardado = localStorage.getItem("estadoHabitaciones");
    if (guardado) {
      setEstadosHabitaciones(JSON.parse(guardado));
    }
  }, []);

  // Carga los bloqueos desde localStorage
  const cargarBloqueos = useCallback(() => {
    const guardado = localStorage.getItem("bloqueosHabitaciones");
    if (guardado) {
      setBloqueos(JSON.parse(guardado));
    }
  }, []);

  // Carga la lista de habitaciones y sus estados al montar el componente
  useEffect(() => {
    cargarHabitaciones();
    cargarEstadosHabitaciones();
    cargarBloqueos();
  }, [cargarHabitaciones, cargarEstadosHabitaciones, cargarBloqueos]);

  // Función para manejar el cambio de fecha
  const manejarCambioFecha = (e) => {
    const nuevaFecha = e.target.value;
    if (nuevaFecha) {
      setFechaInicio(new Date(nuevaFecha));
    }
  };

  // Carga las reservas cada vez que cambia la fecha de inicio
  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  // Obtiene el estado de una habitación específica
  const getEstadoHabitacion = (numeroHabitacion) => {
    return estadosHabitaciones.find((e) => e.numero === numeroHabitacion);
  };

  // Verifica si una habitación está bloqueada en una fecha específica
  const estaBloqueda = (numeroHabitacion, fecha) => {
    const fechaObj = new Date(fecha);
    return bloqueos.some(
      (bloqueo) =>
        bloqueo.numero_habitacion === numeroHabitacion &&
        new Date(bloqueo.fecha_inicio) <= fechaObj &&
        new Date(bloqueo.fecha_fin) >= fechaObj
    );
  };

  // Busca si una habitación tiene reserva en una fecha específica
  const getReservaEnFecha = (habitacion, fecha) => {
    const f = new Date(fecha);
    return reservas.find((reserva) => {
      const entrada = new Date(reserva.fecha_entrada);
      const salida = new Date(reserva.fecha_salida);
      return (
        reserva.numero_habitacion === habitacion.numero_habitacion &&
        entrada <= f &&
        f < salida
      );
    });
  };

  // Devuelve la clase de color según el estado de la reserva
  const getEstadoColor = (estado) => {
    if (estado === "Check-in") return "bg-primary text-white";
    if (estado === "Confirmada") return "bg-warning text-dark";
    return "";
  };

  // Formatea fecha a 'DD/MM/YYYY' para mostrar en tooltip
  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const año = d.getFullYear();
    return `${dia}/${mes}/${año}`;
  };
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar2-range fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Planning de Habitaciones</h2>
                  <p className="text-muted mb-0">
                    Visualización de ocupación y estado por 15 días
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de fecha */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    <i className="bi bi-calendar-date me-2"></i>
                    Fecha de inicio del planning
                  </label>
                  <input
                    type="date"
                    className="form-control rounded"
                    value={formatearFechaInput(fechaInicio)}
                    onChange={manejarCambioFecha}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda de colores */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-palette text-primary me-2"></i>
                Leyenda de Estados
              </h6>
              <div className="d-flex flex-wrap gap-4">
                <div className="d-flex align-items-center">
                  <div className="cuadro-color bg-success-subtle me-2"></div>
                  <span className="fw-medium">Libre</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="cuadro-color bg-primary me-2"></div>
                  <span className="fw-medium">Ocupada</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="cuadro-color bg-warning me-2"></div>
                  <span className="fw-medium">Asignada</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="cuadro-color bg-dark me-2"></div>
                  <span className="fw-medium">Bloqueada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla principal de planificación */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th className="text-center">Habitación</th>
                      {fechas.map((f, i) => (
                        <th key={i} className="text-center">
                          {formatearDiaMes(f)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {habitaciones.map((hab) => (
                      <tr key={hab.numero_habitacion}>
                        <td className="celda-planning">
                          {hab.numero_habitacion}
                        </td>
                        {fechas.map((fecha, i) => {
                          // Busca si la habitación está reservada en la fecha
                          const reserva = getReservaEnFecha(hab, fecha);
                          // Obtiene el estado de la habitación desde localStorage
                          const estadoHab = getEstadoHabitacion(
                            hab.numero_habitacion
                          );
                          // Verifica si está bloqueada en esta fecha específica
                          const estaBloqueada = estaBloqueda(
                            hab.numero_habitacion,
                            fecha
                          );

                          // Determina el estado: bloqueada tiene prioridad sobre reservas
                          let estadoFinal = null;
                          let colorClass = "bg-success-subtle"; // Por defecto libre

                          if (estaBloqueada) {
                            estadoFinal = "Bloqueada";
                            colorClass = "bg-dark text-white";
                          } else if (reserva) {
                            estadoFinal = reserva.estado;
                            colorClass = getEstadoColor(reserva.estado);
                          }

                          return (
                            <td
                              key={i}
                              className={`celda-planning ${colorClass}`}
                              // Tooltip con información de la reserva o estado de bloqueo
                              title={
                                estadoFinal === "Bloqueada"
                                  ? `Habitación bloqueada\nFecha: ${formatearFecha(
                                      fecha
                                    )}`
                                  : reserva
                                  ? `Reserva nº: ${reserva.id_reserva}\n` +
                                    `Huésped: ${reserva.nombre_huesped || ""} ${
                                      reserva.primer_apellido_huesped || ""
                                    } ${
                                      reserva.segundo_apellido_huesped || ""
                                    }\n` +
                                    `Entrada: ${formatearFecha(
                                      reserva.fecha_entrada
                                    )}\n` +
                                    `Salida: ${formatearFecha(
                                      reserva.fecha_salida
                                    )}\n` +
                                    `Estado: ${reserva.estado}`
                                  : ""
                              }
                            >
                              {/* Muestra el nombre del huésped si hay reserva, o "BLOQUEADA" si está bloqueada */}
                              {estadoFinal === "Bloqueada"
                                ? "BLOQUEADA"
                                : reserva
                                ? `${reserva.nombre_huesped} ${
                                    reserva.primer_apellido_huesped
                                  } ${reserva.segundo_apellido_huesped || ""}`
                                : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
