import { useState } from "react";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

const NoticiasAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="dashboard-container min-vh-100 bg-light">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} />

      {/* Contenedor principal */}
      <div className="main-content-container">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido */}
        <section className="content-section p-4">
          <h2 className="text-purple mb-4">Panel de Control de Noticias</h2>
        </section>
      </div>
    </div>
  );
};

export default NoticiasAdmin;
