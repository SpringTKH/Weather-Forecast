# 🌤️ Weather Dashboard

A responsive weather dashboard built with **React + TypeScript + Vite**, powered by the [OpenWeatherMap API](https://openweathermap.org/api). Search for any city worldwide to get real-time weather conditions and a 5-day forecast at a glance.

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
