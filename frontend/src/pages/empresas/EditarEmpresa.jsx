// Página para editar los datos de una empresa 
// Permite cargar los datos actuales, modificarlos y guardarlos mediante un formulario controlado.
// Incluye validaciones, notificaciones y navegación tras la edición.

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const EditarEmpresa = () => {
  // Obtiene el ID de la empresa desde la URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [empresa, setEmpresa] = useState(null); // Estado de la empresa a editar

  useEffect(() => {
    // Carga los datos de la empresa al montar el componente
    const obtenerEmpresa = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/empresas/id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmpresa(Array.isArray(res.data) ? res.data[0] : res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Error al cargar los datos de la empresa");
        navigate("/empresas/buscar");
      }
    };

    obtenerEmpresa();
  }, [id, token, navigate]);

  // Maneja los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  // Envía el formulario para actualizar la empresa
  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Evitar envío de email vacío (lo convierte en null)
    if (empresa.email?.trim() === "") {
      empresa.email = null;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/empresas/${id}`,
        empresa,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Empresa actualizada correctamente");
      navigate("/empresas/buscar");
    } catch (error) {
      toast.error(`Error al actualizar empresa: ${error.response?.data?.error || error.message}`);
    }
  };

  // Muestra un mensaje mientras se cargan los datos
  if (!empresa) return <p className="text-center mt-5">Cargando empresa...</p>;

  return (
    <div className="container py-4 mt-4">
      <h2 className="text-center mb-4">Editar empresa</h2>
      {/* Formulario de edición de empresa */}
      <form
        onSubmit={manejarSubmit}
        className="mx-auto"
        style={{ maxWidth: "750px", textAlign: "left" }}
      >
        {/* Campos de datos de empresa */}
        <div className="row">
          <div className="col-md-9 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={empresa.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">CIF</label>
            <input
              type="text"
              name="cif"
              className="form-control"
              value={empresa.cif}
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
            value={empresa.direccion || ""}
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
              value={empresa.ciudad || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">País</label>
            <input
              type="text"
              name="pais"
              className="form-control"
              value={empresa.pais}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Código postal</label>
            <input
              type="text"
              name="codigo_postal"
              className="form-control"
              value={empresa.codigo_postal || ""}
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
              value={empresa.telefono || ""}
              onChange={manejarCambio}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={empresa.email || ""}
              onChange={manejarCambio}
            />
          </div>
        </div>
        <div className="col-6 form-check mb-4">
          <input
            type="checkbox"
            className="form-check-input"
            name="credito"
            id="creditoCheck"
            checked={empresa.credito}
            onChange={(e) =>
              setEmpresa({ ...empresa, credito: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="creditoCheck">
            Empresa con crédito
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            rows="3"
            value={empresa.observaciones || ""}
            onChange={manejarCambio}
          ></textarea>
        </div>
        <div className="row button-row mx-auto">
          <div className="col-3">
            <button type="submit" className="btn btn-success">
              Guardar cambios
            </button>
          </div>
          <div className="col-3">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/empresas/buscar")}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditarEmpresa;
