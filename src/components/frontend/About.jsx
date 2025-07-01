import heroBg from "@/assets/images/banner.avif";
import Doctor from "@/assets/images/doctor.webp";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const JuntaDirectiva = () => {
  return (
    <>
      <Header />
      <main>
        {/* hero section */}
        <section
          className="hero-section d-flex align-items-center justify-content-center text-center text-white"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "80vh",
            position: "relative",
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0,0,0,.4)" }}
          />
          <div className="container position-relative z-2">
            <h1 className="display-4 fw-bold mb-3">Gestión 2024 – 2027</h1>
            <p className="lead fs-4">
              “Comprometidos con la ética, la excelencia y la vocación de
              servicio”
            </p>
          </div>
        </section>

        {/* Junta Directiva */}
        <section className="py-5 bg-light" id="junta">
          <div className="container">
            {/* encabezado + filtro */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
              <h2 className="fw-bold mb-3 mb-md-0" style={{ color: "#5c0655" }}>
                Miembros de la gestión 2024 - 2027
              </h2>

              <select
                className="form-select shadow-sm w-auto"
                defaultValue="2024-2026"
                style={{ minWidth: "200px", borderColor: "#5c0655" }}
              >
                <option value="2024-2026">Gestión 2024 – 2026</option>
                <option value="2022-2024">Gestión 2022 – 2024</option>
                <option value="2020-2022">Gestión 2020 – 2022</option>
              </select>
            </div>

            {/* grid de miembros */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              <div className="col">
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={Doctor}
                    className="card-img-top object-fit-cover"
                    alt="Dr. Juan Pérez"
                    style={{ height: "280px" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="fw-bold mb-1" style={{ color: "#5c0655" }}>
                      Dr. Juan Pérez
                    </h5>
                    <p className="text-muted mb-0">Presidente</p>
                  </div>
                </div>
              </div>
              {/* …más miembros */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default JuntaDirectiva;
