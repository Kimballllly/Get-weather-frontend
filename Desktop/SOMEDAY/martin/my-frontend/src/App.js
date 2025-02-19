import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://get-weather-utiw.onrender.com/weather/city";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/${city}/en`);
      
      if (!response.data || !response.data.weather) {
        throw new Error("Invalid API response.");
      }

      setWeather(response.data);
    } catch (err) {
      setError("City not found or API error.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city.trim()) {
      const delayDebounceFn = setTimeout(() => {
        getWeather();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [city]);

  return (
    <div className="app-container">
      <h1 className="app-title">🌦️ Weather Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button onClick={getWeather} className="search-button">Search</button>
      </div>

      {loading && <p className="loading">Fetching weather...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2 className="location">📍 {weather.location}</h2>
          <img src={weather.weather.icon_url} alt="Weather icon" className="weather-icon" />
          <p className="condition">{weather.weather.condition} - {weather.weather.description}</p>

          <div className="temp-container">
            <p>🌡️ Current: {weather.temperature.current}°C</p>
            <p>🔻 Min: {weather.temperature.min}°C</p>
            <p>🔺 Max: {weather.temperature.max}°C</p>
            <p>🥶 Feels Like: {weather.temperature.feels_like}°C</p>
          </div>

          <div className="extra-info">
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>🌬️ Wind: {weather.wind.speed} at {weather.wind.direction}</p>
            <p>👁️ Visibility: {weather.visibility} km</p>
            <p>📈 Pressure: {weather.pressure} hPa</p>
          </div>

          <div className="sun-times">
            <p>🌅 Sunrise: {weather.sunrise}</p>
            <p>🌇 Sunset: {weather.sunset}</p>
          </div>

          <p className="last-updated">🕒 Last updated: {weather.last_updated}</p>
        </div>
      )}
    </div>
  );
}

export default App;
