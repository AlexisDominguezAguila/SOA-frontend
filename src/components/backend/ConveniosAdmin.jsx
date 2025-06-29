"use client";

// src/components/backend/ConveniosAdmin.jsx

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
import "@/components/backend/layout/ConveniosAdmin.scss";
import convenio from "@/assets/images/convenio.jpeg";

/* ───── Datos dummy solo para maqueta ───── */
const DUMMY_DATA = [
  {
    id: 1,
    img: convenio, // ← aquí la usas
    title: "Convenio Universidad X",
    bullets: ["Descuento 30%", "Acceso a biblioteca virtual"],
    url: convenio, // si quieres que el enlace abra la imagen
    status: "active",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    img: convenio, // mismo placeholder
    title: "Programa Talento Y",
    bullets: ["Mentorías", "Bolsa de trabajo", "Networking"],
    url: "https://talentoy.org", // o un enlace externo normal
    status: "active",
    created_at: "2024-01-10",
  },
  {
    id: 3,
    img: convenio,
    title: "Instituto Tecnológico Z",
    bullets: ["Certificaciones gratuitas", "Cursos especializados"],
    url: "https://institutoz.edu",
    status: "inactive",
    created_at: "2024-01-05",
  },
];

const ConveniosAdmin = () => {
  /* ───── state UI ───── */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  /* modal & form */
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

  /* listado, búsqueda y paginación */
  const [data] = useState(DUMMY_DATA);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = data.filter((c) => {
    const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // paginación cliente‑side: 5 por página
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <Badge bg="success" className="status-badge">
        <i className="bi bi-check-circle me-1"></i>Activo
      </Badge>
    ) : (
      <Badge bg="secondary" className="status-badge">
        <i className="bi bi-pause-circle me-1"></i>Inactivo
      </Badge>
    );
  };

  return (
    <div className="dashboard-container min-vh-100">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} />

      {/* Contenedor principal */}
      <div className="main-content-container">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />

        {/* Contenido */}
        <section className="content-section p-4">
          {/* Header de la sección */}
          <div className="section-header mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="section-title mb-1">
                  <i className="bi bi-handshake me-2"></i>
                  Gestión de Convenios
                </h2>
                <p className="section-subtitle mb-0">
                  Administra los convenios y alianzas estratégicas
                </p>
              </div>
              <Button
                className="btn-add-convenio"
                onClick={handleShow}
                size="lg"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Nuevo Convenio
              </Button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="stats-card stats-card-primary">
                <Card.Body className="text-center">
                  <i className="bi bi-briefcase-fill stats-icon"></i>
                  <h3 className="stats-number">{data.length}</h3>
                  <p className="stats-label">Total Convenios</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card stats-card-success">
                <Card.Body className="text-center">
                  <i className="bi bi-check-circle stats-icon"></i>
                  <h3 className="stats-number">
                    {data.filter((c) => c.status === "active").length}
                  </h3>
                  <p className="stats-label">Activos</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card stats-card-warning">
                <Card.Body className="text-center">
                  <i className="bi bi-pause-circle stats-icon"></i>
                  <h3 className="stats-number">
                    {data.filter((c) => c.status === "inactive").length}
                  </h3>
                  <p className="stats-label">Inactivos</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card stats-card-info">
                <Card.Body className="text-center">
                  <i className="bi bi-calendar-plus stats-icon"></i>
                  <h3 className="stats-number">2</h3>
                  <p className="stats-label">Este Mes</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filtros y búsqueda */}
          <Card className="filters-card mb-4">
            <Card.Body>
              <Row className="align-items-end">
                <Col md={6}>
                  <Form.Label className="filter-label">
                    Buscar convenio
                  </Form.Label>
                  <InputGroup className="search-input-group">
                    <InputGroup.Text className="search-icon">
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar por título..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                      className="search-input"
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Label className="filter-label">Estado</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="status-filter"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-secondary"
                    className="w-100 reset-btn"
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
              </Row>
            </Card.Body>
          </Card>

          {/* Tabla de convenios */}
          <Card className="table-card">
            <Card.Body className="p-0">
              {view.length > 0 ? (
                <div className="table-responsive">
                  <Table className="convenios-table mb-0">
                    <thead>
                      <tr>
                        <th className="table-header">#</th>
                        <th className="table-header">Logo</th>
                        <th className="table-header">Información</th>
                        <th className="table-header">Beneficios</th>
                        <th className="table-header">Estado</th>
                        <th className="table-header">Enlace</th>
                        <th className="table-header text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {view.map((c, i) => (
                        <tr key={c.id} className="table-row">
                          <td className="row-number">
                            {(page - 1) * pageSize + (i + 1)}
                          </td>
                          <td className="logo-cell">
                            <div className="logo-container">
                              <img
                                src={c.img || "/placeholder.svg"}
                                alt={c.title}
                                className="convenio-logo"
                                onError={(e) => {
                                  e.target.src =
                                    "/placeholder.svg?height=40&width=40";
                                }}
                              />
                            </div>
                          </td>
                          <td className="info-cell">
                            <div>
                              <h6 className="convenio-title mb-1">{c.title}</h6>
                              <small className="convenio-date text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                Creado:{" "}
                                {new Date(c.created_at).toLocaleDateString()}
                              </small>
                            </div>
                          </td>
                          <td className="benefits-cell">
                            <div className="benefits-container">
                              <Badge bg="info" className="benefits-count">
                                <i className="bi bi-list-ul me-1"></i>
                                {c.bullets.length} beneficios
                              </Badge>
                              <div className="benefits-preview mt-1">
                                {c.bullets.slice(0, 2).map((bullet, idx) => (
                                  <small
                                    key={idx}
                                    className="benefit-item d-block text-muted"
                                  >
                                    • {bullet}
                                  </small>
                                ))}
                                {c.bullets.length > 2 && (
                                  <small className="text-muted">
                                    +{c.bullets.length - 2} más...
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="status-cell">
                            {getStatusBadge(c.status)}
                          </td>
                          <td className="link-cell">
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="external-link"
                            >
                              <i className="bi bi-box-arrow-up-right me-1"></i>
                              Visitar
                            </a>
                          </td>
                          <td className="actions-cell text-end">
                            <div className="action-buttons">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="action-btn edit-btn me-2"
                                onClick={() => handleEdit(c)}
                                title="Editar convenio"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className="action-btn delete-btn"
                                title="Eliminar convenio"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <i className="bi bi-search empty-state-icon"></i>
                    <h5 className="empty-state-title">
                      No se encontraron convenios
                    </h5>
                    <p className="empty-state-text">
                      {query || statusFilter !== "all"
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "Comienza agregando tu primer convenio"}
                    </p>
                    {!query && statusFilter === "all" && (
                      <Button
                        variant="primary"
                        onClick={handleShow}
                        className="mt-2"
                      >
                        <i className="bi bi-plus-lg me-2"></i>
                        Agregar Convenio
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Paginación */}
          {pages > 1 && (
            <div className="pagination-container mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="pagination-info">
                  <small className="text-muted">
                    Mostrando {(page - 1) * pageSize + 1} -{" "}
                    {Math.min(page * pageSize, filtered.length)} de{" "}
                    {filtered.length} convenios
                  </small>
                </div>
                <Pagination className="custom-pagination mb-0">
                  <Pagination.Prev
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  />
                  {[...Array(pages)].map((_, idx) => (
                    <Pagination.Item
                      key={idx}
                      active={idx + 1 === page}
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={page === pages}
                    onClick={() => setPage((p) => p + 1)}
                  />
                </Pagination>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modal formulario */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        className="convenio-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <i className="bi bi-handshake me-2"></i>
            {editingItem ? "Editar Convenio" : "Nuevo Convenio"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-image me-2"></i>Logo del convenio
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    className="form-control-custom"
                  />
                  <Form.Text className="text-muted">
                    Formatos soportados: JPG, PNG, SVG (máx. 2MB)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-type me-2"></i>Título del convenio
                  </Form.Label>
                  <Form.Control
                    placeholder="Ej: Universidad Nacional de Colombia"
                    className="form-control-custom"
                    defaultValue={editingItem?.title || ""}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                <i className="bi bi-list-ul me-2"></i>Beneficios y ventajas
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Escribe cada beneficio en una línea separada&#10;Ej:&#10;• Descuento del 20% en matrículas&#10;• Acceso gratuito a biblioteca digital&#10;• Mentorías especializadas"
                className="form-control-custom"
                defaultValue={editingItem?.bullets?.join("\n") || ""}
              />
              <Form.Text className="text-muted">
                Cada línea será un beneficio independiente. Usa viñetas (•) para
                mejor presentación.
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-link-45deg me-2"></i>URL del convenio
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://ejemplo.com/convenio"
                    className="form-control-custom"
                    defaultValue={editingItem?.url || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-toggle-on me-2"></i>Estado
                  </Form.Label>
                  <Form.Select
                    className="form-control-custom"
                    defaultValue={editingItem?.status || "active"}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            className="btn-cancel"
          >
            <i className="bi bi-x-lg me-2"></i>Cancelar
          </Button>
          <Button variant="primary" className="btn-save">
            <i className="bi bi-check-lg me-2"></i>
            {editingItem ? "Actualizar" : "Guardar"} Convenio
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConveniosAdmin;
