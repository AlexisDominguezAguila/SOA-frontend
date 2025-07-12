"use client";
import { useState, useEffect } from "react";
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
  Pagination,
  Spinner,
} from "react-bootstrap";
import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";
import "@/components/backend/layout/gestion.scss";

import Placeholder from "@/assets/images/doctor.webp";

const dummyGestiones = [
  // {
  //   id: 1,
  //   nombre: "Gestión 2020-2023",
  //   lema: "Comprometidos con la ética, la excelencia y la vocación de servicio",
  //   inicio: "2020",
  //   fin: "2023",
  //   isActive: true,
  //   miembros: [
  //     {
  //       id: 1,
  //       nombre: "Ing. Juan Pérez",
  //       cargo: "Presidente",
  //       img: Placeholder,
  //       isActive: true,
  //     },
  //     {
  //       id: 2,
  //       nombre: "Dra. Ana López",
  //       cargo: "Secretaria",
  //       img: Placeholder,
  //       isActive: true,
  //     },
  //     {
  //       id: 3,
  //       nombre: "Dr. José García",
  //       cargo: "Tesorero",
  //       img: Placeholder,
  //       isActive: false,
  //     },
  //   ],
  // },
  // {
  //   id: 2,
  //   nombre: "Gestión 2017-2020",
  //   lema: "Unidos somos más",
  //   inicio: "2017",
  //   fin: "2020",
  //   status: "inactive",
  //   miembros: [
  //     {
  //       id: 4,
  //       nombre: "Lic. Marta Salazar",
  //       cargo: "Presidenta",
  //       img: Placeholder,
  //       isActive: false,
  //     },
  //     {
  //       id: 5,
  //       nombre: "Dr. Luis Ramírez",
  //       cargo: "Secretario",
  //       img: Placeholder,
  //       isActive: false,
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   nombre: "Gestión 2014-2017",
  //   lema: "Desarrollo sostenible",
  //   inicio: "2014",
  //   fin: "2017",
  //   isActive: false,
  //   miembros: [
  //     {
  //       id: 6,
  //       nombre: "Lic. Carlos Rodríguez",
  //       cargo: "Presidente",
  //       img: Placeholder,
  //       isActive: false,
  //     },
  //     {
  //       id: 7,
  //       nombre: "Ing. Teresa Méndez",
  //       cargo: "Tesorera",
  //       img: Placeholder,
  //       isActive: false,
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   nombre: "Gestión 2011-2014",
  //   lema: "Creciendo juntos",
  //   inicio: "2011",
  //   fin: "2014",
  //   isActive: false,
  //   miembros: [
  //     {
  //       id: 8,
  //       nombre: "Dr. Víctor Andrade",
  //       cargo: "Presidente",
  //       img: Placeholder,
  //       isActive: false,
  //     },
  //   ],
  // },
];

const DirectivasAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [gestiones, setGestiones] = useState(dummyGestiones);
  const [showModal, setShowModal] = useState(false);
  const [editingGestion, setEditingGestion] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingMiembros, setLoadingMiembros] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setEditingGestion(null);
  };

  const handleEditGestion = (g) => {
    setEditingGestion(g);
    setShowModal(true);
  };

  // Simulación de carga de datos
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Filtrado de gestiones
  const filtered = gestiones.filter((g) => {
    const matchesName = g.nombre.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <section className="content-section p-4">
          {/* Sección Hero */}
          <div className="page-header mb-5">
            <div className="header-content">
              <div className="header-info">
                <h1 className="page-title">
                  <i className="bi bi-people-fill me-2"></i>
                  Gestión de Juntas Directivas
                </h1>
                <p className="page-subtitle">
                  Administra las gestiones de la junta directiva y sus miembros
                </p>
                <div className="header-stats">
                  <span className="stat-item">
                    <i className="bi bi-people"></i>
                    {gestiones.length} Gestiones totales
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-check-circle"></i>
                    {gestiones.filter((g) => g.status === "active").length}{" "}
                    Activas
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-archive"></i>
                    {
                      gestiones.filter((g) => g.status === "inactive").length
                    }{" "}
                    Inactivas
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <Button onClick={handleShow} className="btn-primary-custom">
                  <i className="bi bi-plus-lg me-2"></i>
                  Nueva Gestión
                </Button>
              </div>
            </div>
          </div>

          {/* Sección de Filtros */}
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
                        placeholder="Buscar por año de gestión: YYYY - YYYY"
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
                    <option value="all">Todos los estados</option>
                    <option value="active">Activas</option>
                    <option value="inactive">Inactivas</option>
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
                    <span className="stat-item">
                      <i className="bi bi-list-check me-1"></i>
                      {filtered.length} resultado
                      {filtered.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabla de gestiones */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Cargando gestiones...</p>
            </div>
          ) : (
            <>
              <div className="dark-container">
                <Accordion
                  alwaysOpen
                  activeKey={expanded}
                  className="custom-accordion"
                >
                  {view.length > 0 ? (
                    view.map((g) => (
                      <Card key={g.id} className="table-card mb-3">
                        <Accordion.Item eventKey={g.id.toString()}>
                          <Accordion.Header
                            onClick={() =>
                              setExpanded(
                                expanded === g.id.toString()
                                  ? null
                                  : g.id.toString()
                              )
                            }
                          >
                            <div className="accordion-header-content w-100 d-flex justify-content-start py-2 ">
                              {/* Badge */}
                              <div className="accordion-title flex-grow-1">
                                <strong>{g.nombre}</strong>
                              </div>
                              <span
                                className={`status-badge ${
                                  g.is_active ?? g.isActive
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                {g.is_active ?? g.isActive
                                  ? "Activo"
                                  : "Inactivo"}
                              </span>
                            </div>
                          </Accordion.Header>

                          <Accordion.Body>
                            <Card className="table-card">
                              <Card.Body className="p-0">
                                <div className="table-header d-flex justify-content-between align-items-center px-4 py-3">
                                  <h5 className="table-titles mb-0">
                                    <i className="bi bi-chat-quote me-2"></i>
                                    {g.lema}
                                  </h5>
                                  {/*botones para editar y eliminar gestiones*/}
                                  <div className="action-buttons d-flex align-items-center gap-2">
                                    <Button
                                      size="sm"
                                      className="btn-action btn-edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="btn-action btn-delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </div>
                                </div>

                                <div className="table-responsive">
                                  <Table
                                    bsPrefix="modern-table"
                                    className="modern-table mb-0"
                                  >
                                    <thead>
                                      <tr>
                                        <th className="table-header-cell">#</th>
                                        <th className="table-header-cell">
                                          Foto
                                        </th>
                                        <th className="table-header-cell">
                                          Nombre
                                        </th>
                                        <th className="table-header-cell">
                                          Cargo
                                        </th>
                                        <th className="table-header-cell">
                                          Estado
                                        </th>
                                        <th className="text-center">
                                          Acciones
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {loadingMiembros &&
                                      deletingId === g.id ? (
                                        <tr>
                                          <td
                                            colSpan="6"
                                            className="text-center py-5"
                                          >
                                            <Spinner
                                              animation="border"
                                              variant="primary"
                                            />
                                            <p className="mt-2">
                                              Cargando decanos...
                                            </p>
                                          </td>
                                        </tr>
                                      ) : g.miembros.length > 0 ? (
                                        g.miembros.map((m, i) => (
                                          <tr key={m.id} className="table-row">
                                            <td className="table-cell">
                                              <span className="row-number">
                                                {(page - 1) * pageSize + i + 1}
                                              </span>
                                            </td>
                                            <td className="table-cell">
                                              <div className="image-container">
                                                <img
                                                  src={m.img}
                                                  alt={m.nombre}
                                                  className="table-image"
                                                  onError={(e) => {
                                                    e.target.src = Placeholder;
                                                  }}
                                                />
                                              </div>
                                            </td>
                                            <td className="table-cell">
                                              {m.nombre}
                                            </td>
                                            <td className="table-cell">
                                              {m.cargo}
                                            </td>
                                            <td>
                                              <span
                                                className={`status-badge ${
                                                  m.is_active ?? m.isActive
                                                    ? "status-active"
                                                    : "status-inactive"
                                                }`}
                                              >
                                                {m.is_active ?? m.isActive
                                                  ? "Activo"
                                                  : "Inactivo"}
                                              </span>
                                            </td>
                                            <td className="table-cell text-center">
                                              <div className="action-buttons">
                                                <Button
                                                  size="sm"
                                                  variant="outline-primary"
                                                  className="btn-action btn-edit"
                                                >
                                                  <i className="bi bi-pencil"></i>
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline-danger"
                                                  className="btn-action btn-delete"
                                                >
                                                  <i className="bi bi-trash"></i>
                                                </Button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan="6"
                                            className="text-center py-5"
                                          >
                                            <div className="empty-state">
                                              <i className="bi bi-inbox"></i>
                                              <h5>
                                                Esta Gestión no tiene registros
                                              </h5>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              </Card.Body>
                            </Card>

                            <div className="text-end">
                              <Button
                                className="btn-primary-custom"
                                size="sm"
                                variant="outline-success"
                              >
                                <i className="bi bi-person-plus me-2"></i>
                                Agregar Miembro
                              </Button>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Card>
                    ))
                  ) : (
                    <Card className="table-card">
                      <div className="empty-state">
                        <i className="bi bi-inbox "></i>
                        <h5>
                          {query
                            ? "No se encontraron resultados para tu búsqueda"
                            : "Aún no has registrado ninguna gestión"}
                        </h5>
                        <p>
                          {query
                            ? "Prueba con otros términos o verifica la ortografía"
                            : "Empieza registrando tu primera gestión"}
                        </p>
                        <br />

                        <div className="header-actions">
                          <Button
                            onClick={handleShow}
                            className="btn-primary-custom"
                            variant="outline-success"
                            size="sm" // <-- también reduce altura y fuente
                          >
                            Añadir una Nueva Gestión
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Accordion>
              </div>
              {/* Paginación */}
              {pages > 1 && (
                <div className="pagination-outer-container mt-4">
                  <Pagination className="custom-pagination">
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
            </>
          )}
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
              <Form.Control
                defaultValue={editingGestion?.nombre || ""}
                placeholder="Ej: Gestión 2020-2023"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lema</Form.Label>
              <Form.Control
                defaultValue={editingGestion?.lema || ""}
                placeholder="Ej: Innovar para avanzar"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Año Inicio</Form.Label>
                  <Form.Control
                    type="number"
                    min="2000"
                    max="2100"
                    defaultValue={editingGestion?.inicio || ""}
                    placeholder="Ej: 2020"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Año Fin</Form.Label>
                  <Form.Control
                    type="number"
                    min="2000"
                    max="2100"
                    defaultValue={editingGestion?.fin || ""}
                    placeholder="Ej: 2023"
                  />
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
          <Button variant="primary" disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              "Guardar Gestión"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para registrar/editar miembros de las gestiones */}
    </div>
  );
};

export default DirectivasAdmin;
