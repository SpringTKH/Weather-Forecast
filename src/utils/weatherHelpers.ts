import type { ForecastItem, WeatherData } from "../types/weather";

// Change UTC dt time stamp to the Date object of the city's local time
// This is the common logic for all time-related calculations
// Any new function that needs "local time" should call this
function toLocalDate(utcDt: number, timezoneOffsetSeconds: number): Date {
  return new Date((utcDt + timezoneOffsetSeconds) * 1000);
}

// Change 40 items of 3-hour interval data into "one entry per day" (take the entry closest to 12 o'clock local time)

// Why not use "exactly equal to 12 o'clock" to judge:
// forecast's data point is every 3 hours（UTC 00, 03, 06...），
// Only when the time zone offset can be divided by 3 (like Tokyo UTC+9), the local time will fall exactly on the hour
// For example, Kuala Lumpur UTC+8, London UTC+0/+1, the local time will often be 11:00, 13:00, which is "a little bit" off, and can never catch
// the exact "12:00", causing some cities to miss all the data, and the 5-day forecast disappears.
export function getDailyForecasts(
  list: ForecastItem[],
  timezoneOffsetSeconds: number
): ForecastItem[] {
  // First, group the data by "local date"
  const groupedByDate = new Map<string, ForecastItem[]>();

  for (const item of list) {
    const localDate = toLocalDate(item.dt, timezoneOffsetSeconds);
    // Use "Year-Month-Day" as the grouping key (use UTC method to read, because it's already an adjusted fake timestamp)
    const dateKey = `${localDate.getUTCFullYear()}-${localDate.getUTCMonth()}-${localDate.getUTCDate()}`;

    if (!groupedByDate.has(dateKey)) {
      groupedByDate.set(dateKey, []);
    }
    groupedByDate.get(dateKey)!.push(item);
  }

  // For each group, pick the one closest to 12 o'clock local time
  const dailyRepresentatives: ForecastItem[] = [];

  for (const itemsInOneDay of groupedByDate.values()) {
    let closest = itemsInOneDay[0];
    let smallestDiff = Infinity;

    for (const item of itemsInOneDay) {
      const localDate = toLocalDate(item.dt, timezoneOffsetSeconds);
      const hour = localDate.getUTCHours();
      const diff = Math.abs(hour - 12);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        closest = item;
      }
    }

    dailyRepresentatives.push(closest);
  }

  return dailyRepresentatives.slice(0, 5);
}

// Get the nearest 8 data points (8 * 3 hours = 24 hours), used for the line chart
export function getNext24Hours(list: ForecastItem[]): ForecastItem[] {
  return list.slice(0, 8);
}

// Change the UTC dt time stamp to the "HH:00" format of the city's local time, used for the chart's X-axis
export function formatHour(utcDt: number, timezoneOffsetSeconds: number): string {
  const localDate = toLocalDate(utcDt, timezoneOffsetSeconds);
  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  return `${hours}:00`;
}

// Change the UTC dt time stamp to the "Fri, 25 Sep" format of the city's local date
export function formatDate(utcDt: number, timezoneOffsetSeconds: number): string {
  const localDate = toLocalDate(utcDt, timezoneOffsetSeconds);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const weekday = weekdays[localDate.getUTCDay()];
  const day = localDate.getUTCDate();
  const month = months[localDate.getUTCMonth()];

  return `${weekday}, ${day} ${month}`;
}

// Calculate the "current local time" of the city, accurate to the minute
// Principle: dt is the unix timestamp of UTC, and timezone is the offset in seconds from the city to UTC
// Adding them together gives the unix timestamp corresponding to the "local time" of the city
export function getLocalTime(weather: WeatherData): string {
  const localMillis = (weather.dt + weather.timezone) * 1000;
  const localDate = new Date(localMillis);

  // Key: Use UTC method to read, not local method
  // Because localMillis is already an "adjusted fake timestamp",
  // If getHours()/getMinutes() (local method) is used,
  // It will be converted again by the user's computer's time zone, and the number will be wrong
  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

// Change timezone offset seconds to human-readable format like "GMT+8"
// Also handles non-integer time zones like India UTC+5:30
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

// OpenWeatherMap's AQI is a proprietary 1-5 rating system, not a universal 0-500 scale
// Here, the number is converted to the corresponding text label
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

// Change the Wind Direction from （0-360） to "N 9.3°E" format
// Rule: First determine whether it is North or South
// Then calculate how many degrees away from the North/South
// Finally determine whether it is East or West
export function formatWindDirection(deg: number): string {
  // Limit the angle to the range of 0-360 to prevent the API from occasionally giving values above 360 or negative boundary values
  const normalizedDeg = ((deg % 360) + 360) % 360;
 
  let ns: "N" | "S";
  let angleFromPole: number;
 
  if (normalizedDeg <= 90 || normalizedDeg >= 270) {
    // 0-90 degrees or 270-360 degrees, all are in the "North" range
    ns = "N";
    angleFromPole = normalizedDeg <= 90 ? normalizedDeg : 360 - normalizedDeg;
  } else {
    // Between 90-270 degrees, it is in the "South" range
    ns = "S";
    angleFromPole = 180 - normalizedDeg;
  }
 
  const ew: "E" | "W" = normalizedDeg <= 180 ? "E" : "W";
 
  return `${ns} ${Math.abs(angleFromPole).toFixed(1)}° ${ew}`;
}