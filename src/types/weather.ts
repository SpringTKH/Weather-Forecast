// Current weather type
export interface WeatherData {
  name: string;
  dt: number;        // Unix Time
  timezone: number;  // Offset in seconds from UTC
  main: {
    temp: number; // Temperature in Celsius
    feels_like: number; // Human comfort temperature
    temp_min: number;
    temp_max: number;
    humidity: number; // Humidity in percentage
    pressure: number; // Atmospheric pressure in hPa
  };
  weather: {
    main: string; // Weather group
    description: string; // Description of weather conditions
    icon: string; // Icon of weather conditions
  }[];
  // Array of the weather conditions since the API can provide multiple weather conditions
  wind: {
    speed: number; // Wind speed
    deg: number; // Wind direction
    gust?: number; // Wind gust speed, since not everytime exists, used "?"
  };
  rain?: {
    "1h"?: number; // 1-hour precipitation, since not everytime exists, used "?"
  };
  sys: {
    country: string;
  };
}

// 5-day forecast
export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}