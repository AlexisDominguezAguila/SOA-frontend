import React from "react";
import logoCMP from "../../assets/images/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer
        className="footer pt-6 pb-4 position-relative p-5 "
        id="footer"
        style={{
          backgroundColor: "#f8f5fa",
          borderTop: "1px solid rgba(92, 6, 85, 0.1)",
        }}
      >
        {/* Elemento decorativo */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(92, 6, 85, 0.05) 0%, transparent 30%)",
            zIndex: 0,
          }}
        ></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          {/* Sección superior del footer */}
          <div className="row g-5 mb-6">
            {/* Columna 1: Logo e información */}
            <div className="col-lg-4">
              <div className="mb-4">
                <img
                  src={logoCMP}
                  alt="Colegio Médico de Piura"
                  className="img-fluid mb-3"
                  style={{ maxWidth: "180px" }}
                />
                <p
                  className="mb-3"
                  style={{ color: "#5c0655", fontWeight: "500" }}
                >
                  Trabajando por la excelencia médica y el bienestar de nuestros
                  colegiados.
                </p>
                <div className="d-flex align-items-center mb-2">
                  <i
                    className="bi bi-geo-alt-fill me-3"
                    style={{ color: "#5c0655", fontSize: "1.2rem" }}
                  ></i>
                  <span>Av. Grau 1234, Piura, Perú</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i
                    className="bi bi-telephone-fill me-3"
                    style={{ color: "#5c0655", fontSize: "1.2rem" }}
                  ></i>
                  <span>(073) 123-4567</span>
                </div>
                <div className="d-flex align-items-center">
                  <i
                    className="bi bi-envelope-fill me-3"
                    style={{ color: "#5c0655", fontSize: "1.2rem" }}
                  ></i>
                  <span>info@cmpiura.org.pe</span>
                </div>
              </div>
            </div>

            {/* Columna 2: Enlaces rápidos */}
            <div className="col-lg-2 col-md-4">
              <h5 className="mb-4 fw-bold" style={{ color: "#5c0655" }}>
                Enlaces Rápidos
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <NavLink
                    to="/"
                    className="text-decoration-none text-secondary"
                  >
                    <i
                      className="bi bi-arrow-right me-2"
                      style={{ color: "#5c0655" }}
                    />
                    Inicio
                  </NavLink>
                </li>

                <li className="mb-2">
                  {/* “Nosotros” → página About */}
                  <NavLink
                    to="/#servicios"
                    className="text-decoration-none text-secondary"
                  >
                    <i
                      className="bi bi-arrow-right me-2"
                      style={{ color: "#5c0655" }}
                    />
                    Servicios
                  </NavLink>
                </li>

                <li className="mb-2">
                  {/* Junta Directiva está en Home (/#junta) */}
                  <NavLink
                    to="/junta-directiva"
                    className="text-decoration-none text-secondary"
                  >
                    <i
                      className="bi bi-arrow-right me-2"
                      style={{ color: "#5c0655" }}
                    />
                    Junta Directiva
                  </NavLink>
                </li>

                <li className="mb-2">
                  {/* Servicios también en Home (/#servicios) – ajusta si vive en otra ruta */}
                  <NavLink
                    to="/convenios"
                    className="text-decoration-none text-secondary"
                  >
                    <i
                      className="bi bi-arrow-right me-2"
                      style={{ color: "#5c0655" }}
                    />
                    Convenios
                  </NavLink>
                </li>

                <li className="mb-2">
                  <NavLink
                    to="/news#noticias"
                    className="text-decoration-none text-secondary"
                  >
                    <i
                      className="bi bi-arrow-right me-2"
                      style={{ color: "#5c0655" }}
                    />
                    Noticias
                  </NavLink>
                </li>

                <li>
                  {/* “Contacto” simplemente hace scroll al footer, así que basta con #footer */}
                  <NavLink
                    to="/tumi"
                    className="text-decoration-none text-secondary"
                  >
                    <i
                      className="bi bi-arrow-right me-2"
                      style={{ color: "#5c0655" }}
                    />
                    Centro Tumi
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Columna 3: Servicios */}
            <div className="col-lg-3 col-md-4">
              <h5 className="mb-4 fw-bold" style={{ color: "#5c0655" }}>
                Nuestros Servicios
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i
                    className="bi bi-check-circle-fill me-2"
                    style={{ color: "#5c0655" }}
                  ></i>
                  <span>Certificaciones y constancias</span>
                </li>
                <li className="mb-2">
                  <i
                    className="bi bi-check-circle-fill me-2"
                    style={{ color: "#5c0655" }}
                  ></i>
                  <span>Capacitaciones médicas</span>
                </li>
                <li className="mb-2">
                  <i
                    className="bi bi-check-circle-fill me-2"
                    style={{ color: "#5c0655" }}
                  ></i>
                  <span>Asesoría legal profesional</span>
                </li>
                <li className="mb-2">
                  <i
                    className="bi bi-check-circle-fill me-2"
                    style={{ color: "#5c0655" }}
                  ></i>
                  <span>Convenios con instituciones</span>
                </li>
                <li className="mb-2">
                  <i
                    className="bi bi-check-circle-fill me-2"
                    style={{ color: "#5c0655" }}
                  ></i>
                  <span>Eventos científicos</span>
                </li>
                <li>
                  <i
                    className="bi bi-check-circle-fill me-2"
                    style={{ color: "#5c0655" }}
                  ></i>
                  <span>Publicaciones especializadas</span>
                </li>
              </ul>
            </div>

            {/* Columna 4: Horario y redes */}
            <div className="col-lg-3 col-md-4">
              <h5 className="mb-4 fw-bold" style={{ color: "#5c0655" }}>
                Horario de Atención
              </h5>
              <div className="mb-4">
                <p className="mb-1">
                  <strong>Lunes a Viernes:</strong> 8:00 AM - 8:00 PM
                </p>
                <p className="mb-1">
                  <strong>Sábados:</strong> 8:00 AM - 1:00 PM
                </p>
                <p>
                  <strong>Domingos:</strong> Cerrado
                </p>
              </div>

              <h5 className="mb-3 fw-bold" style={{ color: "#5c0655" }}>
                Síguenos
              </h5>
              <div className="d-flex gap-3">
                <a
                  href="https://www.facebook.com/cmpiura"
                  className="social-icon"
                  target="_blank"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#5c0655",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-5px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="https://www.instagram.com/colegio_medico_de_piura/?hl=es-la"
                  className="social-icon"
                  target="_blank"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#5c0655",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-5px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <i className="bi bi-instagram"></i>
                </a>

                <a
                  href="https://www.youtube.com/@cmppiura"
                  className="social-icon"
                  target="_blank"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#5c0655",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-5px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Sección de Mapa */}
          <div className="row mb-6">
            <div className="col-12">
              <div
                className="map-container rounded-4 overflow-hidden shadow-lg"
                style={{
                  height: "350px",
                  border: "1px solid rgba(92, 6, 85, 0.1)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15893.734007483517!2d-80.61962!3d-5.194343000000001!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904a10636dea72a1%3A0x10077bfcf3f51f21!2sCOLEGIO%20M%C3%89DICO%20DEL%20PER%C3%9A%2C%20CONSEJO%20REGIONAL%20VII%20-%20PIURA!5e0!3m2!1ses!2spe!4v1750725347874!5m2!1ses!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del Colegio Médico de Piura"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Sección inferior del footer */}
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <p className="mb-0" style={{ color: "#6c757d" }}>
                &copy; {new Date().getFullYear()} Colegio Médico de Piura. Todos
                los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <ul className="list-inline mb-0">
                {/*<li className="list-inline-item me-3">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "#6c757d" }}
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li className="list-inline-item me-3">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "#6c757d" }}
                  >
                    Política de Privacidad
                  </a>
                </li> */}
                <li className="list-inline-item">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "#6c0655", fontWeight: "500" }}
                  >
                    <i
                      className="bi bi-arrow-up-circle-fill me-2 "
                      style={{
                        fontSize: "2.5rem",
                        verticalAlign: "middle",
                      }}
                    ></i>{" "}
                    Volver arriba
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
