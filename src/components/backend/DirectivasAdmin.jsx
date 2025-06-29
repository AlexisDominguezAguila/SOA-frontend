import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Accordion,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

const dummyGestiones = [
  {
    id: 1,
    nombre: "Gestión 2020-2023",
    lema: "Innovar para avanzar",
    inicio: "2020",
    fin: "2023",
    status: "active",
    miembros: [
      {
        id: 1,
        nombre: "Ing. Juan Pérez",
        cargo: "Presidente",
        img: "/img/placeholder.jpg",
      },
      {
        id: 2,
        nombre: "Dra. Ana López",
        cargo: "Secretaria",
        img: "/img/placeholder.jpg",
      },
    ],
  },
  {
    id: 2,
    nombre: "Gestión 2017-2020",
    lema: "Unidos somos más",
    inicio: "2017",
    fin: "2020",
    status: "inactive",
    miembros: [],
  },
];

const DirectivasAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [gestiones, setGestiones] = useState(dummyGestiones);
  const [showModal, setShowModal] = useState(false);
  const [editingGestion, setEditingGestion] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setEditingGestion(null);
  };

  const handleEditGestion = (g) => {
    setEditingGestion(g);
    setShowModal(true);
  };

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <section className="content-section p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-purple mb-1">
                <i className="bi bi-people-fill me-2"></i>
                Gestión de Juntas Directivas
              </h2>
              <p className="text-muted mb-0">
                Listado de gestiones y sus miembros
              </p>
            </div>
            <Button onClick={handleShow} className="btn-add-convenio">
              <i className="bi bi-plus-lg me-2"></i> Nueva Gestión
            </Button>
          </div>

          <Accordion alwaysOpen activeKey={expanded}>
            {gestiones.map((g) => (
              <Card key={g.id} className="mb-3">
                <Accordion.Item eventKey={g.id.toString()}>
                  <Accordion.Header
                    onClick={() =>
                      setExpanded(
                        expanded === g.id.toString() ? null : g.id.toString()
                      )
                    }
                  >
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <strong>{g.nombre}</strong> - {g.lema} ({g.inicio} -{" "}
                        {g.fin})
                      </div>
                      <Badge
                        bg={g.status === "active" ? "success" : "secondary"}
                      >
                        {g.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    {g.miembros.length > 0 ? (
                      <Table responsive hover size="sm">
                        <thead>
                          <tr>
                            <th>Foto</th>
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.miembros.map((m) => (
                            <tr key={m.id}>
                              <td>
                                <img
                                  src={m.img}
                                  width="50"
                                  className="rounded"
                                  alt={m.nombre}
                                />
                              </td>
                              <td>{m.nombre}</td>
                              <td>{m.cargo}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  className="me-2"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button size="sm" variant="outline-danger">
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-muted">
                        Esta gestión no tiene miembros registrados.
                      </p>
                    )}

                    <div className="text-end">
                      <Button size="sm" variant="outline-success">
                        <i className="bi bi-person-plus me-2"></i>Agregar
                        Miembro
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card>
            ))}
          </Accordion>
        </section>
      </div>

      {/* Modal para registrar/editar gestión */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-clipboard-data me-2"></i>
            {editingGestion ? "Editar Gestión" : "Nueva Gestión"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Gestión</Form.Label>
              <Form.Control defaultValue={editingGestion?.nombre || ""} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lema</Form.Label>
              <Form.Control defaultValue={editingGestion?.lema || ""} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Año Inicio</Form.Label>
                  <Form.Control defaultValue={editingGestion?.inicio || ""} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Año Fin</Form.Label>
                  <Form.Control defaultValue={editingGestion?.fin || ""} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select defaultValue={editingGestion?.status || "active"}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary">Guardar Gestión</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DirectivasAdmin;
