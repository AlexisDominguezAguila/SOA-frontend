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
  {
    id: 4,
    img: convenio,
    title: "Instituto Tecnológico Z",
    bullets: ["Certificaciones gratuitas", "Cursos especializados"],
    url: "https://institutoz.edu",
    status: "inactive",
    created_at: "2024-01-05",
  },
  {
    id: 5,
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
  const pageSize = 4;
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
      <main className="main-content-container">
        {/* Contenido */}
        <section className="content-section p-4">
          {/* Header de la sección */}
          <div className="page-header mb-5">
            <div className="header-content">
              <div className="header-info">
                <h1 className="page-title">Gestión de Convenios</h1>
                <p className="page-subtitle">
                  Administra y publica los convenios y alianzas institucionales
                  de manera eficiente
                </p>
                <div className="header-stats">
                  <span className="stat-item">
                    <i className="bi bi-file-text"></i>
                    {data.length} Convenios totales
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-check-circle"></i>
                    {data.filter((n) => n.status === "active").length}{" "}
                    Publicados
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
                  Nuevo Convenio
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
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
                        placeholder="Buscar por título de convenio..."
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
                      <i className="bi bi-newspaper me-3"></i> Activos
                    </option>
                    <option value="inactive">
                      <i className="bi bi-newspaper me-3"></i> Inactivos
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

          {/* Tabla de convenios */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header">
                <h5 className="table-title mb-0 p-4">
                  <i className="bi bi-list-ul me-2"></i>Lista de Convenios
                </h5>
              </div>

              <div className="table-responsive">
                <Table bsPrefix="modern-table" className="modern-table mb-0">
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
                    {view.length > 0 ? (
                      view.map((c, i) => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <div className="empty-state">
                            <i className="bi bi-inbox fs-1 mb-3 d-block text-muted"></i>
                            <h5 className="mb-1">
                              No se encontraron convenios
                            </h5>
                            <p className="text-muted mb-0">
                              {query
                                ? "Intenta con otros términos de búsqueda"
                                : "Comienza agregando un nuevo convenio"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
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
      </main>

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
