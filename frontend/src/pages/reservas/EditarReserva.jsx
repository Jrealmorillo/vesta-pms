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

        // Solicita líneas asociadas a la reserva
        const { data: datosLineas } = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("datosLineas es: ", datosLineas);
        setLineas(datosLineas);
      } catch (error) {
        toast.error(`Error al cargar la reserva: ${error.response?.data?.error || error.message}`);
      }
    };

    obtenerDatos();
  }, [id, token]);

  // Maneja cambios en los campos de la reserva principal
  const manejarCambio = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  // Maneja cambios en los campos de una línea de reserva
  const manejarCambioLinea = (index, campo, valor) => {
    const nuevasLineas = [...lineas];
    nuevasLineas[index][campo] = valor;
    setLineas(nuevasLineas);
  };

  // Añade una nueva línea de reserva vacía
  const añadirLinea = () => {
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
        toast.error(`Error al eliminar la línea: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  // Guarda los cambios de la reserva y sus líneas en la API
  const guardarCambios = async () => {
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
        toast.error("Hay líneas de reserva cuyas fechas no coinciden con el rango de la estancia. Corrige las fechas de las líneas antes de guardar.");
        return;
      }

      // Validar que todas las fechas del rango están cubiertas por líneas
      const diasEstancia = [];
      for (let d = new Date(entrada); d < salida; d.setDate(d.getDate() + 1)) {
        diasEstancia.push(new Date(d).toISOString().slice(0, 10));
      }
      const fechasLineas = lineas.map(l => l.fecha);
      const fechasFaltantes = diasEstancia.filter(dia => !fechasLineas.includes(dia));
      if (fechasFaltantes.length > 0) {
        toast.error("Faltan líneas de reserva para las siguientes fechas: " + fechasFaltantes.join(", "));
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

      // 1. Eliminar en backend las líneas que ya no están en el frontend
      for (const lineaBackend of lineasActualesBackend) {
        const existeEnFrontend = lineas.find(
          l => l.id_linea_reserva === lineaBackend.id_linea_reserva
        );
        if (!existeEnFrontend) {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${lineaBackend.id_linea_reserva}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      // 2. Actualizar o crear las líneas que están en el frontend
      for (const linea of lineas) {
        if (linea.id_linea_reserva) {
          const existeEnBackend = lineasActualesBackend.find(l => l.id_linea_reserva === linea.id_linea_reserva);
          if (existeEnBackend) {
            // Actualizar línea existente
            await axios.put(
              `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas/${linea.id_linea_reserva}`,
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

      toast.success("Reserva modificada correctamente");
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
      toast.error(`Error al modificar la reserva: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "950px" }}>
      <h2 className="mb-4">Editar Reserva #{id}</h2>
      {/* Estado visual de la reserva */}
      <div className="mb-3">
        <span className="fw-bold">Estado de la reserva: </span>
        <span
          className={`badge ${
            reserva.estado === "Anulada"
              ? "bg-danger"
              : reserva.estado === "Confirmada"
              ? "bg-success"
              : reserva.estado === "Check-in"
              ? "bg-primary"
              : "bg-secondary"
          }`}
        >
          {reserva.estado}
        </span>
      </div>

      {/* Formulario de datos principales de la reserva */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Nombre huésped</label>
          <input
            type="text"
            className="form-control"
            name="nombre_huesped"
            value={reserva.nombre_huesped || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Primer apellido</label>
          <input
            type="text"
            className="form-control"
            name="primer_apellido_huesped"
            value={reserva.primer_apellido_huesped || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Segundo apellido</label>
          <input
            type="text"
            className="form-control"
            name="segundo_apellido_huesped"
            value={reserva.segundo_apellido_huesped || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha entrada</label>
          <input
            type="date"
            className="form-control"
            name="fecha_entrada"
            value={reserva.fecha_entrada || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha salida</label>
          <input
            type="date"
            className="form-control"
            name="fecha_salida"
            value={reserva.fecha_salida || ""}
            onChange={manejarCambio}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Nº Habitación</label>
          <input
            type="text"
            className="form-control"
            name="numero_habitacion"
            value={reserva.numero_habitacion || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Importe total (€)</label>
          <input
            type="text"
            className="form-control bg-light"
            value={reserva.precio_total || 0}
            readOnly
            tabIndex={-1}
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Observaciones</label>
          <textarea
            className="form-control"
            name="observaciones"
            value={reserva.observaciones}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ID Cliente</label>
          <input
            type="number"
            className="form-control"
            name="id_cliente"
            value={reserva.id_cliente || ""}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ID Empresa</label>
          <input
            type="number"
            className="form-control"
            name="id_empresa"
            value={reserva.id_empresa || ""}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <span className="d-block p-1 text-bg-dark"></span>

      {/* Tabla editable de líneas de reserva */}
      <h4 className="mt-1">Líneas de Reserva</h4>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Régimen</th>
              <th>Habitaciones</th>
              <th>Adultos</th>
              <th>Niños</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lineas.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No hay líneas de reserva asociadas.<br />
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={añadirLinea}
                  >
                    Añadir línea
                  </button>
                </td>
              </tr>
            ) : (
              lineas.map((linea, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={linea.fecha || ""}
                      onChange={(e) =>
                        manejarCambioLinea(index, "fecha", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <select
                      name="tipo_habitacion"
                      className="form-select"
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
                      className="form-select"
                      value={linea.regimen}
                      onChange={(e) =>
                        manejarCambioLinea(index, "regimen", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        -- Selecciona régimen
                      </option>
                      <option value="Solo Alojamiento">Solo Alojamiento</option>
                      <option value="Alojamiento y Desayuno">
                        Alojamiento y Desayuno
                      </option>
                      <option value="Media Pensión">Media Pensión</option>
                      <option value="Pensión Completa">Pensión Completa</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
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
                  <td>
                    <input
                      type="number"
                      className="form-control"
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
                  <td>
                    <input
                      type="number"
                      className="form-control"
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
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={linea.precio}
                      onChange={(e) =>
                        manejarCambioLinea(index, "precio", e.target.value)
                      }
                    />
                  </td>
                  <td style={{ width: "150px" }}>
                    <button
                      className="btn btn-sm btn-danger w-100 mb-2"
                      onClick={() => eliminarLinea(linea)}
                    >
                      Eliminar línea
                    </button>
                    <button
                      className="btn btn-sm btn-primary w-100 mb-2"
                      onClick={() => añadirLinea()}
                    >
                      Añadir línea
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botón para guardar todos los cambios */}
      <div className="d-grid">
        <button className="btn btn-success" onClick={guardarCambios}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default EditarReserva;
