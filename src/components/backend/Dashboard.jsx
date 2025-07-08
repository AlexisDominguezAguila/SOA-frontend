// dashboard.jsx
"use client";

import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import DashboardHeader from "@/components/common/HeaderAdmin";
import "@/components/backend/layout/dashboard.scss";

const Dashboard = () => {
  const [isSidebarOpen] = useState(true);

  return (
    <div
      className={`dashboard-container min-vh-100 d-flex ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <DashboardSidebar isOpen={isSidebarOpen} />

      <main className="main-content-container flex-grow-1 p-4">
        <DashboardHeader toggleSidebar={() => {}} />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-white">Panel de Control</h1>
            <p className="text-muted">Resumen general y accesos rápidos</p>
          </div>
          <Button variant="info" className="d-flex align-items-center">
            <i className="bi bi-bar-chart-line-fill me-2"></i>
            Ver reportes
          </Button>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <Card className="dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Total usuarios</h6>
                    <h4>1,240</h4>
                  </div>
                  <i className="bi bi-people-fill fs-2 text-info"></i>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Reportes hoy</h6>
                    <h4>87</h4>
                  </div>
                  <i className="bi bi-bar-chart-fill fs-2 text-info"></i>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="dashboard-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>Alertas activas</h6>
                    <h4>12</h4>
                  </div>
                  <i className="bi bi-exclamation-triangle-fill fs-2 text-warning"></i>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <Card className="dashboard-card mb-4">
              <Card.Header className="d-flex justify-content-between">
                <span>Actividad reciente</span>
                <i className="bi bi-clock-history" />
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Usuario Juan Pérez actualizó su perfil
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-x-circle-fill text-danger me-2"></i>
                    Error en la carga de datos del módulo X
                  </li>
                  <li>
                    <i className="bi bi-file-earmark-plus-fill text-info me-2"></i>
                    Se generó un nuevo reporte semanal
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4">
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <i className="bi bi-calendar-week me-2"></i>
                Calendario
              </Card.Header>
              <Card.Body>
                <p className="text-muted">
                  Próxima reunión: 10 de julio, 10:00 a.m.
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
