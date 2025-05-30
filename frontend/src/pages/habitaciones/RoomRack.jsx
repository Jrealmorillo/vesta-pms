/* eslint-disable no-unused-vars */
// Página visual para gestión rápida del estado de habitaciones (ocupación y limpieza).
// Permite cambiar el estado de limpieza y bloqueo de cada habitación, mostrando colores y estilos según el estado.
// El estado se sincroniza con localStorage para persistencia temporal.

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./RoomRack.css";

// Componente principal RoomRack
const RoomRack = () => {
  const { token } = useContext(AuthContext);
  // Estado de habitaciones (datos originales) y estados visuales (ocupación/limpieza)
  const [habitaciones, setHabitaciones] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [habitacionesAsignadas, setHabitacionesAsignadas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]); // Nuevo estado para manejar bloqueos con fechas
  const [mostrarModalBloqueo, setMostrarModalBloqueo] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null); // Sincroniza el estado visual con localStorage cada vez que cambia
  useEffect(() => {
    if (cargado) {
      localStorage.setItem("estadoHabitaciones", JSON.stringify(estados));
      localStorage.setItem("bloqueosHabitaciones", JSON.stringify(bloqueos));
      // Dispara evento personalizado para notificar a otros componentes
      window.dispatchEvent(new CustomEvent("estadoHabitacionesChanged"));
    }
  }, [estados, bloqueos, cargado]);
  // Carga habitaciones desde la API y sincroniza con localStorage si existe
  useEffect(() => {
    const cargarHabitaciones = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/habitaciones`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const guardado = localStorage.getItem("estadoHabitaciones");
        const bloqueosGuardados = localStorage.getItem("bloqueosHabitaciones");

        // Cargar bloqueos guardados
        if (bloqueosGuardados) {
          setBloqueos(JSON.parse(bloqueosGuardados));
        }

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
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/asignadas`,
          {
            params: {
              desde: hoy,
              hasta: mañana.toISOString().split("T")[0],
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }        );        const asignadas = res.data.map((r) => r.numero_habitacion);
        setHabitacionesAsignadas(asignadas);
      } catch (error) {
        console.error("Error al obtener habitaciones asignadas:", error);
      }
    };

    cargarAsignadas();
  }, [token]);
  // Cambia el estado de limpieza u ocupación de una habitación
  const cambiarEstado = (numero, tipo, nuevoValor) => {
    setEstados((prev) =>
      prev.map((hab) =>
        hab.numero === numero ? { ...hab, [tipo]: nuevoValor } : hab
      )
    );
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

  // Obtiene el estado de ocupación considerando bloqueos con fecha
  const getEstadoOcupacion = (numeroHabitacion, fecha = new Date()) => {
    const estado = estados.find((e) => e.numero === numeroHabitacion);
    if (!estado) return "libre";

    if (estaBloqueda(numeroHabitacion, fecha)) {
      return "bloqueada";
    }

    return estado.ocupacion;
  };

  // Abre el modal para bloquear una habitación
  const abrirModalBloqueo = (numeroHabitacion) => {
    setHabitacionSeleccionada(numeroHabitacion);
    setMostrarModalBloqueo(true);
  };

  // Bloquea una habitación en un rango de fechas
  const bloquearHabitacion = (numeroHabitacion, fechaInicio, fechaFin) => {
    const nuevoBloqueo = {
      id: Date.now(), // ID temporal
      numero_habitacion: numeroHabitacion,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      motivo: "Bloqueo manual",
    };

    setBloqueos((prev) => [...prev, nuevoBloqueo]);
    setMostrarModalBloqueo(false);
  };

  // Elimina bloqueos de una habitación
  const eliminarBloqueo = (bloqueoId) => {
    setBloqueos((prev) => prev.filter((b) => b.id !== bloqueoId));
  };  // Renderiza la tarjeta visual de cada habitación
  const renderHabitacion = (estado) => {
    // Determina clases CSS según estado de ocupación y limpieza
    const hoy = new Date().toISOString().split("T")[0];
    const estadoOcupacionHoy = getEstadoOcupacion(estado.numero, hoy);    // Determinar clase de fondo con la prioridad correcta
    let claseFondo;
    if (estadoOcupacionHoy === "bloqueada") {
      // Las habitaciones bloqueadas tienen máxima prioridad (fondo negro)
      claseFondo = "fondo-bloqueada";    } else if (estadoOcupacionHoy === "libre" && habitacionesAsignadas.includes(estado.numero)) {
      // Las habitaciones libres pero asignadas para hoy (fondo amarillo)
      claseFondo = "fondo-asignada";
    } else {
      // Estados normales: ocupada (azul) o libre (blanco)
      claseFondo = `fondo-${estadoOcupacionHoy}`;
    }
    
    const claseTexto = `texto-${estado.limpieza}`;

    // Obtener bloqueos activos para esta habitación
    const bloqueosActivos = bloqueos.filter(
      (b) =>
        b.numero_habitacion === estado.numero &&
        new Date(b.fecha_fin) >= new Date(hoy)
    );

    return (
      <div
        key={estado.numero}
        className={`roomrack-card ${claseFondo} ${claseTexto}`}
      >
        <div>{estado.numero}</div>
        <div style={{ fontSize: "0.75rem" }}>{estado.tipo}</div>
        <div style={{ fontSize: "0.8rem" }}>
          {estadoOcupacionHoy} / {estado.limpieza}
        </div>

        {/* Mostrar bloqueos activos */}
        {bloqueosActivos.length > 0 && (
          <div
            style={{ fontSize: "0.7rem", color: "red", marginTop: "0.2rem" }}
          >
            Bloqueada hasta:{" "}
            {new Date(
              Math.max(...bloqueosActivos.map((b) => new Date(b.fecha_fin)))
            ).toLocaleDateString()}
          </div>
        )}

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

        {/* Botones de gestión de bloqueos */}
        <div style={{ marginTop: "0.5rem" }}>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => abrirModalBloqueo(estado.numero)}
            style={{ fontSize: "0.7rem", marginRight: "0.2rem" }}
          >
            Bloquear
          </button>
          {bloqueosActivos.length > 0 && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                bloqueosActivos.forEach((b) => eliminarBloqueo(b.id));
              }}
              style={{ fontSize: "0.7rem" }}
            >
              Desbloquear
            </button>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-grid-3x3-gap fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Room Rack</h2>
                  <p className="text-muted mb-0">
                    Estado visual de habitaciones en tiempo real
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Habitaciones Grid */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="roomrack-container">
                {estados.map((estado) => renderHabitacion(estado))}
              </div>
            </div>
          </div>
          {/* Leyenda */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-palette text-primary me-2"></i>
                Leyenda de Estados
              </h6>
              <div className="d-flex flex-wrap gap-4">
                <div className="d-flex align-items-center">
                  <div className="cuadro-color fondo-libre me-2"></div>
                  <span className="fw-medium">Libre</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="cuadro-color fondo-ocupada me-2"></div>
                  <span className="fw-medium">Ocupada</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="cuadro-color fondo-asignada me-2"></div>
                  <span className="fw-medium">Asignada</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="cuadro-color fondo-bloqueada me-2"></div>
                  <span className="fw-medium">Bloqueada</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="cuadro-color"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <span className="texto-limpia">A</span>
                  </div>
                  <span className="ms-2 fw-medium">Limpia (texto verde)</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="cuadro-color"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <span className="texto-sucia">A</span>
                  </div>
                  <span className="ms-2 fw-medium">Sucia (texto rojo)</span>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Modal para bloquear habitación */}
          {mostrarModalBloqueo && (
            <ModalBloqueoHabitacion
              numeroHabitacion={habitacionSeleccionada}
              onBloquear={bloquearHabitacion}
              onCerrar={() => setMostrarModalBloqueo(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Componente Modal para bloquear habitación
const ModalBloqueoHabitacion = ({ numeroHabitacion, onBloquear, onCerrar }) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [motivo, setMotivo] = useState("");
  const manejarBloqueo = () => {
    if (!fechaInicio || !fechaFin) {
      toast.warning("Por favor, selecciona fechas de inicio y fin");
      return;
    }

    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      toast.error(
        "La fecha de fin de bloqueo debe ser posterior a la fecha de inicio"
      );
      return;
    }

    onBloquear(numeroHabitacion, fechaInicio, fechaFin, motivo);
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Bloquear Habitación {numeroHabitacion}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCerrar}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Fecha de inicio</label>
              <input
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha de fin</label>
              <input
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={fechaInicio || new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Motivo (opcional)</label>
              <input
                type="text"
                className="form-control"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Mantenimiento, Renovación..."
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCerrar}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={manejarBloqueo}
            >
              Bloquear Habitación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomRack;
