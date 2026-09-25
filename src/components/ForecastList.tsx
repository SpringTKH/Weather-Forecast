import type { ForecastItem } from "../types/weather";
import { ForecastCard } from "./ForecastCard";
 
export function ForecastList({ items }: { items: ForecastItem[] }) {
  return (
    <div className="forecast-list">
      {items.map((item) => (
        <ForecastCard key={item.dt} item={item} />
      ))}
    </div>
  );
}