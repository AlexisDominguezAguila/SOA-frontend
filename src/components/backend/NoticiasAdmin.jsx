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
import "@/components/backend/layout/noticias.scss";

/* ---------------------------------------------------------------------------
 |  CONSTANTES Y UTILIDADES                                                   |
 * ------------------------------------------------------------------------ */

const emptyNews = {
  id: null,
  imageUrl: "",
  file: null,
  title: "",
  description: "",
  url: "",
  status: "active",
};

const NoticiasAdmin = () => {
  /* ----------------------------- state ----------------------------------- */
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [showMejorarModal, setShowMejorarModal] = useState(false);

  const [form, setForm] = useState({ ...emptyNews });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mejorarTexto, setMejorarTexto] = useState("");
  const [textoMejorado, setTextoMejorado] = useState("");
  const [mejorando, setMejorando] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  /* --- Mejora de texto con IA --*/
  const abrirModalMejorar = () => {
    setMejorarTexto(form.description);
    setTextoMejorado("");
    setShowMejorarModal(true);
  };

  const aplicarMejora = () => {
    setForm((prev) => ({ ...prev, description: textoMejorado }));
    setShowMejorarModal(false);
  };

  const mejorarTextoIA = async () => {
    if (!mejorarTexto.trim()) return;

    try {
      setMejorando(true);
      const { data } = await api.post("/ia/redactar", {
        detalles: mejorarTexto,
      });

      if (data.success && data.redaccion) {
        setTextoMejorado(data.redaccion);
      } else {
        throw new Error("No se pudo generar una mejora válida");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ??
          "Ocurrió un error al mejorar el texto con IA",
        icon: "error",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setMejorando(false);
    }
  };

  /* ----------------------------- fetch ----------------------------------- */
  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/news", { params: { per_page: 100 } });
      setData(data.data ?? data);
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener las noticias",
        icon: "error",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
    if (saving) return;

    try {
      setSaving(true);
      validateForm();

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("status", form.status);
      fd.append("url", form.url);

      // Subir imagen (opcional)
      if (form.file) {
        fd.append("image", form.file);
      }

      const endpoint = form.id ? `/news/${form.id}?_method=PUT` : "/news";
      await api.post(endpoint, fd);

      Swal.fire({
        title: form.id ? "¡Actualizado!" : "¡Creada!",
        text: form.id
          ? "La noticia ha sido actualizada correctamente"
          : "La noticia ha sido creada correctamente",
        icon: "success",
        confirmButtonColor: "#5C0655",
      });

      handleClose();
      fetchNews();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message ?? "No se pudo guardar la noticia",
        icon: "warning",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------- delete ---------------------------------- */
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
        await api.delete(`/news/${id}`);
        Swal.fire({
          title: "¡Eliminada!",
          text: "La noticia ha sido eliminada correctamente",
          icon: "success",
          confirmButtonColor: "#5C0655",
        });
        fetchNews();
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la noticia",
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
    setForm({ ...emptyNews });
    setShowModal(false);
  };

  const handleEdit = (n) => {
    setForm({
      ...emptyNews,
      id: n.id,
      imageUrl: n.image_url ?? n.imageUrl,
      title: n.title,
      description: n.description,
      url: n.url,
      status: n.status,
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
  const filtered = data.filter((n) => {
    const matchesTitle = n.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
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

  /* ------------------------------ render ------------------------------- */
  return (
    <div className="dashboard-container min-vh-100">
      {/* ───────── Sidebar ───────── */}
      <DashboardSidebar isOpen={isSidebarOpen} />

      <main className="main-content-container">
        <section className="content-section p-4">
          {/* ───────── Header ───────── */}
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
                    {data.filter((n) => n.status === "active").length}{" "}
                    Publicadas
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-x-circle me-1"></i>
                    {data.filter((n) => n.status === "inactive").length} Sin
                    revisar
                  </span>
                </div>
              </div>

              <div className="header-actions">
                <Button className="btn-primary-custom" onClick={handleOpen}>
                  <i className="bi bi-plus-lg me-2"></i>
                  Nueva Noticia
                </Button>
              </div>
            </div>
          </div>

          {/* ───────── Filtros ───────── */}
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
                    <option value="all"> Todos los estados</option>
                    <option value="active">Publicadas</option>
                    <option value="inactive">Pendientes</option>
                  </Form.Select>
                </Col>

                <Col lg={2} md={2}>
                  <Button
                    className="btn-clear-filters"
                    variant="outline-secondary"
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

          {/* ───────── Tabla ───────── */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header">
                <h5 className="table-title mb-0 p-4">
                  <i className="bi bi-list-ul me-2"></i>
                  Lista de Noticias
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
                          <p className="mt-2">Cargando noticias...</p>
                        </td>
                      </tr>
                    ) : view.length > 0 ? (
                      view.map((n, i) => (
                        <tr key={n.id} className="table-row">
                          <td className="table-cell">
                            <span className="row-number">
                              {(page - 1) * pageSize + i + 1}
                            </span>
                          </td>

                          <td className="table-cell">
                            <div className="image-container">
                              <img
                                src={n.image_url || "/placeholder-avatar.png"}
                                alt={n.title}
                                className="table-image"
                                onError={(e) => {
                                  e.target.src = "/placeholder-avatar.png";
                                }}
                              />
                            </div>
                          </td>

                          <td className="table-cell">
                            <div>
                              <h6 className="table-title">{n.title}</h6>
                              <span className="date-info">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(n.created_at)}
                              </span>
                            </div>
                          </td>

                          {/* Bullets */}
                          <td className="table-cell">
                            <div className="tag-list">
                              <Button
                                size="sm"
                                className="btn-action btn-view"
                                variant="outline-primary"
                                onClick={() => window.open(n.url, "_blank")}
                                title="Ver noticia"
                              >
                                <i className="bi bi-box-arrow-up-right"></i>
                              </Button>
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="table-cell">
                            {getStatusBadge(n.status)}
                          </td>

                          {/* Acciones */}
                          <td className="table-cell text-center">
                            <div className="action-buttons">
                              <Button
                                size="sm"
                                className="btn-action btn-edit"
                                variant="outline-secondary"
                                onClick={() => handleEdit(n)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Button>

                              <Button
                                size="sm"
                                className="btn-action btn-delete"
                                variant="outline-danger"
                                disabled={deletingId === n.id}
                                onClick={() => handleDelete(n.id)}
                                title="Eliminar"
                              >
                                {deletingId === n.id ? (
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
                                : "Aún no has registrado ningúna noticia"}
                            </h5>
                            <p>
                              {query
                                ? "Prueba con otros términos o verifica la ortografía"
                                : "Empieza registrando tu primer noticia"}
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

      {/* ───────── Modal Mejorar Texto ───────── */}
      <Modal
        show={showMejorarModal}
        onHide={() => setShowMejorarModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-magic me-2"></i>
            Mejorar Texto con IA
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tu descripción actual:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={mejorarTexto}
                onChange={(e) => setMejorarTexto(e.target.value)}
                placeholder="Descripción que deseas mejorar"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mb-3">
              <Button
                variant="info"
                className="btn-ia-news"
                onClick={mejorarTextoIA}
                disabled={mejorando || !mejorarTexto.trim()}
              >
                {mejorando ? (
                  <>
                    <Spinner animation="border" size="sm" /> Mejorando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-stars me-2" />
                    Mejorar Texto
                  </>
                )}
              </Button>
            </div>

            {textoMejorado && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Texto mejorado:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={textoMejorado}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>

                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Revisa la propuesta de mejora y aplícala si te parece adecuada
                </div>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-secondary-custom"
            onClick={() => setShowMejorarModal(false)}
          >
            Cancelar
          </Button>

          {textoMejorado && (
            <Button variant="success" onClick={aplicarMejora}>
              <i className="bi bi-check-circle me-2"></i>
              Aplicar Mejora
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ───────── Modal Noticia ───────── */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-newspaper me-2"></i>
            {form.id ? "Editar Noticia" : "Nueva Noticia"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Imagen destacada */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Imagen destacada</Form.Label>
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
              <Form.Label>Título</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Título de la noticia"
                required
              />
            </Form.Group>

            {/* Descripción */}
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción breve"
              />

              {/* Botón para abrir modal de mejora */}
              <div className="d-flex justify-content-end mt-2">
                <Button
                  className="btn-ia-news"
                  size="sm"
                  onClick={abrirModalMejorar}
                  disabled={!form.description.trim()}
                >
                  <i className="bi bi-magic me-1"></i>
                  Mejorar con IA
                </Button>
              </div>
            </Form.Group>

            {/* URL + Estado */}
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>URL de la noticia</Form.Label>
                  <Form.Control
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/noticia"
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
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
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

export default NoticiasAdmin;
