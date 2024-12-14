import axios from "axios"; // Import axios for API calls
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook for routing
import logo from "./image.png"; // Import your logo image\
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate(); // Use navigate to route to different pages
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ProceedLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.get(`http://localhost:8080/api/${email}`);
        const user = response.data;

        if (!user) {
          toast.error("User not found");
        } else if (user.password === password) {
          toast.success("Login successful");
          localStorage.setItem("userId", user.id); // Save user ID in localStorage
          login(email);

          if (user.driver === "ambulance-driver") {
            navigate("/amb");
          } else {
            navigate("/user");
          }
        } else {
          toast.error("Invalid credentials");
        }
      } catch (err) {
        toast.error("Login failed due to: " + err.message);
      }
    }
  };

  const validate = () => {
    let result = true;
    if (!email) {
      result = false;
      toast.warning("Please enter username");
    }
    if (!password) {
      result = false;
      toast.warning("Please enter password");
    }
    return result;
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Accident Detection Logo" style={styles.logo} />
        <h2 style={styles.title}>Alert Accident Detection</h2>
        <form onSubmit={ProceedLogin}>
          <div style={styles.inputField}>
            <label style={styles.label}>Email ID</label>
            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputField}>
            <label style={styles.label}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <span
              style={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            onClick={ProceedLogin}
            style={styles.loginButton}
          >
            Login
          </button>
        </form>

        <p style={styles.registerLink}>
          New user?{" "}
          <a href="/register" style={styles.link}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif", // Consistent font style
  },
  card: {
    width: "500px",
    padding: "30px",
    height: "450px",
    borderRadius: "8px",
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  logo: {
    width: "80px",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "maroon",
  },
  inputField: {
    marginBottom: "20px",
    position: "relative", // For password visibility icon positioning
  },
  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  togglePassword: {
    position: "absolute",
    right: "10px",
    top: "38px",
    cursor: "pointer",
  },
  loginButton: {
    backgroundColor: "maroon",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    width: "100%",
    cursor: "pointer",
    fontSize: "16px",
  },
  registerLink: {
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "maroon",
    textDecoration: "none",
  },
};

export default Login;
