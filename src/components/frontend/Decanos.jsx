import heroBg from "@/assets/images/BannerDecano.jpg";
import Decano from "@/assets/images/doctor.webp";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const decanos = [
  {
    nombre: "Dr. Juan Pérez",
    periodo: "2010 – 2014",
    imagen: Decano,
  },
  {
    nombre: "Dra. María López",
    periodo: "2014 – 2018",
    imagen: Decano,
  },
];

const Decanos = () => {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section
          className="hero-section position-relative overflow-hidden"
          style={{
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Banner de fondo morado */}
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

          {/* Overlay para mejorar legibilidad */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(75, 0, 130, 0.4)",
              zIndex: 2,
            }}
          ></div>

          {/* Contenido principal */}
          <div className="container position-relative z-3 py-5">
            <div className="row align-items-center">
              {/* Columna de la foto del decano */}
              <div className="col-lg-5 mb-5 mb-lg-0">
                <div className="d-flex justify-content-center">
                  <div
                    className="position-relative"
                    style={{
                      maxWidth: "350px",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={Decano}
                      alt="Decano actual"
                      className="img-fluid rounded-circle shadow-lg"
                      style={{
                        border: "5px solid white",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                    {/* Elemento decorativo */}
                    <div
                      className="position-absolute bottom-0 end-0 bg-warning rounded-circle"
                      style={{
                        width: "60px",
                        height: "60px",
                        transform: "translate(15px, 15px)",
                        zIndex: 4,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Columna de texto */}
              <div className="col-lg-7 text-center text-lg-start text-white">
                <h1 className="display-2 fw-bold mb-3">Dr. Juan Pérez</h1>
                <div
                  className="position-relative mb-4"
                  style={{ maxWidth: "300px", margin: "0 auto" }}
                >
                  <h2 className="fs-1 mb-0">Decano</h2>
                  <div
                    className="position-absolute bottom-0 left-0 w-100 bg-warning"
                    style={{
                      height: "4px",
                      transform: "translateY(10px)",
                    }}
                  ></div>
                </div>
                <p className="fs-2 mb-5">2024 - 2027</p>
              </div>
            </div>
          </div>

          {/* Indicador de scroll */}
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

        <section className="py-5 bg-light">
          <div className="container py-5">
            {/* Encabezado */}
            <div className="row mb-5">
              <div className="col-md-8 mx-auto text-center">
                <h2 className="mb-3">Sección de decanos históricos</h2>
                <p className="lead">
                  Conoce a quienes dirigieron nuestro colegio profesional a lo
                  largo del tiempo
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="row">
              {decanos.map((d, i) => (
                <div className="col-md-4 mb-4" key={i}>
                  <div className="card h-100 shadow">
                    <img
                      src={d.imagen}
                      className="card-img-top"
                      alt={d.nombre}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{d.nombre}</h5>
                      <p className="card-text text-muted">{d.periodo}</p>
                    </div>
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

export default Decanos;
