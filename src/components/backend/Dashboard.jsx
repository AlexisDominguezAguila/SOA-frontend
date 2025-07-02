"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

const Dashboard = () => {
  const [isSidebarOpen] = useState(true);
  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);   // abrir/cerrar

  return (
    <div
      className={`dashboard-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <DashboardSidebar isOpen={isSidebarOpen} />

      <main className="main-content-container">
        <h1>Contenido aquí del Dashboard</h1>
        <p>
          Ajusta el ancho automáticamente según el estado del sidebar (abierto o
          cerrado) y ocupa toda la altura de la ventana.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
