import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import routes from "../routes";

const Navbar = () => {
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
              // Si todos los submenús son solo para admin, y el usuario no lo es, ocultar
              if (
                item.submenu &&
                item.submenu.every((sub) => sub.adminOnly) &&
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
                        {item.submenu
                          .filter(
                            (sub) =>
                              !sub.adminOnly || usuario.id_rol === 1
                          )
                          .map((subitem, subindex) => (
                          <li key={subindex}>
                            <NavLink
                              to={subitem.path}
                              end={subitem.exact}
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
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <b>Usuario activo: {usuario.nombre_usuario}</b>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink
                    to="/usuarios/cambiar-password"
                    className="dropdown-item"
                  >
                    Cambiar contraseña
                  </NavLink>
                </li>
                <li>
                  <button className="dropdown-item" onClick={manejarLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
