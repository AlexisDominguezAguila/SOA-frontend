import BannerNew from "@/assets/images/BannerCursos.jpg";
import Curso from "@/assets/images/curso.jpg";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Cursos = () => {
  // Datos de ejemplo (reemplazar con datos reales)
  const lastCourse = {
    image: Curso,
    title: "Curso Avanzado de React",
    speaker: "María Rodríguez",
    description: "Aprende técnicas avanzadas de React y hooks modernos",
  };

  return (
    <>
      <Header />
      <main>
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
              {/* Columna de la imagen del curso */}
              <Col md={6} className="text-center">
                <div className=" overflow-hidden shadow-lg">
                  <img
                    src={lastCourse.image}
                    alt={lastCourse.title}
                    className="img-fluid"
                    style={{
                      maxHeight: "400px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </Col>

              {/* Columna de información del curso */}
              <Col md={6} className="text-white">
                <div className="p-4  ">
                  <h1 className="display-5 fw-bold mb-4">
                    <i className="bi bi-stars me-3 text-warning"></i>
                    Último Curso
                  </h1>

                  <h2 className=" mb-3">
                    <i className="bi bi-book me-2"></i>
                    {lastCourse.title}
                  </h2>

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
        {/* Sección de todos los cursos */}
        <section className="courses-content py-5">
          <Container className="py-5">
            <h2 className="text-center mb-4">
              <i className="bi bi-book-half me-2"></i>
              Todos los Cursos
            </h2>
            <Row>
              {/* Aquí se pueden mapear los cursos disponibles */}
              {[1, 2, 3, 4].map((course, index) => (
                <Col md={3} key={index} className="mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={Curso}
                      alt={`Curso ${index + 1}`}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">Curso {index + 1}</h5>
                      <p className="card-text">
                        Descripción breve del curso {index + 1}.
                      </p>
                      <button className="btn btn-primary w-100">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Cursos;
