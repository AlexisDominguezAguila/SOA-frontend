"use client";

import { NavLink, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "@/components/backend/context/Auth";
import "@/components/backend/layout/sidebar.scss";
import Swal from "sweetalert2";

const links = [
  {
    to: "/admin/dashboard",
    icon: "house-door",
    label: "Inicio",
    color: "primary",
  },
  {
    to: "/admin/noticias",
    icon: "newspaper",
    label: "Noticias",
    color: "info",
  },
  {
    to: "/admin/cursos",
    icon: "mortarboard",
    label: "Cursos",
    color: "success",
  },
  {
    to: "/admin/decanos",
    icon: "award",
    label: "Past de Decanos",
    color: "warning",
  },
  {
    to: "/admin/convenios",
    icon: "book",
    label: "Convenios",
    color: "danger",
  },
  {
    to: "/admin/directivas",
    icon: "people",
    label: "Juntas Directivas",
    color: "purple",
  },
  {
    to: "/admin/centros",
    icon: "tree",
    label: "Centros Recreacionales",
    color: "teal",
  },
  {
    to: "/admin/comunicados",
    icon: "megaphone",
    label: "Comunicados",
    color: "orange",
  },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user, logout } = useContext(AuthContext);

  const isActiveLink = (path) => location.pathname === path;

  const getActiveSection = () => {
    const activeLink = links.find((link) => link.to === location.pathname);
    return activeLink ? activeLink.label : "Panel de Administración";
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // rojo Bootstrap Danger
      cancelButtonColor: "#3085d6", // azul Bootstrap Primary
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // ← tu función de cierre
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  };
  return (
    <nav className={`modern-sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Header del sidebar sin botón hamburguesa */}
      <div className="sidebar-header px-3 py-2">
        <div className="sidebar-brand d-flex align-items-center">
          <div className="brand-icon me-2">
            <i className="bi bi-shield-check"></i>
          </div>
          {isOpen && (
            <div className="brand-info">
              <h6 className="brand-title mb-0">Admin Panel</h6>
              <span className="brand-subtitle">CMP Piura</span>
            </div>
          )}
        </div>
      </div>

      {/* Sección activa */}
      {isOpen && (
        <div className="active-section px-3">
          <div className="section-indicator d-flex align-items-center">
            <i className="bi bi-circle-fill me-2"></i>
            <span>{getActiveSection()}</span>
          </div>
        </div>
      )}

      {/* Navegación principal */}
      <div className="sidebar-nav mt-3">
        <ul className="nav-list list-unstyled px-2">
          {links.map(({ to, icon, label, color }, index) => {
            const isActive = isActiveLink(to);

            return (
              <li
                key={label}
                className="nav-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NavLink
                  to={to}
                  className={`nav-link d-flex align-items-center justify-content-between ${
                    isActive ? "active" : ""
                  } color-${color}`}
                  onMouseEnter={() => setHoveredItem(label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="nav-link-content d-flex align-items-center">
                    <div className="nav-icon me-2">
                      <i className={`bi bi-${icon}`}></i>
                    </div>
                    {isOpen && <span className="nav-label">{label}</span>}
                    {isActive && <div className="active-indicator"></div>}
                  </div>

                  {/* Tooltip si está cerrado */}
                  {!isOpen && <div className="nav-tooltip">{label}</div>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer del sidebar */}
      {isOpen && (
        <div className="sidebar-footer mt-auto px-3 py-3">
          <div className="footer-content d-flex align-items-center justify-content-between">
            <div className="user-info d-flex align-items-center">
              <div className="user-avatar me-2">
                <i className="bi bi-person-circle fs-4"></i>
              </div>
              <div className="user-details">
                <span className="user-name fw-semibold">
                  {user?.name || "Admin"}
                </span>
                <span className="user-role d-block small text-muted">
                  Administrador
                </span>
              </div>
            </div>
            <div className="footer-actions d-flex align-items-center gap-2">
              <button className="action-btn btn btn-sm" title="Administradores">
                <i className="bi bi-people"></i>
              </button>
              <button
                className="action-btn btn btn-sm"
                title="Cerrar sesión"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de estado */}
    </nav>
  );
};

export default Sidebar;
