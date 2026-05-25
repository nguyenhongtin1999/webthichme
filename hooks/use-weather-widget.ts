"use client"

import { useState, useEffect, useCallback } from "react"

export interface WeatherData {
  condition: string
  temperature: string
  time: string
  date: string
  location: string
  icon: string
  isDay: boolean
  clockIcon: string
}

export function useWeatherWidget() {
  const [lastLocationRequest, setLastLocationRequest] = useState<number>(0)
  const [baseWeatherData, setBaseWeatherData] = useState({
    temperature: "25",
    location: "Việt Nam",
    actualCondition: "Nắng", // Store the actual weather condition
  })
  const [weatherData, setWeatherData] = useState<WeatherData>({
    condition: "Nắng",
    temperature: "25",
    time: "--:--",
    date: "Đang tải...",
    location: "Việt Nam",
    icon: "wb_sunny",
    isDay: true,
    clockIcon: "clock-12",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const getClockIcon = useCallback((hour: number) => {
    if (hour === 0) return "clock-12" // 12 AM
    if (hour <= 12) return `clock-${hour}` // 1 AM - 12 PM
    return `clock-${hour - 12}` // 1 PM - 11 PM
  }, [])

  const getUserLocation = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=vi`,
      )
      const data = await response.json()

      if (data && data.display_name) {
        const addressParts = data.display_name.split(", ")
        let locationName = ""

        if (data.address) {
          const { city, town, village, state, country } = data.address
          locationName = city || town || village || state || country || "Việt Nam"
        } else {
          locationName = addressParts[0] || "Việt Nam"
        }

        return locationName.length > 15 ? locationName.substring(0, 15) + "..." : locationName
      }
      return "Việt Nam"
    } catch (error) {
      console.error("Error getting location:", error)
      return "Việt Nam"
    }
  }, [])

  const shouldRequestLocation = useCallback(() => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastLocationRequest
    const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    return timeSinceLastRequest > twentyFourHours || lastLocationRequest === 0
  }, [lastLocationRequest])

  const updateWeatherDisplay = useCallback(() => {
    const hour = new Date().getHours()
    const isDay = hour >= 6 && hour < 19

    let displayCondition: string, icon: string

    if (isDarkMode) {
      displayCondition = "Đêm quang"
      icon = "nights_stay"
    } else {
      if (isDay) {
        displayCondition = baseWeatherData.actualCondition
        const temp = Number.parseInt(baseWeatherData.temperature)
        icon = temp > 30 ? "wb_sunny" : "wb_cloudy"
      } else {
        displayCondition = "Đêm quang"
        icon = "nights_stay"
      }
    }

    setWeatherData((prev) => ({
      ...prev,
      condition: displayCondition,
      temperature: baseWeatherData.temperature,
      location: baseWeatherData.location,
      icon,
      isDay,
    }))
  }, [isDarkMode, baseWeatherData])

  const getWeatherData = useCallback(
    async (requestLocation = false) => {
      setIsLoading(true)

      try {
        if (requestLocation && shouldRequestLocation() && navigator.geolocation) {
          setLastLocationRequest(Date.now()) // Update timestamp when requesting

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude
              const lon = position.coords.longitude

              try {
                const locationName = await getUserLocation(lat, lon)
                const hour = new Date().getHours()
                const isDay = hour >= 6 && hour < 19
                const temp = Math.floor(Math.random() * 15) + (isDay ? 25 : 20)

                const conditions = ["Nắng", "Nắng ít mây", "Nhiều mây"]
                const actualCondition = conditions[Math.floor(Math.random() * conditions.length)]

                setBaseWeatherData({
                  temperature: temp.toString(),
                  location: locationName,
                  actualCondition,
                })

                setIsLoading(false)
              } catch (apiError) {
                const hour = new Date().getHours()
                const isDay = hour >= 6 && hour < 19
                setBaseWeatherData({
                  temperature: isDay ? "28" : "22",
                  location: "Việt Nam",
                  actualCondition: "Nắng",
                })
                setIsLoading(false)
              }
            },
            (error) => {
              console.log("Location access denied, using Vietnam default")
              const hour = new Date().getHours()
              const isDay = hour >= 6 && hour < 19
              setBaseWeatherData({
                temperature: isDay ? "28" : "22",
                location: "Việt Nam",
                actualCondition: "Nắng",
              })
              setIsLoading(false)
            },
            {
              timeout: 10000,
              enableHighAccuracy: true,
            },
          )
        } else {
          const hour = new Date().getHours()
          const isDay = hour >= 6 && hour < 19
          const temp = Math.floor(Math.random() * 15) + (isDay ? 25 : 20)

          const conditions = ["Nắng", "Nắng ít mây", "Nhiều mây"]
          const actualCondition = conditions[Math.floor(Math.random() * conditions.length)]

          setBaseWeatherData({
            temperature: temp.toString(),
            location: "Việt Nam",
            actualCondition,
          })
          setIsLoading(false)
        }
      } catch (error) {
        const hour = new Date().getHours()
        const isDay = hour >= 6 && hour < 19
        setBaseWeatherData({
          temperature: isDay ? "28" : "22",
          location: "Việt Nam",
          actualCondition: "Nắng",
        })
        setIsLoading(false)
      }
    },
    [getUserLocation, shouldRequestLocation],
  )

  const updateWeatherTime = useCallback(() => {
    const now = new Date()
    const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }))

    const timeString = vietnamTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const day = vietnamTime.getDate()
    const month = vietnamTime.getMonth() + 1
    const year = vietnamTime.getFullYear()
    const dateString = `Ngày ${day}/${month}/${year}`

    const hour = vietnamTime.getHours()
    const clockIcon = getClockIcon(hour)

    setWeatherData((prev) => ({
      ...prev,
      time: timeString,
      date: dateString,
      clockIcon,
    }))
  }, [getClockIcon])

  const initializeWeatherWidget = useCallback(() => {
    getWeatherData(shouldRequestLocation())
    updateWeatherTime()
  }, [getWeatherData, updateWeatherTime, shouldRequestLocation])

  const handleDarkModeChange = useCallback((darkMode: boolean) => {
    setIsDarkMode(darkMode)
  }, [])

  useEffect(() => {
    initializeWeatherWidget()
  }, [initializeWeatherWidget])

  useEffect(() => {
    updateWeatherTime()
  }, [updateWeatherTime])

  useEffect(() => {
    const timeInterval = setInterval(updateWeatherTime, 60000)
    return () => clearInterval(timeInterval)
  }, [updateWeatherTime])

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      getWeatherData(false)
    }, 600000) // 10 minutes

    return () => clearInterval(weatherInterval)
  }, [getWeatherData])

  useEffect(() => {
    updateWeatherDisplay()
  }, [updateWeatherDisplay])

  return {
    weatherData,
    isLoading,
    isDarkMode,
    handleDarkModeChange,
    getClockIcon,
    requestLocationUpdate: () => getWeatherData(true),
  }
}
