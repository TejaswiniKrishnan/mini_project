import React, { useState, useEffect } from "react";

const accidentProneZones = [
  { lat: 10.963, lon: 76.9987 }, // Kurichi Kulam
  { lat: 10.9973, lon: 76.9617 }, // Trichy Road Flyover
  { lat: 11.2928, lon: 77.248 }, // Nanjundapuram Road Flyover landing area
  { lat: 11.0162, lon: 77.0159 }, // Anna Silai on Avinashi Road
  { lat: 11.0036, lon: 77.0134 }, // Peelamedu College Area
  { lat: 11.0505, lon: 77.0282 }, // SITRA
  { lat: 10.9969, lon: 77.0301 }, // KMCH Junction Area
  { lat: 11.0152, lon: 77.0243 }, // Goldwins
  { lat: 10.9956, lon: 77.0154 }, // Vasantha Mill on Trichy Road
  { lat: 10.9614, lon: 77.0069 }, // Singanallur Bus Stand Junction
  { lat: 10.9858, lon: 77.0355 }, // Amman Kulam Bus Stop on Sathy Road
  { lat: 11.0133, lon: 77.0241 }, // Sungam Classic Road Junction near Valankulam
  { lat: 10.935737, lon: 76.954804 }, // Sungam Classic Road Junction near Valankulam
];

// Function to calculate distance between two lat/lon points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

const AccidentAlert = () => {
  const [isAlarmOn, setIsAlarmOn] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [audio] = useState(new Audio("./alarm.mp3")); // Path to your alarm sound

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;

          // Check if the user is near any accident-prone zone
          for (const zone of accidentProneZones) {
            const distance = calculateDistance(
              userLat,
              userLon,
              zone.lat,
              zone.lon
            );
            if (distance < 0.5) {
              // 500 meters radius (adjust as needed)
              if (!isAlarmOn) {
                audio.play();
                setIsAlarmOn(true);
                setIsPopupVisible(true); // Show popup
              }
              break;
            }
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [isAlarmOn, audio]);

  const stopAlarm = () => {
    audio.pause();
    setIsAlarmOn(false);
    setIsPopupVisible(false); // Hide the popup
  };

  return (
    <div>
      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffcc00",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            color: "#333",
            fontSize: "18px",
            zIndex: 1000,
          }}
        >
          <p>Warning: High-Risk Zone Ahead!</p>
          <button
            onClick={stopAlarm}
            style={{
              backgroundColor: "#ff6600",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Turn Off Alarm
          </button>
        </div>
      )}
    </div>
  );
};

export default AccidentAlert;
