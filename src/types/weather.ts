// Current weather data type
export interface WeatherData {
  name: string;
  dt: number; // Unix Time
  timezone: number; // Timezone (e.g. Kuala Lumpur = +28800s = 8 hours)
  main: {
    temp: number; // Temperature in Celsius
    feels_like: number; // Feels like temperature in Celsius
    temp_min: number; // Minimum temperature in Celsius
    temp_max: number; // Maximum temperature in Celsius
    humidity: number; // Humidity in percentage
  };
  weather: {
    main: string; // Weather condition (e.g., "Clouds", "Clear")
    description: string; // Detailed weather description (e.g., "broken clouds")
    icon: string; // Icon code for weather
  }[]; 
  // Array of weather conditions, since there can be more than one weather condition
  wind: {
    speed: number; // Wind speed in meters per second
  };
  sys: {
    country: string; // Country code (e.g., "MY")
  };
}
 
// 5-day forecast item 
export interface ForecastItem {
  dt: number; // Unix timestamp
  dt_txt: string; // Date and time in "YYYY-MM-DD HH:MM:SS" format
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

// How the whole 5-day forecast API response looks like
export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}