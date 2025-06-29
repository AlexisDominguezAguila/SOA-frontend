import { useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Valores simulados
  const stats = {
    convenios: 12,
    noticias: 5,
    cursos: 3,
    directivas: 4,
    decanos: 7,
  };

  return (
    <div className="dashboard-container min-vh-100 bg-light">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <section className="content-section p-4">
          <h2 className="text-purple mb-4">
            <i className="bi bi-speedometer2 me-2"></i>Panel de Control
          </h2>

          {/* Bienvenida */}
          <div className="mb-4">
            <Card className="bg-light border-0">
              <Card.Body>
                <h5 className="fw-bold">¡Bienvenido, Administrador!</h5>
                <p className="mb-0 text-muted">
                  Este es tu panel de control. Desde aquí puedes gestionar
                  convenios, noticias, cursos y más.
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Estadísticas rápidas */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="stats-card border-start border-4 border-primary shadow-sm">
                <Card.Body>
                  <i className="bi bi-briefcase-fill  fs-4 text-primary"></i>
                  <h5 className="mt-2">{stats.convenios} Convenios</h5>
                  <p className="text-muted mb-0">Gestionados</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stats-card border-start border-4 border-success shadow-sm">
                <Card.Body>
                  <i className="bi bi-newspaper fs-4 text-success"></i>
                  <h5 className="mt-2">{stats.noticias} Noticias</h5>
                  <p className="text-muted mb-0">Publicadas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="stats-card border-start border-4 border-info shadow-sm">
                <Card.Body>
                  <i className="bi bi-journal-text fs-4 text-info"></i>
                  <h5 className="mt-2">{stats.cursos} Cursos</h5>
                  <p className="text-muted mb-0">Disponibles</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card className="quick-card shadow-sm border-0">
                <Card.Body>
                  <h6 className="mb-3">
                    <i className="bi bi-people-fill me-2"></i>Decanos y
                    Directiva
                  </h6>
                  <p className="text-muted small">
                    {stats.decanos} decanos registrados
                    <br />
                    {stats.directivas} gestiones de junta directiva
                  </p>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-eye me-1"></i> Ver detalle
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="quick-card shadow-sm border-0">
                <Card.Body>
                  <h6 className="mb-3">
                    <i className="bi bi-gear-fill me-2"></i>Configuración del
                    sistema
                  </h6>
                  <p className="text-muted small">
                    Administra accesos, datos institucionales y opciones del
                    sistema.
                  </p>
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-sliders2-vertical me-1"></i> Ir a
                    ajustes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
