import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "@/components/backend/context/Auth";
import Logo from "@/assets/images/icono.webp";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.status) {
        toast.error(result.message);
      } else {
        const userInfo = {
          id: result.id,
          token: result.token,
          name: result.name || "Admin",
        };
        login(userInfo);
        reset();
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <h1 style={styles.title}>Iniciar Sesión</h1>
          <p style={styles.subtitle}>Ingrese sus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              <i className="bi bi-envelope-fill" style={styles.icon}></i> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ingrese su Email"
              style={styles.input}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Ingrese un email válido",
                },
              })}
            />
            {errors.email && (
              <span style={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              <i className="bi bi-lock-fill" style={styles.icon}></i> Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingrese su contraseña"
              style={styles.input}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres",
                },
              })}
            />
            {errors.password && (
              <span style={styles.error}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              "Cargando..."
            ) : (
              <>
                <i
                  className="bi bi-box-arrow-in-right"
                  style={styles.buttonIcon}
                ></i>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
  },
  card: {
    maxWidth: "450px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(104, 29, 91, 0.15)",
    padding: "40px 30px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "80px",
    height: "80px",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(104, 29, 91, 0.1)",
    borderRadius: "50%",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#681D5B",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#6c757d",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#495057",
    fontSize: "14px",
  },
  icon: {
    marginRight: "8px",
    color: "#681D5B",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
    display: "block",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#681D5B",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: "10px",
    fontSize: "18px",
  },
};

export default Login;
