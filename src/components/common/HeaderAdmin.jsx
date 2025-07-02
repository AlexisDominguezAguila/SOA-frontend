import PropTypes from "prop-types";
const HeaderAdmin = ({ toggleSidebar }) => {
  // Manejar clic fuera del dropdown para cerrarlo

  return (
    <header className="header-admin  px-4 py-3 d-flex justify-content-between align-items-center">
      {/* Botón hamburguesa */}
      <button className="btn d-lg-none" onClick={toggleSidebar}>
        <i className="bi bi-list fs-4 text-purple"></i>
      </button>
    </header>
  );
};

HeaderAdmin.propTypes = { toggleSidebar: PropTypes.func.isRequired };
export default HeaderAdmin;
