import axios from "axios";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    bloodGroup: "",
    driver: "",
  });
  const [certificatesValidated, setCertificatesValidated] = useState({
    emt: false,
    license: false,
    idCard: false,
  });

  const { name, email, password, phoneNumber, bloodGroup, driver } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Check if all certificates are validated
    if (
      (role === "ambulance-driver" &&
        certificatesValidated.emt &&
        certificatesValidated.license &&
        certificatesValidated.idCard) ||
      role === "user"
    ) {
      try {
        await axios.post("http://localhost:8080/api/register", user);
        navigate("/"); // Go to login page
      } catch (err) {
        console.error("Error registering user", err);
      }
    } else {
      toast.warning("Please upload and validate all required certificates.");
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setUser({
      ...user,
      driver: selectedRole === "ambulance-driver" ? "ambulance-driver" : "user",
    });
  };

  const handleFileChange = (e, checkType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;

        Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        })
          .then(({ data: { text } }) => {
            // Handle the specific validation based on the checkType
            console.log("Check Type:", checkType); // Log checkType value to verify if it's what you expect
            console.log("Extracted Text:", text);
            if (checkType === "emt") {
              const emergencyTerms = [
                "emergency",
                "medical services",
                "emt",
                "emergency medical technician",
              ];
              if (
                emergencyTerms.some((term) => text.toLowerCase().includes(term))
              ) {
                toast.success("EMT certificate validated successfully!");
                setCertificatesValidated((prev) => ({ ...prev, emt: true }));
              } else {
                toast.warning(
                  "EMT certificate validation failed: Required information not found."
                );
                setCertificatesValidated((prev) => ({ ...prev, emt: false }));
              }
            } else if (checkType === "license") {
              if (
                text.toLowerCase().includes(name.toUpperCase()) ||
                text.includes("Driving Licence")
              ) {
                toast.success("Driving License validated successfully!");
                setCertificatesValidated((prev) => ({
                  ...prev,
                  license: true,
                }));
              } else {
                toast.warning("License validation failed");
                setCertificatesValidated((prev) => ({
                  ...prev,
                  license: false,
                }));
              }
            } else if (checkType === "idCard") {
              const emergencyTerms = [
                "id card",
                "emergency",
                "medical services",
              ];
              if (
                text.toLowerCase().includes(name.toLowerCase()) ||
                text.includes("Date")
              ) {
                toast.success("ID Card validated successfully!");
                setCertificatesValidated((prev) => ({ ...prev, idCard: true }));
              } else {
                toast.warning(
                  "ID Card validation failed: Required information not found."
                );
                setCertificatesValidated((prev) => ({
                  ...prev,
                  idCard: false,
                }));
              }
            }
          })
          .catch((err) => {
            console.error("OCR Error: ", err);
            toast.error("Error during OCR processing");
          });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={onSubmit}>
          {/* Input fields for Name, Email, Phone, etc. */}
          <div style={styles.inputField}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onInputChange}
              placeholder="Enter your name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputField}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onInputChange}
              placeholder="Enter your email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputField}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onInputChange}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputField}>
            <label style={styles.label}>Phone Number</label>
            <PhoneInput
              country={"us"}
              value={phoneNumber}
              onChange={(value) => setUser({ ...user, phoneNumber: value })} // directly update phoneNumber
              inputStyle={styles.phoneInput}
              buttonStyle={styles.phoneButton}
              required
            />
          </div>

          <div style={styles.inputField}>
            <label style={styles.label}>Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={bloodGroup}
              onChange={onInputChange}
              placeholder="Enter your blood group"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.radioContainer}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={handleRoleChange}
                style={styles.radioInput}
              />
              User
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="ambulance-driver"
                checked={role === "ambulance-driver"}
                onChange={handleRoleChange}
                style={styles.radioInput}
              />
              Ambulance Driver
            </label>
          </div>

          {/* Additional fields based on user or driver role */}
          {role === "ambulance-driver" && (
            <>
              {/* EMT Certificate */}
              <div style={styles.inputField}>
                <label style={styles.label}>EMT Certificate</label>
                <input
                  type="file"
                  name="emtCertificate"
                  required
                  style={styles.fileInput}
                  onChange={(e) => handleFileChange(e, "emt")}
                />
              </div>

              {/* Driving License */}
              <div style={styles.inputField}>
                <label style={styles.label}>Driving License</label>
                <input
                  type="file"
                  name="drivingLicense"
                  required
                  style={styles.fileInput}
                  onChange={(e) => handleFileChange(e, "license")}
                />
              </div>

              {/* ID Card */}
              <div style={styles.inputField}>
                <label style={styles.label}>ID Card</label>
                <input
                  type="file"
                  name="idCard"
                  required
                  style={styles.fileInput}
                  onChange={(e) => handleFileChange(e, "idCard")}
                />
              </div>
            </>
          )}

          <button type="submit" style={styles.registerButton}>
            Register
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
    alignItems: "flex-start", // Align items to the top
    height: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden", // Prevent scrollbars on the container itself
    padding: "20px", // Add some padding so the form doesn't touch the edges
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "400px",
    maxHeight: "calc(100vh - 40px)", // Prevent the card from growing too tall
    overflowY: "scroll", // Enable vertical scrolling without a visible scrollbar
    scrollbarWidth: "none", // For Firefox, hides the scrollbar
    "-ms-overflow-style": "none", // For Internet Explorer
  },
  title: {
    color: "maroon",
    marginBottom: "20px",
  },
  inputField: {
    marginBottom: "20px",
    position: "relative",
  },
  label: {
    display: "block",
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "maroon",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  fileInput: {
    padding: "10px",
    border: "none",
  },
  phoneInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  radioContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  radioLabel: {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    color: "maroon",
  },
  radioInput: {
    marginRight: "10px",
  },
  registerButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "maroon",
    color: "#fff",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;
