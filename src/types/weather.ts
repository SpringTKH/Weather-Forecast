// Current weather type
export interface WeatherData {
  name: string;
  dt: number;        // Unix Time
  timezone: number;  // Offset in seconds from UTC
  coord: {
    lon: number;
    lat: number;
  }
  main: {
    temp: number; // Temperature in Celsius
    feels_like: number; // Human comfort temperature
    temp_min: number;
    temp_max: number;
    humidity: number; // Humidity in percentage
    pressure: number; // Atmospheric pressure in hPa (1 hPa = 100 Pa)
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
    "1h"?: number; // 1-hour precipitation in unit mm, since not everytime exists, used "?"
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
    timezone: number; // 该城市相对UTC的偏移秒数，跟 WeatherData 的 timezone 同一个概念
  };
}

export interface AirPollutionData {
  list: {
    main: {
      aqi: 1 | 2 | 3 | 4 | 5; // Only these 5 numbers
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }[];
}