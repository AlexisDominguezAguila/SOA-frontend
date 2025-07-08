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
      <main className="main-content-container">
        <section className="content-section p-4">
          {/* Header mejorado */}
          <div className="page-header mb-5">
            <div className="header-content">
              <div className="header-info">
                <h1 className="page-title">Gestión de Cursos</h1>
                <p className="page-subtitle">
                  Administra y publica los cursos institucionales de manera
                  eficiente
                </p>
                <div className="header-stats">
                  <span className="stat-item">
                    <i className="bi bi-file-text"></i>
                    {data.length} Noticias totales
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-check-circle"></i>
                    {data.filter((n) => n.status === "active").length}{" "}
                    Publicadas
                  </span>
                  <span className="stat-item ">
                    <i className="bi bi-x-circle me-1"></i>
                    {data.filter((n) => n.status === "inactive").length} Sin
                    revisar
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <Button className="btn-primary-custom" onClick={handleShow}>
                  <i className="bi bi-plus-lg me-2"></i>
                  Nueva Noticia
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros mejorados */}
          <Card className="filter-card mb-4">
            <Card.Body className="p-4">
              <div className="filters-header mb-3">
                <h5 className="filters-title">
                  <i className="bi bi-funnel me-2"></i>
                  Filtros de búsqueda
                </h5>
              </div>
              <Row className="g-3">
                <Col lg={5} md={6}>
                  <div className="search-input-wrapper">
                    <InputGroup className="search-input">
                      <InputGroup.Text className="search-icon">
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Buscar por título de curso..."
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setPage(1);
                        }}
                        className="search-field"
                      />
                    </InputGroup>
                  </div>
                </Col>
                <Col lg={3} md={4}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="status-filter"
                  >
                    <option value="all">
                      <i className="bi bi-newspaper me-3"></i> Todos los estados
                    </option>
                    <option value="active">
                      <i className="bi bi-newspaper me-3"></i> Aprobadas
                    </option>
                    <option value="inactive">
                      <i className="bi bi-newspaper me-3"></i> Pendientes
                    </option>
                  </Form.Select>
                </Col>
                <Col lg={2} md={2}>
                  <Button
                    className="btn-clear-filters"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("all");
                      setPage(1);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Limpiar
                  </Button>
                </Col>
                <Col lg={2} md={12}>
                  <div className="results-info">
                    <span className="stat-item ">
                      <i className="bi bi-list-check me-1"></i>
                      {filtered.length} resultado
                      {filtered.length !== 1 ? "s" : ""}
                    </span>
                  </div>
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
      </main>

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
