"use client"

import { useState, useEffect, useCallback } from "react"

export interface FavoriteProduct {
  id: number
  name: string
  price: number
  original_price?: number
  discount_percent?: number
  image: string
  tags?: Array<{
    name: string
    icon: string
    color: string
    textColor: string
  }>
}

export interface FavoriteApp {
  id: number
  name: string
  description?: string
  icon?: string
  type?: string
}

export interface FavoriteArticle {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
}

export interface FavoriteVideo {
  id: number
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
}

export function useFavorites() {
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([])
  const [favoriteApps, setFavoriteApps] = useState<FavoriteApp[]>([])
  const [favoriteArticles, setFavoriteArticles] = useState<FavoriteArticle[]>([])
  const [favoriteVideos, setFavoriteVideos] = useState<FavoriteVideo[]>([])
  const [activeTab, setActiveTab] = useState<"products" | "apps" | "saved">("products")
  const [savedFilter, setSavedFilter] = useState<"articles" | "videos">("articles")

  // Get current user from session storage
  const getCurrentUser = useCallback(() => {
    try {
      const user = sessionStorage.getItem("currentUser")
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  }, [])

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      setFavoriteProducts([])
      setFavoriteApps([])
      setFavoriteArticles([])
      setFavoriteVideos([])
      return
    }

    // Load from user data
    setFavoriteProducts((currentUser.favorites || []).slice().reverse())
    setFavoriteApps((currentUser.favoriteApps || []).slice().reverse())
    setFavoriteArticles((currentUser.favoriteArticles || []).slice().reverse())
    setFavoriteVideos((currentUser.favoriteVideos || []).slice().reverse())
  }, [getCurrentUser])

  // Remove favorite item
  const removeFavorite = useCallback(
    (itemId: number, type: "product" | "app" | "article" | "video") => {
      const currentUser = getCurrentUser()
      if (!currentUser) return

      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: any) => u.id === currentUser.id)

        if (userIndex === -1) return

        let itemName = ""

        // Remove from appropriate array
        if (type === "product") {
          const item = users[userIndex].favorites?.find((f: any) => f.id === itemId)
          itemName = item?.name || "sản phẩm này"
          users[userIndex].favorites = (users[userIndex].favorites || []).filter((f: any) => f.id !== itemId)
          setFavoriteProducts((prev) => prev.filter((p) => p.id !== itemId))
        } else if (type === "app") {
          const item = users[userIndex].favoriteApps?.find((f: any) => f.id === itemId)
          itemName = item?.name || "ứng dụng này"
          users[userIndex].favoriteApps = (users[userIndex].favoriteApps || []).filter((f: any) => f.id !== itemId)
          setFavoriteApps((prev) => prev.filter((a) => a.id !== itemId))
        } else if (type === "article") {
          const item = users[userIndex].favoriteArticles?.find((f: any) => f.id === itemId)
          itemName = item?.title || "bài viết này"
          users[userIndex].favoriteArticles = (users[userIndex].favoriteArticles || []).filter(
            (f: any) => f.id !== itemId,
          )
          setFavoriteArticles((prev) => prev.filter((a) => a.id !== itemId))
        } else if (type === "video") {
          const item = users[userIndex].favoriteVideos?.find((f: any) => f.id === itemId)
          itemName = item?.title || "video này"
          users[userIndex].favoriteVideos = (users[userIndex].favoriteVideos || []).filter((f: any) => f.id !== itemId)
          setFavoriteVideos((prev) => prev.filter((v) => v.id !== itemId))
        }

        // Update localStorage and sessionStorage
        localStorage.setItem("users", JSON.stringify(users))
        sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))

        // Show toast notification (if available)
        if (typeof window !== "undefined" && (window as any).showToast) {
          const message =
            type === "product" || type === "app"
              ? `Đã xóa ${type === "product" ? "sản phẩm" : "ứng dụng"} khỏi danh sách yêu thích!`
              : `Đã bỏ lưu ${type === "video" ? "video" : "bài viết"} thành công!`
          ;(window as any).showToast(message, "info")
        }
      } catch (error) {
        console.error("Error removing favorite:", error)
      }
    },
    [getCurrentUser],
  )

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }, [])

  // Load favorites on mount and when user changes
  useEffect(() => {
    loadFavorites()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        loadFavorites()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadFavorites])

  return {
    favoriteProducts,
    favoriteApps,
    favoriteArticles,
    favoriteVideos,
    activeTab,
    savedFilter,
    currentUser: getCurrentUser(),
    hasMoreProducts: favoriteProducts.length > 15,
    hasMoreApps: favoriteApps.length > 15,
    hasMoreArticles: favoriteArticles.length > 15,
    hasMoreVideos: favoriteVideos.length > 15,
    setActiveTab,
    setSavedFilter,
    removeFavorite,
    formatDate,
    loadFavorites,
  }
}
