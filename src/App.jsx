// src/App.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/components/frontend/Home";
import About from "@/components/frontend/About";
import Cursos from "@/components/frontend/Cursos";
import Decanos from "@/components/frontend/Decanos";
import News from "@/components/frontend/News";
import Convenios from "@/components/frontend/Convenios";
import Tumi from "@/components/frontend/Tumi";
import Login from "@/components/backend/Login";

import ScrollToHash from "@/components/common/ScrollToHash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequiereAuth from "@/components/common/RequiereAuth";
{
  /*components Admin*/
}
import Dashboard from "@/components/backend/Dashboard";
import NoticiasAdmin from "./components/backend/NoticiasAdmin";
import CursosAdmin from "./components/backend/CursosAdmin";
import DirectivaDecanos from "./components/backend/DirectivaDecanos";
import BeneficiosAdmin from "./components/backend/BeneficiosAdmin";

import "@/assets/css/style.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/junta-directiva" element={<About />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/decanos" element={<Decanos />} />
          <Route path="/news" element={<News />} />
          <Route path="/convenios" element={<Convenios />} />
          <Route path="/tumi" element={<Tumi />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Routes */}

          <Route
            path="/admin/dashboard"
            element={
              <RequiereAuth>
                <Dashboard />
              </RequiereAuth>
            }
          />
          <Route
            path="/admin/noticias"
            element={
              <RequiereAuth>
                <NoticiasAdmin />
              </RequiereAuth>
            }
          />
          <Route
            path="/admin/cursos"
            element={
              <RequiereAuth>
                <CursosAdmin />
              </RequiereAuth>
            }
          />
          <Route
            path="/admin/decanos"
            element={
              <RequiereAuth>
                <DirectivaDecanos />
              </RequiereAuth>
            }
          />
          <Route
            path="/admin/beneficios"
            element={
              <RequiereAuth>
                <BeneficiosAdmin />
              </RequiereAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
