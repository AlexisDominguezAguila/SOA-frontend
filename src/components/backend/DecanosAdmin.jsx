"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import Select from "react-select";

/* ---------------------------------------------------------------------------
 |  UTILS
 * ------------------------------------------------------------------------ */

const emptyDean = {
  id: null,
  imageUrl: "",
  file: null,
  name: "",
  yearStart: "",
  yearEnd: "",
  isActive: true,
};

const generateYears = (start = 1900, end = 2100) =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const y = start + i;
    return { value: y, label: y.toString() };
  });

/* ---------------------------------------------------------------------------
 |  YearSelect – selector con buscador basado en react‑select
 * ------------------------------------------------------------------------ */

const YearSelect = ({ name, value, onChange, minYear = 1900 }) => {
  const options = useMemo(() => generateYears(minYear, 2100), [minYear]);

  const selectedOption =
    options.find((opt) => opt.value === parseInt(value)) || null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selected) =>
        onChange({
          target: {
            name,
            value: selected ? selected.value : "",
          },
        })
      }
      placeholder="Selecciona un año"
      isClearable
      className="react-select-container"
      classNamePrefix="react-select"
      maxMenuHeight={180}
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 1055 }),
        control: (provided) => ({
          ...provided,
          borderRadius: "0.375rem",
          minHeight: "38px",
          fontSize: "0.95rem",
        }),
      }}
    />
  );
};

/* ---------------------------------------------------------------------------
 |  MAIN COMPONENT
 * ------------------------------------------------------------------------ */

const PastDeans = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyDean);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  /* ------------------------- solapamiento de periodos --------------------- */
  const checkPeriodOverlap = useCallback(
    (newStart, newEnd, excludeId = null) => {
      return data.some((dean) => {
        if (excludeId && dean.id === excludeId) return false;

        const start = parseInt(dean.year_start ?? dean.yearStart);
        const end = parseInt(dean.year_end ?? dean.yearEnd);
        const newS = parseInt(newStart);
        const newE = parseInt(newEnd);

        return newS <= end && newE >= start;
      });
    },
    [data]
  );

  /* ------------------------------ fetch ---------------------------------- */
  const fetchDeans = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeans();
  }, []);

  /* ------------------------------ save ----------------------------------- */
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // validaciones
      if (!form.name.trim()) throw new Error("El nombre completo es requerido");
      if (!form.yearStart || !form.yearEnd)
        throw new Error("Ambos años son requeridos");

      const yearStart = parseInt(form.yearStart);
      const yearEnd = parseInt(form.yearEnd);
      if (isNaN(yearStart) || isNaN(yearEnd))
        throw new Error("Los años deben ser números válidos");
      if (yearStart > yearEnd)
        throw new Error("El año de inicio no puede ser mayor al año de fin");
      if (checkPeriodOverlap(yearStart, yearEnd, form.id))
        throw new Error("El período se solapa con otro decano existente");

      if (form.file && form.file.size > 2 * 1024 * 1024)
        throw new Error("La imagen no puede superar los 2MB");

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("year_start", form.yearStart);
      fd.append("year_end", form.yearEnd);
      fd.append("is_active", form.isActive ? 1 : 0);
      if (form.file) fd.append("image", form.file);
      if (!form.file && form.imageUrl) fd.append("image_url", form.imageUrl);

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
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error de validación",
        text: error.message,
        icon: "warning",
        confirmButtonColor: "#5C0655",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------ delete --------------------------------- */
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
      } finally {
        setDeletingId(null);
      }
    });
  };

  /* ------------------------------ modal helpers -------------------------- */
  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setForm(emptyDean);
    setShowModal(false);
  };

  const handleEdit = (d) => {
    setForm({
      ...emptyDean,
      ...d,
      imageUrl: d.image_url ?? d.imageUrl,
      yearStart: d.year_start ?? d.yearStart,
      yearEnd: d.year_end ?? d.yearEnd,
      isActive: d.is_active ?? d.isActive,
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

  /* ------------------------------ filtros y paginación ------------------- */
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

  /* ------------------------------ render --------------------------------- */
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
                  Gestiona la Información Histórica de los Decanos de CMP
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
                  <i className="bi bi-funnel me-2"></i>Filtros de búsqueda
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
                    <option value="all"> Todos los estados</option>
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
                  <i className="bi bi-list-ul me-2"></i>Lista Histórica de
                  Decanos
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
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-2">Cargando decanos...</p>
                        </td>
                      </tr>
                    ) : view.length > 0 ? (
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
                                variant="outline-secondary"
                                onClick={() => handleEdit(d)}
                                title="Editar decano"
                              >
                                <i className="bi bi-pencil-square" />
                              </Button>
                              <Button
                                size="sm"
                                className="btn-action btn-delete"
                                variant="outline-danger"
                                onClick={() => handleDelete(d.id)}
                                title="Eliminar decano"
                                disabled={deletingId === d.id}
                              >
                                {deletingId === d.id ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  <i className="bi bi-trash3" />
                                )}
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
                            <h5>
                              {query
                                ? "No se encontraron resultados para tu búsqueda"
                                : "Aún no has registrado ningún decano"}
                            </h5>
                            <p>
                              {query
                                ? "Prueba con otros términos o verifica la ortografía"
                                : "Empieza agregando el primer decano al sistema"}
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
                    (max 2MB)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-person me-2" />
                    Nombre Completo *
                  </Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="Ingresa el nombre completo del decano"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input-custom"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-calendar-event me-2" />
                    Año de Inicio *
                  </Form.Label>
                  <YearSelect
                    name="yearStart"
                    value={form.yearStart}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label-custom">
                    <i className="bi bi-calendar-check me-2" />
                    Año de Fin *
                  </Form.Label>
                  <YearSelect
                    name="yearEnd"
                    value={form.yearEnd}
                    onChange={handleChange}
                    minYear={form.yearStart}
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
          <Button
            className="btn-secondary-custom"
            onClick={handleClose}
            disabled={saving}
          >
            <i className="bi bi-x-lg me-2" />
            Cancelar
          </Button>
          <Button
            className="btn-primary-custom"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {form.id ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              <>
                <i
                  className={`bi ${
                    form.id ? "bi-check-lg" : "bi-plus-lg"
                  } me-2`}
                />
                {form.id ? "Actualizar" : "Guardar"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PastDeans;
