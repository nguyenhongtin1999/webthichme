"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  username: string
  name: string
  email: string
  avatar?: string
  firstLogin?: boolean
  points?: number
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const initializeUser = useCallback(() => {
    setIsLoading(true)
    try {
      let userData = sessionStorage.getItem("currentUser")
      if (!userData) {
        userData = localStorage.getItem("currentUser")
      }

      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUser(user)
        // Ensure session storage is also updated
        sessionStorage.setItem("currentUser", userData)
      } else {
        setCurrentUser(null)
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCurrentUser = useCallback((): User | null => {
    try {
      let userData = sessionStorage.getItem("currentUser")
      if (!userData) {
        userData = localStorage.getItem("currentUser")
      }
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }, [])

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      const current = getCurrentUser()
      if (!current) return

      const updatedUser = { ...current, ...userData }

      try {
        const userDataStr = JSON.stringify(updatedUser)
        sessionStorage.setItem("currentUser", userDataStr)
        localStorage.setItem("currentUser", userDataStr)

        // Update in local storage users array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: User) => u.id === current.id)

        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem("users", JSON.stringify(users))
        }

        setCurrentUser(updatedUser)

        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "currentUser",
            newValue: userDataStr,
            oldValue: JSON.stringify(current),
          }),
        )
      } catch (error) {
        console.error("Error updating user:", error)
      }
    },
    [getCurrentUser],
  )

  const updatePoints = useCallback(
    (pointsToAdd: number) => {
      const current = getCurrentUser()
      if (!current) return

      const currentPoints = current.points || 0
      const newPoints = currentPoints + pointsToAdd

      const updatedUser = {
        ...current,
        points: newPoints,
      }

      try {
        const userDataStr = JSON.stringify(updatedUser)
        sessionStorage.setItem("currentUser", userDataStr)
        localStorage.setItem("currentUser", userDataStr)

        // Update in local storage users array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: User) => u.id === current.id)

        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem("users", JSON.stringify(users))
        }

        setCurrentUser(updatedUser)

        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "currentUser",
            newValue: userDataStr,
            oldValue: JSON.stringify(current),
          }),
        )
      } catch (error) {
        console.error("Error updating points:", error)
      }
    },
    [getCurrentUser],
  )

  const updateAvatar = useCallback(
    (avatarData: string) => {
      const current = getCurrentUser()
      if (!current) return

      const updatedUser = {
        ...current,
        avatar: avatarData,
        firstLogin: false,
      }

      try {
        const userDataStr = JSON.stringify(updatedUser)
        sessionStorage.setItem("currentUser", userDataStr)
        localStorage.setItem("currentUser", userDataStr)

        // Update in local storage users array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: User) => u.id === current.id)

        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem("users", JSON.stringify(users))
        }

        setCurrentUser(updatedUser)

        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "currentUser",
            newValue: userDataStr,
            oldValue: JSON.stringify(current),
          }),
        )
      } catch (error) {
        console.error("Error updating avatar:", error)
      }
    },
    [getCurrentUser],
  )

  const showLogoutConfirmation = useCallback(() => {
    if (!currentUser) return
    setIsLogoutModalOpen(true)
  }, [currentUser])

  const hideLogoutConfirmation = useCallback(() => {
    setIsLogoutModalOpen(false)
  }, [])

  const performLogout = useCallback(() => {
    try {
      sessionStorage.removeItem("currentUser")
      localStorage.removeItem("currentUser")

      // Update state
      setCurrentUser(null)
      setIsLogoutModalOpen(false)

      // Show success message
      const event = new CustomEvent("showToast", {
        detail: { message: "Đăng xuất thành công!", type: "success" },
      })
      window.dispatchEvent(event)

      setTimeout(() => {
        window.location.href = "/trangchu"
      }, 1000)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }, [])

  const login = useCallback((userData: User) => {
    try {
      const userDataStr = JSON.stringify(userData)
      sessionStorage.setItem("currentUser", userDataStr)
      localStorage.setItem("currentUser", userDataStr)
      setCurrentUser(userData)

      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUserIndex = users.findIndex((u: User) => u.id === userData.id)

      if (existingUserIndex !== -1) {
        users[existingUserIndex] = userData
      } else {
        users.push(userData)
      }

      localStorage.setItem("users", JSON.stringify(users))
    } catch (error) {
      console.error("Error during login:", error)
    }
  }, [])

  const redirectToLogin = useCallback(() => {
    window.location.href = "/login"
  }, [])

  const isAuthenticated = useCallback((): boolean => {
    return currentUser !== null
  }, [currentUser])

  const needsAvatarSetup = useCallback((): boolean => {
    return currentUser?.firstLogin === true
  }, [currentUser])

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        if (e.newValue) {
          try {
            const userData = JSON.parse(e.newValue)
            setCurrentUser(userData)
          } catch (error) {
            console.error("Error parsing storage change:", error)
            setCurrentUser(null)
          }
        } else {
          setCurrentUser(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return {
    currentUser,
    isLoading,
    isLogoutModalOpen,
    initializeUser,
    getCurrentUser,
    updateUser,
    updatePoints,
    updateAvatar,
    showLogoutConfirmation,
    hideLogoutConfirmation,
    performLogout,
    login,
    redirectToLogin,
    isAuthenticated,
    needsAvatarSetup,
  }
}
