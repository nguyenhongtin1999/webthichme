"use client"

import { useState, useEffect, useCallback } from "react"

export interface Notification {
  id: string
  title: string
  content: string
  icon: string
  primaryColor?: string
  secondaryColor?: string
  showDateTime?: boolean
  startDate?: string
  endDate?: string
  status?: string
  createdAt?: string
  date?: string
  read?: boolean
  category?: "activity" | "system" | "transaction"
  type?: string
  recipientUsernames?: string[]
  isPinned?: boolean
  pinnedAt?: number | null // Added pinnedAt to track pin order
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Get current user from session storage
  const getCurrentUser = useCallback(() => {
    try {
      const user = sessionStorage.getItem("currentUser")
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  }, [])

  const filterNotifications = useCallback((notifs: Notification[], currentUser?: any) => {
    const currentDate = new Date().toISOString()

    return notifs.filter((notification: any) => {
      // Check if notification is active or scheduled
      const isActiveOrScheduled = notification.status === "active" || notification.status === "scheduled"

      if (!isActiveOrScheduled) return false

      // Check if notification has started
      const hasStarted = !notification.startDate || notification.startDate <= currentDate

      // Check if notification hasn't ended
      const hasNotEnded = !notification.endDate || notification.endDate > currentDate

      if (notification.type === "user" && currentUser) {
        // Only show this notification if the current user is in the recipient list
        const recipientUsernames = notification.recipientUsernames || []
        if (!recipientUsernames.includes(currentUser.username)) {
          return false
        }
      }

      return hasStarted && hasNotEnded
    })
  }, [])

  // Load notifications from API and localStorage
  const loadNotifications = useCallback(async () => {
    setLoading(true)
    const currentUser = getCurrentUser()

    try {
      let globalNotifications: any[] = []

      try {
        const response = await fetch("get_notifications.php")
        if (response.ok) {
          const text = await response.text()
          if (text.trim()) {
            globalNotifications = JSON.parse(text)
          }
        }
      } catch (apiError) {
        console.log("[v0] PHP endpoint not available, trying localStorage")
      }

      if (globalNotifications.length === 0) {
        try {
          const stored = localStorage.getItem("notifications")
          if (stored) {
            const parsed = JSON.parse(stored)
            globalNotifications = filterNotifications(parsed, currentUser)
          }
        } catch (storageError) {
          console.warn("[v0] Could not load notifications from localStorage")
          globalNotifications = []
        }
      }

      let allNotifications: Notification[] = []

      if (currentUser) {
        let userNotifications: any[] = []
        try {
          const userNotifData = localStorage.getItem(`notifications_${currentUser.id}`)
          userNotifications = userNotifData ? JSON.parse(userNotifData) : []
        } catch (parseError) {
          console.warn("Could not parse user notifications from localStorage")
          userNotifications = []
        }

        let pinnedNotifications: Record<string, number | null> = {}
        try {
          const pinnedData = localStorage.getItem(`pinnedNotifications_${currentUser.id}`)
          pinnedNotifications = pinnedData ? JSON.parse(pinnedData) : {}
        } catch (parseError) {
          console.warn("Could not parse pinned notifications")
          pinnedNotifications = {}
        }

        const processedUserNotifications = userNotifications.map((notification: any) => ({
          ...notification,
          createdAt: notification.createdAt || notification.date || new Date().toISOString(),
          isPinned: !!pinnedNotifications[notification.id],
          pinnedAt: pinnedNotifications[notification.id] || null,
        }))

        const processedGlobalNotifications = globalNotifications.map((notification: any) => ({
          ...notification,
          createdAt: notification.createdAt || notification.startDate || notification.date || new Date().toISOString(),
          isPinned: !!pinnedNotifications[notification.id],
          pinnedAt: pinnedNotifications[notification.id] || null,
        }))

        allNotifications = [...processedUserNotifications, ...processedGlobalNotifications]
        allNotifications.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1

          // If both pinned, sort by pinnedAt (most recent first)
          if (a.isPinned && b.isPinned) {
            const pinnedATime = a.pinnedAt || 0
            const pinnedBTime = b.pinnedAt || 0
            return pinnedBTime - pinnedATime
          }

          const getTime = (dateStr: string) => {
            try {
              return new Date(dateStr).getTime()
            } catch {
              return 0
            }
          }

          const timeA = getTime(a.createdAt || a.startDate || a.date || "")
          const timeB = getTime(b.createdAt || b.startDate || b.date || "")
          return timeB - timeA
        })

        let readNotifications: Record<string, boolean> = {}
        try {
          const readNotifData = localStorage.getItem(`readNotifications_${currentUser.id}`)
          readNotifications = readNotifData ? JSON.parse(readNotifData) : {}
        } catch (parseError) {
          console.warn("Could not parse read notifications from localStorage")
          readNotifications = {}
        }

        allNotifications = allNotifications.map((notification) => ({
          ...notification,
          read: readNotifications[notification.id] || false,
        }))
      } else {
        allNotifications = globalNotifications
      }

      setNotifications(allNotifications)

      const unread = allNotifications.filter((n) => !n.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("Error loading notifications:", error)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }, [getCurrentUser, filterNotifications])

  const markAsRead = useCallback(
    (notificationId: string) => {
      const currentUser = getCurrentUser()
      if (!currentUser) return

      let readNotifications: Record<string, boolean> = {}
      try {
        const readNotifData = localStorage.getItem(`readNotifications_${currentUser.id}`)
        readNotifications = readNotifData ? JSON.parse(readNotifData) : {}
      } catch (parseError) {
        console.warn("Could not parse read notifications, starting fresh")
        readNotifications = {}
      }

      readNotifications[notificationId] = true

      try {
        localStorage.setItem(`readNotifications_${currentUser.id}`, JSON.stringify(readNotifications))
      } catch (storageError) {
        console.warn("Could not save read notification status")
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      setUnreadCount((prev) => Math.max(0, prev - 1))
    },
    [getCurrentUser],
  )

  const markAllAsRead = useCallback(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    let readNotifications: Record<string, boolean> = {}
    try {
      const readNotifData = localStorage.getItem(`readNotifications_${currentUser.id}`)
      readNotifications = readNotifData ? JSON.parse(readNotifData) : {}
    } catch (parseError) {
      console.warn("Could not parse read notifications, starting fresh")
      readNotifications = {}
    }

    notifications.forEach((notification) => {
      readNotifications[notification.id] = true
    })

    try {
      localStorage.setItem(`readNotifications_${currentUser.id}`, JSON.stringify(readNotifications))
    } catch (storageError) {
      console.warn("Could not save read notification status")
    }

    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }, [getCurrentUser, notifications])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  const togglePinNotification = useCallback(
    (notificationId: string) => {
      const currentUser = getCurrentUser()
      if (!currentUser) return

      let pinnedNotifications: Record<string, number | null> = {}
      try {
        const pinnedData = localStorage.getItem(`pinnedNotifications_${currentUser.id}`)
        pinnedNotifications = pinnedData ? JSON.parse(pinnedData) : {}
      } catch (parseError) {
        console.warn("Could not parse pinned notifications")
        pinnedNotifications = {}
      }

      const isCurrentlyPinned = !!pinnedNotifications[notificationId]

      if (!isCurrentlyPinned) {
        const pinnedCount = Object.values(pinnedNotifications).filter(Boolean).length
        if (pinnedCount >= 3) {
          alert("Bạn chỉ có thể ghim tối đa 3 thông báo")
          return
        }
        // Pin now - store current timestamp
        pinnedNotifications[notificationId] = Date.now()
      } else {
        // Unpin - remove from pinned
        pinnedNotifications[notificationId] = null
      }

      try {
        localStorage.setItem(`pinnedNotifications_${currentUser.id}`, JSON.stringify(pinnedNotifications))
      } catch (storageError) {
        console.warn("Could not save pinned notification status")
      }

      setNotifications((prev) => {
        const updated = prev.map((notification) => {
          if (notification.id === notificationId) {
            return {
              ...notification,
              isPinned: !!pinnedNotifications[notification.id],
              pinnedAt: pinnedNotifications[notification.id],
            }
          }
          return notification
        })

        // Re-sort notifications after pinning/unpinning
        updated.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1

          if (a.isPinned && b.isPinned) {
            const pinnedATime = a.pinnedAt || 0
            const pinnedBTime = b.pinnedAt || 0
            return pinnedBTime - pinnedATime
          }

          const getTime = (dateStr: string) => {
            try {
              return new Date(dateStr).getTime()
            } catch {
              return 0
            }
          }

          const timeA = getTime(a.createdAt || a.startDate || a.date || "")
          const timeB = getTime(b.createdAt || b.startDate || b.date || "")
          return timeB - timeA
        })

        return updated
      })
    },
    [getCurrentUser],
  )

  useEffect(() => {
    loadNotifications()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser" || e.key === "notifications") {
        loadNotifications()
      }
    }

    const handleNotificationUpdate = () => {
      loadNotifications()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("notificationsUpdated", handleNotificationUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("notificationsUpdated", handleNotificationUpdate)
    }
  }, [loadNotifications])

  return {
    notifications: notifications.slice(0, 15),
    loading,
    unreadCount,
    hasMore: notifications.length > 15,
    currentUser: getCurrentUser(),
    loadNotifications,
    markAsRead,
    markAllAsRead,
    formatDate,
    togglePinNotification,
  }
}
