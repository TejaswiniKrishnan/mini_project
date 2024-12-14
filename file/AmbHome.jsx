import React from "react";
import { Link } from "react-router-dom";
import "./Amb.css";
import rescueImage from "./rescue.png";

const AmbHome = () => {
  const accidentPlaces = [
    {
      id: 1,
      location: "Gandhi Puram",
      severity: "High",
      time: "40 minutes ago",
    },
    {
      id: 2,
      location: "Mettupalayam",
      severity: "High",
      time: "35 minutes ago",
    },
    {
      id: 2,
      location: "Ariyalur",
      severity: "Medium",
      time: "35 minutes ago",
    },
    {
      id: 2,
      location: "Periyur",
      severity: "Medium",
      time: "35 minutes ago",
    },
    {
      id: 2,
      location: "Chinnor",
      severity: "Medium",
      time: "30 minutes ago",
    },
    {
      id: 2,
      location: "Silambur",
      severity: "Medium",
      time: "30 minutes ago",
    },
    {
      id: 2,
      location: "Vadavalli",
      severity: "Medium",
      time: "26 minutes ago",
    },
    {
      id: 2,
      location: "Vinaiyur",
      severity: "Medium",
      time: "25 minutes ago",
    },
    {
      id: 2,
      location: "Town hall",
      severity: "Medium",
      time: "25 minutes ago",
    },
    {
      id: 2,
      location: "Vellore",
      severity: "Medium",
      time: "23 minutes ago",
    },
    {
      id: 3,
      location: "Ariyalur",
      severity: "Low",
      time: "20 minutes ago",
    },
    {
      id: 4,
      location: "Perur",
      severity: "Low",
      time: "5 minutes ago",
    },
  ];

  const styles = {
    inProgress: {
      background: "linear-gradient(135deg, #f7e967, #ffc107)",
    },
    emergency: {
      background: "linear-gradient(135deg, #ff6f61, #d43f3a)",
    },
    justFound: {
      background: "linear-gradient(135deg, #5cb85c, #4cae4c)",
    },
    cardContainer: {
      padding: "20px",
      borderRadius: "15px",
      margin: "15px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      overflow: "hidden",
      animation: "slideIn 0.8s ease-out",
    },
    statusBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      padding: "8px 12px",
      borderRadius: "20px",
      fontSize: "0.9em",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    },
  };

  return (
    <div className="apps">
      <nav className="navbar">
        <h1>Safe Track</h1>
        <ul>
          <li>
            <Link to="/amb">Home</Link>
          </li>
          <li>
            <Link to="/sign">Sign Up</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <center>
        <br></br>
        <br></br>
        <h1>EMERGENCY CASES</h1>
      </center>
      <div className="card-sections">
        {accidentPlaces.map((place, index) => {
          let cardStyle = {};
          let badgeStyle = {};
          let textStyleClass = "";

          if (index < 2) {
            cardStyle = { ...styles.cardContainer, ...styles.inProgress };
            badgeStyle = styles.statusBadge;
            textStyleClass = "inProgressText";
          } else if (index < 5) {
            cardStyle = { ...styles.cardContainer, ...styles.emergency };
            badgeStyle = styles.statusBadge;
            textStyleClass = "emergencyText";
          } else {
            cardStyle = { ...styles.cardContainer, ...styles.justFound };
            badgeStyle = styles.statusBadge;
            textStyleClass = "justFoundText";
          }

          return (
            <div
              className={`card ${textStyleClass}`}
              style={cardStyle}
              key={place.id}
            >
              <div style={badgeStyle}>
                {index < 2
                  ? "In Progress"
                  : index < 5
                  ? "Emergency"
                  : "Just Found"}
              </div>
              <br></br>
              <br></br>
              <h2>{place.location}</h2>
              <p>Severity: {place.severity}</p>
              <p>Reported: {place.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmbHome;
