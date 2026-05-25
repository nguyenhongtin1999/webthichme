"use client"

import { useWeatherWidget } from "@/hooks/use-weather-widget"
import { useEffect } from "react"

interface WeatherWidgetProps {
  isDarkMode: boolean
}

const ClockIcons = {
  "clock-1": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 14.5,8" />
    </svg>
  ),
  "clock-2": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,10" />
    </svg>
  ),
  "clock-3": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 18,12" />
    </svg>
  ),
  "clock-4": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  "clock-5": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 14.5,16" />
    </svg>
  ),
  "clock-6": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 12,18" />
    </svg>
  ),
  "clock-7": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 9.5,16" />
    </svg>
  ),
  "clock-8": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 8,14" />
    </svg>
  ),
  "clock-9": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 6,12" />
    </svg>
  ),
  "clock-10": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 8,10" />
    </svg>
  ),
  "clock-11": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 9.5,8" />
    </svg>
  ),
  "clock-12": () => (
    <svg
      className="clock-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 12,6" />
    </svg>
  ),
}

export function WeatherWidget({ isDarkMode }: WeatherWidgetProps) {
  const { weatherData, isLoading, handleDarkModeChange } = useWeatherWidget()

  // Update dark mode state when prop changes
  useEffect(() => {
    handleDarkModeChange(isDarkMode)
  }, [isDarkMode, handleDarkModeChange])

  const ClockIconComponent = ClockIcons[weatherData.clockIcon as keyof typeof ClockIcons] || ClockIcons["clock-12"]

  return (
    <div className={`weather-widget active mt-2 ${isDarkMode ? "sparkle" : ""}`}>
      <div className="background">
        <div className="Circle1"></div>
        <div className="Circle2"></div>
        <div className="Circle3"></div>
      </div>
      <div className="content">
        <h1 className="Condition">
          <i
            className={`material-icons ${isDarkMode ? "moon" : "sun"}`}
            style={{
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {weatherData.icon}
          </i>
          <span
            className={isLoading ? "weather-loading" : ""}
            style={{
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {weatherData.condition}
          </span>
        </h1>
        <h1 className="Temp">
          <span
            className={isLoading ? "weather-loading" : ""}
            style={{
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {weatherData.temperature}
          </span>
          <span id="F">°C</span>
        </h1>
        <h1 className="Time">
          <ClockIconComponent />
          <span>{weatherData.time}</span>
        </h1>
        <h1 className="Date">{weatherData.date}</h1>
        <h1 className="Location">
          <i className="material-icons locationIcon">place</i>
          <span
            className={isLoading ? "weather-loading" : ""}
            style={{
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {weatherData.location}
          </span>
        </h1>
      </div>
    </div>
  )
}

export default WeatherWidget
