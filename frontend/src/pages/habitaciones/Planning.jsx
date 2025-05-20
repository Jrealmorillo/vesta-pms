// Página de planificación visual de ocupación de habitaciones en el hotel.
// Permite seleccionar una fecha de inicio y muestra el estado de cada habitación durante 15 días.
// Incluye leyenda de colores para interpretar el estado de cada celda.

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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

  // Token de autenticación para las peticiones
  const token = localStorage.getItem("token");

  // Array de fechas a mostrar (15 días a partir de la fecha de inicio)
  const fechas = Array.from({ length: 15 }, (_, i) => addDays(fechaInicio, i));

  // Carga la lista de habitaciones al montar el componente
  useEffect(() => {
    cargarHabitaciones();
  }, []);

  // Carga las reservas cada vez que cambia la fecha de inicio
  useEffect(() => {
    cargarReservas();
  }, []);

  // Obtiene habitaciones desde la API
  const cargarHabitaciones = async () => {
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
  };

  // Obtiene reservas para el rango de fechas mostrado
  const cargarReservas = async () => {
    const desde = formatearFechaInput(fechaInicio);
    const hasta = formatearFechaInput(addDays(fechaInicio, 15));

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/reservas/planning?desde=${desde}&hasta=${hasta}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReservas(res.data);
    } catch (error) {
      console.error("Error al cargar reservas para el planning");
    }
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
    <div className="container py-5 mt-4">
      <h3>Planning de habitaciones</h3>
      {/* Selector de fecha de inicio para el planning */}
      <div className="col-3 mb-3 text-start">
        <label className="form-label">Selecciona la fecha de inicio</label>
        <input
          type="date"
          className="form-control w-auto"
          value={formatearFechaInput(fechaInicio)}
          onChange={(e) => setFechaInicio(new Date(e.target.value))}
        />
      </div>
      {/* Leyenda de colores para interpretar el estado de las habitaciones */}
      <h5 className="text-start mt-5 mb-2">Leyenda de colores</h5>
      <div className="d-flex flex-wrap gap-3 mb-5">
        <div className="d-flex align-items-center">
          <div className="cuadro-color bg-success-subtle me-2"></div>
          <span>Libre</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="cuadro-color bg-primary me-2"></div>
          <span>Ocupada</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="cuadro-color bg-warning me-2"></div>
          <span>Asignada</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="cuadro-color bg-dark me-2"></div>
          <span>Bloqueada</span>
        </div>
      </div>

      {/* Tabla principal de planificación: filas = habitaciones, columnas = días */}
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
                <td className="celda-planning">{hab.numero_habitacion}</td>
                {fechas.map((fecha, i) => {
                  // Busca si la habitación está reservada en la fecha
                  const reserva = getReservaEnFecha(hab, fecha);
                  return (
                    <td
                      key={i}
                      className={`celda-planning ${
                        reserva
                          ? getEstadoColor(reserva.estado)
                          : "bg-success-subtle"
                      }`}
                      // Tooltip con información de la reserva si existe
                      title={
                        reserva
                          ? `Reserva nº: ${reserva.id_reserva}\n` +
                            `Huésped: ${reserva.nombre_huesped || ""} ${
                              reserva.primer_apellido_huesped || ""
                            } ${reserva.segundo_apellido_huesped || ""}\n` +
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
                      {/* Muestra el nombre del huésped si hay reserva */}
                      {reserva
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
  );
};

export default Planning;
