// App.js
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/weather/city/${city}/en`);
      setWeather(response.data);
    } catch (err) {
      setError("City not found or API error.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (city) getWeather();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
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
            <p>🌡️ Current: {weather.temperature.current}</p>
            <p>🔻 Min: {weather.temperature.min}</p>
            <p>🔺 Max: {weather.temperature.max}</p>
            <p>🥶 Feels Like: {weather.temperature.feels_like}</p>
          </div>

          <div className="extra-info">
            <p>💧 Humidity: {weather.humidity}</p>
            <p>🌬️ Wind: {weather.wind.speed} at {weather.wind.direction}</p>
            <p>👁️ Visibility: {weather.visibility}</p>
            <p>📈 Pressure: {weather.pressure}</p>
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
