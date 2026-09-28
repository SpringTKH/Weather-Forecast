import type { ForecastItem, WeatherData } from "../types/weather";

// "Daily forecast summary": use the noon entry as the representative (for icon, description, etc.)
// But maxTemp/minTemp are the true daily high/low calculated from ALL entries that day,
// not the narrow "3-hour fluctuation" temp_max/temp_min inside a single entry
export interface DailyForecast {
  representative: ForecastItem; // The entry closest to noon — used to display the icon, description, and time
  maxTemp: number; // The highest temperature among all entries for that day
  minTemp: number; // The lowest temperature among all entries for that day
}

// Convert a UTC dt timestamp into a Date object representing the city's local time
function toLocalDate(utcDt: number, timezoneOffsetSeconds: number): Date {
  return new Date((utcDt + timezoneOffsetSeconds) * 1000);
}

// Group the 40 three-hour forecast entries by local date,
// and for each group compute: the representative entry (closest to noon) + the true daily high/low temperature
export function getDailyForecasts(
  list: ForecastItem[],
  timezoneOffsetSeconds: number
): DailyForecast[] {
  const groupedByDate = new Map<string, ForecastItem[]>();

  for (const item of list) {
    const localDate = toLocalDate(item.dt, timezoneOffsetSeconds);
    const dateKey = `${localDate.getUTCFullYear()}-${localDate.getUTCMonth()}-${localDate.getUTCDate()}`;

    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, []);
    }
    groupedByDate.get(dateKey)!.push(item);
  }

  const dailyForecasts: DailyForecast[] = [];

  for (const itemsInOneDay of groupedByDate.values()) {
    // Find the entry closest to noon to use as the day's representative
    let representative = itemsInOneDay[0];
    let smallestDiff = Infinity;

    for (const item of itemsInOneDay) {
      const localDate = toLocalDate(item.dt, timezoneOffsetSeconds);
      const hour = localDate.getUTCHours();
      const diff = Math.abs(hour - 12);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        representative = item;
      }
    }

    // Iterate through all entries for the day to find the true daily high/low temperature
    // (not using any single entry's temp_max/temp_min — comparing the raw temp across all entries)
    const allTemps = itemsInOneDay.map((item) => item.main.temp);
    const maxTemp = Math.max(...allTemps);
    const minTemp = Math.min(...allTemps);

    dailyForecasts.push({ representative, maxTemp, minTemp });
  }

  return dailyForecasts.slice(0, 5);
}

// Take the nearest 8 entries (8 × 3 hours = 24 hours) for the line chart
export function getNext24Hours(list: ForecastItem[]): ForecastItem[] {
  return list.slice(0, 8);
}

// Convert a UTC dt timestamp to "HH:00" format in the city's local time, used for the chart X-axis
export function formatHour(utcDt: number, timezoneOffsetSeconds: number): string {
  const localDate = toLocalDate(utcDt, timezoneOffsetSeconds);
  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  return `${hours}:00`;
}

// Convert a UTC dt timestamp to the city's local weekday abbreviation, e.g. "Tue"
export function formatWeekday(utcDt: number, timezoneOffsetSeconds: number): string {
  const localDate = toLocalDate(utcDt, timezoneOffsetSeconds);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[localDate.getUTCDay()];
}

// Convert a UTC dt timestamp to the city's local date, e.g. "27 Sep"
export function formatDayMonth(utcDt: number, timezoneOffsetSeconds: number): string {
  const localDate = toLocalDate(utcDt, timezoneOffsetSeconds);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = localDate.getUTCDate();
  const month = months[localDate.getUTCMonth()];
  return `${day} ${month}`;
}

// Calculate the city's current local time, accurate to the minute
// Principle: dt is the UTC unix timestamp (seconds); timezone is the city's offset from UTC in seconds
// Adding them together gives the unix timestamp that corresponds to the city's local time
export function getLocalTime(weather: WeatherData): string {
  const localMillis = (weather.dt + weather.timezone) * 1000;
  const localDate = new Date(localMillis);

  // Key: use UTC methods to read the time, not local methods
  // Because localMillis is already an "adjusted fake timestamp",
  // using getHours()/getMinutes() (local methods) would apply the user's
  // computer timezone on top of it a second time, giving wrong results
  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

// Convert timezone offset seconds to a human-readable label like "GMT+8"
// Also handles non-integer-hour timezones like India (UTC+5:30)
export function getGmtLabel(timezoneOffsetSeconds: number): string {
  const hours = timezoneOffsetSeconds / 3600;
  const sign = hours >= 0 ? "+" : "";

  if (Number.isInteger(hours)) {
    return `GMT${sign}${hours}`;
  } else {
    const wholeHours = Math.trunc(hours);
    const minutesPart = Math.abs(hours - wholeHours) * 60;
    return `GMT${sign}${wholeHours}:${minutesPart.toString().padStart(2, "0")}`;
  }
}

// OpenWeatherMap's AQI uses a proprietary 1-5 scale, not the universal 0-500 scale
// This converts the numeric index to a human-readable text label
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

// Convert wind direction in degrees (0-360) to meteorological compass notation like "N 9.3° E"
// Rule: first determine North (N) or South (S), then calculate degrees from the pole, then East (E) or West (W)
export function formatWindDirection(deg: number): string {
  // Clamp the angle to 0-360 to guard against occasional out-of-range values from the API
  const normalizedDeg = ((deg % 360) + 360) % 360;

  let ns: "N" | "S";
  let angleFromPole: number;

  if (normalizedDeg <= 90 || normalizedDeg >= 270) {
    // 0-90° or 270-360° are all in the "northward" range
    ns = "N";
    angleFromPole = normalizedDeg <= 90 ? normalizedDeg : 360 - normalizedDeg;
  } else {
    // 90-270° is in the "southward" range
    ns = "S";
    angleFromPole = 180 - normalizedDeg;
  }

  const ew: "E" | "W" = normalizedDeg <= 180 ? "E" : "W";

  return `${ns} ${Math.abs(angleFromPole).toFixed(1)}°${ew}`;
}

// 天气主题：决定 weather-card 的配色
export type WeatherTheme =
  | "clear-day"
  | "clear-night"
  | "clouds"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "mist";
 
// 根据 API 的天气大类 (weather[0].main) 与图标代码 (weather[0].icon，末尾 d/n 代表日夜)
// 决定要套用哪个配色主题
export function getWeatherTheme(main: string, icon: string): WeatherTheme {
  const isNight = icon.endsWith("n");
 
  switch (main) {
    case "Clear":
      return isNight ? "clear-night" : "clear-day";
    case "Clouds":
      return "clouds";
    case "Rain":
    case "Drizzle":
      return "rain";
    case "Thunderstorm":
      return "thunderstorm";
    case "Snow":
      return "snow";
    // Mist / Smoke / Haze / Dust / Fog / Sand / Ash / Squall / Tornado 这些大气现象统一归为「雾霾」
    default:
      return "mist";
  }
}