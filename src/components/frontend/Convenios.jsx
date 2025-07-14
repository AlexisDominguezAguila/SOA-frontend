"use client";

import { useEffect, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import api from "@/services/api";
import { Spinner } from "react-bootstrap";

const Convenios = () => {
  const [convenios, setConvenios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConvenios = async () => {
    try {
      const { data } = await api.get("public/convenios");
      setConvenios(data);
    } catch (error) {
      console.error("Error al obtener convenios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvenios();
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* Banner superior */}
        <section
          className="d-flex align-items-center justify-content-center text-center text-white py-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://img.freepik.com/fotos-premium/diseno-fondo-desdibujado-gradiente-moderno-fot-publicidad_558873-44763.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "90vh",
          }}
        >
          <div className="container">
            <h1 className="display-4 fw-bold">Convenios Estratégicos</h1>
            <p className="lead mt-3">
              Alianzas que impulsan el bienestar y desarrollo de nuestros
              colegiados
            </p>
          </div>
        </section>

        {/* Contenido principal */}
        <section className="py-5 bg-light">
          <div className="container py-5">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando convenios...</p>
              </div>
            ) : convenios.length > 0 ? (
              convenios.map((convenio) => (
                <div
                  key={convenio.id}
                  className="row align-items-center mb-5 shadow p-4 rounded"
                  style={{
                    border: "none",
                    borderTop: "5px solid #5c0655",
                    borderRadius: "10px",
                  }}
                >
                  {/* Imagen del convenio */}
                  <div className="col-lg-6 mb-4 mb-lg-0">
                    <img
                      src={convenio.image_url || "/placeholder-avatar.png"}
                      alt={convenio.title}
                      className="img-fluid rounded shadow"
                      onError={(e) => {
                        e.target.src = "/placeholder-avatar.png";
                      }}
                    />
                  </div>

                  {/* Detalles del convenio */}
                  <div className="col-lg-6 text-lg-start">
                    <h2 className="fw-bold mb-4" style={{ color: "#5c0655" }}>
                      {convenio.title}
                    </h2>

                    <ul className="list-unstyled">
                      {convenio.benefits.map((b, i) => (
                        <li key={i} className="d-flex align-items-start mb-3">
                          <BiCheckCircle
                            className="me-2"
                            size={24}
                            color="#5c0655"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {convenio.url && (
                      <a
                        href={convenio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mt-4 px-4 py-2"
                        style={{
                          background:
                            "linear-gradient(135deg, #5c0655, #3e104e)",
                          border: "none",
                          borderRadius: "50px",
                        }}
                      >
                        Conocer más del convenio
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <i className="bi bi-inbox display-4 mb-3" />
                <h5>No hay convenios activos disponibles.</h5>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Convenios;
