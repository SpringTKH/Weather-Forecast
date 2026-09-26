import type { WeatherData, ForecastItem } from "../types/weather";

// Filter the 40 3-hour weather forecast items to get one item per day
// Take the 12:00:00 item as the representative for each day
export function getDailyForecasts(list: ForecastItem[]): ForecastItem[] {
  const noonForecasts = list.filter((item) => item.dt_txt.includes("12:00:00"));
  return noonForecasts.slice(0, 5);
}

// Take the nearest 8 items (8 * 3 hours = 24 hours) for the line chart
export function getNext24Hours(list: ForecastItem[]): ForecastItem[] {
  return list.slice(0, 8);
}

// Convert "2026-09-25 12:00:00" to "12:00" for chart X-axis
export function formatHour(dtTxt: string): string {
  const date = new Date(dtTxt);
  const hours = date.getHours().toString().padStart(2, "0");
  return `${hours}:00`;
}

// Convert "2026-09-25 12:00:00" to "Fri, 25 Sep" in a more readable format
export function formatDate(dtTxt: string): string {
  const date = new Date(dtTxt);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Calculate the local time of the city, precise to minutes
// Principle: dt is the UTC unix timestamp, timezone is the offset of the city relative to UTC
// Adding the two gives the unix timestamp corresponding to the local time of the city
export function getLocalTime(weather: WeatherData): string {
  const localMillis = (weather.dt + weather.timezone) * 1000;
  const localDate = new Date(localMillis);
 
  // Key: Use UTC methods instead of local methods
  // Because localMillis is already an adjusted "fake" timestamp
  // If program uses [getHours()/getMinutes()] (local methods), 
  // It will be converted again by the user's computer timezone, which will cause the numbers to be wrong
  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");
 
  return `${hours}:${minutes}`;
}

// OpenWeatherMap's AQI is a private 1-5 rating system, not a universal 0-500 scale
// Here we convert the number to the corresponding text label
const AQI_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};
 
export function getAqiLabel(aqi: 1 | 2 | 3 | 4 | 5 | null): string {
  if (aqi === null) return "Unknown";
  return AQI_LABELS[aqi];
}