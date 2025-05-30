/* eslint-disable no-unused-vars */
// Página para realizar el check-in de una reserva concreta.
// Permite asignar habitación, registrar o seleccionar huésped, validar datos y confirmar el check-in.
// Gestiona el estado visual de la habitación y el estado de la reserva, mostrando líneas de reserva asociadas.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCallback } from "react";

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
  const [habitacionesOcupadas, setHabitacionesOcupadas] = useState([]); // Con check-in realizado
  const [habitacionesAsignadas, setHabitacionesAsignadas] = useState([]); // Solo con reserva asignada
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar actualizaciones

  // Carga los datos de la reserva seleccionada
  const cargarReserva = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReserva(data);
      setHabitacionSeleccionada(data.numero_habitacion || "");
      setHuesped((...prev) => ({
        ...prev,
        nombre: data.nombre_huesped,
        primer_apellido: data.primer_apellido_huesped,
        segundo_apellido: data.segundo_apellido_huesped,
      }));
    } catch (error) {
      toast.error(
        `Error al cargar la reserva: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  // Carga las líneas de la reserva (habitaciones, regímenes, etc.)
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
      toast.error(
        `Error al cargar las líneas de la reserva: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  // Carga todas las habitaciones disponibles para asignar
  const cargarHabitacionesDisponibles = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/habitaciones`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabitaciones(data.habitaciones);
    } catch (error) {
      toast.error(
        `Error al cargar habitaciones disponibles: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  // Maneja cambios en los campos del formulario de huésped
  const manejarCambioHuesped = (e) => {
    setHuesped({ ...huesped, [e.target.name]: e.target.value });
  };
  // Confirma el check-in: valida datos, registra huésped si es necesario, asigna habitación y cambia estado
  const confirmarCheckIn = async () => {
    if (!habitacionSeleccionada) {
      toast.error("Debes seleccionar una habitación");
      return;
    }

    // Obtiene el estado visual de la habitación seleccionada
    const estados =
      JSON.parse(localStorage.getItem("estadoHabitaciones")) || [];
    const bloqueos =
      JSON.parse(localStorage.getItem("bloqueosHabitaciones")) || [];
    const estado = estados.find((e) => e.numero === habitacionSeleccionada);

    // Verificar si está bloqueada
    const hoy = new Date();
    const estaBloqueada = bloqueos.some(
      (bloqueo) =>
        bloqueo.numero_habitacion === habitacionSeleccionada &&
        new Date(bloqueo.fecha_inicio) <= hoy &&
        new Date(bloqueo.fecha_fin) >= hoy
    ); // Verificar si está ocupada por otra reserva
    const estaOcupada = habitacionesOcupadas.includes(habitacionSeleccionada);
    const estaAsignada = habitacionesAsignadas.includes(habitacionSeleccionada);

    // Validaciones de estado de la habitación
    if (estaBloqueada) {
      toast.error("No puedes hacer check-in en una habitación bloqueada.");
      return;
    }

    if (estaOcupada) {
      toast.error(
        "No puedes hacer check-in: la habitación está ocupada por otra reserva."
      );
      return;
    }

    if (estaAsignada) {
      toast.error(
        "No puedes hacer check-in: la habitación está asignada a otra reserva."
      );
      return;
    }

    if (estado?.ocupacion === "ocupada") {
      toast.error(
        "No puedes hacer check-in: la habitación está marcada como ocupada en el planning."
      );
      return;
    }

    if (estado?.limpieza === "sucia") {
      toast.error("No puedes hacer check-in en una habitación sucia.");
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

      // Notificar a otros componentes del cambio
      window.dispatchEvent(new CustomEvent("estadoHabitacionesChanged"));

      // Cambiar estado de la reserva a "Check-in"
      await axios.put(
        `${import.meta.env.VITE_API_URL}/reservas/${id}/cambiar-estado`,
        { nuevoEstado: "Check-in" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        `Check-in realizado correctamente en la habitación ${habitacionSeleccionada}`
      );
      navigate("/reservas/check-in");
    } catch (error) {
      toast.error(
        `No se pudo realizar el check-in: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  }; // Maneja la selección de habitación y actualiza el estado visual
  const manejarSeleccionHabitacion = (numero) => {
    setHabitacionSeleccionada(numero);

    const estados =
      JSON.parse(localStorage.getItem("estadoHabitaciones")) || [];
    const bloqueos =
      JSON.parse(localStorage.getItem("bloqueosHabitaciones")) || [];

    const estado = estados.find((e) => e.numero === numero);

    // Verificar si está bloqueada
    const hoy = new Date();
    const estaBloqueada = bloqueos.some(
      (bloqueo) =>
        bloqueo.numero_habitacion === numero &&
        new Date(bloqueo.fecha_inicio) <= hoy &&
        new Date(bloqueo.fecha_fin) >= hoy
    ); // Verificar si está ocupada por otra reserva
    const estaOcupada = habitacionesOcupadas.includes(numero);
    const estaAsignada = habitacionesAsignadas.includes(numero);

    // Mostrar advertencias según el estado
    if (estaBloqueada) {
      toast.warning("La habitación seleccionada está bloqueada.");
    } else if (estaOcupada) {
      toast.warning("La habitación está ocupada (check-in realizado).");
    } else if (estaAsignada) {
      toast.warning(
        "La habitación está asignada a otra reserva (no disponible)."
      );
    } else if (estado?.ocupacion === "ocupada") {
      toast.warning("La habitación está marcada como ocupada en el planning.");
    } else if (estado?.limpieza === "sucia") {
      toast.warning("La habitación seleccionada está sucia.");
    }

    if (estado) {
      setEstadoSeleccionado(estado);
    } else {
      setEstadoSeleccionado(null);
    }

    // Forzar actualización del dropdown
    setRefreshKey((prev) => prev + 1);
  };
  const obtenerHabitacionesAsignadas = useCallback(async () => {
    if (!reserva?.fecha_entrada || !reserva?.fecha_salida) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/reservas/asignadas`,
        {
          params: {
            desde: reserva.fecha_entrada,
            hasta: reserva.fecha_salida,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Excluir la propia reserva actual
      const reservasOtras = data.filter(
        (r) => r.id_reserva !== reserva.id_reserva
      );

      // Separar entre ocupadas (con check-in) y asignadas (solo reserva)
      const ocupadas = reservasOtras
        .filter((r) => r.estado === "Check-in") // Solo las que ya hicieron check-in
        .map((r) => r.numero_habitacion);

      const asignadas = reservasOtras
        .filter((r) => r.estado !== "Check-in" && r.numero_habitacion) // Solo asignadas pero sin check-in
        .map((r) => r.numero_habitacion);

      setHabitacionesOcupadas(ocupadas);
      setHabitacionesAsignadas(asignadas);
    } catch (error) {
      toast.error("Error al obtener habitaciones ya asignadas");
    }
  }, [reserva.fecha_entrada, reserva.fecha_salida, reserva.id_reserva, token]); // Carga datos iniciales al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar reserva
        const reservaResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReserva(reservaResponse.data);
        setHabitacionSeleccionada(reservaResponse.data.numero_habitacion || "");
        setHuesped((prev) => ({
          ...prev,
          nombre: reservaResponse.data.nombre_huesped,
          primer_apellido: reservaResponse.data.primer_apellido_huesped,
          segundo_apellido: reservaResponse.data.segundo_apellido_huesped,
        }));

        // Cargar líneas de reserva
        const lineasResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/reservas/${id}/lineas`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLineasReserva(lineasResponse.data);

        // Cargar habitaciones disponibles
        const habitacionesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/habitaciones`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHabitaciones(habitacionesResponse.data.habitaciones);
      } catch (error) {
        toast.error(
          `Error al cargar datos: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    };

    cargarDatos();
  }, [id, token]);
  // Carga las habitaciones asignadas
  useEffect(() => {
    if (reserva?.fecha_entrada && reserva?.fecha_salida) {
      obtenerHabitacionesAsignadas();
    }
  }, [reserva, obtenerHabitacionesAsignadas]);
  // Forza la actualización del componente cuando cambie el estado de las habitaciones
  useEffect(() => {
    const handleStorageChange = () => {
      // Fuerza re-render cuando cambia el localStorage
      setRefreshKey((prev) => prev + 1);
    };

    // Escuchar cambios en localStorage
    window.addEventListener("storage", handleStorageChange);

    // También escuchar cambios personalizados para la misma pestaña
    window.addEventListener("estadoHabitacionesChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "estadoHabitacionesChanged",
        handleStorageChange
      );
    };
  }, []);

  // Busca cliente por número de documento y permite seleccionarlo
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
    } catch (error) {
      toast.error(
        `Error al buscar cliente: ${
          error.response?.data?.error || error.message
        }`
      );
      setClientesEncontrados([]);
    }
  };

  // Selecciona un cliente encontrado y rellena los datos del huésped
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

  if (!reserva)
    return (
      <div className="container-fluid py-5 mt-4">
        {/* Header */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mb-0">
                  Cargando datos de la reserva...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-11">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-box-arrow-in-down text-primary me-3"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div>
                    <h4 className="mb-0 fw-semibold">Check-in de Reserva</h4>
                    <small className="text-muted">
                      Reserva #{reserva.id_reserva} - {reserva.nombre_huesped}{" "}
                      {reserva.primer_apellido_huesped}{" "}
                      {reserva.segundo_apellido_huesped}
                    </small>
                  </div>
                </div>
                <div className="text-end">
                  <div className="badge bg-primary fs-6">
                    {new Date(
                      reserva.fecha_entrada + "T00:00:00"
                    ).toLocaleDateString("es-ES")}
                    {" - "}
                    {new Date(
                      reserva.fecha_salida + "T00:00:00"
                    ).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Card: Datos de la reserva */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-calendar-range me-2 text-primary"></i>
                Fechas de Estancia
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    Fecha de entrada *
                  </label>
                  <input
                    type="date"
                    name="fecha_entrada"
                    className="form-control rounded"
                    value={reserva.fecha_entrada}
                    onChange={(e) =>
                      setReserva({ ...reserva, fecha_entrada: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    Fecha de salida *
                  </label>
                  <input
                    type="date"
                    name="fecha_salida"
                    className="form-control rounded"
                    min={reserva.fecha_entrada}
                    value={reserva.fecha_salida}
                    onChange={(e) =>
                      setReserva({ ...reserva, fecha_salida: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Card: Datos del huésped */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-person-fill me-2 text-primary"></i>
                Datos del Huésped
              </h5>
            </div>
            <div className="card-body">
              {/* Datos básicos */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Nombre *
                  </label>
                  <input
                    name="nombre"
                    className="form-control rounded"
                    placeholder="Nombre del huésped"
                    value={huesped.nombre}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Primer apellido *
                  </label>
                  <input
                    name="primer_apellido"
                    className="form-control rounded"
                    placeholder="Primer apellido"
                    value={huesped.primer_apellido}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Segundo apellido
                  </label>
                  <input
                    name="segundo_apellido"
                    className="form-control rounded"
                    placeholder="Segundo apellido"
                    value={huesped.segundo_apellido}
                    onChange={manejarCambioHuesped}
                  />
                </div>
              </div>

              {/* Datos personales */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Fecha de nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    className="form-control rounded"
                    value={huesped.fecha_nacimiento || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Género *
                  </label>
                  <select
                    name="genero"
                    className="form-select rounded"
                    value={huesped.genero || ""}
                    onChange={manejarCambioHuesped}
                  >
                    <option value="">Selecciona</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Tipo de documento *
                  </label>
                  <select
                    name="tipo_documento"
                    className="form-select rounded"
                    value={huesped.tipo_documento || ""}
                    onChange={manejarCambioHuesped}
                  >
                    <option value="">Selecciona</option>
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Documento de Identidad">
                      Documento de Identidad
                    </option>
                    <option value="Permiso de Residencia">
                      Permiso de Residencia
                    </option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Fecha de expedición *
                  </label>
                  <input
                    type="date"
                    name="fecha_expedicion"
                    className="form-control rounded"
                    value={huesped.fecha_expedicion || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
              </div>

              {/* Documento con búsqueda */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    Número de documento *
                  </label>
                  <div className="input-group">
                    <input
                      name="numero_documento"
                      className="form-control"
                      placeholder="Ingresa el número de documento"
                      value={huesped.numero_documento || ""}
                      onChange={manejarCambioHuesped}
                    />
                    <button
                      className="btn btn-outline-secondary rounded-end"
                      type="button"
                      onClick={buscarClientePorDocumento}
                    >
                      <i className="bi bi-search me-1"></i>
                      Buscar
                    </button>
                  </div>
                  {clientesEncontrados.length > 1 && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Clientes encontrados:
                      </small>
                      <div className="list-group mt-1">
                        {clientesEncontrados.map((cliente) => (
                          <button
                            key={cliente.id_cliente}
                            type="button"
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            onClick={() => seleccionarCliente(cliente)}
                          >
                            <div>
                              <div className="fw-semibold">
                                {cliente.nombre} {cliente.primer_apellido}
                              </div>
                              <small className="text-muted">
                                {cliente.numero_documento}
                              </small>
                            </div>
                            <i className="bi bi-arrow-right text-primary"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    País *
                  </label>
                  <input
                    name="pais"
                    className="form-control rounded"
                    placeholder="País de origen"
                    value={huesped.pais || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
              </div>

              {/* Datos de contacto */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    Dirección
                  </label>
                  <input
                    name="direccion"
                    className="form-control rounded"
                    placeholder="Dirección completa"
                    value={huesped.direccion || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Ciudad
                  </label>
                  <input
                    name="ciudad"
                    className="form-control rounded"
                    placeholder="Ciudad"
                    value={huesped.ciudad || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Código Postal
                  </label>
                  <input
                    name="codigo_postal"
                    className="form-control rounded"
                    placeholder="CP"
                    value={huesped.codigo_postal || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
              </div>

              <div className="row mb-0">
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Teléfono
                  </label>
                  <input
                    name="telefono"
                    className="form-control rounded"
                    placeholder="Número de teléfono"
                    value={huesped.telefono || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted fw-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control rounded"
                    placeholder="correo@ejemplo.com"
                    value={huesped.email || ""}
                    onChange={manejarCambioHuesped}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-medium">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    className="form-control rounded"
                    rows={2}
                    placeholder="Observaciones adicionales..."
                    value={huesped.observaciones}
                    onChange={manejarCambioHuesped}
                  />
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Card: Selección de habitación */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-door-open me-2 text-primary"></i>
                Selección de Habitación
                {habitacionSeleccionada && (
                  <span className="badge bg-success ms-2">
                    Habitación {habitacionSeleccionada}
                  </span>
                )}
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Habitación asignada *
                  </label>{" "}
                  <select
                    className="form-select rounded"
                    value={habitacionSeleccionada}
                    onChange={(e) => manejarSeleccionHabitacion(e.target.value)}
                    required
                    key={refreshKey} // Fuerza re-render cuando cambia el estado
                  >
                    <option value="">-- Selecciona una habitación --</option>{" "}
                    {habitaciones.map((habitacion) => {
                      const estados =
                        JSON.parse(
                          localStorage.getItem("estadoHabitaciones")
                        ) || [];
                      const bloqueos =
                        JSON.parse(
                          localStorage.getItem("bloqueosHabitaciones")
                        ) || [];

                      const estado = estados.find(
                        (e) => e.numero === habitacion.numero_habitacion
                      );
                      const estaOcupada = habitacionesOcupadas.includes(
                        habitacion.numero_habitacion
                      );
                      const estaSeleccionada =
                        habitacion.numero_habitacion === habitacionSeleccionada;

                      // Verificar si está bloqueada
                      const hoy = new Date();
                      const estaBloqueada = bloqueos.some(
                        (bloqueo) =>
                          bloqueo.numero_habitacion ===
                            habitacion.numero_habitacion &&
                          new Date(bloqueo.fecha_inicio) <= hoy &&
                          new Date(bloqueo.fecha_fin) >= hoy
                      );

                      const ocupacion = estaBloqueada
                        ? "bloqueada"
                        : estado?.ocupacion || "libre";
                      const limpieza = estado?.limpieza || "limpia"; // Iconos visuales según estado real con prioridades:
                      // ⚫ bloqueada (máxima prioridad)
                      // 🔴 ocupada (check-in realizado) o sucia
                      // 🟡 asignada (otras reservas sin check-in)
                      // 🟢 libre y limpia
                      let icono = "⚪"; // por defecto

                      const estaAsignada = habitacionesAsignadas.includes(
                        habitacion.numero_habitacion
                      );

                      if (ocupacion === "bloqueada") {
                        icono = "⚫";
                      } else if (estaOcupada) {
                        // Habitación ocupada (check-in realizado)
                        icono = "🔴";
                      } else if (ocupacion === "ocupada") {
                        // Habitación marcada como ocupada en el planning
                        icono = "🔴";
                      } else if (limpieza === "sucia") {
                        // Habitación sucia
                        icono = "🔴";
                      } else if (estaAsignada) {
                        // Habitación asignada a otra reserva (sin check-in)
                        icono = "🟡";
                      } else if (
                        ocupacion === "libre" &&
                        limpieza === "limpia"
                      ) {
                        // Habitación libre y limpia
                        icono = "🟢";
                      }
                      const descripcion = `${
                        habitacion.tipo || "Standard"
                      }/${limpieza}`; // Determinar si la habitación debe estar deshabilitada
                      const debeDeshabilitarse =
                        (estaOcupada && !estaSeleccionada) || // Ocupada por otra reserva
                        (estaAsignada && !estaSeleccionada) || // Asignada a otra reserva
                        (estaBloqueada && !estaSeleccionada) || // Bloqueada
                        (ocupacion === "ocupada" && !estaSeleccionada) || // Marcada como ocupada en planning
                        (limpieza === "sucia" && !estaSeleccionada); // Habitación sucia

                      return (
                        <option
                          key={habitacion.numero_habitacion}
                          value={habitacion.numero_habitacion}
                          disabled={debeDeshabilitarse}
                        >
                          {icono} Habitación {habitacion.numero_habitacion} -{" "}
                          {descripcion}
                        </option>
                      );
                    })}
                  </select>{" "}
                </div>
                <div className="col-md-8 d-flex justify-content-around align-items-end">
                  <div className="d-flex flex-wrap gap-3 mt-3">
                    <span className="d-flex px-2 align-items-center">
                      <span className="me-1" style={{ fontSize: "1.1em" }}>
                        🟢
                      </span>
                      <small className="text-muted">Libre</small>
                    </span>
                    <span className="d-flex px-2 align-items-center">
                      <span className="me-1" style={{ fontSize: "1.1em" }}>
                        🔴
                      </span>
                      <small className="text-muted">Ocupada</small>
                    </span>
                    <span className="d-flex px-2 align-items-center">
                      <span className="me-1" style={{ fontSize: "1.1em" }}>
                        🟡
                      </span>
                      <small className="text-muted">Asignada</small>
                    </span>
                    <span className="d-flex px-2 align-items-center">
                      <span className="me-1" style={{ fontSize: "1.1em" }}>
                        ⚫
                      </span>
                      <small className="text-muted">Bloqueada</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Card: Líneas de reserva */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Líneas de Reserva
                {lineasReserva.length > 0 && (
                  <span className="badge bg-primary ms-2">
                    {lineasReserva.length}
                  </span>
                )}
              </h5>
            </div>
            <div className="card-body">
              {lineasReserva.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox" style={{ fontSize: "2rem" }}></i>
                  <p className="mt-2 mb-0">
                    No hay líneas registradas para esta reserva
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Régimen</th>
                        <th>Habitaciones</th>
                        <th>Ocupación</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineasReserva.map((linea) => (
                        <tr key={linea.id_linea_reserva}>
                          <td>
                            <small className="text-muted">
                              {new Date(
                                linea.fecha + "T00:00:00"
                              ).toLocaleDateString("es-ES")}
                            </small>
                          </td>
                          <td>{linea.tipo_habitacion}</td>
                          <td>
                            <small className="text-muted">
                              {linea.regimen}
                            </small>
                          </td>
                          <td className="text-center">
                            {linea.cantidad_habitaciones}
                          </td>
                          <td>
                            {linea.cantidad_adultos}A + {linea.cantidad_ninos}N
                          </td>
                          <td className="fw-semibold">
                            {parseFloat(linea.precio).toFixed(2)}€
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          {/* Botón para confirmar el check-in */}
          <div className="d-grid">
            <button
              className="btn btn-success btn-lg rounded"
              onClick={confirmarCheckIn}
              disabled={!habitacionSeleccionada}
            >
              <i className="bi bi-check-circle me-2"></i>
              Confirmar Check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInReserva;
