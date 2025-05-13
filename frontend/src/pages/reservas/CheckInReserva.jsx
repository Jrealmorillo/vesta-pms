/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CheckInReserva = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [reserva, setReserva] = useState({
    nombre_huesped: "",
    primer_apellido_huesped: "",
    segundo_apellido_huesped: "",
    id_cliente: null,
    id_empresa: null,
    fecha_entrada: "",
    fecha_salida: "",
    numero_habitacion: "",
    observaciones: "",
  });
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState("");
  const [huesped, setHuesped] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fecha_nacimiento: "",
    genero: "",
    tipo_documento: "",
    numero_documento: "",
    fecha_expedicion: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
    pais: "",
    telefono: "",
    email: "",
    observaciones: "",
  });
  const [idClienteEncontrado, setIdClienteEncontrado] = useState(null);
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [lineasReserva, setLineasReserva] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

  const cargarReserva = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReserva(data);
      setHuesped((...prev) => ({
        ...prev,
        nombre: data.nombre_huesped,
        primer_apellido: data.primer_apellido_huesped,
        segundo_apellido: data.segundo_apellido_huesped,
      }));
    } catch (error) {
      toast.error("Error al cargar la reserva");
    }
  };

  const cargarLineasReserva = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLineasReserva(data);
    } catch (error) {
      toast.error("Error al cargar las líneas de la reserva");
    }
  };

  const cargarHabitacionesDisponibles = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/habitaciones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabitaciones(data);
    } catch (error) {
      toast.error("Error al cargar habitaciones disponibles");
    }
  };

  const manejarCambioHuesped = (e) => {
    setHuesped({ ...huesped, [e.target.name]: e.target.value });
  };

  const confirmarCheckIn = async () => {
    if (!habitacionSeleccionada) {
      toast.error("Debes seleccionar una habitación");
      return;
    }
    // Validar campos obligatorios del huésped
    const camposObligatorios = [
      "nombre",
      "primer_apellido",
      "fecha_nacimiento",
      "genero",
      "tipo_documento",
      "numero_documento",
      "fecha_expedicion",
      "pais",
    ];

    const faltantes = camposObligatorios.filter((campo) => !huesped[campo]);
    if (faltantes.length > 0) {
      toast.error("Faltan campos obligatorios del huésped");
      return;
    }

    try {
      // Registrar al huésped como cliente
      let id_cliente = idClienteEncontrado;

      if (!id_cliente) {
        const clienteResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/clientes/registro`,
          huesped,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        id_cliente = clienteResponse.data.cliente.id_cliente;
      }

      // Asignar habitación e id_cliente a la reserva
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id}`,
        {
          numero_habitacion: habitacionSeleccionada,
          id_cliente,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cambiar el estado visual de la habitación en localStorage
      const estados =
        JSON.parse(localStorage.getItem("estadoHabitaciones")) || [];

      const index = estados.findIndex(
        (e) => e.numero === habitacionSeleccionada
      );
      if (index !== -1) {
        estados[index].ocupacion = "ocupada";
        estados[index].limpieza = "sucia";
      } else {
        estados.push({
          numero: habitacionSeleccionada,
          ocupacion: "ocupada",
          limpieza: "sucia",
        });
      }

      localStorage.setItem("estadoHabitaciones", JSON.stringify(estados));

      // Cambiar estado de la reserva a "Check-in"
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/cambiar-estado`,
        { nuevoEstado: "Check-in" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Check-in realizado correctamente");
      navigate("/reservas/check-in");
    } catch (error) {
      toast.error("No se pudo realizar el check-in");
      console.error(error);
    }
  };

  const manejarSeleccionHabitacion = (numero) => {
    setHabitacionSeleccionada(numero);

    const estados =
      JSON.parse(localStorage.getItem("estadoHabitaciones")) || [];
    const estado = estados.find((e) => e.numero === numero);

    if (estado) {
      setEstadoSeleccionado(estado);
    } else {
      setEstadoSeleccionado(null);
    }
  };

  useEffect(() => {
    cargarReserva();
    cargarLineasReserva();
    cargarHabitacionesDisponibles();
  }, []);

  const buscarClientePorDocumento = async () => {
    if (!huesped.numero_documento) {
      toast.error("Introduce un número de documento");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/clientes/documento/${
          huesped.numero_documento
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.length === 0) {
        toast.error("No se encontró ningún cliente con ese documento");
        setClientesEncontrados([]);
      } else if (data.length === 1) {
        seleccionarCliente(data[0]);
      } else {
        toast.info("Se han encontrado varios clientes. Selecciona uno.");
        setClientesEncontrados(data);
      }
    } catch (_error) {
      toast.error("Error al buscar cliente");
      setClientesEncontrados([]);
    }
  };

  const seleccionarCliente = (cliente) => {
    setHuesped((prev) => ({
      ...prev,
      nombre: cliente.nombre || "",
      primer_apellido: cliente.primer_apellido || "",
      segundo_apellido: cliente.segundo_apellido || "",
      fecha_nacimiento: cliente.fecha_nacimiento || "",
      genero: cliente.genero || "",
      tipo_documento: cliente.tipo_documento || "",
      numero_documento: cliente.numero_documento || "",
      fecha_expedicion: cliente.fecha_expedicion || "",
      direccion: cliente.direccion || "",
      ciudad: cliente.ciudad || "",
      codigo_postal: cliente.codigo_postal || "",
      pais: cliente.pais || "",
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      observaciones: cliente.observaciones || "",
    }));
    setIdClienteEncontrado(cliente.id_cliente);
    setClientesEncontrados([]);
    toast.success("Cliente seleccionado");
  };

  if (!reserva) return <p>Cargando reserva...</p>;

  return (
    <div className="container py-5 mt-4">
      <h2>Check-in de la reserva #{reserva.id_reserva}</h2>

      <div className="mb-3">
        <strong>Nombre Reserva:</strong> {reserva.nombre_huesped}{" "}
        {reserva.primer_apellido_huesped} {reserva.segundo_apellido_huesped}
      </div>
      <div className="row mb-3">
        <div className="col-md-2">
          <label className="form-label">Fecha de entrada</label>
          <input
            type="date"
            name="fecha_entrada"
            className="form-control"
            value={reserva.fecha_entrada}
            onChange={(e) =>
              setReserva({ ...reserva, fecha_entrada: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Fecha de salida</label>
          <input
            type="date"
            name="fecha_salida"
            className="form-control"
            min={reserva.fecha_entrada}
            value={reserva.fecha_salida}
            onChange={(e) =>
              setReserva({ ...reserva, fecha_salida: e.target.value })
            }
            required
          />
        </div>{" "}
        <div className="col-md-2">
          <label className="form-label">Habitación</label>
          <select
            className="form-select"
            value={habitacionSeleccionada}
            onChange={(e) => manejarSeleccionHabitacion(e.target.value)}
          >
            <option value="" disabled>-- Selecciona una habitación --</option>
            {habitaciones.map((hab) => {
              const estados =
                JSON.parse(localStorage.getItem("estadoHabitaciones")) || [];
              const estado = estados.find(
                (e) => e.numero === hab.numero_habitacion
              );

              const ocupacion = estado?.ocupacion || "Desconocida";
              const limpieza = estado?.limpieza || "Desconocida";

              let icono = "⚪";
              if (ocupacion === "libre" && limpieza === "limpia") icono = "🟢";
              else if (ocupacion === "ocupada" || limpieza === "sucia")
                icono = "🔴";
              else icono = "🟡";

              return (
                <option
                  key={hab.numero_habitacion}
                  value={hab.numero_habitacion}
                >
                  {icono} {hab.numero_habitacion} - {hab.tipo} ({ocupacion} /{" "}
                  {limpieza})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <h5 className="mt-4">Datos del huésped</h5>

      {/* Datos personales */}
      <div className="row mb-3">
        <div className="col">
          <input
            name="nombre"
            className="form-control"
            placeholder="Nombre"
            value={huesped.nombre}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <input
            name="primer_apellido"
            className="form-control"
            placeholder="Primer apellido"
            value={huesped.primer_apellido}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <input
            name="segundo_apellido"
            className="form-control"
            placeholder="Segundo apellido"
            value={huesped.segundo_apellido}
            onChange={manejarCambioHuesped}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            className="form-control"
            value={huesped.fecha_nacimiento || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <label className="form-label">Género</label>
          <select
            name="genero"
            className="form-select"
            value={huesped.genero}
            onChange={manejarCambioHuesped}
          >
            <option value="" disabled>-- Selecciona un género --</option>
            <option>Masculino</option>
            <option>Femenino</option>
          </select>
        </div>
      </div>

      {/* Documento */}
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Tipo de documento</label>
          <select
            name="tipo_documento"
            className="form-select"
            value={huesped.tipo_documento || ""}
            onChange={manejarCambioHuesped}
          >
            <option value="" disabled>-- Selecciona un tipo de documento --</option>
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Documento de Identidad">Documento de Identidad</option>
            <option value="Permiso de Residencia">Permiso de Residencia</option>
          </select>
        </div>
        <div className="col">
          <label className="form-label">Número de documento</label>
          <div className="input-group">
            <input
              name="numero_documento"
              className="form-control"
              value={huesped.numero_documento || ""}
              onChange={manejarCambioHuesped}
            />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={buscarClientePorDocumento}
            >
              Buscar
            </button>
          </div>
          {clientesEncontrados.length > 1 && (
            <ul className="list-group mt-2">
              {clientesEncontrados.map((cliente) => (
                <li
                  key={cliente.id_cliente}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer" }}
                  onClick={() => seleccionarCliente(cliente)}
                >
                  {cliente.nombre} {cliente.primer_apellido} —{" "}
                  {cliente.numero_documento}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col">
          <label className="form-label">Fecha de expedición</label>
          <input
            type="date"
            name="fecha_expedicion"
            className="form-control"
            value={huesped.fecha_expedicion || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
      </div>

      {/* Dirección y contacto */}
      <div className="row mb-3">
        <div className="col">
          <input
            name="direccion"
            className="form-control"
            placeholder="Dirección"
            value={huesped.direccion || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <input
            name="ciudad"
            className="form-control"
            placeholder="Ciudad"
            value={huesped.ciudad || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <input
            name="codigo_postal"
            className="form-control"
            placeholder="Código Postal"
            value={huesped.codigo_postal || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <input
            name="pais"
            className="form-control"
            placeholder="País"
            value={huesped.pais || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <input
            name="telefono"
            className="form-control"
            placeholder="Teléfono"
            value={huesped.telefono || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
        <div className="col">
          <input
            name="email"
            className="form-control"
            placeholder="Email"
            value={huesped.email || ""}
            onChange={manejarCambioHuesped}
          />
        </div>
      </div>

      <div className="mb-3">
        <textarea
          name="observaciones"
          className="form-control"
          placeholder="Observaciones"
          rows={2}
          value={huesped.observaciones}
          onChange={manejarCambioHuesped}
        />
      </div>
      <h5 className="mt-5">Líneas de reserva</h5>
      {lineasReserva.length === 0 ? (
        <p className="text-muted">
          No hay líneas registradas para esta reserva.
        </p>
      ) : (
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
              </tr>
            </thead>
            <tbody>
              {lineasReserva.map((linea) => (
                <tr key={linea.id_linea_reserva}>
                  <td>{linea.fecha}</td>
                  <td>{linea.tipo_habitacion}</td>
                  <td>{linea.regimen}</td>
                  <td>{linea.cantidad_habitaciones}</td>
                  <td>{linea.cantidad_adultos}</td>
                  <td>{linea.cantidad_ninos}</td>
                  <td>{linea.precio} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-grid mt-4">
        <button className="btn btn-success" onClick={confirmarCheckIn}>
          Confirmar check-in
        </button>
      </div>
    </div>
  );
};

export default CheckInReserva;
