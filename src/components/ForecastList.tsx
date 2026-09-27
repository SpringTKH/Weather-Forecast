import type { DailyForecast } from "../utils/weatherHelpers";
import { ForecastCard } from "./ForecastCard";

interface ForecastListProps {
  items: DailyForecast[];
  timezone: number;
}

export function ForecastList({ items, timezone }: ForecastListProps) {
  return (
    <div className="forecast-list">
      {items.map((daily) => (
        <ForecastCard key={daily.representative.dt} daily={daily} timezone={timezone} />
      ))}
    </div>
  );
}