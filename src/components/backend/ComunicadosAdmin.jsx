"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Table,
  Row,
  Col,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

import comunicadoEjemplo from "@/assets/images/convenio.jpeg"; // Imagen temporal

// Datos de prueba
const DUMMY_COMUNICADOS = [
  { id: 1, img: comunicadoEjemplo, created_at: "2024-06-01", active: true },
  { id: 2, img: comunicadoEjemplo, created_at: "2024-05-20", active: false },
  { id: 3, img: comunicadoEjemplo, created_at: "2024-05-10", active: false },
];

const ComunicadosAdmin = () => {
  /* ---------- Estados base ---------- */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [comunicados, setComunicados] = useState(DUMMY_COMUNICADOS);

  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  /* ---------- Filtros y paginación ---------- */
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = comunicados.filter((c) => {
    const matchesText = c.created_at.includes(query); // Ejemplo simple
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.active) ||
      (statusFilter === "inactive" && !c.active);
    return matchesText && matchesStatus;
  });

  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------- Stats ---------- */
  const total = comunicados.length;
  const activos = comunicados.filter((c) => c.active).length;
  const inactivos = total - activos;

  /* ---------- Render ---------- */
  return (
    <div className="dashboard-container min-vh-100">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} />

      {/* Contenido principal */}
      <main className="main-content-container">
        <section className="content-section p-4">
          {/* ENCABEZADO */}
          <div className="page-header mb-5">
            <div className="header-content">
              <div className="header-info">
                <h1 className="page-title">Gestión de Comunicados</h1>
                <p className="page-subtitle">
                  Administra los comunicados mostrados en el portal web
                </p>

                <div className="header-stats mt-3 d-flex flex-wrap gap-3">
                  <span className="stat-item">
                    <i className="bi bi-megaphone-fill me-1" />
                    {total} comunicados en total
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-check-circle me-1" />
                    {activos} activos
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-x-circle me-1" />
                    {inactivos} inactivos
                  </span>
                </div>
              </div>

              <div className="header-actions">
                <Button className="btn-primary-custom" onClick={handleOpen}>
                  <i className="bi bi-plus-lg me-2" />
                  Nuevo comunicado
                </Button>
              </div>
            </div>
          </div>

          {/* FILTROS */}
          <Card className="filter-card mb-4">
            <Card.Body className="p-4">
              <h5 className="filters-title mb-3">
                <i className="bi bi-funnel me-2" />
                Filtros de búsqueda
              </h5>
              <Row className="g-3">
                {/* Búsqueda por fecha (ejemplo simple) */}
                <Col lg={5} md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar por fecha (YYYY-MM-DD)..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                    />
                  </InputGroup>
                </Col>

                {/* Filtro por estado */}
                <Col lg={3} md={4}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </Form.Select>
                </Col>

                {/* Limpiar */}
                <Col lg={2}>
                  <Button
                    className="btn-clear-filters"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("all");
                      setPage(1);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1" />
                    Limpiar
                  </Button>
                </Col>

                {/* Resultados */}
                <Col lg={2}>
                  <span className="stat-item">
                    <i className="bi bi-list-check me-1" />
                    {filtered.length} resultado
                    {filtered.length !== 1 ? "s" : ""}
                  </span>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* TABLA */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header p-4">
                <h5 className="table-title mb-0">
                  <i className="bi bi-list-ul me-2" />
                  Lista de comunicados
                </h5>
              </div>

              <div className="table-responsive">
                <Table className="modern-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Imagen</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.length ? (
                      view.map((c, i) => (
                        <tr key={c.id}>
                          <td>{(page - 1) * pageSize + i + 1}</td>
                          <td>
                            <img
                              src={c.img}
                              alt={`Comunicado ${c.id}`}
                              style={{ width: 80, height: "auto" }}
                            />
                          </td>
                          <td>{c.created_at}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                c.active ? "status-active" : "status-inactive"
                              }`}
                            >
                              {c.active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="text-center">
                            {/* Botones de acción (editar / eliminar) */}
                            <Button
                              size="sm"
                              className="btn-action btn-edit me-2"
                              title="Editar comunicado"
                            >
                              <i className="bi bi-pencil-square" />
                            </Button>
                            <Button
                              size="sm"
                              className="btn-action btn-delete"
                              title="Eliminar comunicado"
                            >
                              <i className="bi bi-trash3" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div className="empty-state">
                            <i className="bi bi-inbox" />
                            <h5>No se encontraron comunicados</h5>
                            <p>
                              {query
                                ? "Intenta con otros términos de búsqueda"
                                : "Comienza agregando un nuevo comunicado"}
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

          {/* PAGINACIÓN */}
          {pages > 1 && (
            <div className="pagination-outer-container mt-4">
              <Pagination className="custom-pagination">
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <i className="bi bi-chevron-left" />
                </Pagination.Prev>

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
                >
                  <i className="bi bi-chevron-right" />
                </Pagination.Next>
              </Pagination>
            </div>
          )}
        </section>
      </main>

      {/* MODAL PARA CREAR / EDITAR */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-megaphone me-2" />
            Nuevo comunicado
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Imagen del comunicado</Form.Label>
                  <Form.Control type="file" accept="image/*" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Form.Check
                  type="switch"
                  id="switch-active"
                  label="¿Activo?"
                  defaultChecked
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary">Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComunicadosAdmin;
