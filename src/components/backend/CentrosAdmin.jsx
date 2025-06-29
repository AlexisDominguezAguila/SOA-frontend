import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination,
  Card,
  Row,
  Col,
  Badge,
  Carousel,
} from "react-bootstrap";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

import placeholder from "@/assets/images/convenio.jpeg";

/* Dummy Data */
const DUMMY_CENTROS = [
  {
    id: 1,
    nombre: "Centro Recreacional El Bosque",
    beneficios: [
      "Piscina semi‑olímpica",
      "Zona de parrillas",
      "Cancha de fútbol",
    ],
    imagenes: [placeholder, placeholder, placeholder],
    status: "active",
    created_at: "2024-05-10",
  },
  {
    id: 2,
    nombre: "Club Campestre Los Pinos",
    beneficios: ["Caballerizas", "Lago artificial"],
    imagenes: [placeholder],
    status: "inactive",
    created_at: "2024-04-18",
  },
];

const CentrosAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [centros] = useState(DUMMY_CENTROS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = centros.filter((c) => {
    const m1 = c.nombre.toLowerCase().includes(query.toLowerCase());
    const m2 = statusFilter === "all" || c.status === statusFilter;
    return m1 && m2;
  });
  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* Modal */
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const handleClose = () => {
    setShowModal(false);
    setEditing(null);
  };

  const getStatusBadge = (s) => (
    <Badge bg={s === "active" ? "success" : "secondary"}>
      {s === "active" ? "Activo" : "Inactivo"}
    </Badge>
  );

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <section className="content-section p-4">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-purple mb-1">
                <i className="bi bi-tree-fill me-2"></i>Centros Recreacionales
              </h2>
              <p className="text-muted mb-0">
                Administra los centros y sus beneficios
              </p>
            </div>
            <Button
              className="btn-add-convenio"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-lg me-2"></i>Nuevo Centro
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row className="align-items-end g-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar por nombre"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </Form.Select>
                </Col>
                <Col md={2} className="text-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("all");
                      setPage(1);
                    }}
                  >
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Table */}
          <Card>
            <Card.Body className="p-0">
              <Table responsive hover className="table-borderless mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Beneficios</th>
                    <th>Imágenes</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {view.map((c, i) => (
                    <tr key={c.id}>
                      <td>{(page - 1) * pageSize + i + 1}</td>
                      <td>{c.nombre}</td>
                      <td>
                        <Badge bg="info">{c.beneficios.length}</Badge>
                      </td>
                      <td>
                        <Badge bg="secondary">{c.imagenes.length}</Badge>
                      </td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => {
                            setEditing(c);
                            setShowModal(true);
                          }}
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
            </Card.Body>
          </Card>

          {/* Pagination */}
          {pages > 1 && (
            <Pagination className="justify-content-end mt-3">
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              />
              {[...Array(pages)].map((_, idx) => (
                <Pagination.Item
                  key={idx}
                  active={page === idx + 1}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              />
            </Pagination>
          )}
        </section>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-tree-fill me-2"></i>
            {editing ? "Editar Centro" : "Nuevo Centro"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del centro</Form.Label>
              <Form.Control defaultValue={editing?.nombre || ""} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Beneficios (una línea por beneficio)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={editing?.beneficios?.join("\n") || ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imágenes</Form.Label>
              <Form.Control type="file" multiple accept="image/*" />
              <Form.Text className="text-muted">
                Puedes seleccionar varias imágenes (máx. 5MB c/u)
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select defaultValue={editing?.status || "active"}>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary">
            {editing ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CentrosAdmin;
