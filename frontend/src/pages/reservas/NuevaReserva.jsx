// Página para registrar una nueva reserva y sus líneas asociadas.
// Permite introducir datos del huésped, fechas, habitación, observaciones y añadir múltiples líneas de reserva.
// Incluye validaciones de fechas, cantidades y feedback visual.

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const NuevaReserva = () => {
  const { token } = useContext(AuthContext);
  // Estado para los datos de la reserva principal
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

  // Estado para las líneas de reserva
  const [lineas, setLineas] = useState([]);
  // Estado para la línea de reserva en edición
  const [nuevaLinea, setNuevaLinea] = useState({
    tipo_habitacion: "",
    fecha: "",
    cantidad_habitaciones: 1,
    precio: "",
    regimen: "",
    cantidad_adultos: 1,
    cantidad_ninos: 0,
  }); // Estados para gestión de empresa
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [buscarEmpresa, setBuscarEmpresa] = useState("");
  const [empresasSugeridas, setEmpresasSugeridas] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [mostrarFormularioEmpresa, setMostrarFormularioEmpresa] =
    useState(false);
  const [nuevaEmpresaDatos, setNuevaEmpresaDatos] = useState({
    nombre: "",
    cif: "",
    direccion: "",
    ciudad: "",
    pais: "",
    codigo_postal: "",
    telefono: "",
    email: "",
  });
  // Maneja cambios en los campos de la reserva principal
  const manejarCambioReserva = (e) => {
    const { name, value } = e.target;
    setReserva((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja cambios en los campos de la línea de reserva en edición
  const manejarCambioLinea = (e) => {
    const { name, value } = e.target;
    setNuevaLinea({ ...nuevaLinea, [name]: value });
  };

  // Añade una nueva línea de reserva tras validar los campos
  const añadirLinea = () => {
    if (
      !nuevaLinea.tipo_habitacion ||
      !nuevaLinea.fecha ||
      !nuevaLinea.precio
    ) {
      toast.warning("Completa todos los campos de la línea");
      return;
    }

    const fechaLinea = new Date(nuevaLinea.fecha);
    const entrada = new Date(reserva.fecha_entrada);
    const salida = new Date(reserva.fecha_salida);

    // Ajustar horas a 00:00 para comparación precisa
    entrada.setHours(0, 0, 0, 0);
    salida.setHours(0, 0, 0, 0);

    if (fechaLinea < entrada || fechaLinea >= salida) {
      toast.warning(
        "La fecha de la línea debe estar dentro del rango de la estancia"
      );
      return;
    }

    setLineas([...lineas, nuevaLinea]);
    setNuevaLinea({
      tipo_habitacion: "",
      fecha: "",
      cantidad_habitaciones: 1,
      precio: "",
      regimen: "",
      cantidad_adultos: 1,
      cantidad_ninos: 0,
    });
  };
  // Elimina una línea de reserva de la lista
  const eliminarLinea = (index) => {
    const nuevas = [...lineas];
    nuevas.splice(index, 1);
    setLineas(nuevas);
  };
  // Funciones para gestión de empresas
  const buscarEmpresas = async (termino) => {
    if (!termino || termino.length < 2) {
      setEmpresasSugeridas([]);
      setMostrarSugerencias(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/empresas/nombre/${termino}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmpresasSugeridas(response.data || []);
      // Siempre mostrar sugerencias después de una búsqueda, incluso si no hay resultados
      setMostrarSugerencias(true);
    } catch (error) {
      console.error("Error buscando empresas:", error);
      setEmpresasSugeridas([]);
      // También mostrar el dropdown en caso de error para permitir crear nueva empresa
      setMostrarSugerencias(true);
    }
  };
  const manejarCambioEmpresa = (e) => {
    const valor = e.target.value;
    setBuscarEmpresa(valor);

    // Si se borra el campo, limpiar empresa seleccionada y sugerencias
    if (!valor) {
      setEmpresaSeleccionada(null);
      setReserva((prev) => ({ ...prev, id_empresa: null }));
      setMostrarSugerencias(false);
      setEmpresasSugeridas([]);
      return;
    }
  };

  // Nueva función para búsqueda manual con botón
  const ejecutarBusquedaEmpresa = () => {
    if (buscarEmpresa && buscarEmpresa.length >= 2) {
      buscarEmpresas(buscarEmpresa);
    } else if (buscarEmpresa.length < 2) {
      toast.warning("Introduce al menos 2 caracteres para buscar");
    }
  };
  const seleccionarEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setBuscarEmpresa(empresa.nombre);
    setReserva((prev) => ({ ...prev, id_empresa: empresa.id_empresa }));
    setMostrarSugerencias(false);
  };

  // Función para mostrar formulario de nueva empresa
  const iniciarCreacionEmpresa = () => {
    setNuevaEmpresaDatos((prev) => ({ ...prev, nombre: buscarEmpresa }));
    setMostrarFormularioEmpresa(true);
    setMostrarSugerencias(false);
  };

  // Función para crear nueva empresa
  const crearNuevaEmpresa = async () => {
    if (!nuevaEmpresaDatos.nombre.trim()) {
      toast.warning("El nombre de la empresa es obligatorio");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/empresas/registro`,
        nuevaEmpresaDatos,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const empresaCreada = response.data.empresa;
      setEmpresaSeleccionada(empresaCreada);
      setBuscarEmpresa(empresaCreada.nombre);
      setReserva((prev) => ({ ...prev, id_empresa: empresaCreada.id_empresa }));
      setMostrarFormularioEmpresa(false);
      setNuevaEmpresaDatos({
        nombre: "",
        cif: "",
        direccion: "",
        ciudad: "",
        pais: "",
        codigo_postal: "",
        telefono: "",
        email: "",
      });
      toast.success("Empresa creada y asociada a la reserva");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al crear la empresa");
    }
  };
  // Función para manejar cambios en el formulario de nueva empresa
  const manejarCambioNuevaEmpresa = (e) => {
    const { name, value } = e.target;
    setNuevaEmpresaDatos((prev) => ({ ...prev, [name]: value }));
  };

  // Envía la reserva y sus líneas a la API tras validar los datos
  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (lineas.length === 0) {
      toast.error("Debe añadir al menos una línea de reserva");
      return;
    }

    const entrada = new Date(reserva.fecha_entrada);
    const salida = new Date(reserva.fecha_salida);
    const hoyDate = new Date();
    hoyDate.setHours(0, 0, 0, 0); // Quita la parte de la hora para comparar bien

    if (entrada < hoyDate) {
      toast.error("La fecha de entrada no puede ser anterior a hoy");
      return;
    }

    if (salida <= entrada) {
      toast.error("La fecha de salida debe ser posterior a la de entrada");
      return;
    }

    // Validación: número de líneas debe coincidir con número de noches
    const diffTime = salida.getTime() - entrada.getTime();
    const numNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (lineas.length !== numNoches) {
      toast.error(
        `Debe añadir una línea de reserva por cada noche de estancia (${numNoches} noches)`
      );
      return;
    }

    // Validación: no puede haber varias líneas para la misma fecha
    const fechas = lineas.map((l) => l.fecha);
    const fechasUnicas = new Set(fechas);
    if (fechas.length !== fechasUnicas.size) {
      toast.error("No puede haber más de una línea de reserva para la misma fecha");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reservas/registro`,
        {
          ...reserva,
          estado: "Confirmada",
          lineas,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReserva({
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

      // Limpiar estados de empresa
      setEmpresaSeleccionada(null);
      setBuscarEmpresa("");
      setEmpresasSugeridas([]);
      setMostrarSugerencias(false);
      setMostrarFormularioEmpresa(false);
      setNuevaEmpresaDatos({
        nombre: "",
        cif: "",
        direccion: "",
        ciudad: "",
        pais: "",
        codigo_postal: "",
        telefono: "",
        email: "",
      });

      toast.success(
        `Reserva ${response.data.reserva.id_reserva} registrada correctamente`
      );
      setLineas([]);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Error al registrar la reserva"
      );
    }
  };

  // Obtenemos la fecha actual
  const hoy = new Date().toISOString().split("T")[0];

  // Convertimos fechas de entrada y salida a formato YYYY-MM-DD
  const fechaEntradaMin = reserva.fecha_entrada || "";
  const fechaSalidaMax = reserva.fecha_salida
    ? new Date(new Date(reserva.fecha_salida).getTime() - 86400000) // 1 día menos
        .toISOString()
        .split("T")[0]
    : "";

  return (
    <div className="container-fluid py-5 mt-4" style={{ maxWidth: "1200px" }}>
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-center align-items-center">
                <i
                  className="bi bi-plus-circle-fill text-primary me-3"
                  style={{ fontSize: "1.5rem" }}
                ></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Nueva Reserva</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={manejarSubmit} className="row justify-content-center">
        <div className="col-lg-10">
          {/* Card: Datos de la reserva */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-person-fill text-primary me-2"></i>
                Datos de la Reserva
              </h5>
            </div>
            <div className="card-body">
              {/* Campos para los datos del huésped */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Nombre del huésped *
                  </label>
                  <input
                    name="nombre_huesped"
                    className="form-control rounded"
                    placeholder="Nombre"
                    value={reserva.nombre_huesped}
                    onChange={manejarCambioReserva}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Primer apellido *
                  </label>
                  <input
                    name="primer_apellido_huesped"
                    className="form-control rounded"
                    placeholder="Primer apellido"
                    value={reserva.primer_apellido_huesped}
                    onChange={manejarCambioReserva}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Segundo apellido
                  </label>
                  <input
                    name="segundo_apellido_huesped"
                    className="form-control rounded"
                    placeholder="Segundo apellido"
                    value={reserva.segundo_apellido_huesped}
                    onChange={manejarCambioReserva}
                  />
                </div>{" "}
              </div>

              {/* Campo para empresa */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label text-muted fw-medium">
                    <i className="bi bi-building me-1"></i>
                    Empresa
                  </label>{" "}
                  <div className="position-relative">
                    {/* Input de búsqueda o empresa seleccionada */}
                    {empresaSeleccionada ? (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control rounded-start"
                          value={`${empresaSeleccionada.nombre}${
                            empresaSeleccionada.cif
                              ? ` (${empresaSeleccionada.cif})`
                              : ""
                          }`}
                          readOnly
                          style={{ backgroundColor: "#f8f9fa" }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary rounded-end"
                          onClick={() => {
                            setEmpresaSeleccionada(null);
                            setBuscarEmpresa("");
                            setReserva((prev) => ({
                              ...prev,
                              id_empresa: null,
                            }));
                            setMostrarSugerencias(false);
                          }}
                          title="Cambiar empresa"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar empresa por nombre..."
                          value={buscarEmpresa}
                          onChange={manejarCambioEmpresa}
                          onFocus={() =>
                            empresasSugeridas.length > 0 &&
                            setMostrarSugerencias(true)
                          }
                          onBlur={(e) => {
                            // Ocultar sugerencias solo si no se está haciendo clic en una sugerencia
                            setTimeout(() => {
                              if (
                                !e.currentTarget.contains(
                                  document.activeElement
                                )
                              ) {
                                setMostrarSugerencias(false);
                              }
                            }, 150);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              ejecutarBusquedaEmpresa();
                            }
                          }}
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={ejecutarBusquedaEmpresa}
                          disabled={!buscarEmpresa || buscarEmpresa.length < 2}
                          title="Buscar empresa"
                        >
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    )}

                    {/* Dropdown de sugerencias */}
                    {mostrarSugerencias && !empresaSeleccionada && (
                      <div
                        className="position-absolute w-100 mt-1"
                        style={{ zIndex: 1000 }}
                      >
                        <div className="list-group shadow">
                          {empresasSugeridas.length > 0
                            ? empresasSugeridas.slice(0, 5).map((empresa) => (
                                <button
                                  key={empresa.id_empresa}
                                  type="button"
                                  className="list-group-item list-group-item-action"
                                  onClick={() => seleccionarEmpresa(empresa)}
                                >
                                  <div className="d-flex w-100 justify-content-between">
                                    <h6 className="mb-1">{empresa.nombre}</h6>
                                    <small className="text-muted">
                                      {empresa.cif}
                                    </small>
                                  </div>
                                  {empresa.ciudad && (
                                    <small className="text-muted">
                                      {empresa.ciudad}
                                    </small>
                                  )}
                                </button>
                              ))
                            : buscarEmpresa &&
                              buscarEmpresa.length >= 2 && (
                                <div className="list-group-item">
                                  <div className="text-center py-2">
                                    <i
                                      className="bi bi-search text-muted mb-2"
                                      style={{ fontSize: "1.2rem" }}
                                    ></i>
                                    <p className="mb-2 text-muted small">
                                      No se encontraron empresas con ese nombre
                                    </p>
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={iniciarCreacionEmpresa}
                                    >
                                      <i className="bi bi-plus-circle me-1"></i>
                                      Crear nueva empresa
                                    </button>
                                  </div>
                                </div>
                              )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal para crear nueva empresa */}
              {mostrarFormularioEmpresa && (
                <div className="row mb-3">
                  <div className="col-12">
                    <div className="card border-primary">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="bi bi-building me-2"></i>
                          Crear Nueva Empresa
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              Nombre de la empresa *
                            </label>
                            <input
                              type="text"
                              name="nombre"
                              className="form-control"
                              value={nuevaEmpresaDatos.nombre}
                              onChange={manejarCambioNuevaEmpresa}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">CIF/NIF</label>
                            <input
                              type="text"
                              name="cif"
                              className="form-control"
                              value={nuevaEmpresaDatos.cif}
                              onChange={manejarCambioNuevaEmpresa}
                              placeholder="Ej: B12345678"
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Dirección</label>
                            <input
                              type="text"
                              name="direccion"
                              className="form-control"
                              value={nuevaEmpresaDatos.direccion}
                              onChange={manejarCambioNuevaEmpresa}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Ciudad</label>
                            <input
                              type="text"
                              name="ciudad"
                              className="form-control"
                              value={nuevaEmpresaDatos.ciudad}
                              onChange={manejarCambioNuevaEmpresa}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">País</label>
                            <input
                              type="text"
                              name="pais"
                              className="form-control"
                              value={nuevaEmpresaDatos.pais}
                              onChange={manejarCambioNuevaEmpresa}
                              placeholder="Ej: España"
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">Código Postal</label>
                            <input
                              type="text"
                              name="codigo_postal"
                              className="form-control"
                              value={nuevaEmpresaDatos.codigo_postal}
                              onChange={manejarCambioNuevaEmpresa}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Teléfono</label>
                            <input
                              type="tel"
                              name="telefono"
                              className="form-control"
                              value={nuevaEmpresaDatos.telefono}
                              onChange={manejarCambioNuevaEmpresa}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              value={nuevaEmpresaDatos.email}
                              onChange={manejarCambioNuevaEmpresa}
                            />
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={crearNuevaEmpresa}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Crear y Asociar Empresa
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setMostrarFormularioEmpresa(false)}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Campos para las fechas y observaciones */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Fecha de entrada *
                  </label>
                  <input
                    type="date"
                    name="fecha_entrada"
                    className="form-control rounded"
                    min={hoy}
                    value={reserva.fecha_entrada}
                    onChange={manejarCambioReserva}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Fecha de salida *
                  </label>
                  <input
                    type="date"
                    name="fecha_salida"
                    className="form-control rounded"
                    min={reserva.fecha_entrada || hoy}
                    value={reserva.fecha_salida}
                    onChange={manejarCambioReserva}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-medium">
                    Número de habitación
                  </label>
                  <input
                    name="numero_habitacion"
                    className="form-control rounded"
                    placeholder="Ej: 204"
                    value={reserva.numero_habitacion}
                    onChange={manejarCambioReserva}
                  />
                </div>
              </div>

              <div className="mb-0">
                <label className="form-label text-muted fw-medium">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  className="form-control rounded"
                  placeholder="Observaciones adicionales..."
                  rows="3"
                  value={reserva.observaciones}
                  onChange={manejarCambioReserva}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card: Líneas de reserva */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Líneas de Reserva
                {lineas.length > 0 && (
                  <span className="badge bg-primary ms-2">{lineas.length}</span>
                )}
              </h5>
            </div>
            <div className="card-body">
              {/* Formulario para añadir línea de reserva */}
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-plus-circle me-2"></i>
                  Añadir nueva línea
                </h6>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label className="form-label text-muted fw-medium">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      className="form-control rounded"
                      value={nuevaLinea.fecha}
                      min={fechaEntradaMin}
                      max={fechaSalidaMax}
                      onChange={manejarCambioLinea}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted fw-medium">
                      Tipo habitación *
                    </label>
                    <select
                      name="tipo_habitacion"
                      className="form-select rounded"
                      value={nuevaLinea.tipo_habitacion}
                      onChange={manejarCambioLinea}
                    >
                      <option value="" disabled>
                        Selecciona tipo
                      </option>
                      <option value="Individual">Individual</option>
                      <option value="Doble">Doble</option>
                      <option value="Triple">Triple</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label text-muted fw-medium">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      name="cantidad_habitaciones"
                      className="form-control rounded"
                      min="1"
                      value={nuevaLinea.cantidad_habitaciones}
                      onChange={manejarCambioLinea}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-medium">
                      Régimen
                    </label>
                    <select
                      name="regimen"
                      className="form-select rounded"
                      value={nuevaLinea.regimen}
                      onChange={manejarCambioLinea}
                    >
                      <option value="" disabled>
                        Selecciona régimen
                      </option>
                      <option value="Solo Alojamiento">Solo Alojamiento</option>
                      <option value="Alojamiento y Desayuno">
                        Alojamiento y Desayuno
                      </option>
                      <option value="Media Pension">Media Pensión</option>
                      <option value="Pension completa">Pensión Completa</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-2">
                    <label className="form-label text-muted fw-medium">
                      Adultos
                    </label>
                    <input
                      name="cantidad_adultos"
                      type="number"
                      min="0"
                      max="3"
                      className="form-control rounded"
                      value={nuevaLinea.cantidad_adultos}
                      onChange={manejarCambioLinea}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label text-muted fw-medium">
                      Niños
                    </label>
                    <input
                      name="cantidad_ninos"
                      type="number"
                      min="0"
                      max="3"
                      className="form-control rounded"
                      value={nuevaLinea.cantidad_ninos}
                      onChange={manejarCambioLinea}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted fw-medium">
                      Precio/noche *
                    </label>
                    <input
                      name="precio"
                      type="number"
                      step="0.01"
                      className="form-control rounded"
                      placeholder="0.00"
                      value={nuevaLinea.precio}
                      onChange={manejarCambioLinea}
                    />
                  </div>
                  <div className="col-md-5 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-success rounded w-100"
                      onClick={añadirLinea}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Añadir línea
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de líneas añadidas */}
              {lineas.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Régimen</th>
                        <th>Habitaciones</th>
                        <th>Ocupación</th>
                        <th>Precio</th>
                        <th width="80">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineas.map((l, i) => (
                        <tr key={i}>
                          <td>
                            {new Date(l.fecha + "T00:00:00").toLocaleDateString(
                              "es-ES"
                            )}
                          </td>
                          <td>{l.tipo_habitacion}</td>
                          <td>
                            <small className="text-muted">{l.regimen}</small>
                          </td>
                          <td className="text-center">
                            {l.cantidad_habitaciones}
                          </td>
                          <td>
                            {l.cantidad_adultos}A + {l.cantidad_ninos}N
                          </td>
                          <td className="fw-semibold">
                            {parseFloat(l.precio).toFixed(2)}€
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded"
                              onClick={() => eliminarLinea(i)}
                              title="Eliminar línea"
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox" style={{ fontSize: "2rem" }}></i>
                  <p className="mt-2 mb-0">No hay líneas de reserva añadidas</p>
                  <small>
                    Completa el formulario anterior para añadir líneas y poder
                    confirmar la reserva
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Botón para registrar la reserva */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded"
              disabled={lineas.length === 0}
            >
              <i className="bi bi-check-circle me-2"></i>
              Registrar Reserva
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NuevaReserva;
