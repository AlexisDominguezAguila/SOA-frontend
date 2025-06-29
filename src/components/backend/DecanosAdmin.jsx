import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Pagination,
  Card,
  Row,
  Col,
} from "react-bootstrap";

import DashboardHeader from "@/components/common/HeaderAdmin";
import DashboardSidebar from "@/components/common/Sidebar";
import "@/components/backend/layout/dashboard.scss";

/* Imagen placeholder */
import defaultImg from "@/assets/images/convenio.jpeg";

/* Datos dummy */
const DUMMY_DATA = [
  {
    id: 1,
    img: defaultImg,
    name: "Dr. Pedro Salazar",
    period: "2018 – 2021",
    created_at: "2024-04-01",
  },
  {
    id: 2,
    img: defaultImg,
    name: "Dra. Ana Rodríguez",
    period: "2021 – 2024",
    created_at: "2024-05-15",
  },
];

const DecanosAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  /* modal */
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

  /* list / search / paginación */
  const [data] = useState(DUMMY_DATA);
  const [query, setQuery] = useState("");
  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const pageSize = 5;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(filtered.length / pageSize);
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="dashboard-container min-vh-100">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="main-content-container">
        <DashboardHeader toggleSidebar={toggleSidebar} />

        <section className="content-section p-4">
          {/* Encabezado */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-purple mb-1">
                <i className="bi bi-person-bounding-box me-2"></i>Past de
                Decanos
              </h2>
              <p className="text-muted mb-0">
                Historial de decanos y períodos de gestión
              </p>
            </div>
            <Button className="btn-add-convenio" onClick={handleShow}>
              <i className="bi bi-plus-lg me-2"></i>Nuevo Decano
            </Button>
          </div>

          {/* Filtro búsqueda */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar por nombre"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setQuery("");
                      setPage(1);
                    }}
                  >
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabla */}
          <Table responsive hover className="table-borderless">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Período</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {view.map((d, i) => (
                <tr key={d.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <img
                      src={d.img}
                      alt={d.name}
                      width="50"
                      className="rounded shadow-sm"
                    />
                  </td>
                  <td>{d.name}</td>
                  <td>{d.period}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleEdit(d)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button size="sm" variant="outline-danger">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Paginación */}
          {pages > 1 && (
            <Pagination className="justify-content-end">
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              />
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
              />
            </Pagination>
          )}
        </section>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-bounding-box me-2"></i>
            {editingItem ? "Editar Decano" : "Nuevo Decano"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Foto del decano</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control defaultValue={editingItem?.name || ""} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Período</Form.Label>
              <Form.Control
                placeholder="Ej: 2018 - 2021"
                defaultValue={editingItem?.period || ""}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary">
            {editingItem ? "Actualizar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DecanosAdmin;
