// Página para que el usuario cambie su contraseña actual.
// Permite introducir la contraseña actual, la nueva y su confirmación, validando coincidencia y mostrando feedback.
// Realiza la petición a la API para actualizar la contraseña del usuario autenticado.

/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import CampoPassword from "../../components/CampoPassword";

const CambiarPassword = () => {
  // usuario: datos del usuario autenticado, token: JWT
  const { usuario, token } = useContext(AuthContext);
  // form: estado local para los campos del formulario
  const [form, setForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  // Maneja cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Envía la petición para cambiar la contraseña tras validar coincidencia
  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (form.nueva !== form.confirmar) {
      toast.warning("La nueva contraseña no coincide");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${
          usuario.id_usuario
        }/cambiar-password`,
        {
          passwordActual: form.actual,
          nuevaPassword: form.nueva,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Contraseña actualizada correctamente");
      setForm({ actual: "", nueva: "", confirmar: "" });
    } catch (error) {
      toast.error("Error al cambiar la contraseña");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Cambiar contraseña</h2>
      <form onSubmit={manejarSubmit}>
        <div className="mb-3">
          {/* Campo para la contraseña actual */}
          <CampoPassword
            label="Contraseña actual"
            name="actual"
            value={form.actual}
            onChange={manejarCambio}
          />
        </div>
        <div className="mb-3">
          {/* Campo para la nueva contraseña */}
          <CampoPassword
            label="Nueva contraseña"
            name="nueva"
            value={form.nueva}
            onChange={manejarCambio}
          />
        </div>
        <div className="mb-4">
          {/* Campo para confirmar la nueva contraseña */}
          <CampoPassword
            label="Confirmar nueva contraseña"
            name="confirmar"
            value={form.confirmar}
            onChange={manejarCambio}
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary">Actualizar contraseña</button>
        </div>
      </form>
    </div>
  );
}

export default CambiarPassword;
