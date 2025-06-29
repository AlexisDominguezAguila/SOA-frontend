import { BiCheckCircle } from "react-icons/bi";
import convenioImg from "@/assets/images/convenio.jpeg";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Convenios = () => {
  return (
    <>
      <Header />
      <main>
        {/* Banner superior */}
        <section
          className="d-flex align-items-center justify-content-center text-center text-white py-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://img.freepik.com/vector-gratis/diseno-banner-elegante-estilo-onda-color-violeta-moderno_1055-15296.jpg?semt=ais_hybrid&w=740')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "80vh",
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
          <div className="container py-5 ">
            <div
              className="row align-items-center mb-5 shadow p-4 rounded"
              style={{
                border: "none",
                borderTop: "5px solid #5c0655",
                borderRadius: "10px",
              }}
            >
              {/* Imagen del convenio */}
              <div className="col-lg-6">
                <img
                  src={convenioImg}
                  alt="Convenio destacado"
                  className="img-fluid rounded shadow"
                />
              </div>

              {/* Detalles del convenio */}
              <div className="col-lg-6  text-lg-start">
                <h2 className="fw-bold mb-4" style={{ color: "#5c0655" }}>
                  Convenio con Academia de natación "ST"
                </h2>

                <ul className="list-unstyled">
                  <li className="d-flex align-items-start mb-3">
                    <BiCheckCircle className="me-2" size={24} color="#5c0655" />
                    <span>Descuentos en maestrías y diplomados</span>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <BiCheckCircle className="me-2" size={24} color="#5c0655" />
                    <span>Acceso a biblioteca virtual</span>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <BiCheckCircle className="me-2" size={24} color="#5c0655" />
                    <span>Charlas exclusivas para colegiados CMP</span>
                  </li>
                  <li className="d-flex align-items-start mb-3">
                    <BiCheckCircle className="me-2" size={24} color="#5c0655" />
                    <span>Descuentos en maestrías y diplomados</span>
                  </li>
                </ul>

                {/* Botón con enlace externo */}
                <a
                  href="https://www.udep.edu.pe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-4 px-4 py-2"
                  style={{
                    background: "linear-gradient(135deg, #5c0655, #3e104e)",
                    border: "none",
                    borderRadius: "50px",
                  }}
                >
                  Conocer más del convenio
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Convenios;
