import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CalendarioOcupacion = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datosOcupacion, setDatosOcupacion] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Inicializar fechas con el mes actual
  useEffect(() => {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const fechaInicioFormateada = formatearFecha(primerDia);
    const fechaFinFormateada = formatearFecha(ultimoDia);

    setFechaInicio(fechaInicioFormateada);
    setFechaFin(fechaFinFormateada);
  }, []);

  // Funciones para manejar cambios de fecha
  const manejarCambioFechaInicio = (e) => {
    const nuevaFecha = e.target.value;
    if (nuevaFecha) {
      setFechaInicio(nuevaFecha);
    }
  };

  const manejarCambioFechaFin = (e) => {
    const nuevaFecha = e.target.value;
    if (nuevaFecha) {
      setFechaFin(nuevaFecha);
    }
  };

  const formatearFecha = (fecha) => {
    return fecha.toISOString().split("T")[0];
  };
  const obtenerDatosOcupacion = useCallback(async () => {
    if (!fechaInicio || !fechaFin) {
      toast.warning("Debes seleccionar las fechas de inicio y fin");
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.warning("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/informes/ocupacion`,
        {
          params: {
            desde: fechaInicio,
            hasta: fechaFin,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDatosOcupacion(data);
    } catch (error) {
      console.error("Error al obtener datos de ocupación:", error);
      toast.error(
        `Error al obtener datos de ocupación: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, token]);

  // Cargar datos automáticamente cuando cambien las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      obtenerDatosOcupacion();
    }
  }, [fechaInicio, fechaFin, obtenerDatosOcupacion]);

  const obtenerColorOcupacion = (porcentaje) => {
    if (porcentaje > 100) return "bg-danger text-white";
    if (porcentaje >= 90) return "bg-warning text-dark";
    if (porcentaje >= 70) return "bg-primary text-white";
    if (porcentaje >= 40) return "bg-secondary text-white";
    return "bg-light text-dark";
  };

  const generarCalendario = () => {
    // Siempre generar calendario si hay fechas válidas
    if (!fechaInicio || !fechaFin) return null;

    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    const diasEnPeriodo =
      Math.ceil((fechaFinObj - fechaInicioObj) / (1000 * 60 * 60 * 24)) + 1;

    // Crear array de días para el calendario
    const dias = [];
    for (let i = 0; i < diasEnPeriodo; i++) {
      const fecha = new Date(fechaInicioObj);
      fecha.setDate(fecha.getDate() + i);

      const fechaStr = formatearFecha(fecha);
      const datosDia = datosOcupacion[fechaStr] || {
        habitaciones_ocupadas: 0,
        habitaciones_disponibles: 0,
        porcentaje_ocupacion: 0,
        adultos: 0,
        ninos: 0,
        huespedes: 0,
      };

      dias.push({
        fecha: fecha,
        fechaStr: fechaStr,
        datos: {
          ...datosDia,
          total_habitaciones: datosDia.habitaciones_disponibles || 0,
        },
      });
    }

    // Generar calendario mensual por semanas
    const semanas = [];
    let semanaActual = [];

    // Añadir días vacíos al inicio si es necesario
    const primerDia = dias[0]?.fecha.getDay() || 0;
    for (let i = 0; i < primerDia; i++) {
      semanaActual.push(null);
    }

    dias.forEach((dia) => {
      semanaActual.push(dia);
      if (semanaActual.length === 7) {
        semanas.push(semanaActual);
        semanaActual = [];
      }
    });

    // Completar última semana si es necesario
    while (semanaActual.length < 7 && semanaActual.length > 0) {
      semanaActual.push(null);
    }
    if (semanaActual.length > 0) {
      semanas.push(semanaActual);
    }

    return semanas;
  };
  const semanas = generarCalendario();
  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar3 fs-2 text-primary me-3"></i>
                <div>
                  <h2 className="mb-1">Calendario de Ocupación</h2>
                  <p className="text-muted mb-0">Visualiza el porcentaje de ocupación por fechas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controles de fechas */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    <i className="bi bi-calendar-date me-2"></i>
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    className="form-control rounded"
                    value={fechaInicio}
                    onChange={manejarCambioFechaInicio}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    <i className="bi bi-calendar-date-fill me-2"></i>
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    className="form-control rounded"                    value={fechaFin}
                    onChange={manejarCambioFechaFin}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={obtenerDatosOcupacion}
                    disabled={loading}
                  >
                    <i className="bi bi-search me-2"></i>
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-info-circle text-primary me-2"></i>
                Leyenda de Ocupación
              </h6>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <span className="badge bg-light text-dark fs-6">0-39%: Baja</span>
                <span className="badge bg-secondary text-white fs-6">40-69%: Media</span>
                <span className="badge bg-primary text-white fs-6">70-89%: Alta</span>
                <span className="badge bg-warning text-dark fs-6">90-100%: Muy alta</span>
                <span className="badge bg-danger text-white fs-6">+100%: Overbooking</span>
              </div>
            </div>
          </div>          {/* Loading */}
          {loading && (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h4 className="text-muted mt-3">Cargando datos de ocupación...</h4>
                <p className="text-muted">Por favor espera un momento</p>
              </div>
            </div>
          )}

          {/* Calendario */}
          {!loading && semanas && semanas.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr className="table-light">
                    <th className="text-center">Dom</th>
                    <th className="text-center">Lun</th>
                    <th className="text-center">Mar</th>
                    <th className="text-center">Mié</th>
                    <th className="text-center">Jue</th>
                    <th className="text-center">Vie</th>
                    <th className="text-center">Sáb</th>
                  </tr>
                </thead>
                <tbody>
                  {semanas.map((semana, indexSemana) => (
                    <tr key={indexSemana}>
                      {semana.map((dia, indexDia) => (
                        <td
                          key={indexDia}
                          className="p-1"
                          style={{
                            height: "100px",
                            width: "14.28%",
                          }}
                        >
                          {dia ? (
                            <div
                              className={`h-100 p-2 rounded ${obtenerColorOcupacion(
                                dia.datos.porcentaje_ocupacion
                              )}`}
                              style={{ cursor: "pointer" }}
                              title={`${dia.fecha.getDate()}/${
                                dia.fecha.getMonth() + 1
                              } - ${
                                dia.datos.porcentaje_ocupacion
                              }% ocupación\nHuéspedes: ${
                                dia.datos.huespedes || 0
                              }\nAdultos: ${dia.datos.adultos || 0}, Niños: ${
                                dia.datos.ninos || 0
                              }`}
                            >
                              <div className="fw-bold">
                                {dia.fecha.getDate()}/{dia.fecha.getMonth() + 1}
                              </div>
                              <div className="small">
                                {dia.datos.habitaciones_ocupadas}/
                                {dia.datos.total_habitaciones}
                              </div>
                              <div className="small">
                                {dia.datos.porcentaje_ocupacion}%
                              </div>
                            </div>
                          ) : (
                            <div className="h-100"></div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Estadísticas del período */}
      {!loading && fechaInicio && fechaFin && (
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">Ocupación Media</h5>
                <h3 className="card-text">
                  {Object.values(datosOcupacion).length > 0
                    ? (
                        Object.values(datosOcupacion).reduce(
                          (sum, d) => sum + (d.porcentaje_ocupacion || 0),
                          0
                        ) / Object.values(datosOcupacion).length
                      ).toFixed(1)
                    : 0}
                  %
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">Días con +70%</h5>
                <h3 className="card-text">
                  {
                    Object.values(datosOcupacion).filter(
                      (d) => (d.porcentaje_ocupacion || 0) >= 70
                    ).length
                  }
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-warning">Ocupación Máxima</h5>
                <h3 className="card-text">
                  {Object.values(datosOcupacion).length > 0
                    ? Math.max(
                        ...Object.values(datosOcupacion).map(
                          (d) => d.porcentaje_ocupacion || 0
                        )
                      ).toFixed(1)
                    : 0}
                  %
                </h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">Ocupación Mínima</h5>
                <h3 className="card-text">
                  {Object.values(datosOcupacion).length > 0
                    ? Math.min(
                        ...Object.values(datosOcupacion).map(
                          (d) => d.porcentaje_ocupacion || 0
                        )
                      ).toFixed(1)
                    : 0}
                  %
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Tabla detallada */}
      {!loading && Object.keys(datosOcupacion).length > 0 && (
        <div className="mt-4">
          <h5>Detalle por Día</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Habitaciones Ocupadas</th>
                  <th>Total Habitaciones</th>
                  <th>% Ocupación</th>
                  <th>Huéspedes</th>
                  <th>Adultos</th>
                  <th>Niños</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(datosOcupacion).map(([fecha, datos]) => (
                  <tr key={fecha}>
                    <td>
                      {new Date(fecha).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </td>
                    <td>{datos.habitaciones_ocupadas || 0}</td>
                    <td>{datos.habitaciones_disponibles || 0}</td>
                    <td>
                      <span
                        className={`badge ${obtenerColorOcupacion(
                          datos.porcentaje_ocupacion || 0
                        )}`}
                      >
                        {datos.porcentaje_ocupacion || 0}%
                      </span>
                    </td>
                    <td>{datos.huespedes || 0}</td>
                    <td>{datos.adultos || 0}</td>
                    <td>{datos.ninos || 0}</td>
                  </tr>
                ))}              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
    </div>
  );
};

export default CalendarioOcupacion;
