import type { DailyForecast } from "../utils/weatherHelpers";
import { formatWeekday, formatDayMonth } from "../utils/weatherHelpers";

interface ForecastCardProps {
  daily: DailyForecast;
  timezone: number;
}

export function ForecastCard({ daily, timezone }: ForecastCardProps) {
  const { representative, maxTemp, minTemp } = daily;

  return (
    <div className="forecast-card">
      <p className="forecast-card_weekday">{formatWeekday(representative.dt, timezone)}</p>
      <p className="forecast-card_day-month">{formatDayMonth(representative.dt, timezone)}</p>
      <img
        src={`https://openweathermap.org/img/wn/${representative.weather[0].icon}.png`}
        alt={representative.weather[0].description}
        className="forecast-card_icon"
      />
      <p className="forecast-card_temp-range">
        <div className="forecast-card_temp-max">
          <span>{Math.round(maxTemp)}°C</span>
        </div>
        <div className="forecast-card_temp-min">
          <span>{Math.round(minTemp)}°C</span>
        </div>
      </p>
      <p className="forecast-card_description">{representative.weather[0].description}</p>
      <p className="forecast-card_wind">{representative.wind.speed.toFixed(1)} m/s</p>
    </div>
  );
}