import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import routes from "../routes";

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const manejarLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          Vesta PMS
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContenido"
          aria-controls="navbarContenido"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del navbar que se oculta/expande */}
        <div className="collapse navbar-collapse" id="navbarContenido">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {routes.map((ruta) => (
              <li className="nav-item" key={ruta.path}>
                <NavLink to={ruta.path} className="nav-link">
                  {ruta.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {usuario && (
            <span className="navbar-text text-white">
              Hola 👋 {usuario.nombre_usuario} &nbsp;
              <button
                className="btn btn-sm btn-outline-light ms-2"
                onClick={manejarLogout}
              >
                Cerrar sesión
              </button>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
