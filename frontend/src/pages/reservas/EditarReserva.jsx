/* eslint-disable no-unused-vars */
// Página para editar una reserva existente y sus líneas asociadas.
// Permite modificar datos del huésped, fechas, habitación, observaciones, cliente/empresa y líneas de reserva.
// Incluye gestión de líneas (añadir, editar, eliminar) y guardado de cambios en la API.

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const EditarReserva = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [reserva, setReserva] = useState({});
  const [lineas, setLineas] = useState([]);

  // Carga los datos de la reserva y sus líneas al montar el componente
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Solicita datos de la reserva
        const { data: datosReserva } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReserva(datosReserva);

        // Verificar si la reserva está anulada
        if (datosReserva.estado === "Anulada") {
          toast.warning(
            "Esta reserva está anulada y no se puede modificar. Debe recuperarla primero para poder editarla.",
            { autoClose: 8000 }
          );
        }

        // Solicita líneas asociadas a la reserva
        const { data: datosLineas } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLineas(datosLineas);
      } catch (error) {
        toast.error(
          `Error al cargar la reserva: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    };

    obtenerDatos();
  }, [id, token]);
  // Maneja cambios en los campos de la reserva principal
  const manejarCambio = (e) => {
    if (reserva.estado === "Anulada") {
      toast.error(
        "No se puede modificar una reserva anulada. Debe recuperarla primero."
      );
      return;
    }
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };
  // Maneja cambios en los campos de una línea de reserva
  const manejarCambioLinea = (index, campo, valor) => {
    if (reserva.estado === "Anulada") {
      toast.error(
        "No se puede modificar una reserva anulada. Debe recuperarla primero."
      );
      return;
    }
    const nuevasLineas = [...lineas];
    nuevasLineas[index][campo] = valor;
    setLineas(nuevasLineas);
  };
  // Añade una nueva línea de reserva vacía
  const añadirLinea = () => {
    if (reserva.estado === "Anulada") {
      toast.error(
        "No se puede modificar una reserva anulada. Debe recuperarla primero."
      );
      return;
    }
    const nuevaLinea = {
      fecha: "",
      tipo_habitacion: "",
      regimen: "Solo Alojamiento",
      cantidad_habitaciones: 1,
      cantidad_adultos: 1,
      cantidad_ninos: 0,
      precio: 0,
    };
    setLineas([...lineas, nuevaLinea]);
  };
  // Elimina una línea de reserva (pide confirmación si ya existe en la base de datos)
  const eliminarLinea = async (linea) => {
    if (reserva.estado === "Anulada") {
      toast.error(
        "No se puede modificar una reserva anulada. Debe recuperarla primero."
      );
      return;
    }

    const idLinea = linea.id_linea_reserva;
    if (!idLinea) {
      // Es una línea nueva no guardada aún
      setLineas(lineas.filter((l) => l !== linea));
      return;
    }

    const resultado = await Swal.fire({
      title: "¿Eliminar línea de reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (resultado.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${idLinea}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLineas(lineas.filter((l) => l.id_linea_reserva !== idLinea));
        toast.success("Línea eliminada correctamente");
      } catch (error) {
        toast.error(
          `Error al eliminar la línea: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    }
  };
  // Guarda los cambios de la reserva y sus líneas en la API
  const guardarCambios = async () => {
    if (reserva.estado === "Anulada") {
      toast.error(
        "No se puede guardar una reserva anulada. Debe recuperarla primero para poder modificarla."
      );
      return;
    }

    try {
      const { estado, ...reservaSinEstado } = reserva;
      // Validar que todas las líneas están dentro del rango de fechas
      const entrada = new Date(reserva.fecha_entrada);
      const salida = new Date(reserva.fecha_salida);
      const lineasFueraDeRango = lineas.filter((linea) => {
        const fechaLinea = new Date(linea.fecha);
        return fechaLinea < entrada || fechaLinea >= salida;
      });
      if (lineasFueraDeRango.length > 0) {
        toast.error(
          "Hay líneas de reserva cuyas fechas no coinciden con el rango de la estancia. Corrige las fechas de las líneas antes de guardar."
        );
        return;
      }

      // Validar que todas las fechas del rango están cubiertas por líneas
      const diasEstancia = [];
      for (let d = new Date(entrada); d < salida; d.setDate(d.getDate() + 1)) {
        diasEstancia.push(new Date(d).toISOString().slice(0, 10));
      }
      const fechasLineas = lineas.map((l) => l.fecha);
      const fechasFaltantes = diasEstancia.filter(
        (dia) => !fechasLineas.includes(dia)
      );
      if (fechasFaltantes.length > 0) {
        toast.error(
          "Faltan líneas de reserva para las siguientes fechas: " +
            fechasFaltantes.join(", ")
        );
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id}`,
        reservaSinEstado,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Recargar las líneas actuales desde el backend (las que siguen existiendo tras el cambio de fechas)
      const { data: lineasActualesBackend } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Eliminar en backend las líneas que ya no están en el frontend
      for (const lineaBackend of lineasActualesBackend) {
        const existeEnFrontend = lineas.find(
          (l) => l.id_linea_reserva === lineaBackend.id_linea_reserva
        );
        if (!existeEnFrontend) {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${
              lineaBackend.id_linea_reserva
            }`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // Actualizar o crear las líneas que están en el frontend
      for (const linea of lineas) {
        if (linea.id_linea_reserva) {
          const existeEnBackend = lineasActualesBackend.find(
            (l) => l.id_linea_reserva === linea.id_linea_reserva
          );
          if (existeEnBackend) {
            // Actualizar línea existente
            await axios.put(
              `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${
                linea.id_linea_reserva
              }`,
              linea,
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } else {
            // Si la línea no existe en backend, la creamos (POST)
            await axios.post(
              `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
              linea,
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        } else {
          // Crear línea nueva
          await axios.post(
            `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
            linea,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      toast.success(`Reserva ${id} modificada correctamente`);
      // recargar datos para reflejar el estado real
      const { data: datosLineasFinal } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLineas(datosLineasFinal);

      // Recargar la reserva para actualizar el importe total
      const { data: datosReservaFinal } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReserva(datosReservaFinal);
    } catch (error) {
      toast.error(
        `Error al modificar la reserva: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };
  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "1100px" }}>
      {/* Header con información principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h1 className="h3 mb-2 text-dark">Editar Reserva #{id}</h1>
                  <p className="text-muted mb-0">
                    Modificar datos de la reserva y líneas asociadas
                  </p>
                </div>
                <div>
                  <span
                    className={`badge fs-6 px-3 py-2 ${
                      reserva.estado === "Anulada"
                        ? "bg-danger"
                        : reserva.estado === "Confirmada"
                        ? "bg-success"
                        : reserva.estado === "Check-in"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                    style={{ borderRadius: "20px" }}
                  >
                    {reserva.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Formulario de datos principales */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            {" "}
            <div className="card-header bg-light border-0 py-3">
              <h5 className="mb-0 fw-semibold text-dark">
                Datos principales de la reserva
                {reserva.estado === "Anulada" && (
                  <span className="badge bg-warning text-dark ms-2">
                    <i className="bi bi-lock-fill me-1"></i>
                    Reserva bloqueada - Estado: Anulada
                  </span>
                )}
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Nombre huésped
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      reserva.estado === "Anulada" ? "bg-light" : ""
                    }`}
                    name="nombre_huesped"
                    value={reserva.nombre_huesped || ""}
                    onChange={manejarCambio}
                    disabled={reserva.estado === "Anulada"}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Primer apellido
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      reserva.estado === "Anulada" ? "bg-light" : ""
                    }`}
                    name="primer_apellido_huesped"
                    value={reserva.primer_apellido_huesped || ""}
                    onChange={manejarCambio}
                    disabled={reserva.estado === "Anulada"}
                  />
                </div>{" "}
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Segundo apellido
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      reserva.estado === "Anulada" ? "bg-light" : ""
                    }`}
                    name="segundo_apellido_huesped"
                    value={reserva.segundo_apellido_huesped || ""}
                    onChange={manejarCambio}
                    disabled={reserva.estado === "Anulada"}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Fecha entrada
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      reserva.estado === "Anulada" ? "bg-light" : ""
                    }`}
                    name="fecha_entrada"
                    value={reserva.fecha_entrada || ""}
                    onChange={manejarCambio}
                    disabled={reserva.estado === "Anulada"}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Fecha salida
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      reserva.estado === "Anulada" ? "bg-light" : ""
                    }`}
                    name="fecha_salida"
                    value={reserva.fecha_salida || ""}
                    onChange={manejarCambio}
                    disabled={reserva.estado === "Anulada"}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Nº Habitación
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      reserva.estado === "Anulada" ? "bg-light" : ""
                    }`}
                    name="numero_habitacion"
                    value={reserva.numero_habitacion || ""}
                    onChange={manejarCambio}
                    disabled={reserva.estado === "Anulada"}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    Importe total (€)
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={reserva.precio_total || 0}
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    ID Cliente
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="id_cliente"
                    value={reserva.id_cliente || ""}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">
                    ID Empresa
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="id_empresa"
                    value={reserva.id_empresa || ""}
                    onChange={manejarCambio}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small mb-1">
                    Observaciones
                  </label>
                  <textarea
                    className="form-control"
                    name="observaciones"
                    rows="3"
                    value={reserva.observaciones || ""}
                    onChange={manejarCambio}
                    placeholder="Observaciones adicionales sobre la reserva..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Líneas de reserva */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold text-dark">Líneas de Reserva</h5>
              <button
                className="btn btn-primary btn-sm px-3"
                onClick={añadirLinea}
                style={{ borderRadius: "15px" }}
              >
                + Añadir línea
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="fw-semibold text-muted">Fecha</th>
                    <th className="fw-semibold text-muted">Tipo</th>
                    <th className="fw-semibold text-muted">Régimen</th>
                    <th className="fw-semibold text-muted text-center">Hab.</th>
                    <th className="fw-semibold text-muted text-center">Ad.</th>
                    <th className="fw-semibold text-muted text-center">Ni.</th>
                    <th className="fw-semibold text-muted text-end">Precio</th>
                    <th className="fw-semibold text-muted text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="text-muted mb-3">
                          <svg
                            width="48"
                            height="48"
                            fill="currentColor"
                            className="bi bi-calendar-x"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                          </svg>
                        </div>
                        <h6 className="text-muted mb-2">
                          Sin líneas de reserva
                        </h6>
                        <p className="text-muted mb-3">
                          No hay líneas de reserva asociadas.
                        </p>
                        <button
                          className="btn btn-primary px-4 py-2"
                          onClick={añadirLinea}
                          style={{ borderRadius: "20px" }}
                        >
                          Añadir primera línea
                        </button>
                      </td>
                    </tr>
                  ) : (
                    lineas.map((linea, index) => (
                      <tr key={index} className="align-middle">
                        <td>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={linea.fecha || ""}
                            onChange={(e) =>
                              manejarCambioLinea(index, "fecha", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <select
                            name="tipo_habitacion"
                            className="form-select form-select-sm"
                            value={linea.tipo_habitacion || ""}
                            onChange={(e) =>
                              manejarCambioLinea(
                                index,
                                "tipo_habitacion",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled>
                              -- Selecciona tipo
                            </option>
                            <option value="Individual">Individual</option>
                            <option value="Doble">Doble</option>
                            <option value="Triple">Triple</option>
                            <option value="Suite">Suite</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={linea.regimen}
                            onChange={(e) =>
                              manejarCambioLinea(
                                index,
                                "regimen",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled>
                              -- Selecciona régimen
                            </option>
                            <option value="Solo Alojamiento">
                              Solo Alojamiento
                            </option>
                            <option value="Alojamiento y Desayuno">
                              Alojamiento y Desayuno
                            </option>
                            <option value="Media Pensión">Media Pensión</option>
                            <option value="Pensión Completa">
                              Pensión Completa
                            </option>
                          </select>
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            style={{ width: "70px" }}
                            value={linea.cantidad_habitaciones}
                            onChange={(e) =>
                              manejarCambioLinea(
                                index,
                                "cantidad_habitaciones",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            style={{ width: "70px" }}
                            value={linea.cantidad_adultos}
                            onChange={(e) =>
                              manejarCambioLinea(
                                index,
                                "cantidad_adultos",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            style={{ width: "70px" }}
                            value={linea.cantidad_ninos}
                            onChange={(e) =>
                              manejarCambioLinea(
                                index,
                                "cantidad_ninos",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-end">
                          <input
                            type="number"
                            className="form-control form-control-sm text-end"
                            style={{ width: "100px" }}
                            value={linea.precio}
                            onChange={(e) =>
                              manejarCambioLinea(
                                index,
                                "precio",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => eliminarLinea(linea)}
                              title="Eliminar línea"
                              style={{ width: "32px", height: "32px" }}
                            >
                              ×
                            </button>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => añadirLinea()}
                              title="Añadir línea"
                              style={{ width: "32px", height: "32px" }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Botón para guardar cambios */}
      <div className="row d-flex justify-content-center">
        <div className="col-4">
          <div className="d-grid">
            <button
              className="btn btn-success py-3"
              onClick={guardarCambios}
              style={{ borderRadius: "10px", fontWeight: "bold" }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarReserva;
