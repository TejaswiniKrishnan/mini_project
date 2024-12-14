import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // Renamed to `userName` for consistency
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      fetchUserData(storedEmail); // Fetch user data if email is found in sessionStorage
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/${email}`);
      if (response.data) {
        setIsLoggedIn(true);
        setUserName(response.data.name); // Assuming `firstname` is the name you want
        setEmail(email);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      // Handle errors accordingly, e.g., clear sessionStorage if user data cannot be fetched
      sessionStorage.removeItem("email");
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  const login = async (email, password) => {
        await fetchUserData(email);
        setIsLoggedIn(true);
        setUserName(userName); // Assuming `firstname` is returned by the backend
        setEmail(email);
        sessionStorage.setItem("email", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setEmail("");
    sessionStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
