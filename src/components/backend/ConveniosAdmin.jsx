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
import api from "@/services/api";
import Swal from "sweetalert2";
import "@/components/backend/layout/dashboard.scss";

const emptyConvenios = {
  id: null,
  imageUrl: "",
  file: null,
  title: "",
  beneficios: "",
  url: "",
  status: "active",
};
const ConveniosAdmin = () => {
  /* ───── state UI ───── */
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyConvenios });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  /* ----------------------------- fetch ----------------------------------- */
  const fetchConvenios = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/convenios", {
        params: { per_page: 100 },
      });
      setData(data.data ?? data);
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener los convenios",
        icon: "error",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvenios();
  }, []);

  /* --------------------------- validaciones ------------------------------ */
  const validateForm = () => {
    if (!form.title.trim()) throw new Error("El título es obligatorio");
    if (form.file && form.file.size > 2 * 1024 * 1024)
      throw new Error("La imagen no puede superar los 2MB");
    if (form.url && !/^https?:\/\//i.test(form.url))
      throw new Error("La URL no es válida");
  };

  /* ----------------------------- save ------------------------------------ */
  const handleSave = async () => {
    try {
      validateForm();
      setSaving(true);

      const formData = new FormData();
      formData.append("titulo", form.title);
      formData.append("beneficios", form.beneficios);
      formData.append("url", form.url);
      formData.append("activo", form.status);
      if (form.file) formData.append("imagen", form.file);

      if (form.id) {
        await api.post(`/convenios/${form.id}?_method=PUT`, formData);
        Swal.fire(
          "Actualizado",
          "Convenio actualizado correctamente",
          "success"
        );
      } else {
        await api.post("/convenios", formData);
        Swal.fire("Guardado", "Convenio registrado correctamente", "success");
      }

      handleClose();
      fetchConvenios();
    } catch (e) {
      Swal.fire("Error", e.message || "No se pudo guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------- delete ---------------------------------- */
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(id);
      await api.delete(`/convenios/${id}`);
      Swal.fire("Eliminado", "Convenio eliminado correctamente", "success");
      fetchConvenios();
    } catch (e) {
      Swal.fire("Error", "No se pudo eliminar el convenio", "error");
    } finally {
      setDeletingId(null);
    }
  };

  /* ----------------------------- modal helpers -------------------------- */
  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setForm({ ...emptyConvenios });
    setShowModal(false);
  };

  const handleEdit = (c) => {
    setForm({
      ...emptyConvenios,
      id: c.id,
      imageUrl: c.image_url ?? c.imageUrl,
      title: c.title,
      description: c.description,
      url: c.url,
      status: c.status,
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
  const filtered = data.filter((c) => {
    const title = c.title || ""; // Si title es undefined, usa string vacío
    const matchesTitle = title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
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
                <Button className="btn-primary-custom" onClick={handleOpen}>
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
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
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
          {/* ───────── Tabla de Convenios ───────── */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header">
                <h5 className="table-title mb-0 p-4">
                  <i className="bi bi-list-ul me-2"></i>
                  Lista de Convenios
                </h5>
              </div>
              <div className="table-responsive">
                <Table bsPrefix="modern-table" className="modern-table mb-0">
                  <thead>
                    <tr>
                      <th className="table-header-cell">#</th>
                      <th className="table-header-cell">Vista Previa</th>
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
                          <p className="mt-2">Cargando convenios...</p>
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
                                  c.image_url || "@/assets/images/convenio.jpeg"
                                }
                                alt={c.title}
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
                              <span className="date-info">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(c.created_at)}
                              </span>
                            </div>
                          </td>

                          <td className="table-cell">
                            <div className="tag-list">
                              <Button
                                size="sm"
                                className="btn-action btn-view"
                                variant="outline-primary"
                                onClick={() => window.open(c.url, "_blank")}
                                title="Ver convenio"
                              >
                                <i className="bi bi-box-arrow-up-right"></i>
                              </Button>
                            </div>
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
                                <i className="bi bi-pencil-square"></i>
                              </Button>

                              <Button
                                size="sm"
                                className="btn-action btn-delete"
                                variant="outline-danger"
                                disabled={deletingId === c.id}
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
                        <td colSpan={6} className="text-center py-5">
                          <div className="empty-state">
                            <i className="bi bi-inbox"></i>
                            <h5>
                              {query
                                ? "No se encontraron resultados para tu búsqueda"
                                : "Aún no has registrado ningún convenio"}
                            </h5>
                            <p>
                              {query
                                ? "Prueba con otros términos o verifica la ortografía"
                                : "Empieza registrando tu primer convenio"}
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

          {/* ───────── Paginación ───────── */}
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

      {/* Modal formulario */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-richtext me-2"></i>
            {form.id ? "Editar Convenio" : "Nuevo Convenio"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {/* Imagen */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Imagen del convenio</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="img-fluid mt-2 rounded"
                      style={{ maxHeight: 180 }}
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
            {/* Título */}
            <Form.Group className="mb-3">
              <Form.Label>Título del convenio</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Nombre del convenio"
              />
            </Form.Group>
            {/* Beneficios */}
            <Form.Group className="mb-3">
              <Form.Label>Beneficios</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="beneficios"
                value={form.beneficios}
                onChange={handleChange}
                placeholder={
                  "• Acceso a descuentos especiales\n• Asesoría gratuita\n• Certificación digital"
                }
              />
            </Form.Group>

            {/* URL y Estado */}
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>URL del convenio</Form.Label>
                  <Form.Control
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://institucion.com/convenio"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
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

export default ConveniosAdmin;
