import { useState, useEffect } from "react";
import heroBg from "@/assets/images/banner.avif";
import Placeholder from "@/assets/images/doctor.webp";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import api from "@/services/api";
import Swal from "sweetalert2";

const JuntaDirectiva = () => {
  const [gestiones, setGestiones] = useState([]);
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGestiones = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/gestiones");
        setGestiones(res.data?.data || []);

        // Seleccionar la primera gestión por defecto
        if (res.data?.data?.length > 0) {
          setSelectedGestion(res.data.data[0]);
        }
      } catch (error) {
        console.error("Error al obtener gestiones:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las gestiones",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGestiones();
  }, []);

  const handleGestionChange = (e) => {
    const gestionId = parseInt(e.target.value);
    const gestion = gestiones.find((g) => g.id === gestionId);
    setSelectedGestion(gestion);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando gestiones...</p>
        </div>
      </div>
    );
  }

  if (!gestiones.length) {
    return (
      <>
        <Header />
        <main>
          <section className="py-5 bg-light">
            <div className="container text-center py-5">
              <h2>No hay gestiones disponibles</h2>
              <p className="lead">
                Actualmente no hay juntas directivas registradas
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero section */}
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
            {selectedGestion && (
              <>
                <h1 className="display-4 fw-bold mb-3">
                  Gestión {selectedGestion.inicio} – {selectedGestion.fin}
                </h1>
                <p className="lead fs-4">
                  {selectedGestion.lema
                    ? `“${selectedGestion.lema}”`
                    : "Comprometidos con la ética, la excelencia y la vocación de servicio"}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Junta Directiva */}
        <section className="py-5 bg-light" id="junta">
          <div className="container">
            {/* Encabezado + filtro */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
              <h2 className="fw-bold mb-3 mb-md-0" style={{ color: "#5c0655" }}>
                {selectedGestion
                  ? `Miembros de la gestión ${selectedGestion.inicio} - ${selectedGestion.fin}`
                  : "Miembros de la junta directiva"}
              </h2>

              {gestiones.length > 1 && (
                <select
                  className="form-select shadow-sm w-auto"
                  value={selectedGestion?.id || ""}
                  onChange={handleGestionChange}
                  style={{ minWidth: "200px", borderColor: "#5c0655" }}
                >
                  {gestiones.map((gestion) => (
                    <option key={gestion.id} value={gestion.id}>
                      Gestión {gestion.inicio} – {gestion.fin}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Grid de miembros */}
            {selectedGestion?.miembros?.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {selectedGestion.miembros.map((miembro) => (
                  <div className="col" key={miembro.id}>
                    <div className="card h-100 border-0 shadow-sm">
                      <img
                        src={miembro.img_url || Placeholder}
                        className="card-img-top object-fit-cover"
                        alt={miembro.nombre}
                        style={{ height: "280px" }}
                        onError={(e) => {
                          e.target.src = Placeholder;
                        }}
                      />
                      <div className="card-body text-center">
                        <h5
                          className="fw-bold mb-1"
                          style={{ color: "#5c0655" }}
                        >
                          {miembro.nombre}
                        </h5>
                        <p className="text-muted mb-0">{miembro.cargo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="empty-state">
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h4>No hay miembros registrados</h4>
                  <p className="text-muted">
                    Esta gestión aún no tiene miembros registrados
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default JuntaDirectiva;
