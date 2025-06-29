import { useState } from "react";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

const Dashboard = () => {
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
          <h2 className="text-purple mb-4">Panel de Control</h2>

          {/* Tarjetas de estadísticas */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted">Usuarios</h6>
                      <h3 className="mb-0">1,254</h3>
                    </div>
                    <div
                      className="bg-purple-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <i className="bi bi-people fs-4 text-purple"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-success">
                      <i className="bi bi-arrow-up"></i> 12.5%
                    </span>{" "}
                    desde el mes pasado
                  </div>
                </div>
              </div>
            </div>

            {/* Otras tarjetas similares... */}
          </div>

          {/* Más contenido... */}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
