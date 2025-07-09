import React, { useState, useEffect } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";

import { BiCalendar, BiUser, BiTime, BiShow } from "react-icons/bi";
import JuntaCMP from "@/assets/images/about.webp";
import NoticiaCMP from "@/assets/images/NoticiaEjp.webp";
import Aviso from "@/assets/images/convenio.jpeg";
import { Link } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import api from "@/services/api";

const Home = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHimno, setShowHimno] = useState(false);
  const [showAvisos, setShowAvisos] = useState(false);

  const avisos = [Aviso];
  const totalAvisos = avisos.length;

  // Beneficios y valores de la junta directiva
  const beneficios = [
    "Representación profesional ante instituciones públicas y privadas",
    "Programas de formación continua y desarrollo profesional",
    "Asesoría legal y apoyo en casos relacionados con la práctica médica",
    "Acceso a convenios y descuentos exclusivos para colegiados",
    "Promoción de la investigación y publicación científica",
    "Defensa de los derechos e intereses de los médicos",
  ];

  const valores = [
    "Compromiso con la excelencia médica",
    "Integridad y transparencia en todas nuestras acciones",
    "Responsabilidad social con nuestra comunidad",
    "Innovación en la práctica médica",
    "Respeto por la diversidad y la ética profesional",
    "Trabajo colaborativo y en equipo",
  ];

  // Datos de los servicios
  const servicios = [
    {
      titulo: "Conoce a tu médico",
      subtitulo: "Médicos colegiados por el CMP",
      icono: "bi-person-badge",
      color: "#5c0655",
      enlace: "https://aplicaciones.cmp.org.pe/conoce_a_tu_medico/index.php",
    },
    {
      titulo: "SEMEFA",
      subtitulo: "Servicio médico familiar",
      icono: "bi-heart-pulse",
      color: "#0d6efd",
      enlace: "https://www.cmp.org.pe/semefa/",
    },
    {
      titulo: "FOSEMED",
      subtitulo: "Fondo de seguridad del médico",
      icono: "bi-shield-check",
      color: "#198754",
      enlace: "https://www.cmp.org.pe/fosemed/",
    },
    {
      titulo: "CMP DIGITAL",
      subtitulo: "Plataforma CMP",
      icono: "bi-laptop",
      color: "#fd7e14",
      enlace: "https://ayni.cmp.org.pe/",
    },
  ];

  const openHimno = () => setShowHimno(true);
  const closeHimno = () => setShowHimno(false);
  const openAvisos = () => setShowAvisos(true);
  const closeAvisos = () => setShowAvisos(false);

  // Obtener la ultima noticia
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/public/news", {
          params: { per_page: 1, sort: "created_at:desc" },
        });

        const latest = Array.isArray(data)
          ? data[0]
          : data.data?.[0] || data?.[0] || null;

        setNews(latest);
      } catch (err) {
        console.error("Error al cargar la última noticia", err);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  // Función para truncar
  const truncate = (text = "", wordLimit = 60) => {
    if (!text) return ""; // Manejar texto vacío
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")}…`
      : text;
  };

  // Formatear fecha
  const formatDate = (iso) => {
    if (!iso) return "Fecha no disponible";
    try {
      return new Date(iso).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="section-1">
          <div className="hero d-flex align-items-center justify-content-center text-center">
            <div className="container">
              <span className="hero-subtitle">COLEGIO MEDICO DEL PERÚ</span>
              <h1 className="hero-title">CONSEJO REGIONAL VII - PIURA</h1>
              <div className="mt-3">
                <button
                  className="btn btn-primary btn-lg px-5 py-3 mt-3 fw-bold"
                  style={{
                    background:
                      "linear-gradient(135deg,rgb(124, 15, 134),rgb(27, 13, 104))",
                    border: "none",
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    letterSpacing: "1px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onClick={openHimno}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 25px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.2)";
                  }}
                >
                  <i className="bi bi-play-circle me-2"></i> Himno - Colegio
                  Médico del Perú
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* ---------- MODAL HIMNO ---------- */}
        <Modal
          show={showHimno}
          onHide={closeHimno}
          size="lg"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Himno – Colegio Médico del Perú</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/Oplu_aj5A7w"
                title="Himno CMP"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeHimno}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Galería de íconos */}
        <section
          className="services-section py-5 position-relative"
          id="servicios"
          style={{
            backgroundColor: "#f8f9fa",
            marginTop: "-50px",
            zIndex: 10,
            paddingTop: "80px",
          }}
        >
          {/* Elemento decorativo */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(92, 6, 85, 0.05) 0%, transparent 30%)",
              zIndex: 0,
            }}
          ></div>

          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row justify-content-center">
              <div className="col-12 text-center mb-5">
                <h2
                  className="section-title mb-3"
                  style={{
                    color: "#5c0655",
                    fontWeight: "700",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  Nuestros Servicios
                  <span
                    className="position-absolute bottom-0 start-50 translate-middle-x"
                    style={{
                      width: "80px",
                      height: "4px",
                      background: "linear-gradient(90deg, #5c0655, #8a0b7d)",
                      borderRadius: "10px",
                    }}
                  ></span>
                </h2>
                <p
                  className="section-subtitle text-muted mx-auto"
                  style={{ maxWidth: "700px" }}
                >
                  Descubre los servicios exclusivos que ofrecemos para nuestros
                  colegiados y la comunidad médica
                </p>
              </div>
            </div>

            <div className="row g-4 justify-content-center">
              {servicios.map((servicio, index) => (
                <div className="col-lg-3 col-md-6" key={index}>
                  <a
                    href={servicio.enlace}
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className="service-card bg-white rounded-4 p-4 shadow-sm h-100 d-flex flex-column"
                      style={{
                        transition: "all 0.3s ease",
                        borderBottom: `4px solid ${servicio.color}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-10px)";
                        e.currentTarget.style.boxShadow =
                          "0 15px 30px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 5px 15px rgba(0, 0, 0, 0.05)";
                      }}
                    >
                      <div
                        className="service-icon d-flex align-items-center justify-content-center mb-4"
                        style={{
                          width: "70px",
                          height: "70px",
                          backgroundColor: `${servicio.color}20`,
                          borderRadius: "18px",
                        }}
                      >
                        <i
                          className={`bi ${servicio.icono}`}
                          style={{
                            fontSize: "2rem",
                            color: servicio.color,
                          }}
                        ></i>
                      </div>

                      <h3
                        className="service-title mb-2"
                        style={{
                          color: "#212529",
                          fontWeight: "700",
                        }}
                      >
                        {servicio.titulo}
                      </h3>

                      <p
                        className="service-subtitle mb-0"
                        style={{
                          color: "#6c757d",
                          flexGrow: 1,
                        }}
                      >
                        {servicio.subtitulo}
                      </p>

                      <div
                        className="mt-4 d-flex align-items-center"
                        style={{ color: servicio.color }}
                      >
                        <span className="me-2 fw-medium">Más información</span>
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de última noticia */}
        <section
          className="section-featured-news py-5"
          id="noticias"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f0f5ff 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decoración */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(109,66,193,0.1) 0%, rgba(13,110,253,0.05) 100%)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>

          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row g-0 rounded-4 overflow-hidden shadow-lg">
              {/* Imagen destacada */}
              <div className="col-lg-6">
                <div
                  className="featured-news-image-container overflow-hidden"
                  style={{ height: "100%", position: "relative" }}
                >
                  <img
                    src={news?.image_url || NoticiaCMP}
                    alt={news?.title || "Noticia destacada"}
                    className="img-fluid w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "40%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>

              {/* Contenido de la noticia */}
              <div className="col-lg-6 bg-white">
                <div className="p-4 p-lg-5 h-100 d-flex flex-column">
                  <span
                    className="featured-news-badge mb-4 d-inline-flex align-items-center align-self-start"
                    style={{
                      background:
                        "linear-gradient(90deg,rgb(167, 75, 167) 0%,rgb(66, 21, 148) 100%)",
                      color: "white",
                      fontWeight: "700",
                      padding: "0.5rem 1.25rem",
                      borderRadius: "50px",
                      boxShadow: "0 4px 10px rgba(13, 110, 253, 0.25)",
                      textTransform: "uppercase",
                      fontSize: "0.85rem",
                      letterSpacing: "1px",
                    }}
                  >
                    <i className="bi bi-star-fill me-2" /> Destacado
                  </span>

                  {loading ? (
                    <h2>Cargando última noticia…</h2>
                  ) : (
                    <>
                      <h2
                        className="featured-news-title mb-3"
                        style={{
                          fontSize: "2.25rem",
                          fontWeight: "800",
                          lineHeight: "1.2",
                          background:
                            "linear-gradient(90deg,rgb(22, 23, 24) 0%,rgb(79, 18, 119) 100%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {news?.title}
                      </h2>

                      <p
                        className="featured-news-excerpt mb-4"
                        style={{
                          fontSize: "1.1rem",
                          lineHeight: "1.7",
                          color: "#495057",
                          flexGrow: 1,
                        }}
                      >
                        {truncate(news?.description)}
                      </p>

                      <div className="featured-news-meta d-flex align-items-center gap-3 mb-4 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                          <BiCalendar
                            className="text-primary"
                            style={{ fontSize: "1.1rem" }}
                          />
                          <span>{formatDate(news?.created_at)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <BiUser
                            className="text-primary"
                            style={{ fontSize: "1.1rem" }}
                          />
                          <span>{news?.author || "Redacción CMP - Piura"}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <Link
                    to="/news#noticias"
                    className="btn btn-primary mt-auto align-self-start d-inline-flex align-items-center gap-2"
                    style={{
                      background: "linear-gradient(90deg, #5c0655, #8a0b7d)",
                      border: "none",
                      fontWeight: "600",
                      padding: "0.8rem 2rem",
                      borderRadius: "50px",
                      boxShadow: "0 4px 15px rgba(157, 13, 253, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 7px 20px rgba(197, 13, 253, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(213, 13, 253, 0.3)";
                    }}
                  >
                    Ver en Noticias <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Junta Directiva */}
        <section
          className="section-directiva py-6 position-relative p-5"
          id="junta"
          style={{
            backgroundColor: "#f8f5fa",
            backgroundImage:
              "linear-gradient(135deg, rgba(92, 6, 85, 0.03) 0%, transparent 100%)",
            overflow: "hidden",
          }}
        >
          {/* Elementos decorativos */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(92, 6, 85, 0.05) 0%, transparent 30%)",
              zIndex: 0,
            }}
          ></div>

          <div
            className="position-absolute bottom-0 end-0"
            style={{
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(92, 6, 85, 0.1) 0%, transparent 70%)",
              transform: "translate(30%, 30%)",
              zIndex: 0,
            }}
          ></div>

          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="section-header text-center mb-6 position-relative">
              <div className="d-flex justify-content-center position-relative mb-4">
                <h2
                  className="section-title position-relative display-4 fw-bold"
                  style={{
                    color: "#5c0655",
                    letterSpacing: "1px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Junta Directiva
                </h2>
                <div
                  className="position-absolute bottom-0"
                  style={{
                    width: "100px",
                    height: "4px",
                    background: "linear-gradient(90deg, #5c0655, #8a0b7d)",
                    borderRadius: "10px",
                  }}
                ></div>
              </div>

              <p
                className="section-subtitle fs-5"
                style={{
                  color: "#6c757d",
                  fontWeight: "500",
                  maxWidth: "700px",
                  margin: "0 auto",
                }}
              >
                El Colegio Médico de Piura: Trabajando por el desarrollo
                profesional y el bienestar de nuestros colegiados
              </p>
            </div>

            {/* Sección de imagen (primera en el flujo) */}
            <div className="row justify-content-center mb-6">
              <div className="col-lg-10">
                <div
                  className="directiva-img-container position-relative rounded-4 overflow-hidden shadow-lg"
                  style={{
                    aspectRatio: "16/7",
                    borderRadius: "20px",
                    boxShadow: "0 20px 40px rgba(92, 6, 85, 0.15)",
                    position: "relative",
                  }}
                >
                  <img
                    src={JuntaCMP}
                    alt="Junta Directiva del Colegio Médico de Piura"
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />

                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "rgba(92, 6, 85, 0.4)",
                      zIndex: 1,
                    }}
                  >
                    <div
                      className="text-center text-white p-4"
                      style={{ zIndex: 2 }}
                    >
                      <h2 className="display-5 fw-bold mb-3">
                        Nuestro Compromiso
                      </h2>
                      <p
                        className="fs-4 mb-4"
                        style={{ maxWidth: "700px", margin: "0 auto" }}
                      >
                        Trabajando por la excelencia médica y el bienestar de
                        nuestros colegiados
                      </p>
                      <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <span className="badge bg-light text-dark fs-6 px-4 py-2 rounded-pill">
                          <i className="bi bi-check-circle-fill me-2 text-primary"></i>{" "}
                          Profesionalismo
                        </span>
                        <span className="badge bg-light text-dark fs-6 px-4 py-2 rounded-pill">
                          <i className="bi bi-check-circle-fill me-2 text-primary"></i>{" "}
                          Ética
                        </span>
                        <span className="badge bg-light text-dark fs-6 px-4 py-2 rounded-pill">
                          <i className="bi bi-check-circle-fill me-2 text-primary"></i>{" "}
                          Innovación
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-4"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                      zIndex: 2,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="text-white mb-0">
                          Junta Directiva 2025-2027
                        </h4>
                        <p className="text-white opacity-75 mb-0">
                          Colegio Médico de Piura
                        </p>
                      </div>
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #5c0655, #8a0b7d)",
                        }}
                      >
                        <i className="bi bi-award-fill fs-4 text-white"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de contenido (segunda en el flujo) */}
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div
                  className="directiva-content bg-white rounded-4 p-4 p-lg-5 shadow-lg"
                  style={{
                    borderTop: "5px solid #5c0655",
                    marginTop: "-50px",
                    position: "relative",
                    zIndex: 3,
                  }}
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="p-3">
                        <h3
                          className="mb-4 fw-bold"
                          style={{
                            color: "#5c0655",
                            position: "relative",
                            paddingBottom: "10px",
                          }}
                        >
                          <span
                            className="position-absolute bottom-0 start-0"
                            style={{
                              width: "50px",
                              height: "3px",
                              backgroundColor: "#5c0655",
                              borderRadius: "5px",
                            }}
                          ></span>
                          Nuestros Beneficios
                        </h3>

                        <ul className="list-unstyled">
                          {beneficios.map((item, index) => (
                            <li key={index} className="mb-3">
                              <div className="d-flex">
                                <div
                                  className="flex-shrink-0 me-3"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "rgba(92, 6, 85, 0.1)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <i
                                    className="bi bi-check-circle-fill fs-5"
                                    style={{ color: "#5c0655" }}
                                  ></i>
                                </div>
                                <div className="flex-grow-1">
                                  <p
                                    className="mb-0 fw-medium"
                                    style={{
                                      color: "#495057",
                                      fontSize: "1.05rem",
                                    }}
                                  >
                                    {item}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="p-3">
                        <h3
                          className="mb-4 fw-bold"
                          style={{
                            color: "#5c0655",
                            position: "relative",
                            paddingBottom: "10px",
                          }}
                        >
                          <span
                            className="position-absolute bottom-0 start-0"
                            style={{
                              width: "50px",
                              height: "3px",
                              backgroundColor: "#5c0655",
                              borderRadius: "5px",
                            }}
                          ></span>
                          Nuestros Valores
                        </h3>

                        <ul className="list-unstyled">
                          {valores.map((item, index) => (
                            <li key={index} className="mb-3">
                              <div className="d-flex">
                                <div
                                  className="flex-shrink-0 me-3"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "rgba(92, 6, 85, 0.1)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <i
                                    className="bi bi-star-fill fs-5"
                                    style={{ color: "#5c0655" }}
                                  ></i>
                                </div>
                                <div className="flex-grow-1">
                                  <p
                                    className="mb-0 fw-medium"
                                    style={{
                                      color: "#495057",
                                      fontSize: "1.05rem",
                                    }}
                                  >
                                    {item}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                    {/* Botón para ver los miembros de la junta directiva */}
                    <div className="mt-5">
                      <Link
                        to="/junta-directiva"
                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                        style={{
                          background:
                            "linear-gradient(90deg, #5c0655, #8a0b7d)",
                          border: "none",
                          padding: "0.8rem 1.5rem",
                          borderRadius: "50px",
                          boxShadow: "0 4px 15px rgba(92, 6, 85, 0.3)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-3px)";
                          e.currentTarget.style.boxShadow =
                            "0 7px 20px rgba(121, 10, 131, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(205, 13, 253, 0.3)";
                        }}
                      >
                        Conoce a los miembros de la Junta Directiva
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-5 pt-3">
                    <div
                      className="bg-light rounded-3 p-4 p-lg-5"
                      style={{ borderLeft: "3px solid #5c0655" }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-4">
                          <i
                            className="bi bi-quote fs-1"
                            style={{ color: "#5c0655", opacity: "0.2" }}
                          ></i>
                        </div>

                        <div className="flex-grow-1">
                          <p
                            className="fs-5 mb-3"
                            style={{ color: "#5c0655", lineHeight: "1.7" }}
                          >
                            "Nuestra misión es promover la excelencia en la
                            práctica médica, defender los derechos de nuestros
                            colegiados y contribuir al desarrollo de una
                            sociedad más saludable en la región de Piura."
                          </p>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3">
                              <div
                                className="bg-primary rounded-circle"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  background:
                                    "linear-gradient(135deg, #5c0655, #8a0b7d)",
                                }}
                              ></div>
                            </div>
                            <div>
                              <h5
                                className="mb-0 fw-bold"
                                style={{ color: "#5c0655" }}
                              >
                                Dr. Carlos Mendoza
                              </h5>
                              <p className="mb-0 text-muted">
                                Presidente del Colegio Médico de Piura
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: 1050,
          }}
        >
          <button
            className="btn btn-primary btn-lg rounded-circle shadow position-relative"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#800080",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={openAvisos}
            aria-label="Ver anuncios"
          >
            <i className="bi bi-megaphone-fill fs-4 text-white"></i>

            {/* Badge contador - ahora posicionado correctamente */}
            {totalAvisos > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.4em 0.6em",
                  transform: "translate(-50%, -50%)", // Ajuste fino
                }}
              >
                {totalAvisos}
              </span>
            )}
          </button>
        </div>
        <Modal show={showAvisos} onHide={closeAvisos} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-megaphone-fill me-2" /> Avisos
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-0">
            {avisos.length === 0 ? (
              <div className="text-center py-5 bg-light">
                <i
                  className="bi bi-megaphone text-muted"
                  style={{ fontSize: "4rem", opacity: 0.3 }}
                />
                <h4 className="mt-3 text-muted">
                  No hay anuncios en este momento
                </h4>
                <p className="text-muted">
                  Pronto publicaremos nuevos avisos importantes
                </p>
              </div>
            ) : (
              <>
                <Carousel>
                  {avisos.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        src={img}
                        className="d-block w-100"
                        alt={`Aviso ${idx + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </>
            )}
          </Modal.Body>
        </Modal>
      </main>
      <Footer />
    </>
  );
};

export default Home;
