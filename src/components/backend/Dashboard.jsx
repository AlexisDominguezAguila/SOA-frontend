"use client";

import { useState, useContext } from "react";
import { Card } from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import { AuthContext } from "@/components/backend/context/Auth";
import "@/components/backend/layout/dashboard.scss";
import logo from "@/assets/images/icono.webp";

const Dashboard = () => {
  const [isSidebarOpen] = useState(true);
  const { user } = useContext(AuthContext); // ← obtiene el nombre
  const nombreAdmin = user?.name || "Administrador";

  return (
    <div
      className={`dashboard-container min-vh-100 d-flex ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <DashboardSidebar isOpen={isSidebarOpen} />

      <main className="main-content-container flex-grow-1 p-4">
        <div className="welcome-card-container d-flex justify-content-center align-items-center h-100">
          <Card className="welcome-card text-white text-center p-4">
            <Card.Body>
              <i className="bi bi-stars icon-welcome mb-3"></i>
              <h2 className="mb-3">¡Bienvenido, {nombreAdmin}!</h2>
              <p className="lead mb-0">
                Has ingresado al Panel Administrativo del{" "}
                <strong>CMP Piura</strong>. Desde aquí puedes gestionar
                noticias, cursos y mucho más. ¡Gracias por tu compromiso!
              </p>
              <br />
              <img
                src={logo}
                alt="icono CMP"
                className="welcome-icon-img"
                style={{
                  width: "250px",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 8px rgba(212, 192, 209, 0.6))",
                }}
              />
            </Card.Body>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
