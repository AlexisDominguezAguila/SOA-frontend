import { Carousel } from "react-bootstrap";

import tumi1 from "@/assets/images/tumi1.webp";
import tumi2 from "@/assets/images/tumi2.webp";
import tumi3 from "@/assets/images/tumi3.webp";
import tumi4 from "@/assets/images/tumi4.webp";
import tumi5 from "@/assets/images/tumi5.webp";
import doctor from "@/assets/images/doctora.webp";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Tumi = () => {
  return (
    <>
      <Header />
      <main>
        {/* Banner */}
        <section
          className="d-flex align-items-center justify-content-center text-center text-white py-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://tumiscriiilima.com/wp-content/uploads/2023/01/portada3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "90vh",
          }}
        >
          <div className="container">
            <h1 className="display-4 fw-bold">Centro Recreacional Tumi</h1>
            <p className="lead mt-3">
              El lugar ideal para tu descanso, deporte y vida en comunidad
            </p>
          </div>
        </section>

        {/* Sección descriptiva con slider */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row align-items-center g-5">
              {/* Slider */}
              <div className="col-lg-6">
                <Carousel fade indicators={false} controls={true}>
                  {[tumi1, tumi2, tumi3, tumi4, tumi5].map((img, i) => (
                    <Carousel.Item key={i}>
                      <img
                        src={img}
                        alt={`Tumi slide ${i + 1}`}
                        className="d-block w-100 rounded shadow"
                        style={{ height: "350px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>

              {/* Texto descriptivo */}
              <div className="col-lg-6">
                <h3 className="fw-bold mb-4" style={{ color: "#5c0655" }}>
                  Espacio de encuentro y bienestar
                </h3>
                <p className="fs-5 text-muted text-justify">
                  El Centro Recreacional Tumi está diseñado para brindar a
                  nuestros colegiados un espacio cómodo, moderno y seguro donde
                  puedan compartir momentos en familia, disfrutar del deporte, o
                  simplemente relajarse en contacto con la naturaleza. Nuestro
                  compromiso es ofrecer calidad y bienestar en cada rincón del
                  recinto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <h3 className="fw-bold mb-4" style={{ color: "#5c0655" }}>
                  Beneficios exclusivos
                </h3>
                <ul className="list-unstyled fs-5">
                  {[
                    "Piscina recreativa y juegos infantiles",
                    "Canchas de fútbol y vóley",
                    "Áreas de parrillas y esparcimiento familiar",
                    "Salón de eventos para celebraciones y talleres",
                  ].map((beneficio, i) => (
                    <li key={i} className="d-flex align-items-start mb-3">
                      <i
                        className="bi bi-check-circle-fill me-2"
                        style={{ color: "#5c0655", fontSize: "1.2rem" }}
                      />
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-6 text-center">
                <img
                  src={doctor}
                  alt=""
                  className="img-fluid"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="py-5 bg-light">
          <div className="container">
            <h3
              className="text-center fw-bold mb-5"
              style={{ color: "#5c0655" }}
            >
              ¿Qué dicen nuestros colegiados?
            </h3>

            <div className="row row-cols-1 row-cols-md-3 g-4">
              {[
                {
                  nombre: "Dra. Ana Martínez",
                  comentario:
                    "Es un espacio increíble para compartir en familia. Mis hijos aman la piscina y los jardines.",
                },
                {
                  nombre: "Dr. Luis Herrera",
                  comentario:
                    "Excelente ambiente y muy bien cuidado. Lo uso todos los fines de semana para jugar fútbol.",
                },
                {
                  nombre: "Dra. Carla Núñez",
                  comentario:
                    "Ideal para desconectar de la rutina. Me encanta pasar una tarde de lectura en los espacios verdes.",
                },
              ].map((t, i) => (
                <div className="col" key={i}>
                  <div className="card h-100 shadow-sm border-0 p-4">
                    <i
                      className="bi bi-quote fs-2 mb-3"
                      style={{ color: "#5c0655" }}
                    />
                    <p className="mb-3 text-muted">“{t.comentario}”</p>
                    <h6 className="fw-bold mb-0">{t.nombre}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Tumi;
