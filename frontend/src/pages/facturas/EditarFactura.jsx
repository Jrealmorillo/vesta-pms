// EditarFactura.jsx
// Componente para modificar los datos de una factura existente
// Permite cambiar forma de pago y estado, agregar nuevos cargos y recuperar facturas anuladas
// Aplicando el patrón de diseño sobrio

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const EditarFactura = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    forma_pago: "",
    estado: "",
    id_empresa: null,
    id_cliente: null,
  });
  const [nuevoCargo, setNuevoCargo] = useState({
    concepto: "",
    cantidad: 1,
    precio_unitario: 0,
  });
  const [mostrarFormularioCargo, setMostrarFormularioCargo] = useState(false);

  // Estados para gestión de empresa
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [buscarEmpresa, setBuscarEmpresa] = useState("");
  const [empresasSugeridas, setEmpresasSugeridas] = useState([]);
  const [mostrarSugerenciasEmpresa, setMostrarSugerenciasEmpresa] =
    useState(false);

  // Estados para gestión de cliente
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [buscarCliente, setBuscarCliente] = useState("");
  const [clientesSugeridos, setClientesSugeridos] = useState([]);
  const [mostrarSugerenciasCliente, setMostrarSugerenciasCliente] =
    useState(false);
  const token = localStorage.getItem("token");

  // Funciones para gestión de empresas
  const buscarEmpresas = async (termino) => {
    if (!termino || termino.length < 2) {
      setEmpresasSugeridas([]);
      setMostrarSugerenciasEmpresa(false);
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
      setMostrarSugerenciasEmpresa(true);
    } catch (error) {
      console.error("Error buscando empresas:", error);
      setEmpresasSugeridas([]);
      setMostrarSugerenciasEmpresa(true);
    }
  };

  const manejarCambioEmpresa = (e) => {
    const valor = e.target.value;
    setBuscarEmpresa(valor);

    if (!valor) {
      setEmpresaSeleccionada(null);
      setFormData((prev) => ({ ...prev, id_empresa: null }));
      setMostrarSugerenciasEmpresa(false);
      setEmpresasSugeridas([]);
      return;
    }
  };

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
    setFormData((prev) => ({ ...prev, id_empresa: empresa.id_empresa }));
    setMostrarSugerenciasEmpresa(false);

    // EXCLUSIÓN MUTUA: Limpiar cliente cuando se selecciona empresa
    if (clienteSeleccionado) {
      setClienteSeleccionado(null);
      setBuscarCliente("");
      setFormData((prev) => ({ ...prev, id_cliente: null }));
      setMostrarSugerenciasCliente(false);
      toast.info(
        "Cliente deseleccionado: una factura no puede tener empresa y cliente al mismo tiempo"
      );
    }
  };

  // Funciones para gestión de clientes
  const buscarClientes = async (termino) => {
    if (!termino || termino.length < 2) {
      setClientesSugeridos([]);
      setMostrarSugerenciasCliente(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/clientes/nombre/${termino}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClientesSugeridos(response.data || []);
      setMostrarSugerenciasCliente(true);
    } catch (error) {
      console.error("Error buscando clientes:", error);
      setClientesSugeridos([]);
      setMostrarSugerenciasCliente(true);
    }
  };

  const manejarCambioCliente = (e) => {
    const valor = e.target.value;
    setBuscarCliente(valor);

    if (!valor) {
      setClienteSeleccionado(null);
      setFormData((prev) => ({ ...prev, id_cliente: null }));
      setMostrarSugerenciasCliente(false);
      setClientesSugeridos([]);
      return;
    }
  };

  const ejecutarBusquedaCliente = () => {
    if (buscarCliente && buscarCliente.length >= 2) {
      buscarClientes(buscarCliente);
    } else if (buscarCliente.length < 2) {
      toast.warning("Introduce al menos 2 caracteres para buscar");
    }
  };
  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBuscarCliente(
      `${cliente.nombre} ${cliente.primer_apellido || ""} ${
        cliente.segundo_apellido || ""
      }`
    );
    setFormData((prev) => ({ ...prev, id_cliente: cliente.id_cliente }));
    setMostrarSugerenciasCliente(false);

    // EXCLUSIÓN MUTUA: Limpiar empresa cuando se selecciona cliente
    if (empresaSeleccionada) {
      setEmpresaSeleccionada(null);
      setBuscarEmpresa("");
      setFormData((prev) => ({ ...prev, id_empresa: null }));
      setMostrarSugerenciasEmpresa(false);
      toast.info(
        "Empresa deseleccionada: una factura no puede tener empresa y cliente al mismo tiempo"
      );
    }
  };

  // Cargar datos de la factura
  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/facturas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFactura(data);
        setFormData({
          forma_pago: data.forma_pago,
          estado: data.estado,
          id_empresa: data.id_empresa,
          id_cliente: data.id_cliente,
        });
        // Inicializar empresa seleccionada si existe
        if (data.empresa) {
          setEmpresaSeleccionada(data.empresa);
          setBuscarEmpresa(data.empresa.nombre);
        }

        // Inicializar cliente seleccionado si existe
        if (data.cliente) {
          setClienteSeleccionado(data.cliente);
          setBuscarCliente(
            `${data.cliente.nombre} ${data.cliente.primer_apellido || ""} ${
              data.cliente.segundo_apellido || ""
            }`
          );
        }

        setLoading(false);
      } catch (error) {
        toast.error(`${error.response?.data?.error || error.message}`);
        navigate("/facturas/buscar");
      }
    };
    cargarFactura();
  }, [id, token, navigate]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.forma_pago || !formData.estado) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/facturas/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Factura modificada correctamente");
      navigate(`/facturas/${id}`);
    } catch (error) {
      toast.error(
        `Error al modificar la factura: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  // Manejar cambios en el formulario de nuevo cargo
  const handleCargoChange = (e) => {
    const { name, value } = e.target;
    setNuevoCargo((prev) => ({
      ...prev,
      [name]:
        name === "cantidad"
          ? parseInt(value, 10) || 1
          : name === "precio_unitario"
          ? parseFloat(value) || 0
          : value,
    }));
  };
  // Agregar nuevo cargo
  const agregarCargo = async () => {
    if (
      !nuevoCargo.concepto ||
      nuevoCargo.cantidad <= 0 ||
      nuevoCargo.precio_unitario < 0
    ) {
      toast.error("Datos del cargo inválidos");
      return;
    }

    try {
      const total = (nuevoCargo.cantidad * nuevoCargo.precio_unitario).toFixed(
        2
      );

      await axios.post(
        `${import.meta.env.VITE_API_URL}/detalles-factura`,
        {
          id_reserva: factura.id_reserva,
          id_factura: factura.id_factura, // Asociar directamente a la factura existente
          concepto: nuevoCargo.concepto,
          cantidad: nuevoCargo.cantidad,
          precio_unitario: nuevoCargo.precio_unitario,
          total,
          fecha: new Date().toISOString().split("T")[0], // Fecha actual
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Cargo añadido correctamente");
      setNuevoCargo({ concepto: "", cantidad: 1, precio_unitario: 0 });
      setMostrarFormularioCargo(false);

      // Recargar la factura para ver el nuevo cargo
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/facturas/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFactura(data);
    } catch (error) {
      toast.error(
        `Error al agregar cargo: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  // Recuperar factura anulada
  const recuperarFactura = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Recuperar factura anulada?",
      text: "Esta acción cambiará el estado de la factura a 'Pendiente'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, recuperar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/facturas/${id}`,
        { estado: "Pendiente" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Factura recuperada correctamente");

      // Recargar los datos de la factura
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/facturas/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFactura(data);
      setFormData({
        forma_pago: data.forma_pago,
        estado: data.estado,
        id_empresa: data.id_empresa,
        id_cliente: data.id_cliente,
      });
    } catch (error) {
      toast.error(
        `Error al recuperar la factura: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i
                  className="bi bi-clock text-muted mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="text-muted">Cargando datos de la factura...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi bi-pencil-square fs-2 text-primary me-3"></i>
                  <div>
                    {" "}
                    <h2 className="mb-1">
                      Editar Factura #{factura.id_factura}
                    </h2>
                  </div>
                </div>{" "}
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(`/facturas/${id}`)}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </button>
                {factura.estado === "Anulada" && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={recuperarFactura}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Recuperar Factura
                  </button>
                )}
              </div>
            </div>
          </div>{" "}
          {/* Información actual de la factura */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-info-circle text-muted me-2"></i>
                Información Actual
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <span className="text-muted fw-medium">
                      Fecha de emisión:
                    </span>
                    <br />
                    <strong>
                      {new Date(factura.fecha_emision).toLocaleDateString(
                        "es-ES"
                      )}
                    </strong>
                  </p>{" "}
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Huésped:</span>
                    <br />{" "}
                    <strong>
                      {factura.reserva
                        ? `${factura.reserva.nombre_huesped} ${
                            factura.reserva.primer_apellido_huesped || ""
                          } ${factura.reserva.segundo_apellido_huesped || ""}`
                        : factura.nombre_huesped || "—"}
                    </strong>
                  </p>
                  {/* Mostrar empresa actual si existe */}
                  {factura.empresa && (
                    <p className="mb-2">
                      <span className="text-muted fw-medium">
                        Empresa actual:
                      </span>
                      <br />
                      <strong className="text-primary">
                        {factura.empresa.nombre}
                      </strong>
                      {factura.empresa.cif && (
                        <>
                          <br />
                          <small className="text-muted">
                            CIF: {factura.empresa.cif}
                          </small>
                        </>
                      )}
                    </p>
                  )}
                  {/* Mostrar cliente actual si existe */}
                  {factura.cliente && (
                    <p className="mb-2">
                      <span className="text-muted fw-medium">
                        Cliente actual:
                      </span>
                      <br />
                      <strong className="text-info">
                        {factura.cliente.nombre}{" "}
                        {factura.cliente.primer_apellido || ""}{" "}
                        {factura.cliente.segundo_apellido || ""}
                      </strong>
                      {factura.cliente.numero_documento && (
                        <>
                          <br />
                          <small className="text-muted">
                            Doc: {factura.cliente.numero_documento}
                          </small>
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Reserva:</span>
                    <br />
                    <strong>#{factura.id_reserva}</strong>
                  </p>
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Estado actual:</span>
                    <br />
                    <span
                      className={`badge ${
                        factura.estado === "Pagada"
                          ? "bg-success"
                          : factura.estado === "Anulada"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {factura.estado}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="text-muted fw-medium">
                      Forma de pago actual:
                    </span>
                    <br />
                    <strong>{factura.forma_pago}</strong>
                  </p>
                  <p className="mb-2">
                    <span className="text-muted fw-medium">Total:</span>
                    <br />
                    <strong className="text-primary fs-5">
                                          {factura.detalles
                      .reduce((sum, d) => sum + parseFloat(d.total || 0), 0)
                      .toFixed(2)}
                    €
                      {/* {parseFloat(factura.total).toFixed(2)}€ */}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Formulario de edición */}
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light border-bottom">
                <h5 className="mb-0">
                  <i className="bi bi-gear text-muted me-2"></i>
                  Datos Modificables
                </h5>
              </div>
              {/* Nota informativa sobre exclusión mutua */}{" "}
              <div className="col-12 mt-2">
                <div className="alert alert-info d-flex align-items-center">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <div>
                    <strong>Nota:</strong> Una factura solo puede asociarse a
                    una empresa <strong>o</strong> cliente. Seleccionar uno
                    deselecciona el otro automáticamente.
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between">
              {/* Sección de Empresa */}
              <div className="col-md-5">
                <label className="form-label text-muted fw-medium">
                  Empresa
                </label>
                <div className="position-relative">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Buscar empresa..."
                      value={buscarEmpresa}
                      onChange={manejarCambioEmpresa}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={ejecutarBusquedaEmpresa}
                    >
                      <i className="bi bi-search"></i>
                    </button>
                    {empresaSeleccionada && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          setEmpresaSeleccionada(null);
                          setBuscarEmpresa("");
                          setFormData((prev) => ({
                            ...prev,
                            id_empresa: null,
                          }));
                          setMostrarSugerenciasEmpresa(false);
                        }}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>

                  {/* Dropdown de sugerencias de empresas */}
                  {mostrarSugerenciasEmpresa && (
                    <div
                      className="dropdown-menu show w-100 mt-1 shadow-sm"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {empresasSugeridas.length > 0 ? (
                        empresasSugeridas.map((empresa) => (
                          <button
                            key={empresa.id_empresa}
                            type="button"
                            className="dropdown-item d-flex justify-content-between align-items-center"
                            onClick={() => seleccionarEmpresa(empresa)}
                          >
                            <div>
                              <div className="fw-medium">{empresa.nombre}</div>
                              {empresa.cif && (
                                <small className="text-muted">
                                  CIF: {empresa.cif}
                                </small>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="dropdown-item-text text-muted">
                          <i className="bi bi-info-circle me-2"></i>
                          No se encontraron empresas
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empresa seleccionada */}
                  {empresaSeleccionada && (
                    <div className="mt-2 p-2 bg-light rounded border">
                      <small className="text-muted">
                        Empresa seleccionada:
                      </small>
                      <div className="fw-medium">
                        {empresaSeleccionada.nombre}
                      </div>
                      {empresaSeleccionada.cif && (
                        <small className="text-muted">
                          CIF: {empresaSeleccionada.cif}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Sección de Cliente */}
              <div className="col-md-5">
                <label className="form-label text-muted fw-medium">
                  Cliente
                </label>
                <div className="position-relative">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Buscar cliente..."
                      value={buscarCliente}
                      onChange={manejarCambioCliente}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={ejecutarBusquedaCliente}
                    >
                      <i className="bi bi-search"></i>
                    </button>
                    {clienteSeleccionado && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          setClienteSeleccionado(null);
                          setBuscarCliente("");
                          setFormData((prev) => ({
                            ...prev,
                            id_cliente: null,
                          }));
                          setMostrarSugerenciasCliente(false);
                        }}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>

                  {/* Dropdown de sugerencias de clientes */}
                  {mostrarSugerenciasCliente && (
                    <div
                      className="dropdown-menu show w-100 mt-1 shadow-sm"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {clientesSugeridos.length > 0 ? (
                        clientesSugeridos.map((cliente) => (
                          <button
                            key={cliente.id_cliente}
                            type="button"
                            className="dropdown-item d-flex justify-content-between align-items-center"
                            onClick={() => seleccionarCliente(cliente)}
                          >
                            <div>
                              <div className="fw-medium">
                                {cliente.nombre} {cliente.primer_apellido || ""}{" "}
                                {cliente.segundo_apellido || ""}
                              </div>
                              {cliente.email && (
                                <small className="text-muted">
                                  {cliente.email}
                                </small>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="dropdown-item-text text-muted">
                          <i className="bi bi-info-circle me-2"></i>
                          No se encontraron clientes
                        </div>
                      )}
                    </div>
                  )}
                  {/* Cliente seleccionado */}
                  {clienteSeleccionado && (
                    <div className="mt-2 p-2 bg-light rounded border">
                      <small className="text-muted">
                        Cliente seleccionado:
                      </small>
                      <div className="fw-medium">
                        {clienteSeleccionado.nombre}{" "}
                        {clienteSeleccionado.primer_apellido || ""}{" "}
                        {clienteSeleccionado.segundo_apellido || ""}
                      </div>
                      {clienteSeleccionado.numero_documento && (
                        <small className="text-muted">
                          {clienteSeleccionado.numero_documento}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>{" "}
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium">
                      Forma de pago <span className="text-danger">*</span>
                    </label>
                    <select
                      name="forma_pago"
                      className="form-select form-select-lg"
                      value={formData.forma_pago}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar forma de pago</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Visa">Visa</option>
                      <option value="Amex">Amex</option>
                      <option value="Crédito">Crédito</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-medium">
                      Estado <span className="text-danger">*</span>
                    </label>
                    <select
                      name="estado"
                      className="form-select form-select-lg"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagada">Pagada</option>
                      <option value="Anulada">Anulada</option>{" "}
                    </select>
                  </div>

                </div>
              </div>
            </div>
          </form>
          {/* Tabla de cargos existentes */}
          {factura.detalles && factura.detalles.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light border-bottom">
                <h5 className="mb-0">
                  <i className="bi bi-list-ul text-muted me-2"></i>
                  Cargos Actuales
                  <span className="badge bg-primary ms-2">
                    {factura.detalles.length}
                  </span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Fecha</th>
                        <th className="fw-semibold">Concepto</th>
                        <th className="fw-semibold text-center">Cantidad</th>
                        <th className="fw-semibold text-end">Precio Unit.</th>
                        <th className="fw-semibold text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factura.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(detalle.fecha).toLocaleDateString(
                              "es-ES"
                            )}
                          </td>
                          <td>{detalle.concepto}</td>
                          <td className="text-center">{detalle.cantidad}</td>
                          <td className="text-end">
                            {parseFloat(detalle.precio_unitario).toFixed(2)}€
                          </td>
                          <td className="text-end fw-medium">
                            {parseFloat(detalle.total).toFixed(2)}€
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-light border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total de cargos:</span>
                  <span className="fw-bold text-primary fs-5">
                    {factura.detalles
                      .reduce((sum, d) => sum + parseFloat(d.total || 0), 0)
                      .toFixed(2)}
                    €
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Sección para agregar nuevo cargo */}
          {factura.estado !== "Anulada" && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-plus-circle text-muted me-2"></i>
                  Agregar Nuevo Cargo
                </h5>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() =>
                    setMostrarFormularioCargo(!mostrarFormularioCargo)
                  }
                >
                  <i
                    className={`bi ${
                      mostrarFormularioCargo ? "bi-dash" : "bi-plus"
                    } me-1`}
                  ></i>
                  {mostrarFormularioCargo ? "Cancelar" : "Nuevo Cargo"}
                </button>
              </div>
              {mostrarFormularioCargo && (
                <div className="card-body">
                  <div className="row g-3">
                    {" "}
                    <div className="col-md-5">
                      <label className="form-label text-muted fw-medium">
                        Concepto <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="concepto"
                        value={nuevoCargo.concepto}
                        onChange={handleCargoChange}
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
                    <div className="col-md-2">
                      <label className="form-label text-muted fw-medium">
                        Cantidad <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="cantidad"
                        min="1"
                        value={nuevoCargo.cantidad}
                        onChange={handleCargoChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-muted fw-medium">
                        Precio unitario <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="precio_unitario"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={nuevoCargo.precio_unitario}
                        onChange={handleCargoChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label text-muted fw-medium">
                        Total
                      </label>
                      <div className="form-control bg-light text-end">
                        {(
                          nuevoCargo.cantidad * nuevoCargo.precio_unitario
                        ).toFixed(2)}
                        €
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={agregarCargo}
                        disabled={
                          !nuevoCargo.concepto ||
                          nuevoCargo.cantidad <= 0 ||
                          nuevoCargo.precio_unitario < 0
                        }
                      >
                        <i className="bi bi-plus me-2"></i>
                        Agregar Cargo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Botones de acción al final */}
          <div className="card border-0 shadow-sm">
            <div className="card-footer bg-light border-top">
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(`/facturas/${id}`)}
                >
                  <i className="bi bi-x me-2"></i>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!formData.forma_pago || !formData.estado}
                >
                  <i className="bi bi-check me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarFactura;
