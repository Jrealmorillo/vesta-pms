// Página para registrar un nuevo cliente
// Permite ingresar los datos del cliente y enviarlos al backend para su registro.
// Incluye validaciones, notificaciones y reseteo del formulario tras el registro exitoso.

import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const NuevoCliente = () => {
  const { token } = useContext(AuthContext);

  const [cliente, setCliente] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fecha_nacimiento: "",
    genero: "Masculino",
    tipo_documento: "DNI",
    numero_documento: "",
    fecha_expedicion: "",
    direccion: "",
    ciudad: "",
    pais: "",
    codigo_postal: "",
    telefono: "",
    email: "",
    observaciones: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    // campo email debe ser null en vez de "" para evitar problemas en el backend
    if (cliente.email === "") {
      cliente.email = null;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/clientes/registro`,
        cliente,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        `Cliente ${cliente.nombre} ${cliente.primer_apellido} registrado correctamente`
      );
      // Resetea el formulario tras registrar
      setCliente({
        nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        fecha_nacimiento: "",
        genero: "Masculino",
        tipo_documento: "DNI",
        numero_documento: "",
        fecha_expedicion: "",
        direccion: "",
        ciudad: "",
        pais: "",
        codigo_postal: "",
        telefono: "",
        email: "",
        observaciones: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };
  return (
    <div className="container-fluid py-5 mt-4">
      {/* Header */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-plus text-primary me-3" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <h4 className="mb-0 fw-semibold">Registrar Nuevo Cliente</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <form onSubmit={manejarSubmit}>
            {/* Card: Datos personales */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-person-fill me-2 text-primary"></i>
                  Datos Personales
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control rounded"
                      placeholder="Nombre del cliente"
                      value={cliente.nombre}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Primer apellido *</label>
                    <input
                      type="text"
                      name="primer_apellido"
                      className="form-control rounded"
                      placeholder="Primer apellido"
                      value={cliente.primer_apellido}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Segundo apellido</label>
                    <input
                      type="text"
                      name="segundo_apellido"
                      className="form-control rounded"
                      placeholder="Segundo apellido"
                      value={cliente.segundo_apellido}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Fecha de nacimiento *</label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      className="form-control rounded"
                      value={cliente.fecha_nacimiento}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Género *</label>
                    <select
                      name="genero"
                      className="form-select rounded"
                      value={cliente.genero}
                      onChange={manejarCambio}
                      required                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Tipo de documento *</label>
                    <select
                      name="tipo_documento"
                      className="form-select rounded"
                      value={cliente.tipo_documento}
                      onChange={manejarCambio}
                      required                    >
                      <option value="DNI">DNI</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Documento de Identidad">Documento de Identidad</option>
                      <option value="Permiso de Residencia">Permiso de Residencia</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Número de documento *</label>
                    <input
                      type="text"
                      name="numero_documento"
                      className="form-control rounded"
                      placeholder="Número del documento"
                      value={cliente.numero_documento}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted fw-medium">Fecha de expedición *</label>
                    <input
                      type="date"
                      name="fecha_expedicion"
                      className="form-control rounded"
                      value={cliente.fecha_expedicion}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>            {/* Card: Dirección y contacto */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-geo-alt me-2 text-primary"></i>
                  Dirección y Contacto
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted fw-medium">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-control rounded"
                    placeholder="Dirección completa"
                    value={cliente.direccion}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      className="form-control rounded"
                      placeholder="Ciudad de residencia"
                      value={cliente.ciudad}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">País *</label>
                    <input
                      type="text"
                      name="pais"
                      className="form-control rounded"
                      placeholder="País de residencia"
                      value={cliente.pais}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted fw-medium">Código postal</label>
                    <input
                      type="text"
                      name="codigo_postal"
                      className="form-control rounded"
                      placeholder="CP"
                      value={cliente.codigo_postal}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control rounded"
                      placeholder="Número de teléfono"
                      value={cliente.telefono}
                      onChange={manejarCambio}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted fw-medium">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded"
                      placeholder="correo@ejemplo.com"
                      value={cliente.email}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label text-muted fw-medium">Observaciones</label>
                  <textarea
                    name="observaciones"
                    className="form-control rounded"
                    rows="3"
                    placeholder="Observaciones adicionales sobre el cliente..."
                    value={cliente.observaciones}
                    onChange={manejarCambio}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Botón de registro */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg rounded">
                <i className="bi bi-person-plus me-2"></i>
                Registrar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoCliente;
