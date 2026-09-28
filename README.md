# 🌤️ Spring's Weather Forecast

A responsive weather dashboard built with **React + TypeScript + Vite**, powered by the [OpenWeatherMap API](https://openweathermap.org/api). Search for any city worldwide to get real-time weather conditions, a 24-hour temperature chart, and a 5-day forecast — all displayed in the **city's own local timezone**.

[To view the live demonstration on Vercel, click here.](https://weather-forecast-sigma-drab.vercel.app/)

---

## ✨ Features

- 🔍 **City Search** — Search weather for any city in the world with an icon search button
- 🌡️ **Current Weather Card** — Displays temperature, feels-like, wind speed, wind direction (compass format), atmospheric pressure, humidity, and AQI — each with a corresponding icon
- 🌬️ **Air Quality Index (AQI)** — Fetches AQI from the Air Pollution API using city coordinates; displays a human-readable label (Good → Very Poor); fails silently without breaking the UI
- 📈 **24-Hour Temperature Chart** — Custom SVG line chart with a smooth Bézier curve, per-point temperature labels, weather icons, wind speed, and timezone-correct local time labels
- 📅 **5-Day Forecast** — One card per day showing the true daily high/low temperature, weather icon, description, and wind speed; picks the entry closest to local noon
- 🕐 **Timezone-Correct Display** — All dates and times (forecast dates, chart hours, card local time) are computed from the city's UTC offset, not the user's browser timezone
- 🏙️ **Saved Cities** — Up to 5 recently searched cities persisted in localStorage as quick-access chips, each removable with an X button
- ⚡ **Parallel API Fetching** — Current weather and forecast fetched simultaneously via Promise.all; AQI fetched independently as a non-blocking secondary request
- 🛡️ **Error Handling** — User-friendly messages for city-not-found (404), invalid API key (401), and rate-limiting (429)

---

## 🛠️ Tech Stack

| Category    | Technology                                                      |
| ----------- | --------------------------------------------------------------- |
| Framework   | React 19                                                        |
| Language    | TypeScript 6                                                    |
| Build Tool  | Vite 8                                                          |
| Charts      | Custom SVG (Bézier curve, no third-party chart library)         |
| Icons       | lucide-react                                                    |
| API         | OpenWeatherMap (Current Weather, 5-Day Forecast, Air Pollution) |
| Styling     | Vanilla CSS                                                     |
| State       | React useState / useEffect                                      |
| Persistence | localStorage                                                    |

---

## 📁 Project Structure

```
weather-forecast/
├── public/
│   ├── Background.jpg
│   └── headerBackground.png
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx  # Weather card: temp, wind, pressure, humidity, AQI (with lucide icons)
│   │   ├── HourlyChart.tsx         # Custom SVG 24h temperature line chart with Bézier curve
│   │   ├── ForecastCard.tsx        # Single-day forecast: daily high/low, icon, description, wind
│   │   ├── ForecastList.tsx        # 5-day forecast list
│   │   └── SavedCities.tsx         # Recent city chips with select + remove buttons
│   ├── types/
│   │   └── weather.ts              # TypeScript interfaces: WeatherData, ForecastItem, ForecastData, AirPollutionData
│   ├── utils/
│   │   └── weatherHelpers.ts       # All helper functions and the DailyForecast interface (see below)
│   ├── App.tsx                     # Root component: state, API calls, layout
│   ├── App.css                     # All component styles
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global CSS reset (box-sizing, margin, min-height)
├── .env                            # API key (not committed)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔧 Helper Functions & Types (weatherHelpers.ts)

### DailyForecast Interface

```ts
interface DailyForecast {
  representative: ForecastItem; // Entry closest to noon — used for icon, description, and time
  maxTemp: number; // True daily high from all entries that day
  minTemp: number; // True daily low from all entries that day
}
```

> The maxTemp/minTemp are computed by comparing the raw temp across **all** 3-hour entries for that day — not the narrow temp_max/temp_min inside a single entry.

### Helper Functions

| Function                        | Description                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| toLocalDate(utcDt, offset)      | (private) Converts a UTC unix timestamp into a Date adjusted for the city's timezone offset                                                 |
| getDailyForecasts(list, offset) | Groups all 40 forecast entries by local date; returns up to 5 DailyForecast objects, each with a representative entry + true daily high/low |
| getNext24Hours(list)            | Returns the first 8 forecast entries (8 x 3h = 24h) for the hourly chart                                                                    |
| formatHour(utcDt, offset)       | Formats a UTC timestamp as "HH:00" in the city's local time (e.g. "14:00")                                                                  |
| formatWeekday(utcDt, offset)    | Formats a UTC timestamp as a weekday abbreviation in the city's local time (e.g. "Tue")                                                     |
| formatDayMonth(utcDt, offset)   | Formats a UTC timestamp as a day-month string in the city's local date (e.g. "27 Sep")                                                      |
| getLocalTime(weather)           | Returns the city's current local time as "HH:MM" for the weather card header                                                                |
| getGmtLabel(offset)             | Converts offset seconds to a readable label like "GMT+8" or "GMT+5:30"                                                                      |
| formatWindDirection(deg)        | Converts wind degrees (0-360) to compass notation, e.g. "N 45.0° E"                                                                         |
| getAqiLabel(aqi)                | Converts AQI index (1-5) to a text label: Good, Fair, Moderate, Poor, Very Poor                                                             |

---

## ⚠️ Known Limitations

- **3-hour forecast granularity**

  The free OpenWeatherMap plan provides data every 3 hours, so the "24-hour" chart shows 8 data points rather than hourly readings.

- **Partial first day**

  The 5-day forecast starts from the query time, so today's high/low only reflects the remaining time slots.

- **Regional data**

  Conditions are aggregated from regional stations and models, and may differ from what you see locally.

- **API key exposure**

  As a client-side-only app, the OpenWeatherMap key is bundled into the frontend and visible in the browser. This deployment uses a dedicated, rate-limited free-tier key; a production version would proxy requests through a backend so the key stays server-side.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- An [OpenWeatherMap API key](https://home.openweathermap.org/api_keys) (free tier works)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SpringTKH/Weather-Forecast.git
   cd Weather-Forecast
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your API key**

   Create a `.env` file in the project root:

   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser.

---

## 📦 Available Scripts

| Script          | Description                        |
| --------------- | ---------------------------------- |
| npm run dev     | Start the local development server |
| npm run build   | Build the production bundle        |
| npm run preview | Preview the production build       |
| npm run lint    | Run ESLint checks                  |

---

## 🔑 Environment Variables

| Variable                 | Description                 |
| ------------------------ | --------------------------- |
| VITE_OPENWEATHER_API_KEY | Your OpenWeatherMap API key |

> Never commit your .env file. It is already listed in .gitignore.

---

## 📡 API Reference

This project uses three endpoints from the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint                                        | Usage                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| GET /data/2.5/weather?q={city}&units=metric     | Current weather conditions (temp, wind, pressure, humidity, coords, timezone)   |
| GET /data/2.5/forecast?q={city}&units=metric    | 5-day / 3-hour forecast — used for both the 24h chart and 5-day cards           |
| GET /data/2.5/air_pollution?lat={lat}&lon={lon} | Air Quality Index by coordinates (fetched after current weather returns coords) |
