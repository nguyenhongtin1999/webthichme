"use client"

import { useState, useEffect } from "react"

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial dark mode state
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"))
    }

    checkDarkMode()

    // Watch for changes to body's dark-mode class
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return { isDarkMode }
}
