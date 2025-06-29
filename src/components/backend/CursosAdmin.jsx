import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";

import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

import defaultImg from "@/assets/images/convenio.jpeg";

const DUMMY_DATA = [
  {
    id: 1,
    img: defaultImg,
    title: "Curso de Introducción a React",
    description: "Aprende los fundamentos de React en este curso intensivo.",
    speaker: "Ing. Juan Pérez",
    url: "https://curso-react.com",
    status: "active",
    created_at: "2024-06-10",
  },
  {
    id: 2,
    img: defaultImg,
    title: "Taller de Ciberseguridad",
    description: "Protege tu información personal y empresarial.",
    speaker: "Dra. María Torres",
    url: "https://ciberseguridad.org",
    status: "inactive",
    created_at: "2024-05-20",
  },
];

const CursosAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };
  const handleShow = () => setShowModal(true);
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const [data] = useState(DUMMY_DATA);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = data.filter((c) => {
    const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const pageSize = 5;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getStatusBadge = (status) => (
    <Badge bg={status === "active" ? "success" : "secondary"}>
      {status === "active" ? "Activo" : "Inactivo"}
    </Badge>
  );

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <section className="content-section p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-purple mb-1">
                <i className="bi bi-easel2-fill me-2"></i>Gestión de Cursos
              </h2>
              <p className="text-muted mb-0">
                Administra los cursos y talleres ofrecidos
              </p>
            </div>
            <Button className="btn-add-convenio" onClick={handleShow}>
              <i className="bi bi-plus-lg me-2"></i>Nuevo Curso
            </Button>
          </div>

          {/* Filtros */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar por título"
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
                <Col md={2}>
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

          {/* Tabla */}
          <Table responsive hover className="table-borderless">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Ponente</th>
                <th>Estado</th>
                <th>Enlace</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {view.map((curso, i) => (
                <tr key={curso.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <img
                      src={curso.img}
                      alt={curso.title}
                      width="50"
                      className="rounded shadow-sm"
                    />
                  </td>
                  <td>{curso.title}</td>
                  <td>
                    <small>{curso.description}</small>
                  </td>
                  <td>
                    <small>{curso.speaker}</small>
                  </td>
                  <td>{getStatusBadge(curso.status)}</td>
                  <td>
                    <a
                      href={curso.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Ver
                    </a>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleEdit(curso)}
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

          {/* Paginación */}
          {pages > 1 && (
            <Pagination className="justify-content-end">
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              />
              {[...Array(pages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
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
            <i className="bi bi-easel2-fill me-2"></i>
            {editingItem ? "Editar Curso" : "Nuevo Curso"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Imagen del curso</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control defaultValue={editingItem?.title || ""} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={editingItem?.description || ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ponente</Form.Label>
              <Form.Control
                placeholder="Nombre del ponente"
                defaultValue={editingItem?.speaker || ""}
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Enlace del curso</Form.Label>
                  <Form.Control
                    type="url"
                    defaultValue={editingItem?.url || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select defaultValue={editingItem?.status || "active"}>
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
            {editingItem ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CursosAdmin;
