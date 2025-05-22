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
      toast.success("Cliente registrado correctamente");
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
      toast.error(`Error al registrar cliente: ${error.response?.data?.error || error.message}`);
      console.error("Error:", error);
    }
  };

  return (
    <div className="container py-4 mt-4">
      <h2 className="text-center mb-4">Registrar nuevo cliente</h2>
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "750px", textAlign: "left" }}
      >
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={cliente.nombre}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Primer apellido</label>
            <input
              type="text"
              name="primer_apellido"
              className="form-control"
              value={cliente.primer_apellido}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Segundo apellido</label>
            <input
              type="text"
              name="segundo_apellido"
              className="form-control"
              value={cliente.segundo_apellido}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              className="form-control"
              value={cliente.fecha_nacimiento}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Género</label>
            <select
              name="genero"
              className="form-select"
              value={cliente.genero}
              onChange={manejarCambio}
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Tipo de documento</label>
            <select
              name="tipo_documento"
              className="form-select"
              value={cliente.tipo_documento}
              onChange={manejarCambio}
              required
            >
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
          <div className="col-md-5 mb-3">
            <label className="form-label">Número de documento</label>
            <input
              type="text"
              name="numero_documento"
              className="form-control"
              value={cliente.numero_documento}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Fecha de expedición</label>
            <input
              type="date"
              name="fecha_expedicion"
              className="form-control"
              value={cliente.fecha_expedicion}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={cliente.direccion}
            onChange={manejarCambio}
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              className="form-control"
              value={cliente.ciudad}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">País</label>
            <input
              type="text"
              name="pais"
              className="form-control"
              value={cliente.pais}
              onChange={manejarCambio}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Código postal</label>
            <input
              type="text"
              name="codigo_postal"
              className="form-control"
              value={cliente.codigo_postal}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              className="form-control"
              value={cliente.telefono}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={cliente.email}
              onChange={manejarCambio}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            rows="3"
            value={cliente.observaciones}
            onChange={manejarCambio}
          ></textarea>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Registrar cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoCliente;
