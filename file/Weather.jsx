import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import "./Weather.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff7f00", // Darker orange color
    },
    secondary: {
      main: "#e65c00", // Another shade if needed
    },
  },
});
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("New York"); // Default city
  const [inputCity, setInputCity] = useState("");

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(
        "https://api.weatherapi.com/v1/forecast.json",
        {
          params: {
            key: "1254025435f84bc7abe100500240611",
            q: city,
            days: 5,
          },
        }
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleCityChange = (e) => {
    setInputCity(e.target.value);
  };

  const handleCitySubmit = () => {
    setCity(inputCity);
    setInputCity("");
  };

  if (!weatherData) {
    return <Typography>Loading...</Typography>;
  }

  const { location, current, forecast } = weatherData;

  return (
    <Box className="weather-container">
      <Paper className="weather-paper" elevation={3}>
        <Typography variant="h5" className="weather-title">
          {`${location.name}, ${location.region}, ${location.country}`}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src={current.condition.icon}
            alt="weather icon"
            className="weather-icon"
          />
          <Typography variant="h3" className="temperature">
            {`${current.temp_c}°C`}
          </Typography>
        </Box>
        <Typography variant="h6" className="condition-text">
          {current.condition.text}
        </Typography>
        <Box className="weather-details">
          <Typography>Wind: {`${current.wind_kph} kph`}</Typography>
          <Typography>Precip: {`${current.precip_mm} mm`}</Typography>
          <Typography>Pressure: {`${current.pressure_mb} mb`}</Typography>
        </Box>
        <Box className="forecast">
          {forecast.forecastday.map((day) => (
            <Box key={day.date} className="forecast-item">
              <Typography>
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </Typography>
              <img
                src={day.day.condition.icon}
                alt="forecast icon"
                className="forecast-icon"
              />
              <Typography>{`${day.day.avgtemp_c}°C`}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          className="city-input"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            label="Enter City"
            variant="outlined"
            value={inputCity}
            onChange={handleCityChange}
            sx={{
              width: "100%", // Makes TextField take the full width of the parent Box
              maxWidth: "400px", // Optional: you can limit the width of the input
            }}
          />

          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="primary" // Use custom primary or secondary color
              onClick={handleCitySubmit}
              sx={{
                mt: 3,
                padding: "12px 24px", // Increase padding for larger button
                fontSize: "1.2rem", // Increase font size for larger text
                height: "50px", // Increase button height
                borderRadius: "8px", // Optional: rounded corners for style
                "&:hover": {
                  backgroundColor: "#ff7f00", // Slightly lighter orange on hover
                },
              }}
            >
              Get Weather
            </Button>
          </ThemeProvider>
        </Box>
      </Paper>
    </Box>
  );
};

export default Weather;
