import { useState } from "react";
import { Button, Card, Modal, Table, Row, Col, Form } from "react-bootstrap";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

import comunicadoEjemplo from "@/assets/images/convenio.jpeg"; // Imagen temporal

const DUMMY_COMUNICADOS = [
  {
    id: 1,
    img: comunicadoEjemplo,
    created_at: "2024-06-01",
    active: true,
  },
  {
    id: 2,
    img: comunicadoEjemplo,
    created_at: "2024-05-20",
    active: false,
  },
  {
    id: 3,
    img: comunicadoEjemplo,
    created_at: "2024-05-10",
    active: false,
  },
];

const ComunicadosAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [comunicados, setComunicados] = useState(DUMMY_COMUNICADOS);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const activo = comunicados.find((c) => c.active);
  const anteriores = comunicados.filter((c) => !c.active);

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <section className="content-section p-4">
          {/* Título + botón */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title text-purple">
                <i className="bi bi-megaphone-fill me-2"></i>Comunicados
              </h2>
              <p className="text-muted">Gestiona los comunicados oficiales</p>
            </div>
            <Button className="btn-add-comunicado" onClick={handleShow}>
              <i className="bi bi-plus-lg me-2"></i>Nuevo Comunicado
            </Button>
          </div>

          {/* Comunicado activo */}
          <Card className="mb-4">
            <Card.Header className="bg-light fw-semibold">
              Comunicado actual
            </Card.Header>
            <Card.Body className="text-center">
              {activo ? (
                <img
                  src={activo.img}
                  alt="Comunicado actual"
                  className="img-fluid rounded comunicado-img"
                />
              ) : (
                <p className="text-muted">No hay comunicado activo</p>
              )}
            </Card.Body>
          </Card>

          {/* Anteriores */}
          <Card>
            <Card.Header className="bg-light fw-semibold">
              Comunicados anteriores
            </Card.Header>
            <Card.Body className="p-0">
              {anteriores.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Miniatura</th>
                      <th>Fecha</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anteriores.map((c, idx) => (
                      <tr key={c.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <img
                            src={c.img}
                            alt="Comunicado"
                            height="50"
                            className="rounded"
                          />
                        </td>
                        <td>{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Eliminar comunicado"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="p-4 text-center text-muted">
                  No hay comunicados anteriores
                </div>
              )}
            </Card.Body>
          </Card>
        </section>
      </div>

      {/* Modal subir comunicado */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="comunicado-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-megaphone-fill me-2"></i>
            Nuevo Comunicado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                <i className="bi bi-image me-2"></i>Imagen del comunicado
              </Form.Label>
              <Form.Control type="file" accept="image/*" />
              <Form.Text className="text-muted">
                Formato JPG o PNG (máx. 2MB)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <i className="bi bi-x-lg me-2"></i>Cancelar
          </Button>
          <Button variant="primary">
            <i className="bi bi-check-lg me-2"></i>Guardar Comunicado
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComunicadosAdmin;
