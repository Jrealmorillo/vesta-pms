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
        <Link className="navbar-brand" to="/">
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
            {routes.map((item, index) => {
              // Ocultar secciones reservadas para admin (id_rol === 1)
              if (
                (item.label === "Usuarios" || item.label === "Habitaciones") &&
                usuario.id_rol !== 1
              ) {
                return null;
              }

              return (
                <li
                  className={`nav-item ${item.submenu ? "dropdown" : ""}`}
                  key={index}
                >
                  {item.submenu ? (
                    <>
                      <span
                        className="nav-link dropdown-toggle"
                        id={`navbarDropdown${index}`}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {item.label}
                      </span>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby={`navbarDropdown${index}`}
                      >
                        {item.submenu.map((subitem, subindex) => (
                          <li key={subindex}>
                            <NavLink
                              to={subitem.path}
                              className="dropdown-item"
                            >
                              {subitem.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <NavLink to={item.path} className="nav-link">
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            })}
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
