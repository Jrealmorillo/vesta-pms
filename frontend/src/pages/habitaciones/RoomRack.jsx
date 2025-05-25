/* eslint-disable no-unused-vars */
// Página visual para gestión rápida del estado de habitaciones (ocupación y limpieza).
// Permite cambiar el estado de limpieza y bloqueo de cada habitación, mostrando colores y estilos según el estado.
// El estado se sincroniza con localStorage para persistencia temporal.

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./RoomRack.css";

// Componente principal RoomRack
const RoomRack = () => {
  const { token } = useContext(AuthContext);
  // Estado de habitaciones (datos originales) y estados visuales (ocupación/limpieza)
  const [habitaciones, setHabitaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [habitacionesAsignadas, setHabitacionesAsignadas] = useState([]);

  // Sincroniza el estado visual con localStorage cada vez que cambia
  useEffect(() => {
    if (cargado) {
      localStorage.setItem("estadoHabitaciones", JSON.stringify(estados));
    }
  }, [estados, cargado]);

  // Carga habitaciones desde la API y sincroniza con localStorage si existe
  useEffect(() => {
    const cargarHabitaciones = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/habitaciones`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const guardado = localStorage.getItem("estadoHabitaciones");

        if (guardado) {
          const estadosGuardados = JSON.parse(guardado);

          // Sincroniza el estado guardado solo con habitaciones existentes
          const sincronizado = response.data.habitaciones.map((habitacion) => {
            const encontrado = estadosGuardados.find(
              (e) => e.numero === habitacion.numero_habitacion
            );

            return {
              numero: habitacion.numero_habitacion,
              tipo: habitacion.tipo,
              limpieza: encontrado?.limpieza || "limpia",
              ocupacion: encontrado?.ocupacion || "libre",
            };
          });

          setEstados(sincronizado);
          setCargado(true);
        } else {
          // Estado inicial: todas limpias y libres
          const inicial = response.data.habitaciones.map((habitacion) => ({
            numero: habitacion.numero_habitacion,
            tipo: habitacion.tipo,
            limpieza: "limpia",
            ocupacion: "libre",
          }));

          setEstados(inicial);
          setCargado(true);
        }
        setHabitaciones(response.data.habitaciones);
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
      }
    };

    cargarHabitaciones();
  }, [token]);

  useEffect(() => {
    const cargarAsignadas = async () => {
      const hoy = new Date().toISOString().split("T")[0];
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/asignadas`,
          {
            params: {
              desde: hoy,
              hasta: hoy,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const asignadas = res.data.map((r) => r.numero_habitacion);
        setHabitacionesAsignadas(asignadas);
      } catch (error) {
        console.error("Error al obtener habitaciones asignadas:", error);
      }
    };

    cargarAsignadas();
  }, []);

  // Cambia el estado de limpieza u ocupación de una habitación
  const cambiarEstado = (numero, tipo, nuevoValor) => {
    setEstados((prev) =>
      prev.map((hab) =>
        hab.numero === numero ? { ...hab, [tipo]: nuevoValor } : hab
      )
    );
  };

  // Renderiza la tarjeta visual de cada habitación
  const renderHabitacion = (estado) => {
    // Determina clases CSS según estado de ocupación y limpieza
    const esAsignada =
      estado.ocupacion === "libre" &&
      habitacionesAsignadas.includes(estado.numero);

    const claseFondo = esAsignada
      ? "fondo-asignada"
      : `fondo-${estado.ocupacion}`;
    const claseTexto = `texto-${estado.limpieza}`;

    return (
      <div
        key={estado.numero}
        className={`roomrack-card ${claseFondo} ${claseTexto}`}
      >
        <div>{estado.numero}</div>
        <div style={{ fontSize: "0.75rem" }}>{estado.tipo}</div>
        <div style={{ fontSize: "0.8rem" }}>
          {estado.ocupacion} / {estado.limpieza}
        </div>

        {/* Selector de limpieza: permite marcar la habitación como limpia o sucia */}
        <select
          value={estado.limpieza}
          onChange={(e) =>
            cambiarEstado(estado.numero, "limpieza", e.target.value)
          }
          style={{ marginTop: "0.5rem" }}
        >
          <option value="limpia">Limpia</option>
          <option value="sucia">Sucia</option>
        </select>

        {/* Selector de bloqueo: permite marcar la habitación como bloqueada o disponible */}
        <select
          value={estado.ocupacion === "bloqueada" ? "bloqueada" : "normal"}
          onChange={(e) => {
            // Si se selecciona 'bloqueada', se marca como tal; si no, vuelve a 'libre'
            const nuevaOcupacion =
              e.target.value === "bloqueada" ? "bloqueada" : "libre";
            cambiarEstado(estado.numero, "ocupacion", nuevaOcupacion);
          }}
          style={{ marginTop: "0.5rem" }}
        >
          <option value="normal">Disponible</option>
          <option value="bloqueada">Bloqueada</option>
        </select>
      </div>
    );
  };

  return (
    <div className="container py-5 mt-4">
      <h2 className="mb-3">Room Rack – Estado de Habitaciones</h2>
      {/* Muestra todas las habitaciones como tarjetas visuales */}
      <div className="roomrack-container">
        {estados.map((estado) => renderHabitacion(estado))}
      </div>
      <hr className="my-4" />

      {/* Leyenda de colores y estilos para interpretar el estado de cada habitación */}
      <h5>Leyenda de colores</h5>
      <div className="d-flex flex-wrap gap-3">
        <div className="d-flex align-items-center">
          <div className="cuadro-color fondo-libre me-2"></div>
          <span>Libre</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="cuadro-color fondo-ocupada me-2"></div>
          <span>Ocupada</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="cuadro-color fondo-asignada me-2"></div>
          <span>Asignada</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="cuadro-color fondo-bloqueada me-2"></div>
          <span>Bloqueada</span>
        </div>
        <div className="d-flex align-items-center">
          <div
            className="cuadro-color"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="texto-limpia">A</span>
          </div>
          <span className="ms-2">Limpia (texto verde)</span>
        </div>
        <div className="d-flex align-items-center">
          <div
            className="cuadro-color"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="texto-sucia">A</span>
          </div>
          <span className="ms-2">Sucia (texto rojo)</span>
        </div>
      </div>
    </div>
  );
};

export default RoomRack;
