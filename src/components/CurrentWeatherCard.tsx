import type { WeatherData } from "../types/weather";
import { getLocalTime } from "../utils/weatherHelpers";

export function CurrentWeatherCard({ weather }: { weather: WeatherData }) {
  return (
    <div className="weather-card">
      <div className="weather-card_header">
        <div>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p className="weather-card_local-time">
            As of {getLocalTime(weather)} local time
          </p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="weather-card_icon"
        />
      </div>

      <p className="weather-card_temp">{Math.round(weather.main.temp)}°C</p>
      <p className="weather-card_description">{weather.weather[0].description}</p>

      <div className="weather-card_details">
        <div className="weather-card_detail-item">
          <span className="label">Feels like</span>
          <span className="value">{Math.round(weather.main.feels_like)}°C</span>
        </div>
        <div className="weather-card_detail-item">
          <span className="label">Humidity</span>
          <span className="value">{weather.main.humidity}%</span>
        </div>
        <div className="weather-card_detail-item">
          <span className="label">Wind</span>
          <span className="value">{weather.wind.speed} m/s</span>
        </div>
      </div>
    </div>
  );
}