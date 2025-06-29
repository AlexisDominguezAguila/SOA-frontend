import { useState } from "react";
import { Card, Row, Col, Button, Form, Modal, Image } from "react-bootstrap";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

// Imagen temporal
import avatarDefault from "@/assets/images/decano.webp";

const PerfilAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [showModalPass, setShowModalPass] = useState(false);
  const handleClosePass = () => setShowModalPass(false);
  const handleShowPass = () => setShowModalPass(true);

  const [userData, setUserData] = useState({
    nombre: "Administrador General",
    email: "admin@colegiopiura.org",
    telefono: "+51 999 888 777",
    rol: "Administrador",
    avatar: avatarDefault,
  });

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <section className="content-section p-4">
          <h2 className="text-purple mb-4">
            <i className="bi bi-person-circle me-2"></i>Mi Perfil
          </h2>

          <Row>
            {/* Información personal */}
            <Col md={4}>
              <Card className="profile-card text-center">
                <Card.Body>
                  <Image
                    src={userData.avatar}
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3 profile-avatar"
                  />
                  <h5 className="fw-bold mb-0">{userData.nombre}</h5>
                  <p className="text-muted mb-1">{userData.rol}</p>
                  <p className="text-muted small">{userData.email}</p>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-upload me-1"></i>Cambiar foto
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Detalles editables */}
            <Col md={8}>
              <Card className="p-3">
                <h5 className="mb-3">Información Personal</h5>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={userData.nombre}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          defaultValue={userData.email}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={userData.telefono}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Control
                          type="text"
                          value={userData.rol}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="primary">
                      <i className="bi bi-save me-2"></i>Guardar cambios
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleShowPass}
                    >
                      <i className="bi bi-lock me-2"></i>Cambiar contraseña
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </section>
      </div>

      {/* Modal cambio de contraseña */}
      <Modal show={showModalPass} onHide={handleClosePass} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-lock-fill me-2"></i>Cambiar contraseña
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control type="password" placeholder="••••••••" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control type="password" placeholder="••••••••" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Form.Control type="password" placeholder="••••••••" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePass}>
            Cancelar
          </Button>
          <Button variant="primary">
            <i className="bi bi-check2-circle me-1"></i>Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PerfilAdmin;
