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
} from "react-bootstrap";
import DashboardSidebar from "@/components/common/Sidebar";
import api from "@/services/api";
import Swal from "sweetalert2";
import "@/components/backend/layout/dashboard.scss";

const emptyDean = {
  id: null,
  imageUrl: "",
  file: null,
  name: "",
  yearStart: "",
  yearEnd: "",
  isActive: true,
};

const PastDeans = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyDean);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  // Fetch deans
  const fetchDeans = async () => {
    try {
      const { data } = await api.get("/deans", { params: { per_page: 100 } });
      setData(data.data ?? data);
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener los decanos",
        icon: "error",
        confirmButtonColor: "#5C0655",
      });
    }
  };

  useEffect(() => {
    fetchDeans();
  }, []);

  // Save dean
  const handleSave = async () => {
    if (!form.name.trim()) {
      return Swal.fire({
        title: "Nombre requerido",
        icon: "warning",
        confirmButtonColor: "#5C0655",
      });
    }
    if (form.yearStart > form.yearEnd) {
      return Swal.fire({
        title: "Revisa los años",
        text: "El año de inicio no puede ser mayor al año de fin",
        icon: "warning",
        confirmButtonColor: "#5C0655",
      });
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("year_start", form.yearStart);
    fd.append("year_end", form.yearEnd);
    fd.append("is_active", form.isActive ? 1 : 0);
    if (form.file) fd.append("image", form.file);
    if (!form.file && form.imageUrl) fd.append("image_url", form.imageUrl);

    try {
      if (form.id) {
        await api.post(`/deans/${form.id}?_method=PUT`, fd);
        Swal.fire({
          title: "¡Actualizado!",
          text: "El decano ha sido actualizado correctamente",
          icon: "success",
          confirmButtonColor: "#5C0655",
        });
      } else {
        await api.post("/deans", fd);
        Swal.fire({
          title: "¡Creado!",
          text: "El decano ha sido creado correctamente",
          icon: "success",
          confirmButtonColor: "#5C0655",
        });
      }
      handleClose();
      fetchDeans();
    } catch (e) {
      console.error(e.response?.data);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el decano",
        icon: "error",
        confirmButtonColor: "#5C0655",
      });
    }
  };

  // Delete dean
  const handleDelete = (id) => {
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
      if (!res.isConfirmed) return;
      try {
        await api.delete(`/deans/${id}`);
        Swal.fire({
          title: "¡Eliminado!",
          text: "El decano ha sido eliminado correctamente",
          icon: "success",
          confirmButtonColor: "#5C0655",
        });
        fetchDeans();
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el decano",
          icon: "error",
          confirmButtonColor: "#5C0655",
        });
      }
    });
  };

  // Modal handlers
  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setForm(emptyDean);
    setShowModal(false);
  };

  const handleEdit = (d) => {
    setForm({ ...emptyDean, ...d, imageUrl: d.image_url ?? d.imageUrl });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "file") {
      setForm((f) => ({
        ...f,
        imageUrl: files[0] ? URL.createObjectURL(files[0]) : "",
        file: files[0] || null,
      }));
    } else {
      setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    }
  };

  // Pagination logic
  const filtered = data.filter((d) => {
    const matchesName = d.name.toLowerCase().includes(query.toLowerCase());
    const isActive = d.is_active ?? d.isActive;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && isActive) ||
      (statusFilter === "inactive" && !isActive);

    return matchesName && matchesStatus;
  });

  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <main className="main-content-container">
        <section className="content-section p-4">
          {/* Header Section */}

          <div className="page-header mb-5">
            <div className="header-content">
              <div className="header-info">
                <h1 className="page-title">Gestión de Past de Decanos</h1>
                <p className="page-subtitle">
                  Gestiona la Información Historica de los Decanos de CMP
                </p>
                <div className="header-stats mt-3 d-flex flex-wrap gap-3">
                  <span className="stat-item ">
                    <i className="bi bi-people-fill me-1"></i>
                    {data.length} Decanos Registrados
                  </span>
                  <span className="stat-item ">
                    <i className="bi bi-check-circle me-1"></i>
                    {data.filter((n) => n.is_active ?? n.isActive).length}{" "}
                    Visibles en la web
                  </span>
                  <span className="stat-item ">
                    <i className="bi bi-x-circle me-1"></i>
                    {
                      data.filter((n) => !(n.is_active ?? n.isActive)).length
                    }{" "}
                    Ocultos para los clientes
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <Button className="btn-primary-custom" onClick={handleOpen}>
                  <i className="bi bi-plus-lg me-2"></i>
                  Nueva Decano
                </Button>
              </div>
            </div>
          </div>
          {/* Search Filter */}
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
                        <i className="bi bi-search" />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Buscar decano por nombre..."
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

          {/* Data Table */}
          <Card className="table-card">
            <Card.Body className="p-0">
              <div className="table-header">
                <h5 className="table-title mb-0 p-4 ">
                  <i className="bi bi-list-ul me-2"></i>
                  Lista Historica de Decanos
                </h5>
              </div>
              <div className="table-responsive">
                <Table bsPrefix="modern-table" className="modern-table mb-0">
                  <thead>
                    <tr>
                      <th className="table-header-cell">#</th>
                      <th className="table-header-cell">Foto</th>
                      <th className="table-header-cell">Nombre</th>
                      <th className="table-header-cell">Período</th>
                      <th className="table-header-cell">Estado</th>
                      <th className=" text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view.length > 0 ? (
                      view.map((d, i) => (
                        <tr key={d.id} className="table-row">
                          <td className="table-cell">
                            <span className="row-number">
                              {(page - 1) * pageSize + i + 1}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="image-container">
                              <img
                                src={`http://localhost:8000/storage/${d.image_url}`}
                                alt={d.name}
                                className="table-image"
                                onError={(e) => {
                                  e.target.src = "/placeholder-avatar.png";
                                }}
                              />
                            </div>
                          </td>
                          <td className="table-cell">
                            <div className="table-title">{d.name}</div>
                          </td>
                          <td className="table-cell">
                            <div className="table-description">
                              {d.year_start ?? d.yearStart} -{" "}
                              {d.year_end ?? d.yearEnd}
                            </div>
                          </td>
                          <td className="table-cell">
                            <span
                              className={`status-badge ${
                                d.is_active ?? d.isActive
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              {d.is_active ?? d.isActive
                                ? "Activo"
                                : "Inactivo"}
                            </span>
                          </td>
                          <td className="table-cell text-center">
                            <div className="action-buttons">
                              <Button
                                size="sm"
                                className="btn-action btn-edit"
                                onClick={() => handleEdit(d)}
                                title="Editar decano"
                              >
                                <i className="bi bi-pencil-square" />
                              </Button>
                              <Button
                                size="sm"
                                className="btn-action btn-delete"
                                onClick={() => handleDelete(d.id)}
                                title="Eliminar decano"
                              >
                                <i className="bi bi-trash3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className=" text-center py-5">
                          <div className="empty-state">
                            <i className="bi bi-inbox"></i>
                            <h5>No se encontraron decanos registrados</h5>
                            <p>
                              {query
                                ? "Intenta con otros términos de búsqueda"
                                : "Comienza agregando un nuevo decano"}
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

          {/* Pagination */}
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
      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            <i className="bi bi-person-bounding-box me-3" />
            {form.id ? "Editar Decano" : "Nuevo Decano"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form>
            {/* Image Preview */}
            {form.imageUrl && (
              <div className="text-center mb-4">
                <div className="image-preview-container">
                  <img
                    src={form.imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
              </div>
            )}

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-image me-2" />
                    Foto del Decano
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      name="imageUrl"
                      placeholder="URL de la imagen (opcional)"
                      value={form.imageUrl}
                      onChange={handleChange}
                      className="form-input-custom"
                    />
                    <Form.Control
                      name="file"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleChange}
                      className="form-input-custom"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Puedes usar una URL o subir un archivo desde tu dispositivo
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-person me-2" />
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="Ingresa el nombre completo del decano"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input-custom"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-calendar-event me-2" />
                    Año de Inicio
                  </Form.Label>
                  <Form.Control
                    name="yearStart"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="2020"
                    value={form.yearStart}
                    onChange={handleChange}
                    className="form-input-custom"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-calendar-check me-2" />
                    Año de Fin
                  </Form.Label>
                  <Form.Control
                    name="yearEnd"
                    type="number"
                    min={form.yearStart || 1900}
                    max="2100"
                    placeholder="2024"
                    value={form.yearEnd}
                    onChange={handleChange}
                    className="form-input-custom"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="form-switch-container">
              <Form.Check
                type="switch"
                id="switch-is-active"
                name="isActive"
                label="¿Está actualmente en funciones?"
                checked={form.isActive}
                onChange={handleChange}
                className="form-switch-custom"
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-secondary-custom" onClick={handleClose}>
            <i className="bi bi-x-lg me-2" />
            Cancelar
          </Button>
          <Button className="btn-primary-custom" onClick={handleSave}>
            <i
              className={`bi ${form.id ? "bi-check-lg" : "bi-plus-lg"} me-2`}
            />
            {form.id ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PastDeans;
