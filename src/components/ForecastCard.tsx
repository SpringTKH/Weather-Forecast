import type { ForecastItem } from "../types/weather";
import { formatDate } from "../utils/weatherHelpers";
 
export function ForecastCard({ item }: { item: ForecastItem }) {
  return (
    <div className="forecast-card">
      <p className="forecast-card_date">{formatDate(item.dt_txt)}</p>
      <img
        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
        alt={item.weather[0].description}
        className="forecast-card_icon"
      />
      <p className="forecast-card_temp">{Math.round(item.main.temp)}°C</p>
      <p className="forecast-card_description">{item.weather[0].description}</p>
    </div>
  );
}