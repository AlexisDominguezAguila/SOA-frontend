"use client";

import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Pagination,
  Row,
  Table,
  Spinner,
} from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import api from "@/services/api";
import Swal from "sweetalert2";
import "@/components/backend/layout/dashboard.scss";

import { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";

const CursosAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    ponente: "",
    url: "",
    activo: "active",
    imagen: null,
  });

  const handleClose = () => {
    document.activeElement?.blur();
    setShowModal(false);
    setEditingItem(null);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    if (editingItem) {
      setFormData({
        titulo: editingItem.title || "",
        descripcion: editingItem.description || "",
        ponente: editingItem.speaker || "",
        url: editingItem.url || "",
        activo: editingItem.status || "active",
        imagen: null,
      });
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        ponente: "",
        url: "",
        activo: "active",
        imagen: null,
      });
    }
  }, [editingItem]);

  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append("titulo", formData.titulo);
    payload.append("descripcion", formData.descripcion);
    payload.append("ponente", formData.ponente);
    payload.append("url", formData.url);
    payload.append("activo", formData.activo);

    if (formData.imagen instanceof File) {
      payload.append("imagen", formData.imagen);
    }

    try {
      if (editingItem) {
        await api.post(`/cursos/${editingItem.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
          params: { _method: "PUT" },
        });
        Swal.fire("Actualizado", "Curso actualizado correctamente.", "success");
      } else {
        await api.post("/cursos", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Creado", "Curso creado correctamente.", "success");
      }

      handleClose();
      fetchCursos();
    } catch (error) {
      console.error("Error detallado:", error.response?.data);
      Swal.fire(
        "Error",
        "No se pudo guardar el curso: " +
          (error.response?.data?.message || "Error desconocido"),
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        setDeletingId(id);
        await api.delete(`/cursos/${id}`);
        fetchCursos();
        Swal.fire("Eliminado", "El curso ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el curso.", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filtered = data.filter((c) => {
    const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cursos");

      // Usa directamente res.data.data
      setData(res.data.data);
    } catch (err) {
      console.error("Error al cargar cursos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const pageSize = 5;
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
                    {data.length} Cursos totales
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
                  Nuevo Curso
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
                    <option value="all">Todos los estados</option>
                    <option value="active">Aprobadas</option>
                    <option value="inactive">Pendientes</option>
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
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header">
                <h5 className="table-title mb-0 p-4 ">
                  <i className="bi bi-list-ul me-2"></i>Lista de Cursos
                </h5>
              </div>
              <div className="table-responsive">
                <Table bsPrefix="modern-table" className="modern-table mb-0">
                  <thead>
                    <tr>
                      <th className="table-header-cell">#</th>
                      <th className="table-header-cell">Vista previa</th>
                      <th className="table-header-cell">Información</th>
                      <th className="table-header-cell">Enlace</th>
                      <th className="table-header-cell">Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-2">Cargando cursos...</p>
                        </td>
                      </tr>
                    ) : view.length > 0 ? (
                      view.map((curso, i) => (
                        <tr key={curso.id} className="table-row">
                          <td className="table-cell">
                            <span className="row-number">
                              {(page - 1) * pageSize + i + 1}
                            </span>
                          </td>

                          <td className="table-cell">
                            <div className="image-container">
                              <img
                                src={
                                  curso.image_url || "/placeholder-avatar.png"
                                }
                                alt={curso.title}
                                className="table-image"
                                onError={(e) => {
                                  e.target.src = "/placeholder-avatar.png";
                                }}
                              />
                            </div>
                          </td>

                          <td className="table-cell">
                            <div>
                              <h6 className="table-title">{curso.title}</h6>
                              <span className="date-info">
                                <i className="bi bi-calendar3 me-1"></i>
                                {curso.speaker}
                              </span>
                            </div>
                          </td>

                          <td className="table-cell">
                            <div className="tag-list">
                              <Button
                                size="sm"
                                className="btn-action btn-view"
                                variant="outline-primary"
                                onClick={() => window.open(curso.url, "_blank")}
                                title="Ver noticia"
                              >
                                <i className="bi bi-box-arrow-up-right"></i>
                              </Button>
                            </div>
                          </td>

                          <td className="table-cell text-center">
                            {getStatusBadge(curso.status)}
                          </td>

                          <td className="table-cell text-center">
                            <div className="action-buttons">
                              <Button
                                size="sm"
                                className="btn-action btn-edit"
                                variant="outline-secondary"
                                onClick={() => handleEdit(curso)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Button>

                              <Button
                                size="sm"
                                className="btn-action btn-delete"
                                variant="outline-danger"
                                disabled={deletingId === curso.id}
                                onClick={() => handleDelete(curso.id)}
                                title="Eliminar"
                              >
                                {deletingId === curso.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <i className="bi bi-trash"></i>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-5">
                          <div className="empty-state">
                            <i className="bi bi-inbox"></i>
                            <h5>
                              {query
                                ? "No se encontraron resultados para tu búsqueda"
                                : "Aún no has registrado ningún curso"}
                            </h5>
                            <p>
                              {query
                                ? "Prueba con otros términos o verifica la ortografía"
                                : "Empieza registrando tu primer curso"}
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
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp,image"
                    onChange={(e) =>
                      setFormData({ ...formData, imagen: e.target.files[0] })
                    }
                  />
                  {editingItem?.image_url && (
                    <img
                      src={editingItem.image_url}
                      alt="Vista previa"
                      className="img-thumbnail mt-2"
                      width={150}
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    placeholder="Título del curso"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción del curso"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ponente</Form.Label>
              <Form.Control
                value={formData.ponente}
                onChange={(e) =>
                  setFormData({ ...formData, ponente: e.target.value })
                }
                placeholder="Nombre del ponente"
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Enlace del curso</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.value })
                    }
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-secondary-custom" onClick={handleClose}>
            <i className="bi bi-x-lg me-2" />
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingItem ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CursosAdmin;
