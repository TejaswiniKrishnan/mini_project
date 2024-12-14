import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

const RealtimeLocationTracker = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState("");
  const [routeControl, setRouteControl] = useState(null);
  const [isAlarmOn, setIsAlarmOn] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [alarmAudio, setAlarmAudio] = useState(null); // to store alarm audio reference

  // Accident-prone zones example - coordinates for the risky sections
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
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
  };

  useEffect(() => {
    const initMap = L.map("map").setView([10.9717, 77.0245], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(initMap);

    setMap(initMap);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support geolocation!");
      return;
    }

    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude });
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    };

    const intervalId = setInterval(updatePosition, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (map && position) {
      const { latitude, longitude } = position;
      map.setView([latitude, longitude], map.getZoom());

      // Check if the user is near any accident-prone zone
      for (const zone of accidentProneZones) {
        const distance = calculateDistance(
          latitude,
          longitude,
          zone.lat,
          zone.lon
        );
        if (distance < 0.5) {
          if (!isAlarmOn) {
            setIsAlarmOn(true);
            setIsPopupVisible(true); // Show popup
            playAlarm(); // Trigger alarm sound
          }
          break;
        }
      }
    }
  }, [map, position, isAlarmOn]);

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const calculateRoute = () => {
    if (map && position && destination) {
      const { latitude, longitude } = position;

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const destinationLat = parseFloat(data[0].lat);
            const destinationLon = parseFloat(data[0].lon);

            if (routeControl) {
              routeControl.getPlan().setWaypoints([]); // Remove previous waypoints
              map.removeControl(routeControl);
            }

            const startIcon = L.icon({
              iconUrl: "/car.png", // Path to your car icon
              iconSize: [52, 52],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            const endIcon = L.icon({
              iconUrl: "/map-pin.png", // Path to your destination pin icon
              iconSize: [52, 52],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            const newRouteControl = L.Routing.control({
              waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(destinationLat, destinationLon),
              ],
              routeWhileDragging: true,
              lineOptions: {
                styles: [{ color: "#176fdb", opacity: 0.8, weight: 6 }],
              },
              createMarker: (i, waypoint) => {
                return i === 0
                  ? L.marker(waypoint.latLng, { icon: startIcon })
                  : L.marker(waypoint.latLng, { icon: endIcon });
              },
            }).addTo(map);

            setRouteControl(newRouteControl);

            // Draw accident-prone zones
            accidentProneZones.forEach((zone) => {
              L.circle([zone.lat, zone.lon], {
                color: "red",
                fillColor: "#f03",
                fillOpacity: 0.5,
                radius: 500,
              })
                .addTo(map)
                .bindPopup("Accident-Prone Zone");
            });
          } else {
            alert("Destination not found.");
          }
        })
        .catch((error) => console.error("Geocoding error:", error));
    }
  };

  const playAlarm = () => {
    if (!alarmAudio) {
      const audio = new Audio("/alarm.mp3"); // Path to your alarm sound
      audio.loop = true; // Make the alarm loop continuously
      setAlarmAudio(audio);
      audio.play();
    }
  };

  const stopAlarm = () => {
    if (alarmAudio) {
      alarmAudio.pause(); // Stop the alarm sound
      alarmAudio.currentTime = 0; // Reset the audio to the beginning
    }
    setIsAlarmOn(false);
    setIsPopupVisible(false); // Hide the popup
  };

  return (
    <div>
      <div
        style={{
          padding: "20px",
          background: "linear-gradient(to right, #333, #222)",
          color: "#ff6600",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
          margin: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={destination}
          onChange={handleDestinationChange}
          placeholder="Enter destination"
          style={{
            padding: "12px 20px",
            width: "75%",
            marginRight: "20px",
            borderRadius: "30px",
            border: "2px solid #ff6600",
            backgroundColor: "#333",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "500",
            letterSpacing: "0.5px",
            outline: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease-in-out",
          }}
        />
        <button
          onClick={calculateRoute}
          style={{
            padding: "12px 20px",
            borderRadius: "30px",
            backgroundColor: "#ff6600",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Get Route
        </button>
      </div>

      <div id="map" style={{ height: "600px", width: "100%" }}></div>

      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ff6600",
            color: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
          }}
        >
          <p>Warning: You are near an accident-prone zone!</p>
          <button
            onClick={stopAlarm}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fff",
              color: "#ff6600",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Stop Alarm
          </button>
        </div>
      )}
    </div>
  );
};

export default RealtimeLocationTracker;
