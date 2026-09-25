import { useState, useEffect } from 'react'
import './App.css'

import type { WeatherData, ForecastData, ForecastItem } from './types/weather'
import { getDailyForecasts } from './utils/weatherHelpers'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { ForecastList } from './components/ForecastList'
import { SavedCities } from './components/SavedCities'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// CurrentWeatherCard —— An independent component
// Only responsible for "receiving weather data → displaying it as a card"
// Doesn't care where the data comes from or how it is fetched (That's App's responsibility)

function App() {

  const [city, setCity] = useState<string>("Kuala Lumpur");
  const [inputValue, setInputValue] = useState<string>("Kuala Lumpur");
 
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize localStorage
  const [savedCities, setSavedCities] = useState<string[]>(() => {
    const raw = localStorage.getItem("savedCities");
    return raw ? JSON.parse(raw) : [];
  });
  const MAX_SAVED_CITIES = 5;

useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);
 
  // Add the city name to the saved cities list
  function addToSavedCities(cityName: string) {
    setSavedCities((prev) => {
      // Remove duplicate city names
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      );
      // Add the new city name at the beginning and remove the oldest city name if it exceeds the limit
      const updated = [cityName, ...filtered].slice(0, MAX_SAVED_CITIES);
      return updated;
    });
  }

  useEffect(() => {
    // Reset loading and error states
    setIsLoading(true);
    setError(null);

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Using Promise.all to fetch both current weather and forecast in parallel
    Promise.all([fetch(currentUrl), fetch(forecastUrl)])
      // Check if the response was successful
      .then(([currentRes, forecastRes]) => {
        if (!currentRes.ok || !forecastRes.ok) {
          // Determine which request failed and get the status code
          const failedStatus = !currentRes.ok ? currentRes.status : forecastRes.status;
          if (failedStatus === 404) {
            throw new Error("No city found, please check your spelling.");
          } else if (failedStatus === 401) {
            throw new Error("Invalid API key");
          } else if (failedStatus === 429) {
            throw new Error("Too many requests, please try again later.");
          } else {
            throw new Error(`Request failed with status code: ${failedStatus}`);
          }
        }
        // If both responses were successful, parse the JSON data
        return Promise.all([currentRes.json(), forecastRes.json()]);
      })
      // Get the JSON'ed data and store it in the state
      .then(([currentData, forecastData]: [WeatherData, ForecastData]) => {
        setWeather(currentData);
        setForecast(getDailyForecasts(forecastData.list));
        // Reset error and loading states
        setError(null);
        setIsLoading(false);
        addToSavedCities(currentData.name); // Use the official name returned by the API instead of the original string entered by the user
      })
      // Catch any errors that occur during the fetch requests
      .catch((err) => {
        setError(err.message);
        // Clear the previous messages
        setWeather(null);
        setForecast([]);
        setIsLoading(false);
      });
  }, [city]);

  // Return the JSX code
  // // Function that handles the search bar
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent the default behavior of the form submission
    if (inputValue.trim() === "") {
      setError("Please enter a city name.");
      return;
    }
    // Check if the input value is empty, if so, tell the user to type a proper city name.
    setCity(inputValue.trim()); // Set the city name
  }
 
  return (
    <div className="app">
      <h1 className="app_title">Weather Dashboard</h1>
 
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter city name e.g. London"
          className="search-bar_input"
        />
        <button type="submit" disabled={isLoading} className="search-bar_button">
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      <SavedCities
        cities={savedCities}
        onSelect={(c) => {
          setInputValue(c);
          setCity(c);
        }}
      />
 
      <div className="result-area">
        {isLoading && (
          <p className="loading-message">⏳ Loading weather data...</p>
        )}
        
        {!isLoading && error && (
          <p className="error-message">⚠️ {error}</p>
        )}
 
        {!isLoading && !error && weather && (
          <>
            <CurrentWeatherCard weather={weather} />
            {forecast.length > 0 && <ForecastList items={forecast} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App