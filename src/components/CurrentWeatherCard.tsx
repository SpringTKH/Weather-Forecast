import type { WeatherData } from "../types/weather";
import { getLocalTime, getAqiLabel, getGmtLabel, formatWindDirection } from "../utils/weatherHelpers";
import { Gauge, UserRound, Compass, ArrowDownToLine, Droplet, Wind } from "lucide-react";

interface CurrentWeatherCardProps {
  weather: WeatherData;
  aqi: 1 | 2 | 3 | 4 | 5 | null;
}

export function CurrentWeatherCard({ weather, aqi }: CurrentWeatherCardProps) {
  return (
    <div className="weather-card">
      <div className="weather-card_header">
        <div>
          <h2>Current Weather</h2>
          <p className="weather-card_local-time">
            As of {getLocalTime(weather)} in {getGmtLabel(weather.timezone)}
          </p>
        </div>
      </div>

      <div className="weather-card_body">
        <p className="weather-card_temp">{Math.round(weather.main.temp)}°C</p>
        <p className="weather-card_description">{weather.weather[0].description}</p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="weather-card_icon"
        />
      </div>
 
      <div className="weather-card_details">
        <div className="weather-card_detail-item">
          <Gauge size={28} className="detail-icon" />
          <span className="label">Wind Speed</span>
          <span className="value">{weather.wind.speed} m/s</span>
        </div>
        <div className="weather-card_detail-item">
          <UserRound size={28} className="detail-icon" />
          <span className="label">Feels like</span>
          <span className="value">{Math.round(weather.main.feels_like)}°C</span>
        </div>
        <div className="weather-card_detail-item">
          <Compass size={28} className="detail-icon" />
          <span className="label">Direction</span>
          <span className="value">{formatWindDirection(weather.wind.deg)}</span>
        </div>
        <div className="weather-card_detail-item">
          <ArrowDownToLine size={28} className="detail-icon" />
          <span className="label">Pressure</span>
          <span className="value">{weather.main.pressure} hPa</span>
        </div>
        <div className="weather-card_detail-item">
          <Droplet size={28} className="detail-icon" />
          <span className="label">Humidity</span>
          <span className="value">{weather.main.humidity}%</span>
        </div>
        <div className="weather-card_detail-item">
          <Wind size={28} className="detail-icon" />
          <span className="label">AQI - Pollution</span>
          <span className="value">{getAqiLabel(aqi)}</span>
        </div>
      </div>
    </div>
  );
}