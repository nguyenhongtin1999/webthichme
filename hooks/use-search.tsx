"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SearchResult {
  type: "user" | "product" | "category" | "menu" | "trend" | "entertainment" | "subscription" | "help" | "tool"
  name: string
  url: string
  icon?: string
  thumbnail?: string
  avatar?: string
  username?: string
  fullName?: string
  searchTerms?: string[]
}

interface Product {
  name: string
  image: string
}

export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [productsCache, setProductsCache] = useState<Product[] | null>(null)

  const normalizeText = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
  }, [])

  const createSearchVariations = useCallback(
    (text: string): string[] => {
      if (!text) return []
      const variations = []
      const original = text.toLowerCase()
      const normalized = normalizeText(text)
      variations.push(original)
      if (normalized !== original) variations.push(normalized)
      const withoutSpaces = original.replace(/\s+/g, "")
      if (withoutSpaces !== original && withoutSpaces !== normalized) variations.push(withoutSpaces)
      return variations
    },
    [normalizeText],
  )

  const getUsers = useCallback((): SearchResult[] => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.map((user: any) => {
      const username = user.username || ""
      const fullName = user.name || "Chưa cập nhật tên"
      const searchTerms: string[] = []
      searchTerms.push(`@${username}`, ...createSearchVariations(`@${username}`))
      searchTerms.push(username, ...createSearchVariations(username))
      if (fullName && fullName !== "Chưa cập nhật tên") {
        searchTerms.push(fullName, ...createSearchVariations(fullName))
        searchTerms.push(`@${fullName}`, ...createSearchVariations(`@${fullName}`))
      }
      const uniqueSearchTerms = [...new Set(searchTerms)].filter(Boolean)
      return {
        type: "user" as const,
        name: `@${username}`,
        fullName,
        username,
        avatar: user.avatar || "/placeholder.svg?height=48&width=48&text=User",
        url: `profile.php?user=${username}`,
        searchTerms: uniqueSearchTerms,
      }
    })
  }, [createSearchVariations])

  const getStaticContent = useCallback((): SearchResult[] => {
    return [
      { type: "category", name: "Phát Triển Trí Tuệ", url: "#", icon: "brain" },
      { type: "category", name: "Xếp Hình", url: "#", icon: "puzzle" },
      { type: "category", name: "Âm Nhạc", url: "#", icon: "music" },
      { type: "category", name: "Khoa Học", url: "#", icon: "microscope" },
      { type: "category", name: "Công Nghệ", url: "#", icon: "cpu" },
      { type: "category", name: "Thể Thao", url: "#", icon: "activity" },
      { type: "menu", name: "Trang Chủ", url: "index.php", icon: "home" },
      { type: "menu", name: "Sản Phẩm", url: "#", icon: "package" },
      { type: "menu", name: "Đổi Thưởng", url: "#", icon: "gift" },
      { type: "menu", name: "Ưu Đãi", url: "#", icon: "tag" },
      { type: "menu", name: "Hồ Sơ", url: "profile.php", icon: "user" },
      { type: "menu", name: "Đăng Nhập", url: "login.php", icon: "log-in" },
      { type: "menu", name: "Thông Báo", url: "notifications.php", icon: "bell" },
      { type: "menu", name: "Yêu Thích", url: "favorites.php", icon: "heart" },
      { type: "menu", name: "Tin Nhắn", url: "messaging.php", icon: "message-circle" },
      { type: "menu", name: "Mạng Xã Hội", url: "social-features.php", icon: "users" },
      { type: "trend", name: "Xu hướng", url: "#", icon: "flame" },
      { type: "entertainment", name: "Giải trí & Sáng tạo", url: "#", icon: "sparkles" },
      { type: "subscription", name: "Gói đăng ký", url: "#", icon: "crown" },
      { type: "help", name: "Trợ giúp", url: "#", icon: "help-circle" },
      { type: "tool", name: "AI Tạo Ảnh", url: "#", icon: "image-plus" },
      { type: "tool", name: "Làm Nét Ảnh", url: "#", icon: "image" },
      { type: "tool", name: "Bói Bài Tarot", url: "#", icon: "sparkles" },
      { type: "tool", name: "Tổng Hợp Meme", url: "#", icon: "laugh" },
    ]
  }, [])

  const getProducts = useCallback(async (): Promise<Product[]> => {
    if (productsCache) return productsCache

    try {
      const res = await fetch("/data/products.json", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        console.warn("[v0] Products fetch failed with status:", res.status)
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      const products = Array.isArray(data) ? data : []
      setProductsCache(products)
      return products
    } catch (e) {
      console.warn("[v0] Using mock products data due to fetch error:", e)
      const mockProducts = [
        { name: "Đồ chơi xếp hình LEGO", image: "/placeholder.svg?height=48&width=48&text=LEGO" },
        { name: "Robot thông minh", image: "/placeholder.svg?height=48&width=48&text=Robot" },
        { name: "Bộ thí nghiệm khoa học", image: "/placeholder.svg?height=48&width=48&text=Science" },
        { name: "Đồ chơi giáo dục", image: "/placeholder.svg?height=48&width=48&text=Education" },
        { name: "Puzzle 3D", image: "/placeholder.svg?height=48&width=48&text=Puzzle" },
        { name: "Bộ dụng cụ thí nghiệm", image: "/placeholder.svg?height=48&width=48&text=Lab" },
      ]
      setProductsCache(mockProducts)
      return mockProducts
    }
  }, [productsCache])

  const getTypeLabel = useCallback((type: string): string => {
    switch (type) {
      case "product":
        return "Sản phẩm"
      case "category":
        return "Danh mục"
      case "menu":
        return "Trang"
      case "trend":
        return "Xu hướng"
      case "entertainment":
        return "Giải trí & Sáng tạo"
      case "subscription":
        return "Gói đăng ký"
      case "help":
        return "Trợ giúp"
      case "tool":
        return "Công cụ"
      case "user":
        return "Người dùng"
      default:
        return ""
    }
  }, [])

  const highlightText = useCallback((text: string, searchQuery: string): string => {
    if (!searchQuery) return text
    const safeQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return text.replace(new RegExp(safeQuery, "gi"), `<mark class="bg-yellow-200 px-1 rounded">$&</mark>`)
  }, [])

  const performSearch = useCallback(
    async (searchQuery: string) => {
      const trimmedQuery = searchQuery.toLowerCase().trim()

      if (trimmedQuery === "") {
        setResults([])
        setIsOpen(false)
        return
      }

      // Non-@ queries must be at least 2 chars
      if (!trimmedQuery.startsWith("@") && trimmedQuery.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      const users = getUsers()
      const staticContent = getStaticContent()
      let searchResults: SearchResult[] = []

      // User search: only when startsWith @ and length >= 3
      if (trimmedQuery.startsWith("@") && trimmedQuery.length >= 3) {
        const normalizedQuery = normalizeText(trimmedQuery)
        const queryWithoutAt = trimmedQuery.substring(1)
        const normalizedQueryWithoutAt = normalizeText(queryWithoutAt)

        const userResults = users.filter((item) => {
          return item.searchTerms?.some((term) => {
            const normalizedTerm = normalizeText(term)
            if (term.toLowerCase().includes(trimmedQuery)) return true
            if (normalizedTerm.includes(normalizedQuery)) return true
            if (term.toLowerCase().includes(queryWithoutAt)) return true
            if (normalizedTerm.includes(normalizedQueryWithoutAt)) return true
            return false
          })
        })
        searchResults = searchResults.concat(userResults)
      }

      // Non-user search (products + other static items), only when length >= 2
      if (!trimmedQuery.startsWith("@") && trimmedQuery.length >= 2) {
        const normalizedQuery = normalizeText(trimmedQuery)

        // Products
        const products = await getProducts()
        const productResults = products
          .filter((p) => {
            const name = p.name || ""
            const normName = normalizeText(name)
            return name.toLowerCase().includes(trimmedQuery) || normName.includes(normalizedQuery)
          })
          .map((p) => ({
            type: "product" as const,
            name: p.name,
            url: "index.php",
            thumbnail: p.image,
          }))

        // Other static items
        const others = staticContent.filter((item) => item.name.toLowerCase().includes(trimmedQuery))

        searchResults = searchResults.concat(productResults, others)
      }

      // If searching with @, keep users first
      if (trimmedQuery.startsWith("@")) {
        searchResults.sort((a, b) => {
          if (a.type === "user" && b.type !== "user") return -1
          if (a.type !== "user" && b.type === "user") return 1
          return 0
        })
      }

      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
      setIsLoading(false)
    },
    [getUsers, getStaticContent, getProducts, normalizeText],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, performSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    isLoading,
    searchRef,
    highlightText,
    getTypeLabel,
  }
}
