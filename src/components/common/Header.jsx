// src/components/common/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoCMP from "@/assets/images/logo.png";

const Header = () => {
  return (
    <header>
      <Navbar expand="lg" bg="light" className="py-0">
        <div className="container">
          {/* ===== Logo ===== */}
          <Navbar.Brand as={Link} to="/">
            <img src={logoCMP} alt="Logo CMP Piura" height="60" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* ===== Enlaces simples ===== */}
              <Nav.Link as={NavLink} to="/" end>
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/news">
                Noticias
              </Nav.Link>
              <Nav.Link as={NavLink} to="/cursos">
                Cursos
              </Nav.Link>

              {/* ===== Dropdown ===== */}
              <NavDropdown title="Nosotros" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/#junta">
                  Junta Directiva
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/junta-directiva">
                  Gestión 2024-2027
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={NavLink} to="/decanos">
                  Past Decanos
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Beneficios" id="beneficios-dropdown">
                <NavDropdown.Item as={NavLink} to="/convenios">
                  Convenios
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/tumi">
                  Centros Recreacionales
                </NavDropdown.Item>
              </NavDropdown>

              {/* ===== Enlaces auxiliares ===== */}
              <Nav.Link href="#footer">Contacto</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
