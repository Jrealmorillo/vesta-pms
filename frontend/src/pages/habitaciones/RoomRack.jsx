import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./RoomRack.css";


const RoomRack = () => {
  const { token } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [habitaciones, setHabitaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cargado, setCargado] = useState(false);


  useEffect(() => {
    if (cargado) {
      localStorage.setItem("estadoHabitaciones", JSON.stringify(estados));
    }
  }, [estados, cargado]);
  

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

          // Validar que las habitaciones actuales existan en el estado guardado
          const sincronizado = response.data.map((habitacion) => {
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
          const inicial = response.data.map((habitacion) => ({
            numero: habitacion.numero_habitacion,
            tipo: habitacion.tipo,
            limpieza: "limpia",
            ocupacion: "libre",
          }));

          setEstados(inicial);
          setCargado(true);
        }
        setHabitaciones(response.data);
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
      }
    };

    cargarHabitaciones();
  }, [token]);

  const cambiarEstado = (numero, tipo, nuevoValor) => {
    setEstados((prev) =>
      prev.map((hab) =>
        hab.numero === numero ? { ...hab, [tipo]: nuevoValor } : hab
      )
    );
  };

  const renderHabitacion = (estado) => {
    const claseFondo = `fondo-${estado.ocupacion}`;
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

        {/* Selector de limpieza */}
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

        {/* Selector de bloqueo */}
        <select
          value={estado.ocupacion === "bloqueada" ? "bloqueada" : "normal"}
          onChange={(e) => {
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
      <div className="roomrack-container">
        {estados.map((estado) => renderHabitacion(estado))}
      </div>
      <hr className="my-4" />

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
}

export default RoomRack;
