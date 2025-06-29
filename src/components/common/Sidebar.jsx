import { NavLink } from "react-router-dom";
import "@/components/backend/layout/dashboard.scss"; // importa estilos

const links = [
  { to: "/admin/dashboard", icon: "house-door", label: "Inicio" },
  { to: "/admin/noticias", icon: "calendar-event", label: "Noticias" },
  { to: "/admin/cursos", icon: "people", label: "Cursos" },
  { to: "/admin/decanos", icon: "gear", label: "Directiva - Decanos" },
  { to: "/admin/beneficios", icon: "file-earmark-text", label: "Beneficios" },
  // { to: "#", icon: "calendar-event", label: "Eventos" },
  // { to: "#", icon: "chat-dots", label: "Comunicados" },
];

const Sidebar = ({ isOpen }) => (
  <nav
    className={`sidebar transition-all ${isOpen ? "open" : "closed"}`}
    // el ancho se controla en el SCSS
  >
    <ul className="nav nav-pills flex-column mt-4">
      {links.map(({ to, icon, label }) => (
        <li key={label} className="nav-item mb-2">
          <NavLink
            to={to}
            className="nav-link d-flex align-items-center sidebar-link"
          >
            <i className={`bi bi-${icon} me-3 fs-5`} />
            <span>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default Sidebar;
