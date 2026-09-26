# 🌤️ Spring's Weather Forecast

A responsive weather dashboard built with **React + TypeScript + Vite**, powered by the [OpenWeatherMap API](https://openweathermap.org/api). Search for any city worldwide to get real-time weather conditions, a 24-hour temperature chart, and a 5-day forecast — all displayed in the **city's own local timezone**.

---

## ✨ Features

- 🔍 **City Search** — Search weather for any city in the world with an icon search button
- 🌡️ **Current Weather Card** — Displays temperature, feels-like, wind speed, wind direction (compass format), atmospheric pressure, humidity, and AQI — each with a corresponding icon
- 🌬️ **Air Quality Index (AQI)** — Fetches AQI from the Air Pollution API using city coordinates; displays a human-readable label (Good → Very Poor); fails silently without breaking the UI
- 📈 **24-Hour Temperature Chart** — Custom SVG line chart with a smooth Bézier curve, per-point temperature labels, weather condition icons, and timezone-correct local time on the X-axis
- 📅 **5-Day Forecast** — One card per day, picking the entry closest to local noon (fixes missing forecasts for non-UTC-aligned timezones like UTC+8)
- 🕐 **Timezone-Correct Display** — All dates and times (forecast dates, chart hours, card local time) are computed from the city's UTC offset, not the user's browser timezone
- 🏙️ **Saved Cities** — Up to 5 recently searched cities persisted in `localStorage` as quick-access chips, each removable with an **✕ button**
- ⚡ **Parallel API Fetching** — Current weather and forecast fetched simultaneously via `Promise.all`; AQI fetched independently as a non-blocking secondary request
- 🛡️ **Error Handling** — User-friendly messages for city-not-found (404), invalid API key (401), and rate-limiting (429)

---

## 🛠️ Tech Stack

| Category    | Technology                                                   |
|-------------|--------------------------------------------------------------|
| Framework   | React 19                                                     |
| Language    | TypeScript 6                                                 |
| Build Tool  | Vite 8                                                       |
| Charts      | Custom SVG (Bézier curve, no third-party chart library)      |
| Icons       | lucide-react                                                 |
| API         | OpenWeatherMap (Current Weather, 5-Day Forecast, Air Pollution) |
| Styling     | Vanilla CSS                                                  |
| State       | React `useState` / `useEffect`                               |
| Persistence | `localStorage`                                               |

---

## 📁 Project Structure

```
weather-forecast/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx  # Weather card: temp, wind, pressure, humidity, AQI (with lucide icons)
│   │   ├── HourlyChart.tsx         # Custom SVG 24h temperature line chart
│   │   ├── ForecastCard.tsx        # Single-day forecast card (timezone-aware date)
│   │   ├── ForecastList.tsx        # 5-day forecast list
│   │   └── SavedCities.tsx         # Recent city chips with select + remove buttons
│   ├── types/
│   │   └── weather.ts              # TypeScript interfaces: WeatherData, ForecastItem, ForecastData, AirPollutionData
│   ├── utils/
│   │   └── weatherHelpers.ts       # All helper functions (see below)
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

## 🔧 Helper Functions (`weatherHelpers.ts`)

| Function | Description |
|---|---|
| `toLocalDate(utcDt, offset)` | *(private)* Base converter — turns a UTC unix timestamp into a `Date` object adjusted for the city's timezone offset |
| `getDailyForecasts(list, offset)` | Groups all 40 forecast items by local date, picks the entry closest to 12:00 local time — fixes missing data for non-UTC-aligned cities |
| `getNext24Hours(list)` | Returns the first 8 forecast items (8 × 3h = 24h) for the hourly chart |
| `formatHour(utcDt, offset)` | Formats a UTC timestamp as `"HH:00"` in the city's local time (e.g. `"14:00"`) |
| `formatDate(utcDt, offset)` | Formats a UTC timestamp as `"Fri, 25 Sep"` in the city's local date |
| `getLocalTime(weather)` | Returns the city's current local time as `"HH:MM"` for the weather card |
| `getGmtLabel(offset)` | Converts offset seconds to `"GMT+8"` or `"GMT+5:30"` for non-integer zones |
| `formatWindDirection(deg)` | Converts raw wind degrees (0–360) to compass notation e.g. `"N 45.0° E"` |
| `getAqiLabel(aqi)` | Converts AQI index (1–5) to a text label: Good, Fair, Moderate, Poor, Very Poor |

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

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Script            | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start the local development server |
| `npm run build`   | Build the production bundle        |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint checks                  |

---

## 🔑 Environment Variables

| Variable                   | Description                 |
|----------------------------|-----------------------------|
| `VITE_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📡 API Reference

This project uses three endpoints from the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint | Usage |
|---|---|
| `GET /data/2.5/weather?q={city}&units=metric` | Current weather conditions (temp, wind, pressure, humidity, coords, timezone) |
| `GET /data/2.5/forecast?q={city}&units=metric` | 5-day / 3-hour forecast — used for both the 24h chart and 5-day cards |
| `GET /data/2.5/air_pollution?lat={lat}&lon={lon}` | Air Quality Index by coordinates (fetched after current weather returns coords) |


---

## ✨ Features

- 🔍 **City Search** — Search weather for any city in the world with an icon search button
- 🌡️ **Current Weather Card** — Displays temperature, feels-like, humidity, wind speed & direction, atmospheric pressure, and weather icon with local time
- 🌬️ **Air Quality Index (AQI)** — Fetches AQI data from the Air Pollution API and displays a human-readable label (Good → Very Poor) on the weather card
- 📈 **24-Hour Temperature Chart** — Interactive line chart (powered by Recharts) showing hourly temperature for the next 24 hours
- 📅 **5-Day Forecast** — Shows one representative forecast per day (taken at 12:00 local time)
- 🏙️ **Saved Cities** — Up to 5 recently searched cities saved as quick-access chips (persisted in `localStorage`), each with an **✕ remove button**
- ⚡ **Parallel API Fetching** — Current weather and forecast are fetched simultaneously using `Promise.all`; AQI is fetched independently as a non-blocking secondary request
- 🛡️ **Error Handling** — Clear error messages for invalid city names, bad API keys, and rate-limiting; AQI failures are silently handled (displays "Unknown")

---

## 🛠️ Tech Stack

| Category    | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 19                            |
| Language    | TypeScript 6                        |
| Build Tool  | Vite 8                              |
| Charting    | Recharts 3                          |
| Icons       | lucide-react                        |
| API         | OpenWeatherMap (Current Weather, 5-Day Forecast, Air Pollution) |
| Styling     | Vanilla CSS                         |
| State       | React `useState` / `useEffect`      |
| Persistence | `localStorage`                      |

---

## 📁 Project Structure

```
weather-forecast/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx  # Current weather card (temp, humidity, wind, pressure, AQI)
│   │   ├── HourlyChart.tsx         # 24-hour temperature line chart (Recharts)
│   │   ├── ForecastCard.tsx        # Single day forecast card
│   │   ├── ForecastList.tsx        # 5-day forecast list
│   │   └── SavedCities.tsx         # Recently searched city chips with remove button
│   ├── types/
│   │   └── weather.ts              # TypeScript interfaces (WeatherData, ForecastData, AirPollutionData)
│   ├── utils/
│   │   └── weatherHelpers.ts       # Helpers: date format, local time, AQI label, forecast filters
│   ├── App.tsx                     # Root component & all API logic
│   ├── App.css                     # Component styles
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global CSS reset & base styles
├── .env                            # API key (not committed)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

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

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Script            | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start the local development server |
| `npm run build`   | Build the production bundle        |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint checks                  |

---

## 🔑 Environment Variables

| Variable                   | Description                 |
|----------------------------|-----------------------------|
| `VITE_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📡 API Reference

This project uses three endpoints from the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint | Usage |
|---|---|
| `GET /data/2.5/weather?q={city}&units=metric` | Current weather conditions |
| `GET /data/2.5/forecast?q={city}&units=metric` | 5-day / 3-hour forecast (used for both the 24h chart and 5-day view) |
| `GET /data/2.5/air_pollution?lat={lat}&lon={lon}` | Air Quality Index (AQI) by coordinates |


---

## ✨ Features

- 🔍 **City Search** — Search weather for any city in the world
- 🌡️ **Current Weather Card** — Displays temperature, feels-like, humidity, wind speed, weather icon, and local time of the city
- 📅 **5-Day Forecast** — Shows one representative forecast per day (taken at 12:00 local time)
- 🏙️ **Saved Cities** — Up to 5 recently searched cities saved as quick-access chips (persisted in `localStorage`)
- ⚡ **Parallel API Fetching** — Current weather and forecast are fetched simultaneously using `Promise.all`
- 🛡️ **Error Handling** — Clear error messages for invalid city names, bad API keys, and rate-limiting

---

## 🛠️ Tech Stack

| Category    | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 19                            |
| Language    | TypeScript 6                        |
| Build Tool  | Vite 8                              |
| API         | OpenWeatherMap (Current + Forecast) |
| Styling     | Vanilla CSS                         |
| State       | React `useState` / `useEffect`      |
| Persistence | `localStorage`                      |

---

## 📁 Project Structure

```
weather-forecast/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx  # Current weather display card
│   │   ├── ForecastCard.tsx        # Single day forecast card
│   │   ├── ForecastList.tsx        # 5-day forecast list
│   │   └── SavedCities.tsx         # Recently searched city chips
│   ├── types/
│   │   └── weather.ts              # TypeScript interfaces for API responses
│   ├── utils/
│   │   └── weatherHelpers.ts       # Helper functions (date, time, forecast filter)
│   ├── App.tsx                     # Root component & API logic
│   ├── App.css                     # Component styles
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global styles
├── .env                            # API key (not committed)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

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

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Script            | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start the local development server |
| `npm run build`   | Build the production bundle        |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint checks                  |

---

## 🔑 Environment Variables

| Variable                   | Description                 |
|----------------------------|-----------------------------|
| `VITE_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📡 API Reference

This project uses two endpoints from the [OpenWeatherMap API](https://openweathermap.org/api):

- **Current Weather** — `GET /data/2.5/weather?q={city}&units=metric`
- **5-Day Forecast** — `GET /data/2.5/forecast?q={city}&units=metric`
