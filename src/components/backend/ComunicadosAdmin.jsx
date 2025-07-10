"use client";

import { useState, useEffect } from "react";
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
import "@/components/backend/layout/dashboard.scss";
import api from "@/services/api";
import Swal from "sweetalert2";

const emptyComunicados = {
  id: null,
  imageUrl: "",
  title: "",
  status: "active",
};

const ComunicadosAdmin = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyComunicados });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  const fetchComunicados = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/comunicados", {
        params: { per_page: 100 },
      });
      setData(data.data ?? data);
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener los comunicados",
        icon: "error",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunicados();
  }, []);

  const validateForm = () => {
    if (!form.title.trim()) throw new Error("El título es obligatorio");
    if (form.file && form.file.size > 2 * 1024 * 1024)
      throw new Error("La imagen no puede superar los 2MB");
    if (form.url && !/^https?:\/\//i.test(form.url))
      throw new Error("La URL no es válida");
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      validateForm();

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("status", form.status);

      if (form.file) {
        fd.append("image", form.file);
      }

      const endpoint = form.id
        ? `/comunicados/${form.id}?_method=PUT`
        : "/comunicados";
      await api.post(endpoint, fd);

      Swal.fire({
        title: form.id ? "¡Actualizado!" : "¡Creado!",
        text: form.id
          ? "El Comunicado ha sido actualizado correctamente"
          : "El Comunicado ha sido creado correctamente",
        icon: "success",
        confirmButtonColor: "#5C0655",
      });

      handleClose();
      fetchComunicados();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message ?? "No se pudo guardar el comunicado",
        icon: "warning",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (deletingId) return;
    setDeletingId(id);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (res) => {
      if (!res.isConfirmed) {
        setDeletingId(null);
        return;
      }
      try {
        await api.delete(`/comunicados/${id}`);
        Swal.fire({
          title: "¡Eliminada!",
          text: "El comunicado ha sido eliminado correctamente",
          icon: "success",
          confirmButtonColor: "#5C0655",
        });
        fetchComunicados();
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el comunicado",
          icon: "error",
          confirmButtonColor: "#5C0655",
        });
      } finally {
        setDeletingId(null);
      }
    });
  };

  /* ----------------------------- modal helpers -------------------------- */
  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setForm({ ...emptyComunicados });
    setShowModal(false);
  };

  const handleEdit = (comunicados) => {
    setForm({
      ...emptyComunicados,
      id: comunicados.id,
      imageUrl: comunicados.image_url ?? comunicados.imageUrl,
      title: comunicados.title,
      status: comunicados.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "file") {
      if (files[0]) {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        if (!validTypes.includes(files[0].type)) {
          Swal.fire({
            title: "Formato inválido",
            text: "Solo se permiten imágenes JPG, PNG o WEBP",
            icon: "warning",
            confirmButtonColor: "#5C0655",
          });
          return;
        }
      }

      setForm((f) => ({
        ...f,
        imageUrl: files[0] ? URL.createObjectURL(files[0]) : "",
        file: files[0] || null,
      }));
    } else {
      setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    }
  };

  /* ---------------------- filtros y paginación -------------------------- */
  const filtered = data.filter((comunicados) => {
    const matchesTitle = comunicados.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || comunicados.status === statusFilter;
    return matchesTitle && matchesStatus;
  });

  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------------- helpers UI ------------------------------- */
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (status) => (
    <span
      className={`status-badge ${
        status === "active" ? "status-active" : "status-inactive"
      }`}
    >
      {status === "active" ? "Activa" : "Inactiva"}
    </span>
  );
  const total = data.length;
  const activos = data.filter((c) => c.status === "active").length;
  const inactivos = data.filter((c) => c.status === "inactive").length;

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
              <div className="filters-header mb-3">
                <h5 className="filters-title mb-3">
                  <i className="bi bi-funnel me-2" />
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
                        placeholder="Buscar por fecha de comunicado"
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

                {/* Filtro por estado */}
                <Col lg={3} md={4}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="status-filter"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </Form.Select>
                </Col>

                {/* Limpiar */}
                <Col lg={2} md={2}>
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

          {/* TABLA */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header">
                <h5 className="table-title mb-0 p-4">
                  <i className="bi bi-list-ul me-2"></i>
                  Lista de Comunicados
                </h5>
              </div>

              <div className="table-responsive">
                <Table bsPrefix="modern-table" className="modern-table mb-0">
                  <thead>
                    <tr>
                      <th className="table-header-cell">#</th>
                      <th className="table-header-cell">Imagen</th>
                      <th className="table-header-cell">Titulo</th>
                      <th className="table-header-cell">Fecha</th>
                      <th className="table-header-cell">Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-2">Cargando comunicados...</p>
                        </td>
                      </tr>
                    ) : view.length > 0 ? (
                      view.map((c, i) => (
                        <tr key={c.id} className="table-row">
                          <td className="table-cell">
                            <span className="row-number">
                              {(page - 1) * pageSize + i + 1}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="image-container">
                              <img
                                src={
                                  c.image_url ||
                                  "https://via.placeholder.com/80x80?text=Sin+Imagen"
                                }
                                alt={`Comunicado ${c.id}`}
                                className="table-image"
                                onError={(e) => {
                                  e.target.src = "/placeholder-avatar.png";
                                }}
                              />
                            </div>
                          </td>
                          <td className="table-cell">
                            <div>
                              <h6 className="table-title">{c.title}</h6>
                            </div>
                          </td>
                          <td className="table-cell">
                            <span className="date-info">
                              <i className="bi bi-calendar3 me-1"></i>
                              {formatDate(c.created_at)}
                            </span>
                          </td>
                          <td className="table-cell">
                            {getStatusBadge(c.status)}
                          </td>
                          <td className="table-cell text-center">
                            <div className="action-buttons">
                              <Button
                                size="sm"
                                className="btn-action btn-edit"
                                variant="outline-secondary"
                                onClick={() => handleEdit(c)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-square" />
                              </Button>
                              <Button
                                size="sm"
                                className="btn-action btn-delete"
                                variant="outline-danger"
                                onClick={() => handleDelete(c.id)}
                                title="Eliminar"
                              >
                                {deletingId === c.id ? (
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
                        <td colSpan="6" className="text-center py-5">
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
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Título */}
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Título del comunicado"
              />
            </Form.Group>

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
                  name="status"
                  checked={form.status === "active"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.checked ? "active" : "inactive",
                    }))
                  }
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-secondary-custom" onClick={handleClose}>
            <i className="bi bi-x-lg me-2" />
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Spinner animation="border" size="sm" />
            ) : form.id ? (
              "Actualizar"
            ) : (
              "Guardar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ComunicadosAdmin;
