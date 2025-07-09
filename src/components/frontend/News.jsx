"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import placeholder from "@/assets/images/NoticiaEjp.webp";
import api from "@/services/api";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* datos para el hero */
  const [hero, setHero] = useState({
    img: "/banner-news.jpg",
    title: "Nuestras Últimas Noticias",
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/news", {
          params: { per_page: 100 },
        });
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];

        setNews(list);

        if (list.length) {
          const first = list[0];
          setHero({
            img: first.image_url
              ? first.image_url.startsWith("http")
                ? first.image_url
                : `/storage/${first.image_url}`
              : "/banner-news.jpg",
            title: first.title,
          });
        }
      } catch (err) {
        console.error(err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Header />

      {/* HERO */}
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url(${hero.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          position: "relative",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,.4)", zIndex: 1 }}
        />
        <div className="container position-relative z-2">
          <h1 className="display-4 fw-bold mb-3">{hero.title}</h1>

          <button
            className="btn btn-primary mt-3"
            onClick={() =>
              document
                .querySelector("#noticias")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Noticias
          </button>
        </div>
      </section>

      {/* CONTENIDO */}
      <main id="noticias" className="news-content py-5">
        <div className="container">
          {loading && <p>Cargando noticias…</p>}

          {!loading && news.length === 0 && (
            <p className="text-center">Aún no hay noticias publicadas.</p>
          )}

          {!loading &&
            news.map((n, idx) => {
              const isModel1 = idx % 2 === 0;

              return (
                <div
                  key={n.id}
                  className="card mb-4 shadow-sm border-0 position-relative"
                >
                  <div
                    className="row g-0"
                    style={{
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      borderTop: "5px solid #800080",
                    }}
                  >
                    {/* MODELO 1: imagen izquierda */}
                    {isModel1 && (
                      <div className="col-md-5 d-flex flex-column align-items-center justify-content-center p-3">
                        <img
                          src={n.image_url || placeholder}
                          alt={n.title}
                          className="img-fluid w-100 mb-3 rounded"
                          style={{ objectFit: "cover" }}
                          onError={(e) => (e.target.src = placeholder)}
                        />
                        {n.url && (
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn text-white w-100"
                            style={{
                              backgroundColor: "#800080",
                              borderRadius: "50px",
                            }}
                          >
                            Ver detalles
                          </a>
                        )}
                      </div>
                    )}

                    {/* TEXTO */}
                    <div className="col-md-7 p-4 d-flex flex-column">
                      <div className="mb-2 text-muted">
                        <i className="bi bi-calendar-event me-2" />
                        <small>{formatDate(n.created_at)}</small>
                      </div>

                      <h5
                        className="card-title fw-bold mb-3"
                        style={{ color: "#800080" }}
                      >
                        {n.title}
                      </h5>

                      {n.description && (
                        <p
                          className="card-text text-secondary"
                          style={{ textAlign: "justify", flexGrow: 1 }}
                        >
                          {n.description}
                        </p>
                      )}
                    </div>

                    {/* MODELO 2: imagen derecha */}
                    {!isModel1 && (
                      <div className="col-md-5 d-flex flex-column p-3">
                        <img
                          src={n.image_url || placeholder}
                          alt={n.title}
                          className="img-fluid w-100 mb-3 rounded"
                          style={{ objectFit: "cover" }}
                          onError={(e) => (e.target.src = placeholder)}
                        />
                        {n.url && (
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn text-white w-100 mt-auto"
                            style={{
                              backgroundColor: "#800080",
                              borderRadius: "50px",
                            }}
                          >
                            Ver detalles
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default News;
