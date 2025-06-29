import BannerNew from "@/assets/images/NoticiaEjp.webp";
import NoticiaCMP from "@/assets/images/NoticiaEjp.webp";
import Noticia2 from "@/assets/images/about.webp";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const News = () => {
  return (
    <>
      <Header />
      <main>
        {/* Hero here */}
        <section
          className="hero-section d-flex align-items-center justify-content-center text-center text-white"
          style={{
            backgroundImage: `url(${BannerNew})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "80vh",
            position: "relative",
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 1,
            }}
          ></div>

          <div
            className="container position-relative z-2"
            style={{ zIndex: 2 }}
          >
            <h1 className="display-4 fw-bold mb-3">
              Innovadora Tecnología Revoluciona la Industria de Comunicaciones
            </h1>
          </div>
          <button
            className="btn btn-primary position-absolute bottom-0 start-50 translate-middle-x mb-4"
            style={{ zIndex: 3 }}
            onClick={() => {
              const section = document.querySelector(".news-content");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Ver Noticias
          </button>
        </section>

        {/* News content section */}
        <section className="news-content py-5" id="noticias">
          <div className="container">
            {/* modelo 1 de noticia */}
            <div
              className="card mb-4 shadow-sm border-0 position-relative"
              style={{ borderTop: "5px solidrgb(85, 11, 85)" }}
            >
              <div
                className="row g-0"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  borderTop: "5px solid #800080",
                }}
              >
                {/* Columna izquierda: imagen, título y botón */}
                <div className="col-md-5 d-flex flex-column align-items-center justify-content-center p-3">
                  <img
                    src={NoticiaCMP}
                    alt="Noticia 1"
                    className="img-fluid w-100 mb-3 rounded"
                    style={{ objectFit: "cover", height: "auto" }}
                  />

                  <a
                    href="https://www.youtube.com/watch?v=tNTVLUtip4o"
                    className="btn mt-2 text-white"
                    target="_blank"
                    style={{
                      backgroundColor: "#800080",
                      border: "none",
                      borderRadius: "50px",
                      padding: "0.5rem 1.5rem",
                      fontWeight: "500",
                      width: "100%",
                    }}
                  >
                    Ver detalles
                  </a>
                </div>

                {/* Columna derecha: fecha, descripción, viñetas */}
                <div className="col-md-7 p-4">
                  {/* Fecha con ícono */}
                  <div className="mb-2 text-muted">
                    <i className="bi bi-calendar-event me-2"></i>
                    <small>12 de junio de 2024</small>
                  </div>
                  {/* Título de la noticia */}
                  <h5
                    className="card-title text-center fw-bold text-dark"
                    style={{
                      color: "#800080",
                      fontSize: "2rem",
                    }}
                  >
                    Innovadora Tecnología Revoluciona la Industria medica en
                    Piura -CMP
                  </h5>

                  {/* Descripción */}
                  <p
                    className="card-text text-secondary"
                    style={{ fontSize: "1.1rem", textAlign: "justify" }}
                  >
                    Breve descripción de la noticia. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Proin ac neque nec nisi cursus
                    porta a nec erat. Suspendisse at nisl et purus fringilla
                    tincidunt. Contrary to popular belief, Lorem Ipsum is not
                    simply random text. It has roots in a piece of classical Lat
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Laborum, necessitatibus aliquam quam ad doloribus quae
                    corrupti ipsum quas ex maiores praesentium officia odio
                    rerum aspernatur cumque fugiat modi dicta adipisci.
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Totam explicabo minus magnam sunt, exercitationem quisquam
                    accusamus quos voluptate aspernatur nemo numquam fugiat
                    adipisci hic omnis? Quia molestias nobis mollitia minus.
                  </p>

                  {/* Viñetas con iconos */}
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i
                        className="bi bi-cpu me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Tecnología
                    </li>
                    <li className="mb-2">
                      <i
                        className="bi bi-cpu me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Tecnología médica avanzada
                    </li>
                    <li className="mb-2">
                      <i
                        className="bi bi-activity me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Innovación en neurociencia
                    </li>
                    <li className="mb-2">
                      <i
                        className="bi bi-diagram-3 me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Aplicaciones en genética
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* modelo 2 de noticia */}
            <div
              className="card mb-4 shadow-sm border-0 position-relative"
              style={{ borderTop: "5px solidrgb(85, 11, 85)" }}
            >
              <div
                className="row g-0"
                style={{
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  borderTop: "5px solid #800080",
                }}
              >
                {/* Columna izquierda: imagen, título y botón */}
                <div className="col-md-5 d-flex flex-column  p-3">
                  {/* Fecha con ícono */}
                  <div className="mb-2 text-muted">
                    <i className="bi bi-calendar-event me-2"></i>
                    <small>12 de junio de 2024</small>
                  </div>
                  {/* Título de la noticia */}
                  <h5
                    className="card-title text-center fw-bold text-dark"
                    style={{
                      color: "#800080",
                      fontSize: "2rem",
                      textAlign: "left",
                    }}
                  >
                    Innovadora Tecnología Revoluciona la Industria medica en
                    Piura -CMP
                  </h5>
                  {/* Descripción */}
                  <p
                    className="card-text text-secondary"
                    style={{
                      fontSize: "1.1rem",
                      textAlign: "justify",
                      flexGrow: 1,
                    }}
                  >
                    Breve descripción de la noticia. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Proin ac neque nec nisi cursus
                    porta a nec erat. Suspendisse at nisl et purus fringilla
                    tincidunt. Contrary to popular belief, Lorem Ipsum is not
                    simply random text. It has roots in a piece of classical Lat
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Laborum, necessitatibus aliquam quam ad doloribus quae
                    corrupti ipsum quas ex maiores praesentium officia odio
                    rerum aspernatur cumque fugiat modi dicta adipisci.
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Totam explicabo minus magnam sunt, exercitationem quisquam
                    accusamus quos voluptate aspernatur nemo numquam fugiat
                    adipisci hic omnis? Quia molestias nobis mollitia minus.
                  </p>

                  <a
                    href="https://www.youtube.com/watch?v=tNTVLUtip4o"
                    className="btn mt-2 text-white"
                    target="_blank"
                    style={{
                      backgroundColor: "#800080",
                      border: "none",
                      borderRadius: "50px",
                      padding: "0.5rem 1.5rem",
                      fontWeight: "500",
                      width: "100%",
                    }}
                  >
                    Ver detalles
                  </a>
                </div>

                {/* Columna derecha: fecha, descripción, viñetas */}
                <div className="col-md-7 p-4">
                  <img
                    src={Noticia2}
                    alt="Noticia 1"
                    className="img-fluid w-100 mb-3 rounded"
                    style={{
                      objectFit: "cover",
                      height: "auto",
                      width: "100%",
                      maxHeight: "500px",
                    }}
                  />

                  {/* Viñetas con iconos */}
                  <ul
                    className="list-unstyled"
                    style={{
                      textAlign: "left",
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <li className="mb-2">
                      <i
                        className="bi bi-cpu me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Tecnología médica avanzada
                    </li>
                    <li className="mb-2">
                      <i
                        className="bi bi-cpu me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Tecnología
                    </li>
                    <li className="mb-2">
                      <i
                        className="bi bi-activity me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Innovación en neurociencia
                    </li>
                    <li className="mb-2">
                      <i
                        className="bi bi-diagram-3 me-2"
                        style={{ color: "#800080" }}
                      ></i>
                      Aplicaciones en genética
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
export default News;
