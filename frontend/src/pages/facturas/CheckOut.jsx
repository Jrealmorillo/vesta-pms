// Página de Check-out para reservas y facturación
// Permite buscar reservas activas por habitación, gestionar cargos, cerrar factura y realizar el check-out.
// Incluye validaciones, notificaciones, edición y anulación de cargos, y confirmaciones interactivas.

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CheckOut = () => {
  const [numeroHabitacion, setNumeroHabitacion] = useState("");
  const [reserva, setReserva] = useState(null);
  const [detalleFactura, setDetalleFactura] = useState([]);
  const [error, setError] = useState("");
  const [nuevoCargo, setNuevoCargo] = useState({
    concepto: "",
    cantidad: 1,
    precio: 0,
  });
  const [formaPago, setFormaPago] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [editandoDetalleId, setEditandoDetalleId] = useState(null);
  const [detalleEditado, setDetalleEditado] = useState({
    concepto: "",
    cantidad: 1,
    precio_unitario: 0,
  });

  // Busca la reserva activa por número de habitación y carga los cargos pendientes
  const buscarReservaActiva = async () => {
    if (!numeroHabitacion) {
      toast.error("Introduce un número de habitación");
      return;
    }

    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/reservas/habitacion/${numeroHabitacion}/check-in`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReserva(data);
      setError("");

      const detalles = await axios.get(
        `${import.meta.env.VITE_API_URL}/detalles-factura/pendientes/${
          data.id_reserva
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDetalleFactura(detalles.data);
    } catch (error) {
      toast.error(  `Error al buscar la reserva: ${error.response?.data?.error || error.message}`);
      setReserva(null);
      setDetalleFactura([]);
      setError("No hay reservas activas en esa habitación.");
    }
  };

  // Añade un nuevo cargo a la reserva
  const guardarNuevoCargo = async () => {
    try {
      const { concepto, cantidad, precio } = nuevoCargo;

      if (!concepto || cantidad <= 0 || precio < 0) {
        toast.error("Datos del cargo inválidos");
        return;
      }

      const total = (cantidad * precio).toFixed(2);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/detalles-factura`,
        {
          id_reserva: reserva.id_reserva,
          concepto,
          cantidad,
          precio_unitario: precio,
          total,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const detalles = await axios.get(
        `${import.meta.env.VITE_API_URL}/detalles-factura/pendientes/${
          reserva.id_reserva
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDetalleFactura(detalles.data);

      setNuevoCargo({ concepto: "", cantidad: 1, precio: 0 });
      toast.success("Cargo añadido correctamente");
    } catch (error) {
      toast.error(`Error al añadir el cargo: ${error.response?.data?.error || error.message}`);
    }
  };

  // Adelanta los cargos pendientes a la factura
  const adelantarCargos = async () => {
    // Comprobar si la reserva tiene una factura ya cerrada
    if (reserva.estado_factura === "Pagada") {
      toast.info("La factura ya está cerrada. No se pueden añadir más cargos.");
      return;
    }

    const adelantoCargos = await Swal.fire({
      title: "¿Adelantar cargos?",
      text: "Esto añadirá los cargos pendientes a la factura.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, adelantar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    });
    if (!adelantoCargos.isConfirmed) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/detalles-factura/adelantar/${
          reserva.id_reserva
        }`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar lista de detalles
      const detalles = await axios.get(
        `${import.meta.env.VITE_API_URL}/detalles-factura/pendientes/${
          reserva.id_reserva
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDetalleFactura(detalles.data);

      toast.success(data.mensaje);
    } catch (error) {
      toast.error(error.response?.data?.detalle || "Error desconocido");
    }
  };

  // Cierra la factura de la reserva actual
  const cerrarFactura = async () => {
    if (!detalleFactura.length) {
      toast.error("No hay cargos registrados en la cuenta");
      return;
    }
    if (!formaPago) {
      toast.error("Selecciona una forma de pago");
      return;
    }
    try {
      // Obtener ID del usuario
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const id_usuario = usuario?.id_usuario;
      if (!id_usuario) {
        toast.error("No se pudo identificar al usuario");
        return;
      }

      // Extraer los ID de los detalles pendientes
      const detalles = detalleFactura.map((d) => d.id_detalle);

      const payload = {
        id_reserva: reserva.id_reserva,
        forma_pago: formaPago,
        id_usuario,
        detalles,
      };

      // Crear la factura
      await axios.post(`${import.meta.env.VITE_API_URL}/facturas`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Factura cerrada correctamente");

      // Volver a consultar la reserva actualizada
      const reservaActualizada = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/habitacion/${numeroHabitacion}/check-in`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReserva(reservaActualizada.data);

      // Si la factura está cerrada, limpiar los cargos pendientes
      if (reservaActualizada.data.estado_factura === "Pagada") {
        setDetalleFactura([]);
      } else {
        // Actualizar lista de detalles (los que aún no estén facturados)
        const detallesActualizados = await axios.get(
          `${import.meta.env.VITE_API_URL}/detalles-factura/pendientes/${reservaActualizada.data.id_reserva}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDetalleFactura(detallesActualizados.data);
      }

      setFormaPago("");
    } catch (error) {
      toast.error(`Error al cerrar la factura: ${error.response?.data?.error || error.message}`);
    }
  };

  // Realiza el check-out de la reserva, cambiando su estado y liberando la habitación
  const hacerCheckOut = async () => {
    // Verificar si la fecha de salida coincide con hoy
    const hoy = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
    const fechaSalida = reserva.fecha_salida;

    if (fechaSalida > hoy) {
      const salidaAnticipada = await Swal.fire({
        title: "Salida anticipada",
        text: `La fecha de salida registrada es ${fechaSalida}, pero hoy es ${hoy}. ¿Deseas continuar con el check-out anticipado?`,
        icon: "warning",
        confirmButtonText: "Sí, hacer check-out",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (!salidaAnticipada.isConfirmed) return;
    }

    // Verificar si hay líneas de reserva activas sin trasladar
    try {
      const respuesta = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/${reserva.id_reserva}/tiene-lineas-no-facturadas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (respuesta.data?.pendientes) {
        await Swal.fire({
          icon: "warning",
          title: "Cargos de alojamiento no generados",
          text: "Hay líneas de reserva activas que no se han trasladado como cargos. Por favor, adelanta los cargos antes de hacer check-out.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
    } catch (error) {
      toast.error(`Error al verificar cargos pendientes: ${error.response?.data?.error || error.message}`);
      return;
    }

    // Verificar si hay cargos pendientes de facturar
    if (detalleFactura.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Cargos pendientes",
        text: "No se puede hacer el check-out. Hay cargos que no han sido facturados. Por favor, cierra la factura primero.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Confirmación final de check-out
    const confirmacion = await Swal.fire({
      title: "¿Confirmar check-out?",
      text: "Esta acción marcará la reserva como check-out y liberará la habitación.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    // Ejecutar el check-out
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${
          reserva.id_reserva
        }/cambiar-estado`,
        { nuevoEstado: "Check-out" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const estados =
        JSON.parse(localStorage.getItem("estadoHabitaciones")) || [];
      const index = estados.findIndex((e) => e.numero === numeroHabitacion);
      if (index !== -1) {
        estados[index].ocupacion = "libre";
        estados[index].limpieza = "sucia";
      } else {
        estados.push({
          numero: numeroHabitacion,
          ocupacion: "libre",
          limpieza: "sucia",
        });
      }
      localStorage.setItem("estadoHabitaciones", JSON.stringify(estados));
      toast.success("Check-out realizado correctamente");
      setTimeout(() => {
        navigate("/facturas/check-out");
        window.location.reload(); // Recarga la página para actualizar el estado
      }, 1500);
    } catch (error) {
      toast.error(`Error al hacer check-out: ${error.response?.data?.error || error.message}`);
    }
  };

  // Inicia la edición de un cargo
  const iniciarEdicion = (detalle) => {
    setEditandoDetalleId(detalle.id_detalle);
    setDetalleEditado({
      concepto: detalle.concepto,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
    });
  };

  // Guarda los cambios realizados en un cargo editado
  const guardarEdicion = async (id_detalle) => {
    const total = (
      detalleEditado.cantidad * detalleEditado.precio_unitario
    ).toFixed(2);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/detalles-factura/${id_detalle}`,
        {
          ...detalleEditado,
          total,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const detallesActualizados = await axios.get(
        `${import.meta.env.VITE_API_URL}/detalles-factura/pendientes/${
          reserva.id_reserva
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDetalleFactura(detallesActualizados.data);
      setEditandoDetalleId(null);
      toast.success("Cargo modificado correctamente");
    } catch (error) {
      toast.error(`Error al modificar el cargo: ${error.response?.data?.error || error.message}`);
    }
  };

  // Anula (elimina) un cargo de la reserva
  const anularDetalle = async (id_detalle) => {
    const confirmacion = await Swal.fire({
      title: "¿Anular este cargo?",
      text: "Este cargo dejará de estar activo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/detalles-factura/${id_detalle}/anular`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const detallesActualizados = await axios.get(
        `${import.meta.env.VITE_API_URL}/detalles-factura/pendientes/${
          reserva.id_reserva
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDetalleFactura(detallesActualizados.data);
      toast.success("Cargo anulado correctamente");
    } catch (error) {
      toast.error(`Error al anular el cargo: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: "800px" }}>
      <h2>Check-out</h2>

      <div className="input-group- mx-auto col-md-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Habitación"
          value={numeroHabitacion}
          onChange={(e) => setNumeroHabitacion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              buscarReservaActiva();
            }
          }}
        />
        </div>
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={buscarReservaActiva}>
            Buscar
          </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {reserva && (
        <div className="mt-4">
          <div className="card mb-3">
            <div className="card-header bg-light fw-bold">
              Datos de la reserva
            </div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Huésped:</strong> {reserva.nombre_huesped}
              </p>
              <p className="mb-1">
                <strong>Número reserva:</strong> {reserva.id_reserva}
              </p>
              <p className="mb-1">
                <strong>Fecha entrada:</strong> {reserva.fecha_entrada}
              </p>
              <p className="mb-1">
                <strong>Fecha salida:</strong> {reserva.fecha_salida}
              </p>
              <p className="mb-1">
                <strong>Habitación:</strong> {reserva.numero_habitacion}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span className="badge bg-primary">{reserva.estado}</span>
              </p>
              <p>
                <strong>Factura:</strong>{" "}
                {reserva.estado_factura == "Pagada" ? (
                  <span className="badge bg-success">Cerrada</span>
                ) : (
                  <span className="badge bg-danger">Pendiente</span>
                )}
              </p>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header bg-light fw-bold">
              Cabecera de factura
            </div>
            <div className="card-body">
              {reserva.id_cliente ? (
                <>
                  <p className="mb-1">
                    <strong>Nombre:</strong> {reserva.nombre_huesped}{" "}
                    {reserva.primer_apellido_huesped}{" "}
                    {reserva.segundo_apellido_huesped}
                  </p>
                  <p className="mb-1">
                    <strong>CIF / Documento:</strong>{" "}
                    {reserva.cliente.numero_documento}
                  </p>
                  <p className="mb-1">
                    <strong>Dirección:</strong> {reserva.cliente.direccion}
                  </p>
                  <p className="mb-1">
                    <strong>Ciudad:</strong> {reserva.cliente.ciudad}
                  </p>
                  <p className="mb-1">
                    <strong>Código Postal:</strong>{" "}
                    {reserva.cliente.codigo_postal}
                  </p>
                  <p className="mb-1">
                    <strong>País:</strong> {reserva.cliente.pais}
                  </p>
                </>
              ) : (
                <p className="text-muted">No hay cliente asociado</p>
              )}
            </div>
          </div>

          {detalleFactura.length > 0 && (
            <div className="card mb-3">
              <div className="card-header bg-light fw-bold">
                Cargos registrados
              </div>
              <ul className="list-group list-group-flush">
                {detalleFactura.map((detalle) => (
                  <li
                    key={detalle.id_detalle}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {editandoDetalleId === detalle.id_detalle ? (
                      <div className="w-100">
                        <div className="row">
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              value={detalleEditado.concepto}
                              onChange={(e) =>
                                setDetalleEditado({
                                  ...detalleEditado,
                                  concepto: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <input
                              type="number"
                              min="1"
                              className="form-control"
                              value={detalleEditado.cantidad}
                              onChange={(e) =>
                                setDetalleEditado({
                                  ...detalleEditado,
                                  cantidad: parseInt(e.target.value, 10),
                                })
                              }
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="form-control"
                              value={detalleEditado.precio_unitario}
                              onChange={(e) =>
                                setDetalleEditado({
                                  ...detalleEditado,
                                  precio_unitario: parseFloat(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="col-md-3 text-end">
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => guardarEdicion(detalle.id_detalle)}
                            >
                              Guardar
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditandoDetalleId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span>
                          {detalle.concepto} — {detalle.cantidad} x{" "}
                          {detalle.precio_unitario} € ={" "}
                          <strong>{detalle.total} €</strong>
                        </span>
                        <div>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => iniciarEdicion(detalle)}
                          >
                            <i className="bi bi-pencil-fill"></i> Editar
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => anularDetalle(detalle.id_detalle)}
                          >
                            <i className="bi bi-trash3-fill"></i> Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <div className="card-body border-top d-flex justify-content-between align-items-center">
                <div className="w-50">
                  <label className="form-label fw-bold">Forma de pago</label>
                  <select
                    className="form-select"
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value)}
                  >
                    <option value="" disabled>
                      --Selecciona forma de pago
                    </option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Visa">Visa</option>
                    <option value="Amex">Amex</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Crédito">Crédito</option>
                  </select>
                </div>

                <div className="text-end">
                  <h5 className="fw-bold mt-3">
                    Total:{" "}
                    {detalleFactura
                      .reduce((suma, d) => suma + parseFloat(d.total || 0), 0)
                      .toFixed(2)}{" "}
                    €
                  </h5>
                </div>
              </div>
            </div>
          )}

          <div className="card mb-3">
            <div className="card-header bg-light fw-bold">
              Añadir nuevo cargo
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 mb-2">
                  <label htmlFor="concepto">Concepto</label>
                  <select
                    className="form-select"
                    value={nuevoCargo.concepto}
                    onChange={(e) =>
                      setNuevoCargo({
                        ...nuevoCargo,
                        concepto: e.target.value,
                      })
                    }
                    name="concepto"
                    id="concepto"
                  >
                    <option value="" disabled>
                      --Selecciona concepto
                    </option>
                    <option value="Alojamiento">Alojamiento</option>
                    <option value="Desayuno">Desayuno</option>
                    <option value="Almuerzo">Almuerzo</option>
                    <option value="Cena">Cena</option>
                    <option value="Minibar">Minibar</option>
                    <option value="Room service">Room service</option>
                    <option value="Parking">Parking</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="col-md-2 mb-2">
                  <label htmlFor="cantidad">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    name="cantidad"
                    id="cantidad"
                    placeholder="Cantidad"
                    min="1"
                    value={nuevoCargo.cantidad}
                    onChange={(e) =>
                      setNuevoCargo({
                        ...nuevoCargo,
                        cantidad: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <label htmlFor="precio">Precio/unidad</label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Precio €"
                    id="precio"
                    min="0"
                    step="0.01"
                    value={nuevoCargo.precio}
                    onChange={(e) =>
                      setNuevoCargo({
                        ...nuevoCargo,
                        precio: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div
                  className="col-md-2 mb-2 d-grid"
                  style={{ marginTop: "32px" }}
                >
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={guardarNuevoCargo}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto">
            <button className="btn btn-warning mx-2" onClick={adelantarCargos}>
              Adelantar cargos
            </button>
            <button className="btn btn-info mx-2 " onClick={cerrarFactura}>
              Cerrar factura
            </button>
            <button className="btn btn-success mx-2 " onClick={hacerCheckOut}>
              Realizar check-out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
