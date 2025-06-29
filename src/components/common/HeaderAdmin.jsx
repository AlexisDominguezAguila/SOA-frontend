import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { AuthContext } from "@/components/backend/context/Auth";
import "@/components/backend/layout/dashboard.scss";

const HeaderAdmin = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  // Manejar clic fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header-admin shadow-sm bg-white px-4 py-3 d-flex justify-content-between align-items-center">
      {/* Botón hamburguesa */}
      <button className="btn d-lg-none" onClick={toggleSidebar}>
        <i className="bi bi-list fs-4 text-purple"></i>
      </button>

      <NavLink
        to="/"
        className="d-flex align-items-center text-decoration-none"
      >
        <i className="bi bi-bar-chart-fill fs-3 me-2 text-purple" />
        <span className="fw-semibold text-purple d-none d-md-block">
          Dashboard – CONSEJO REGIONAL VII - PIURA
        </span>
      </NavLink>

      {/* Menú usuario */}
      <div className="dropdown" ref={dropdownRef}>
        <Dropdown
          show={dropdownOpen}
          onToggle={(isOpen) => setDropdownOpen(isOpen)}
        >
          <Dropdown.Toggle
            variant="transparent"
            id="dropdown-user"
            className="d-flex align-items-center p-0"
          >
            <div className="avatar-circle me-2">
              <span className="text-white fw-bold">
                {user?.name ? user.name.charAt(0) : "A"}
              </span>
            </div>
            <strong className="text-purple">{user?.name || "Admin"}</strong>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-end shadow mt-2">
            <Dropdown.Item
              as={NavLink}
              to="/admin/perfil"
              className="d-flex align-items-center"
            >
              <i className="bi bi-person me-2 text-purple"></i> Perfil
            </Dropdown.Item>
            <Dropdown.Item
              as={NavLink}
              to="/admin/ajustes"
              className="d-flex align-items-center"
            >
              <i className="bi bi-gear me-2 text-purple"></i> Ajustes
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              as="button"
              className="d-flex align-items-center"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2 text-purple"></i> Cerrar
              sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

HeaderAdmin.propTypes = { toggleSidebar: PropTypes.func.isRequired };
export default HeaderAdmin;
