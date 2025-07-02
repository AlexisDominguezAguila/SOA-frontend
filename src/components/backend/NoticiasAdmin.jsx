"use client";

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
  Container,
  Dropdown,
} from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";
import "@/components/backend/layout/NoticiasAdmin.scss";

import defaultImg from "@/assets/images/noticia.webp";

const DUMMY_DATA = [
  {
    id: 1,
    img: defaultImg,
    title: "Lanzamiento de nueva plataforma educativa",
    description:
      "Una nueva plataforma será lanzada para apoyar la educación rural.",
    bullets: ["Acceso gratuito", "Soporte técnico", "Material interactivo"],
    url: "https://noticia1.com",
    status: "active",
    created_at: "2024-05-10",
  },
  {
    id: 2,
    img: defaultImg,
    title: "Convenio con Universidad Nacional",
    description:
      "Se firmó un convenio con la universidad para becas estudiantiles.",
    bullets: ["Becas", "Cursos gratuitos"],
    url: "https://noticia2.com",
    status: "inactive",
    created_at: "2024-04-28",
  },
  {
    id: 3,
    img: defaultImg,
    title: "Programa de Innovación Tecnológica",
    description:
      "Nuevo programa para fomentar la innovación en el sector educativo.",
    bullets: ["Capacitación", "Recursos digitales", "Mentorías"],
    url: "https://noticia3.com",
    status: "active",
    created_at: "2024-05-15",
  },
  {
    id: 4,
    img: defaultImg,
    title: "Conferencia Internacional de Educación",
    description:
      "Evento que reunirá a expertos en educación de toda Latinoamérica.",
    bullets: ["Networking", "Conferencias magistrales", "Talleres prácticos"],
    url: "https://noticia4.com",
    status: "active",
    created_at: "2024-05-20",
  },
];

const NoticiasAdmin = () => {
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
    <Badge
      className={`status-badge ${
        status === "active" ? "status-active" : "status-inactive"
      }`}
    >
      {status === "active" ? "Activa" : "Inactiva"}
    </Badge>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`dashboard-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <DashboardSidebar isOpen={isSidebarOpen} />

      <main className="main-content-container">
        <section className="content-section p-4">
          {/* Header mejorado */}
          <div className="page-header mb-5">
            <div className="header-content">
              <div className="header-info">
                <h1 className="page-title">Gestión de Noticias</h1>
                <p className="page-subtitle">
                  Administra y publica las noticias institucionales de manera
                  eficiente
                </p>
                <div className="header-stats">
                  <span className="stat-item">
                    <i className="bi bi-file-text"></i>
                    {data.length} Noticias totales
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-check-circle"></i>
                    {data.filter((n) => n.status === "active").length} Activas
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
          <Card className="filters-card mb-4">
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
                        placeholder="Buscar por título de noticia..."
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
                      <i className="bi bi-newspaper me-3"></i> Activas
                    </option>
                    <option value="inactive">
                      <i className="bi bi-newspaper me-3"></i> Inactivas
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
                    <span className="results-count">
                      {filtered.length} resultado
                      {filtered.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabla mejorada */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header p-4">
                <h5 className="table-title mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Lista de Noticias
                </h5>
              </div>

              <div className="table-responsive">
                <Table className="modern-table mb-0">
                  <thead>
                    <tr>
                      <th className="table-header-cell">#</th>
                      <th className="table-header-cell">Vista Previa</th>
                      <th className="table-header-cell">Información</th>
                      <th className="table-header-cell">Beneficios</th>
                      <th className="table-header-cell">Estado</th>
                      <th className="table-header-cell">Fecha</th>
                      <th className="table-header-cell text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.map((n, i) => (
                      <tr key={n.id} className="table-row">
                        <td className="table-cell">
                          <span className="row-number">
                            {(page - 1) * pageSize + i + 1}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="news-preview">
                            <img
                              src={n.img || "/placeholder.svg"}
                              alt={n.title}
                              className="news-image"
                            />
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="news-info">
                            <h6 className="news-title">{n.title}</h6>
                            <p className="news-description">{n.description}</p>
                            <a
                              href={n.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="news-link"
                            >
                              <i className="bi bi-box-arrow-up-right me-1"></i>
                              Ver noticia completa
                            </a>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="benefits-list">
                            {n.bullets.map((b, idx) => (
                              <span key={idx} className="benefit-tag">
                                <i className="bi bi-check2"></i>
                                {b}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="table-cell">
                          {getStatusBadge(n.status)}
                        </td>
                        <td className="table-cell">
                          <span className="date-info">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(n.created_at)}
                          </span>
                        </td>
                        <td className="table-cell text-center">
                          <div className="action-buttons">
                            <Button
                              size="sm"
                              className="btn-action-edit me-2"
                              onClick={() => handleEdit(n)}
                              title="Editar noticia"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                            <Button
                              size="sm"
                              className="btn-action-delete"
                              title="Eliminar noticia"
                            >
                              <i className="bi bi-trash3"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Paginación mejorada */}
              {pages > 1 && (
                <div className="pagination-wrapper p-4">
                  <div className="pagination-info">
                    <span className="pagination-text">
                      Mostrando {(page - 1) * pageSize + 1} -{" "}
                      {Math.min(page * pageSize, filtered.length)} de{" "}
                      {filtered.length} noticias
                    </span>
                  </div>
                  <Pagination className="custom-pagination mb-0">
                    <Pagination.Prev
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="pagination-control"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </Pagination.Prev>
                    {[...Array(pages)].map((_, i) => (
                      <Pagination.Item
                        key={i}
                        active={page === i + 1}
                        onClick={() => setPage(i + 1)}
                        className="pagination-item"
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={page === pages}
                      onClick={() => setPage(page + 1)}
                      className="pagination-control"
                    >
                      <i className="bi bi-chevron-right"></i>
                    </Pagination.Next>
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </section>
      </main>
      {/* Modal mejorado */}
      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <i className="bi bi-newspaper me-2"></i>
            {editingItem ? "Editar Noticia" : "Nueva Noticia"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            <div className="form-section mb-4">
              <h6 className="form-section-title">
                <i className="bi bi-image me-2"></i>
                Información Visual
              </h6>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      Imagen destacada
                    </Form.Label>
                    <Form.Control
                      type="file"
                      className="form-control-custom"
                      accept="image/*"
                    />
                    <Form.Text className="text-muted">
                      Formatos soportados: JPG, PNG, WebP. Tamaño máximo: 2MB
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="form-section mb-4">
              <h6 className="form-section-title">
                <i className="bi bi-file-text me-2"></i>
                Contenido Principal
              </h6>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  Título de la noticia
                </Form.Label>
                <Form.Control
                  defaultValue={editingItem?.title || ""}
                  className="form-control-custom"
                  placeholder="Ingresa un título atractivo para la noticia"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  Descripción
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue={editingItem?.description || ""}
                  className="form-control-custom"
                  placeholder="Describe brevemente el contenido de la noticia"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">
                  Beneficios o puntos clave
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribe cada beneficio en una línea nueva"
                  defaultValue={editingItem?.bullets?.join("\n") || ""}
                  className="form-control-custom"
                />
                <Form.Text className="text-muted">
                  Cada línea se convertirá en un punto destacado
                </Form.Text>
              </Form.Group>
            </div>

            <div className="form-section">
              <h6 className="form-section-title">
                <i className="bi bi-gear me-2"></i>
                Configuración
              </h6>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      URL de la noticia
                    </Form.Label>
                    <Form.Control
                      type="url"
                      defaultValue={editingItem?.url || ""}
                      className="form-control-custom"
                      placeholder="https://ejemplo.com/noticia"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">
                      Estado
                    </Form.Label>
                    <Form.Select
                      defaultValue={editingItem?.status || "active"}
                      className="form-control-custom"
                    >
                      <option value="active">✅ Activa</option>
                      <option value="inactive">❌ Inactiva</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            className="btn-cancel"
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </Button>
          <Button className="btn-save">
            <i className="bi bi-check-lg me-2"></i>
            {editingItem ? "Actualizar Noticia" : "Guardar Noticia"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NoticiasAdmin;
