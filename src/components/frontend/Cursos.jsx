"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import BannerNew from "@/assets/images/banerCurso.avif";
import CursoPlaceholder from "@/assets/images/curso.jpg";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Swal from "sweetalert2";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/public/cursos");
        setCursos(response.data);
      } catch (error) {
        console.error("Error fetching cursos", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos de los cursos.",
          icon: "error",
          confirmButtonColor: "#5C0655",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lastCourse = cursos.length > 0 ? cursos[0] : null;

  return (
    <>
      <Header />
      <main>
        {lastCourse && (
          <section
            className="position-relative py-5"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${BannerNew})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "90vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Container>
              <Row className="g-4 align-items-center">
                <Col md={6} className="text-center">
                  <div className="overflow-hidden shadow-lg">
                    <img
                      src={lastCourse.image_url || CursoPlaceholder}
                      alt={lastCourse.title}
                      className="img-fluid"
                      style={{
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </Col>

                <Col md={6} className="text-white">
                  <div className="p-4">
                    <h2 className="mb-3">{lastCourse.title}</h2>

                    <p className="lead mb-4">{lastCourse.description}</p>

                    <div className="d-flex align-items-center mt-5">
                      <i
                        className="bi bi-person-circle text-info me-3"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                      <div>
                        <h3 className="h5 mb-0">Ponente</h3>
                        <p className="fs-4 mb-0">{lastCourse.speaker}</p>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary position-absolute bottom-0 start-50 translate-middle-x mb-4"
                      style={{ zIndex: 3 }}
                      onClick={() => {
                        const section =
                          document.querySelector(".courses-content");
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Ver Cursos Disponibles
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        )}

        <section className="courses-content py-5">
          <Container className="py-5">
            <h2 className="text-center mb-4">Todos los Cursos</h2>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando cursos...</p>
              </div>
            ) : cursos.length === 0 ? (
              <p className="text-center text-muted">
                Aún no hay cursos disponibles actualmente.
              </p>
            ) : (
              <Row>
                {cursos.map((curso) => (
                  <Col md={3} key={curso.id} className="mb-4">
                    <div className="card h-100 shadow-sm d-flex flex-column">
                      <img
                        src={curso.image_url || CursoPlaceholder}
                        alt={curso.title}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{curso.title}</h5>
                        <p className="card-text flex-grow-1">
                          {curso.description}
                        </p>
                        <a
                          href={curso.url}
                          className="btn btn-primary w-100 mt-auto"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver curso
                        </a>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Cursos;
