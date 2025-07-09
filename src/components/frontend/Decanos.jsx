"use client";

import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import heroBg from "@/assets/images/BannerDecano.jpg";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import api from "@/services/api";
import Swal from "sweetalert2";

/** Imagen local usada como respaldo cuando no se encuentra la del servidor */
import Placeholder from "@/assets/images/doctor.webp";

const Decanos = () => {
  const [deans, setDeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para cargar los datos
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/public/deans", {
          params: { per_page: 100 },
        });

        setDeans(response.data);
      } catch (e) {
        console.error("Error fetching deans:", e);
        // Solo mostrar error si es la primera carga
        if (deans.length === 0) {
          Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los datos de los decanos",
            icon: "error",
            confirmButtonColor: "#5C0655",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Carga inicial
    fetchData();

    // Configurar intervalo para actualizar cada 10 segundos
    const intervalId = setInterval(fetchData, 10000);

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, []); // El array vacío asegura que solo se ejecute una vez al montar

  /* Decano más reciente (ordenado desc en el backend) */
  const currentDean = deans[0] || null;
  const pastDeans = deans.slice(1);

  return (
    <>
      <Header />
      <main>
        {/* ----------------------- HERO SECTION ----------------------- */}
        <section
          className="hero-section position-relative overflow-hidden"
          style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}
        >
          {/* Banner de fondo */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.8)",
              zIndex: 1,
            }}
          ></div>

          {/* Overlay morado */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(75, 0, 130, 0.4)", zIndex: 2 }}
          ></div>

          {/* Contenido */}
          <div className="container position-relative z-3 py-5">
            {loading && deans.length === 0 ? (
              <div className="text-center text-white">
                <Spinner animation="border" variant="light" />
                <p className="mt-3 fs-4">Cargando decano actual...</p>
              </div>
            ) : currentDean ? (
              <div className="row align-items-center">
                {/* Foto */}
                <div className="col-lg-5 mb-5 mb-lg-0 d-flex justify-content-center">
                  <div style={{ maxWidth: "350px" }}>
                    <img
                      src={`http://localhost:8000/storage/${currentDean.image_url}`}
                      alt={currentDean.name}
                      className="img-fluid rounded-circle shadow-lg"
                      style={{
                        border: "5px solid white",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                      }}
                      onError={(e) => (e.target.src = Placeholder)}
                    />
                  </div>
                </div>
                {/* Texto */}
                <div className="col-lg-7 text-center text-lg-start text-white">
                  <h1 className="display-2 fw-bold mb-3">{currentDean.name}</h1>
                  <div
                    className="position-relative mb-4"
                    style={{ maxWidth: "300px", margin: "0 auto" }}
                  >
                    <h2 className="fs-1 mb-0">Decano</h2>
                    <div
                      className="position-absolute bottom-0 left-0 w-100 bg-warning"
                      style={{ height: "4px", transform: "translateY(10px)" }}
                    ></div>
                  </div>
                  <p className="fs-2 mb-5">
                    {currentDean.year_start} - {currentDean.year_end}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-white">
                <p className="fs-3">No hay decanos activos para mostrar.</p>
              </div>
            )}
          </div>

          {/* Indicador scroll */}
          <div
            className="position-absolute bottom-0 start-50 translate-middle-x text-white text-center mb-4 z-3"
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <div className="d-flex flex-column align-items-center">
              <span className="mb-2">Desplazar para continuar</span>
              <div className="scroll-indicator">
                <div className="scroll-dot"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------- SECCIÓN HISTÓRICA ------------------------- */}
        <section className="py-5 bg-light">
          <div className="container py-5">
            <div className="row mb-5">
              <div className="col-md-8 mx-auto text-center">
                <h2 className="mb-3">Sección de decanos históricos</h2>
                <p className="lead">
                  Conoce a quienes dirigieron nuestro colegio profesional a lo
                  largo del tiempo
                </p>
              </div>
            </div>

            {loading && deans.length === 0 ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : pastDeans.length ? (
              <div className="row">
                {pastDeans.map((d) => (
                  <div className="col-md-4 mb-4" key={d.id}>
                    <div className="card h-100 shadow">
                      <img
                        src={`http://localhost:8000/storage/${d.image_url}`}
                        className="card-img-top"
                        alt={d.name}
                        onError={(e) => (e.target.src = Placeholder)}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{d.name}</h5>
                        <p className="card-text text-muted">
                          {d.year_start} – {d.year_end}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">
                Aún no hay decanos históricos para mostrar.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Decanos;
