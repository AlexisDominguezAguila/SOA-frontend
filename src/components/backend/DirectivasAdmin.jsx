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
import api from "@/services/api";
import Swal from "sweetalert2";

const DirectivasAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const [gestiones, setGestiones] = useState([]);

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
  const [showMiembroModal, setShowMiembroModal] = useState(false);
  const [editingMiembro, setEditingMiembro] = useState(null);
  const [gestionSeleccionada, setGestionSeleccionada] = useState(null);
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [estado, setEstado] = useState("active");
  const [imagen, setImagen] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setEditingGestion(null);
  };
  const fetchGestiones = async () => {
    try {
      setLoading(true);
      const res = await api.get("/gestiones");
      setGestiones(res.data?.data ?? []);
    } catch (error) {
      console.error("Error al obtener gestiones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se puedieron cargar las gestiones. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEditGestion = (g) => {
    setEditingGestion(g);
    setShowModal(true);
  };
  //abrir y cerrar modal de miembros de juntas directivas
  const handleAgregarMiembro = (gestion) => {
    setGestionSeleccionada(gestion);
    setEditingMiembro(null);
    setShowMiembroModal(true);
  };

  const handleEditarMiembro = (gestion, miembro) => {
    setGestionSeleccionada(gestion);
    setEditingMiembro(miembro);
    setShowMiembroModal(true);
  };

  const handleCerrarMiembroModal = () => {
    setShowMiembroModal(false);
    setEditingMiembro(null);
    setGestionSeleccionada(null);

    setNombre("");
    setCargo("");
    setEstado("active");
    setImagen(null);
  };

  useEffect(() => {
    fetchGestiones();
  }, []);

  // Filtrado de gestiones
  const filtered = (gestiones ?? []).filter((g) => {
    const matchesName = g.nombre.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesName && matchesStatus;
  });

  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    if (editingMiembro) {
      setNombre(editingMiembro.nombre);
      setCargo(editingMiembro.cargo);
      setEstado(editingMiembro.is_active ? "active" : "inactive");
      setImagen(null);
    } else {
      setNombre("");
      setCargo("");
      setEstado("active");
      setImagen(null);
    }
  }, [editingMiembro]);
  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleGuardarGestion = async () => {
    // Validación de años
    const inicio = parseInt(editingGestion?.inicio);
    const fin = parseInt(editingGestion?.fin);

    if (fin <= inicio) {
      Swal.fire({
        icon: "error",
        title: "Años inválidos",
        text: "El año fin debe ser mayor al año inicio",
      });
      return;
    }

    const payload = {
      nombre: editingGestion?.nombre || "Gestión sin nombre",
      lema: editingGestion?.lema || null,
      inicio: inicio,
      fin: fin,
      status: editingGestion?.status || "active",
    };

    try {
      setSaving(true);
      let message = "";

      if (editingGestion?.id) {
        await api.put(`/gestiones/${editingGestion.id}`, payload);
        message = "Gestión actualizada correctamente";
      } else {
        await api.post("/gestiones", payload);
        message = "Gestión registrada correctamente";
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: message,
      });

      handleClose();
      fetchGestiones();
    } catch (error) {
      console.error("Error al guardar gestión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la gestión",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarGestion = async (gestion) => {
    const result = await Swal.fire({
      title: "¿Eliminar gestión completa?",
      html: `Esta acción eliminará la gestión <b>${gestion.nombre}</b> y todos sus ${gestion.miembros.length} miembros.<br>¿Está seguro?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar todo",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await api.delete(`/gestiones/${gestion.id}`);
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            `Error al eliminar: ${
              error.response?.data?.message || error.message
            }`
          );
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      if (result.value) {
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          html: `La gestión <b>${gestion.nombre}</b> y sus miembros fueron eliminados`,
        });
        fetchGestiones();
      }
    }
  };
  const handleGuardarMiembro = async () => {
    if (!nombre || !cargo) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Nombre y cargo son obligatorios",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("cargo", cargo);
    formData.append("estado", estado);
    formData.append("gestion_id", gestionSeleccionada.id);
    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      setSaving(true);
      let message = "";

      if (editingMiembro) {
        formData.append("_method", "PUT");
        await api.post(`/miembros/${editingMiembro.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message = "Miembro actualizado correctamente";
      } else {
        await api.post("/miembros", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message = "Miembro registrado correctamente";
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: message,
      });

      handleCerrarMiembroModal();
      fetchGestiones();
    } catch (error) {
      console.error("Error al guardar miembro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el miembro",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarMiembro = async (gestion, miembro) => {
    const result = await Swal.fire({
      title: "¿Eliminar miembro?",
      html: `¿Está seguro de eliminar a <b>${miembro.nombre}</b> de la gestión <b>${gestion.nombre}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(miembro.id);
        await api.delete(`/miembros/${miembro.id}`);

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El miembro ha sido eliminado",
        });

        fetchGestiones();
      } catch (error) {
        console.error("Error al eliminar miembro:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el miembro",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

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
                                  g.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                {g.status === "active" ? "Activo" : "Inactivo"}
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
                                  <div className="gestion-card">
                                    <div className="action-buttons d-flex align-items-center gap-2">
                                      <Button
                                        size="sm"
                                        className="btn-action btn-edit"
                                        onClick={() => handleEditGestion(g)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="btn-action btn-delete"
                                        onClick={() => handleEliminarGestion(g)} // Pasamos el objeto completo
                                      >
                                        <i className="bi bi-trash"></i>
                                      </Button>
                                    </div>
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
                                                  src={m.img_url}
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
                                                  m.is_active
                                                    ? "status-active"
                                                    : "status-inactive"
                                                }`}
                                              >
                                                {m.is_active
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
                                                  onClick={() =>
                                                    handleEditarMiembro(g, m)
                                                  }
                                                >
                                                  <i className="bi bi-pencil"></i>
                                                </Button>

                                                <Button
                                                  size="sm"
                                                  variant="outline-danger"
                                                  className="btn-action btn-delete"
                                                  onClick={() =>
                                                    handleEliminarMiembro(g, m)
                                                  }
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
                                onClick={() => handleAgregarMiembro(g)}
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
                            size="sm"
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
                value={editingGestion?.nombre || ""}
                onChange={(e) =>
                  setEditingGestion({
                    ...editingGestion,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lema</Form.Label>
              <Form.Control
                value={editingGestion?.lema || ""}
                onChange={(e) =>
                  setEditingGestion({
                    ...editingGestion,
                    lema: e.target.value,
                  })
                }
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
                    value={editingGestion?.inicio || ""}
                    onChange={(e) =>
                      setEditingGestion({
                        ...editingGestion,
                        inicio: e.target.value,
                      })
                    }
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
                    value={editingGestion?.fin || ""}
                    onChange={(e) =>
                      setEditingGestion({
                        ...editingGestion,
                        fin: e.target.value,
                      })
                    }
                    placeholder="Ej: 2023"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={editingGestion?.status || "active"}
                onChange={(e) =>
                  setEditingGestion({
                    ...editingGestion,
                    status: e.target.value,
                  })
                }
              >
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
          <Button
            variant="primary"
            onClick={handleGuardarGestion}
            disabled={saving}
          >
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
      <Modal show={showMiembroModal} onHide={handleCerrarMiembroModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-fill me-2"></i>
            {editingMiembro ? "Editar Miembro" : "Agregar Miembro"} —{" "}
            {gestionSeleccionada?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo del médico"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cargo *</Form.Label>
              <Form.Control
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ej: Decano, Secretario"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarMiembroModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardarMiembro}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              "Guardar Miembro"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DirectivasAdmin;
