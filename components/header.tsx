"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import ReactDOM from "react-dom"
import { useRouter } from "next/navigation"

import Image from "next/image"
import Link from "next/link"
import "../styles/header.css"
import "../css/weather-widget.css"
import "../css/theme-toggle.css"
import "../css/ios-modern-menu.css"
import "../css/scrollable-navigation.css"
import "../css/space-login-button.css"
import "../css/utility-classes.css"
import { useAvatarManager } from "../hooks/use-avatar-manager"
import AvatarUploadModal from "./avatar-upload-modal"
import { useNotifications } from "../hooks/use-notifications"
import { NotificationPanel } from "./notification-panel"
import { FavoritesPanel } from "./favorites-panel"
import { useWeatherWidget } from "../hooks/use-weather-widget"
import { useSearch } from "../hooks/use-search"
import { useAuth } from "../hooks/use-auth"
import { LogoutConfirmationModal } from "./logout-confirmation-modal"
import { RemoveConfirmationModal } from "./remove-confirmation-modal"
import { useMusicPlayer } from "../hooks/useMusicPlayer"
import { Home, Package, Gift, Tag, Search, Bell, ShoppingCart, User, Menu, X, UserPlus, Volume2, VolumeX, CloudyIcon, CalendarClock, Flame, Sparkles, Crown, HelpCircle, Plus, ShoppingBag, Trash2, Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, List, Heart, TrendingUp, Headphones, Music, Settings, LogOut, Eye, ExternalLink, TicketPlus, Truck, TicketPercent, ChevronUp, ChevronDown, Filter, Grid3X3 as Grid3x3Gap8, Mic } from "lucide-react"
import WeatherWidget from "./weather-widget"
import SearchDropdown from "./search-dropdown"
import DiscountCodeModal from "./discount-code-modal"
import { NotificationDetailModal } from "./notification-detail-modal"
import { MobileNavbar } from "./mobile-navbar"
import { CustomizeLibraryPanel } from "./customize-library-panel"

interface HeaderProps {
  pageCSS?: string
  pageJS?: string
}

const availableCodes = [
  {
    id: "DISCOUNT10",
    type: "discount",
    value: 10,
    name: "Giảm 10%",
    description: "Giảm 10% tổng giá trị đơn hàng",
    icon: "ticket-percent",
    color: "bg-red-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
  {
    id: "DISCOUNT20",
    type: "discount",
    value: 20,
    name: "Giảm 20%",
    description: "Giảm 20% tổng giá trị đơn hàng",
    icon: "ticket-percent",
    color: "bg-orange-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
  {
    id: "DISCOUNT30",
    type: "discount",
    value: 30,
    name: "Giảm 30%",
    description: "Giảm 30% tổng giá trị đơn hàng",
    icon: "ticket-percent",
    color: "bg-yellow-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
  {
    id: "FREESHIP",
    type: "shipping",
    value: 100,
    name: "Miễn phí vận chuyển",
    description: "Miễn phí vận chuyển cho đơn hàng",
    icon: "truck",
    color: "bg-green-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
  {
    id: "FREESHIP50",
    type: "shipping",
    value: 50,
    name: "Giảm 50% phí vận chuyển",
    description: "Giảm 50% phí vận chuyển cho đơn hàng",
    icon: "truck",
    color: "bg-emerald-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
  {
    id: "COMBO15",
    type: "discount",
    value: 15,
    name: "Combo giảm 15%",
    description: "Giảm 15% khi mua combo sản phẩm",
    icon: "package",
    color: "bg-blue-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
  {
    id: "NEWUSER",
    type: "discount",
    value: 25,
    name: "Người dùng mới - Giảm 25%",
    description: "Giảm 25% cho người dùng mới",
    icon: "user-plus",
    color: "bg-purple-500",
    textColor: "text-white",
    expiryDate: "2025-12-31",
    discountType: "percentage",
  },
]

export default function Header({ pageCSS, pageJS }: HeaderProps) {
  const router = useRouter()
  const [isMobileHeaderBottom, setIsMobileHeaderBottom] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isSearchFilterOpen, setIsSearchFilterOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  // </CHANGE>
  const [searchFilters, setSearchFilters] = useState({
    searchType: "all", // Changed default from "product" to "all"
    category: "all",
    priceRange: { min: 0, max: 10000000 },
    sortBy: "newest",
    inStock: false,
    // User search filters
    userActivity: "all", // all, active, inactive
    userSort: "followers", // followers, posts, joined
    // Category search filters
    categoryType: "all", // all, main, sub
  })
  // </CHANGE>
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [avatarOpacity, setAvatarOpacity] = useState(1)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const [showCustomizePanel, setShowCustomizePanel] = useState(false) // Added for CustomizeLibraryPanel

  const [isSideMenuOpen, setSideMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [panelAnimating, setPanelAnimating] = useState<string | null>(null)
  const [cartItemCount, setCartItemCount] = useState(0)
  // Initialize dark mode from localStorage on component mount
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCodeModalOpen, setCodeModalOpen] = useState(false)
  const [isBubbleModalOpen, setBubbleModalOpen] = useState(false)
  const [activeFavTab, setActiveFavTab] = useState("products")
  const [activeSavedFilter, setActiveSavedFilter] = useState("articles")
  const [isCartRemovalModalOpen, setIsCartRemovalModalOpen] = useState(false)
  const [cartItemToRemove, setCartItemToRemove] = useState<any>(null)

  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isWeatherWidgetActive, setIsWeatherWidgetActive] = useState(false)

  const [selectedCodes, setSelectedCodes] = useState<any[]>([])
  const [currentItemId, setCurrentItemId] = useState<number | null>(null)
  const [codeFilter, setCodeFilter] = useState("all")
  const [codeSearchTerm, setCodeSearchTerm] = useState("")

  const [lastAppliedItemId, setLastAppliedItemId] = useState<number | null>(null)

  const [menuScrollPosition, setMenuScrollPosition] = useState(0)
  const [isSwipeIndicatorVisible, setIsSwipeIndicatorVisible] = useState(false)
  const [menuOverlayOpacity, setMenuOverlayOpacity] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeTransform, setSwipeTransform] = useState("")

  const [isCartOperationInProgress, setIsCartOperationInProgress] = useState(false)

  const [notificationPanelViewed, setNotificationPanelViewed] = useState(false)
  const [cartPanelViewed, setCartPanelViewed] = useState(false)

  // New state for selected notification
  const [selectedNotification, setSelectedNotification] = useState<any>(null)

  // New state for voice input
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  // useEffect is already imported at the top

  const { unreadCount: notificationCount, markAsRead: markNotificationAsRead } = useNotifications()

  const [showNotificationBadge, setShowNotificationBadge] = useState(notificationCount > 0)
  const [showCartBadge, setShowCartBadge] = useState(cartItemCount > 0)
  const prevNotificationCountRef = useRef(notificationCount)
  const prevCartCountRef = useRef(cartItemCount)

  const { currentUser } = useAuth()
  const [showDefaultLogo, setShowDefaultLogo] = useState(false) // Added to fix undeclared variable error

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = "vi-VN"

      recognitionRef.current.onstart = () => setIsListening(true)
      recognitionRef.current.onend = () => {
        setIsListening(false)
        // Automatically re-enable microphone if search is focused and not expanded
        if (
          isSearchFocused &&
          !isSearchExpanded &&
          searchInputRef.current &&
          document.activeElement === searchInputRef.current
        ) {
          if (recognitionRef.current && !isListening) {
            recognitionRef.current.start()
          }
        }
      }

      recognitionRef.current.onresult = (event: any) => {
        let transcript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setSearchQueryHook((prev) => prev + (prev ? " " : "") + transcript)
      }
    }
  }, [isSearchFocused, isSearchExpanded]) // Re-run if focus or expanded state changes

  const handleMicClick = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  useEffect(() => {
    const savedHeaderPosition = localStorage.getItem("mobile-header-position")
    if (savedHeaderPosition === "bottom") {
      setIsMobileHeaderBottom(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("mobile-header-position", isMobileHeaderBottom ? "bottom" : "top")
  }, [isMobileHeaderBottom])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-mode")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    } else if (savedTheme === "light") {
      setIsDarkMode(false)
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode")
      localStorage.setItem("theme-mode", "dark")
    } else {
      document.body.classList.remove("dark-mode")
      localStorage.setItem("theme-mode", "light")
    }
  }, [isDarkMode])

  useEffect(() => {
    if (!currentUser) {
      // Show logo when not logged in
      setAvatarOpacity(0)
      setLogoOpacity(1)
      setShowDefaultLogo(true)
      return
    }

    setAvatarOpacity(1)
    setLogoOpacity(0)
    setShowDefaultLogo(false)

    // Start animation cycle after initial state is set
    const timeoutId = setTimeout(() => {
      const interval = setInterval(
        () => {
          // Phase 1: Avatar to Logo (3 seconds fade out)
          let elapsed = 0
          const fadeDuration = 3000 // 3 seconds
          const startTime = Date.now()

          const fadeOutAvatarInterval = setInterval(() => {
            elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / fadeDuration, 1)

            setAvatarOpacity(1 - progress)
            setLogoOpacity(progress)
            setShowDefaultLogo(true)

            if (progress >= 1) {
              clearInterval(fadeOutAvatarInterval)
            }
          }, 16) // ~60fps

          setTimeout(() => {
            const fadeInTime = Date.now()
            let fadeInElapsed = 0

            const fadeInAvatarInterval = setInterval(() => {
              fadeInElapsed = Date.now() - fadeInTime
              const progress = Math.min(fadeInElapsed / fadeDuration, 1)

              setLogoOpacity(1 - progress)
              setAvatarOpacity(progress)
              setShowDefaultLogo(false)

              if (progress >= 1) {
                clearInterval(fadeInAvatarInterval)
                // Reset to initial state
                setAvatarOpacity(1)
                setLogoOpacity(0)
              }
            }, 16) // ~60fps
          }, 5000) // Reduced logo display time from 8s to 5s (3s fade + 2s display)
        },
        5 * 60 * 1000,
      ) // Increased total cycle from 1 minute to 5 minutes

      return () => clearInterval(interval)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [currentUser])

  const {
    isMusicPlayerVisible,
    setIsMusicPlayerVisible,
    isPlaying,
    currentSongIndex,
    repeatShuffleState,
    currentTime,
    duration,
    showPlaylist,
    showSongList,
    setShowSongList,
    searchQuery,
    setSearchQuery,
    favoriteSongs,
    playlist,
    currentSong,
    filteredSongs,
    audioPlayerRef,
    togglePlayPause,
    prevSong,
    nextSong,
    toggleRepeatMode,
    handleProgressClick,
    showCategory,
    playSongByIndex,
    toggleFavorite,
    handlePlaylistToggle,
    pauseSong,
    setShowPlaylist,
    showNotification,
    notificationMessage,
    setShowNotification,
    loadUserFavorites,
    currentPlaylistCategory,
    isLoggedIn,
    isActivePlayer,
    userPlaylists, // Added userPlaylists from hook
  } = useMusicPlayer()

  const [weatherData, setWeatherData] = useState({
    condition: "",
    temperature: "",
    time: "",
    date: "",
    location: "",
    icon: "",
  })

  const searchInputRef = useRef<HTMLInputElement>(null)

  const {
    isAvatarOverlayOpen,
    selectedAvatar,
    previewImage,
    currentUser: avatarCurrentUser,
    initializeUser: avatarInitializeUser,
    handleFileSelect,
    selectPresetAvatar,
    updateAvatar: avatarUpdateAvatar,
    closeAvatarOverlay,
    openAvatarOverlay,
  } = useAvatarManager()

  // const { unreadCount: notificationCount } = useNotifications() // Moved up

  const { isActive: showWeatherWidget, toggleWeatherWidget } = useWeatherWidget()

  const {
    query: searchQueryHook,
    setQuery: setSearchQueryHook,
    results: searchResults,
    isOpen: showSearchResults,
    setIsOpen: setShowSearchResults,
    isLoading: isSearchLoading,
    searchRef,
    highlightText,
    getTypeLabel,
  } = useSearch()

  const {
    isLoading: isAuthLoading,
    isLogoutModalOpen,
    initializeUser,
    updateAvatar,
    showLogoutConfirmation,
    hideLogoutConfirmation,
    performLogout,
    redirectToLogin,
    isAuthenticated,
    needsAvatarSetup,
  } = useAuth()

  useEffect(() => {
    initializeUser()
    avatarInitializeUser()
  }, [initializeUser, avatarInitializeUser])

  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "0")) {
        e.preventDefault()
      }
    }

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    // Add CSS to prevent zooming
    document.body.style.touchAction = "manipulation"
    document.documentElement.style.touchAction = "manipulation"

    // Add event listeners
    document.addEventListener("touchstart", preventZoom, { passive: false })
    document.addEventListener("touchmove", preventZoom, { passive: false })
    document.addEventListener("keydown", preventKeyboardZoom)
    document.addEventListener("wheel", preventWheelZoom, { passive: false })

    return () => {
      // Cleanup event listeners
      document.removeEventListener("touchstart", preventZoom)
      document.removeEventListener("touchmove", preventZoom)
      document.removeEventListener("keydown", preventKeyboardZoom)
      document.removeEventListener("wheel", preventWheelZoom)
    }
  }, [])

  useEffect(() => {
    if (pageCSS) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = pageCSS
      document.head.appendChild(link)
      return () => document.head.removeChild(link)
    }
  }, [pageCSS])

  useEffect(() => {
    if (pageJS) {
      const script = document.createElement("script")
      script.src = pageJS
      script.defer = true
      document.head.appendChild(script)
      return () => document.head.removeChild(script)
    }
  }, [pageJS])

  useEffect(() => {
    const updateWeather = () => {
      const now = new Date()
      setWeatherData({
        condition: "Sunny",
        temperature: "25",
        time: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        date: now.toLocaleDateString("vi-VN"),
        location: "Hà Nội, Việt Nam",
        icon: "wb_sunny",
      })
    }

    updateWeather()
    const interval = setInterval(updateWeather, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      loadUserFavorites()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
      // Also listen for sessionStorage changes
      const originalSetItem = sessionStorage.setItem
      sessionStorage.setItem = function (key, value) {
        originalSetItem.apply(this, arguments)
        if (key === "currentUser") {
          loadUserFavorites()
        }
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [loadUserFavorites])

  const toggleWeatherWidgetHandler = () => {
    const newWeatherState = !isWeatherWidgetActive
    setIsWeatherWidgetActive(newWeatherState)

    if (newWeatherState) {
      setIsMusicPlayerVisible(false)
      setShowSongList(false)
      setShowPlaylist(false)
    } else {
      if (isAudioOn) {
        setIsMusicPlayerVisible(true)
      }
    }
  }

  const toggleAudioHandler = () => {
    setIsAudioOn(!isAudioOn)

    if (!isAudioOn) {
      if (!isWeatherWidgetActive) {
        setIsMusicPlayerVisible(true)
      }
      document.querySelectorAll("audio, video").forEach((el: any) => {
        el.muted = false
      })
    } else {
      setIsMusicPlayerVisible(false)
      setShowPlaylist(false)
      setShowSongList(false)
      pauseSong()
      document.querySelectorAll("audio, video").forEach((el: any) => {
        el.muted = true
      })
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const heartStyles = `
.heart-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.heart-container {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  transition: 100ms;
}

.heart-checkmark {
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  transition: 100ms;
  animation: dislike_effect 400ms ease;
}

.heart-container input:checked ~ .heart-checkmark path {
  fill: #FF5353;
  stroke-width: 20px;
  stroke: #FFF;
}

.heart-container input:checked ~ .heart-checkmark {
  animation: like_effect 400ms ease;
}

.heart-container:hover {
  transform: scale(1.1);
}

@keyframes like_effect {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes dislike_effect {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
`

  const animatePanel = (panelId: string, show: boolean) => {
    if (show) {
      setActivePanel(panelId)
      setPanelAnimating(`${panelId}-opening`)
      setTimeout(() => setPanelAnimating(null), 300)
    } else {
      setPanelAnimating(`${panelId}-closing`)
      setTimeout(() => {
        setActivePanel(null)
        setPanelAnimating(null)
      }, 300)
    }
  }

  const togglePanel = (panelId: string) => {
    if (isSideMenuOpen) {
      return
    }

    if (activePanel === panelId) {
      // Close current panel with slide-up animation
      animatePanel(panelId, false)
    } else {
      if (activePanel) {
        // Quick close current panel and immediately open new panel
        setPanelAnimating(`${activePanel}-closing`)
        setActivePanel(panelId)
        setPanelAnimating(`${panelId}-opening`)

        // Clean up animations after completion
        setTimeout(() => setPanelAnimating(null), 300)
      } else {
        // No panel open, just open the new one
        animatePanel(panelId, true)
      }
    }
  }

  useEffect(() => {
    if (notificationCount > 0 && prevNotificationCountRef.current < notificationCount) {
      // New notification arrived - reset the panel viewed state and show badge
      setShowNotificationBadge(true)
      setNotificationPanelViewed(false)
    }
    // If count goes to 0, hide badge
    if (notificationCount === 0) {
      setShowNotificationBadge(false)
    }
    prevNotificationCountRef.current = notificationCount
  }, [notificationCount])

  useEffect(() => {
    // If count changes from 0 to > 0, show badge with animation
    if (cartItemCount > 0 && prevCartCountRef.current === 0) {
      setShowCartBadge(true)
      setCartPanelViewed(false)
    }
    // If count goes to 0, hide badge when panel is closed
    if (cartItemCount === 0 && !cartPanelViewed) {
      setShowCartBadge(false)
    }
    prevCartCountRef.current = cartItemCount
  }, [cartItemCount, cartPanelViewed])

  const togglePanelWithBadgeLogic = (panelId: string) => {
    if (panelId === "notifications") {
      setNotificationPanelViewed(true)
      setShowNotificationBadge(false)
    } else if (panelId === "cart") {
      setCartPanelViewed(true)
      setShowCartBadge(false)
    }
    togglePanel(panelId)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activePanel && !isCartOperationInProgress) {
        const panel = document.getElementById(`${activePanel}Panel`)
        const button = document.querySelector(`[data-panel="${activePanel}"]`) as HTMLElement
        const headerElement = document.querySelector("header")

        const isClickInsidePanel = panel?.contains(event.target as Node)

        const target = event.target as HTMLElement
        const isInteractiveElement =
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest(".quantity-controls") ||
          target.closest(".remove-cart-item")

        if (
          panel &&
          button &&
          !isClickInsidePanel &&
          !isInteractiveElement &&
          !button.contains(event.target as Node) &&
          !headerElement?.contains(event.target as Node)
        ) {
          // Use slide-up animation when closing by clicking outside
          animatePanel(activePanel, false)
        }
      }
    }

    const handleRouteChange = () => {
      if (activePanel) {
        animatePanel(activePanel, false)
      }
    }

    document.addEventListener("click", handleClickOutside, true)
    document.addEventListener("touchstart", handleClickOutside, true)

    window.addEventListener("beforeunload", handleRouteChange)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      document.removeEventListener("click", handleClickOutside, true)
      document.removeEventListener("touchstart", handleClickOutside, true)
      window.removeEventListener("beforeunload", handleRouteChange)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [activePanel, isCartOperationInProgress])

  useEffect(() => {
    const handleCartStorageChange = (e: StorageEvent | CustomEvent) => {
      if ("key" in e && e.key === "currentUser" && e.newValue) {
        // Storage event from useAuth will trigger currentUser update
        // This ensures cart panel refreshes when items are added
      } else if (e.type === "cartUpdated") {
        // Custom event for immediate cart updates
        const userString = sessionStorage.getItem("currentUser")
        if (userString) {
          const updatedUser = JSON.parse(userString)
          // Force re-render by updating a timestamp or similar
          if (activePanel === "cart") {
            setTimeout(() => {
              calculateCartTotal()
            }, 50)
          }
        }
      }
    }

    window.addEventListener("storage", handleCartStorageChange as EventListener)
    window.addEventListener("cartUpdated", handleCartStorageChange as EventListener)

    return () => {
      window.removeEventListener("storage", handleCartStorageChange as EventListener)
      window.removeEventListener("cartUpdated", handleCartStorageChange as EventListener)
    }
  }, [activePanel])

  useEffect(() => {
    if (isSideMenuOpen && activePanel) {
      // Close any open panel when menu opens
      animatePanel(activePanel, false)
    }
  }, [isSideMenuOpen])

  const updateCartSelection = () => {
    const checkboxes = document.querySelectorAll(".cart-item-checkbox") as NodeListOf<HTMLInputElement>
    const selectAllCheckbox = document.getElementById("selectAllItems") as HTMLInputElement
    const selectedProductCountElement = document.getElementById("selectedProductCount")

    // Check if all items are selected
    const allSelected = Array.from(checkboxes).every((checkbox) => checkbox.checked)
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allSelected
    }

    // Count selected items
    const selectedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length

    // Update the selected product count display with animation
    if (selectedProductCountElement) {
      selectedProductCountElement.classList.add("scale-110", "text-orange-500")
      setTimeout(() => {
        selectedProductCountElement.classList.remove("scale-110", "text-orange-500")
      }, 300)
      selectedProductCountElement.textContent = `${selectedCount} sản phẩm`
    }

    // Calculate total for selected items
    calculateCartTotal()
  }

  const calculateCartTotal = () => {
    if (!currentUser?.cart) return

    const checkboxes = document.querySelectorAll(".cart-item-checkbox") as NodeListOf<HTMLInputElement>

    // Get selected item IDs
    const selectedItemIds = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => Number.parseInt(checkbox.getAttribute("data-id") || "0"))

    const selectedItems = currentUser.cart.filter((item: any) => selectedItemIds.includes(item.id))

    // Calculate initial total
    const subtotal = selectedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    let totalDiscount = 0
    let totalShippingDiscount = 0
    let hasDiscountCode = false
    let hasShippingCode = false

    selectedItems.forEach((item: any) => {
      const appliedCodes = item.appliedCodes || []

      if (appliedCodes.length > 0) {
        hasDiscountCode = true
      }

      const hasOriginalDiscount = item.discount_percent && item.discount_percent > 0
      const basePrice = hasOriginalDiscount ? item.price * (1 - item.discount_percent / 100) : item.price
      const itemSubtotal = basePrice * item.quantity

      appliedCodes.forEach((code: any) => {
        if (code.type === "discount") {
          let discount = 0
          if (code.discountType === "percentage") {
            // Apply percentage discount on the already discounted price
            discount = (itemSubtotal * code.value) / 100
          } else if (code.discountType === "fixed") {
            discount = Math.min(code.value, itemSubtotal)
          }
          totalDiscount += discount
        } else if (code.type === "shipping") {
          hasShippingCode = true
          if (code.discountType === "percentage") {
            totalShippingDiscount += (30000 * code.value) / 100
          } else if (code.discountType === "fixed") {
            totalShippingDiscount += Math.min(code.value, 30000)
          }
        }
      })
    })

    const baseShippingFee = selectedItems.length > 0 ? 30000 : 0
    const finalShippingFee = Math.max(0, baseShippingFee - totalShippingDiscount)

    // Update UI
    const subtotalElement = document.getElementById("cartSubtotal")
    const discountElement = document.getElementById("cartDiscountAmount")
    const shippingElement = document.getElementById("cartShippingFee")
    const totalElement = document.getElementById("cartTotal")
    const discountLabel = document.getElementById("discountLabel")
    const checkoutButton = document.getElementById("checkoutButton") as HTMLButtonElement

    if (subtotalElement) {
      subtotalElement.textContent = `${subtotal.toLocaleString("vi-VN")} ₫`
    }
    if (discountElement) {
      discountElement.textContent = `-${totalDiscount.toLocaleString("vi-VN")} ₫`
    }
    if (shippingElement) {
      if (hasShippingCode && totalShippingDiscount > 0) {
        shippingElement.innerHTML = `
          <span class="line-through text-gray-400">${baseShippingFee.toLocaleString("vi-VN")} ₫</span>
          <span class="ml-1 text-green-600">${finalShippingFee.toLocaleString("vi-VN")} ₫</span>
        `
      } else {
        shippingElement.textContent = `${finalShippingFee.toLocaleString("vi-VN")} ₫`
      }
    }
    if (totalElement) {
      totalElement.textContent = `${(subtotal - totalDiscount + finalShippingFee).toLocaleString("vi-VN")} ₫`
    }
    if (discountLabel) {
      discountLabel.textContent = hasDiscountCode ? "Giảm giá:" : "Mã giảm giá:"
    }

    // Update checkout button state
    if (checkoutButton) {
      if (selectedItems.length > 0) {
        checkoutButton.classList.remove("opacity-50", "cursor-not-allowed")
        checkoutButton.disabled = false
      } else {
        checkoutButton.classList.add("opacity-50", "cursor-not-allowed")
        checkoutButton.disabled = true
      }
    }
  }

  const updateCartItemQuantity = (itemId: number, isIncrement: boolean) => {
    if (!currentUser?.cart) return

    setIsCartOperationInProgress(true)

    const updatedCart = currentUser.cart.map((item: any) => {
      if (item.id === itemId) {
        if (isIncrement) {
          return { ...item, quantity: item.quantity + 1 }
        } else {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 }
          } else {
            // Show toast for minimum quantity
            console.log("Số lượng tối thiểu là 1")
            return item
          }
        }
      }
      return item
    })

    const updatedUser = { ...currentUser, cart: updatedCart }

    if (typeof window !== "undefined") {
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex].cart = updatedCart
        localStorage.setItem("users", JSON.stringify(users))
      }

      // Update current user in sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Trigger a storage event to update other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "currentUser",
          newValue: JSON.stringify(updatedUser),
        }),
      )
    }

    updateAvatar(currentUser.avatar)

    // Show success message
    console.log(isIncrement ? "Đã tăng số lượng sản phẩm" : "Đã giảm số lượng sản phẩm")

    setTimeout(() => {
      setIsCartOperationInProgress(false)
    }, 100)
  }

  const removeCartItem = (itemId: number) => {
    if (!currentUser?.cart) return

    const item = currentUser.cart.find((item: any) => item.id === itemId)
    if (!item) return

    setCartItemToRemove(item)
    setIsCartOperationInProgress(true)
    setIsCartRemovalModalOpen(true)
  }

  const handleConfirmCartRemoval = () => {
    if (!cartItemToRemove || !currentUser?.cart) return

    const updatedCart = currentUser.cart.filter((item: any) => item.id !== cartItemToRemove.id)
    const updatedUser = { ...currentUser, cart: updatedCart }

    if (typeof window !== "undefined") {
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex].cart = updatedCart
        localStorage.setItem("users", JSON.stringify(users))
      }

      // Update current user in sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Trigger a storage event to update other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "currentUser",
          newValue: JSON.stringify(updatedUser),
        }),
      )
    }

    updateAvatar(currentUser.avatar)

    console.log("Item removed from cart:", cartItemToRemove.name)
    console.log("Updated cart:", updatedCart)

    setIsCartRemovalModalOpen(false)
    setCartItemToRemove(null)
    setTimeout(() => {
      setIsCartOperationInProgress(false)
    }, 100)
  }

  const handleCancelCartRemoval = () => {
    setIsCartRemovalModalOpen(false)
    setCartItemToRemove(null)
    setIsCartOperationInProgress(false)
  }

  const removeCodeFromItem = (itemId: number, codeId: string) => {
    if (!currentUser?.cart) return

    const updatedCart = currentUser.cart.map((item: any) => {
      if (item.id === itemId) {
        const appliedCodes = item.appliedCodes || []
        const updatedCodes = appliedCodes.filter((code: any) => code.id !== codeId)
        return { ...item, appliedCodes: updatedCodes }
      }
      return item
    })

    const updatedUser = { ...currentUser, cart: updatedCart }

    if (typeof window !== "undefined") {
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex].cart = updatedCart
        localStorage.setItem("users", JSON.stringify(users))
      }

      // Update current user in sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Trigger a storage event to update other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "currentUser",
          newValue: JSON.stringify(updatedUser),
        }),
      )
    }

    updateAvatar(currentUser.avatar)

    console.log("Code removed from item")

    // Recalculate totals
    setTimeout(() => {
      calculateCartTotal()
    }, 100)
  }

  const applySelectedCodesToItem = () => {
    if (!currentUser?.cart || !currentItemId || selectedCodes.length === 0) return

    const updatedCart = currentUser.cart.map((item: any) => {
      if (item.id === currentItemId) {
        const existingCodes = item.appliedCodes || []

        const newCodes = [...selectedCodes]
        const finalCodes: any[] = []

        // Keep existing codes that don't conflict with new ones
        existingCodes.forEach((existingCode: any) => {
          const hasConflict = newCodes.some((newCode: any) => newCode.type === existingCode.type)
          if (!hasConflict) {
            finalCodes.push(existingCode)
          }
        })

        // Add new codes (max 1 per type)
        const discountCodes = newCodes.filter((code: any) => code.type === "discount")
        const shippingCodes = newCodes.filter((code: any) => code.type === "shipping")

        if (discountCodes.length > 0) {
          finalCodes.push(discountCodes[0]) // Only take first discount code
        }
        if (shippingCodes.length > 0) {
          finalCodes.push(shippingCodes[0]) // Only take first shipping code
        }

        return { ...item, appliedCodes: finalCodes }
      }
      return item
    })

    const updatedUser = { ...currentUser, cart: updatedCart }

    if (typeof window !== "undefined") {
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex].cart = updatedCart
        localStorage.setItem("users", JSON.stringify(users))
      }

      // Update current user in sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Trigger a storage event to update other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "currentUser",
          newValue: JSON.stringify(updatedUser),
        }),
      )
    }

    setCodeModalOpen(false)
    setSelectedCodes([])
    setLastAppliedItemId(currentItemId)
    setCurrentItemId(null)

    updateAvatar(currentUser.avatar)

    // Recalculate totals
    setTimeout(() => {
      calculateCartTotal()
    }, 100)

    setTimeout(() => {
      togglePanelWithBadgeLogic("cart")
      setTimeout(() => {
        const appliedItemElement = document.querySelector(`[data-cart-item-id="${currentItemId}"]`)
        if (appliedItemElement) {
          appliedItemElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }

        const checkbox = appliedItemElement?.querySelector(".cart-item-checkbox") as HTMLInputElement
        if (checkbox && !checkbox.checked) {
          checkbox.checked = true
          updateCartSelection()
        }
      }, 200)
    }, 150)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const removeSelectedCode = (codeId: string) => {
    setSelectedCodes(selectedCodes.filter((c) => c.id !== codeId))
  }

  const showAddCodeModal = (itemId: number) => {
    setCurrentItemId(itemId)
    setCodeModalOpen(true)
  }

  const getFilteredCodes = () => {
    let filtered = availableCodes

    if (codeFilter !== "all") {
      filtered = filtered.filter((code) => code.type === codeFilter)
    }

    if (codeSearchTerm) {
      filtered = filtered.filter(
        (code) =>
          code.name.toLowerCase().includes(codeSearchTerm.toLowerCase()) ||
          code.description.toLowerCase().includes(codeSearchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  const toggleCodeSelection = (code: any) => {
    if (selectedCodes.some((c) => c.id === code.id)) {
      setSelectedCodes(selectedCodes.filter((c) => c.id !== code.id))
    } else {
      setSelectedCodes([...selectedCodes, code])
    }
  }

  const handleCheckout = () => {
    alert("Chức năng thanh toán sẽ được phát triển trong tương lai!")
  }

  const showCartPanel = activePanel === "cart"

  useEffect(() => {
    if (showCartPanel && currentUser?.cart) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        calculateCartTotal()
      }, 100)
    }
  }, [showCartPanel, currentUser?.cart])

  useEffect(() => {
    if (currentUser?.cart) {
      // Update cart item count
      setCartItemCount(currentUser.cart.length)

      // Recalculate totals if cart panel is open
      if (activePanel === "cart") {
        setTimeout(() => {
          calculateCartTotal()
        }, 100)
      }
    } else {
      setCartItemCount(0)
    }
  }, [currentUser?.cart, activePanel])

  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent | CustomEvent) => {
      if ("key" in e && e.key === "currentUser" && e.newValue) {
        // Storage event from useAuth will trigger currentUser update
        // This ensures cart panel refreshes when items are added
      } else if (e.type === "cartUpdated") {
        // Custom event for immediate cart updates
        const userString = sessionStorage.getItem("currentUser")
        if (userString) {
          const updatedUser = JSON.parse(userString)
          // Force re-render by updating a timestamp or similar
          if (activePanel === "cart") {
            setTimeout(() => {
              calculateCartTotal()
            }, 50)
          }
        }
      }
    }

    window.addEventListener("storage", handleStorageUpdate as EventListener)
    window.addEventListener("cartUpdated", handleStorageUpdate as EventListener)

    return () => {
      window.removeEventListener("storage", handleStorageUpdate as EventListener)
      window.removeEventListener("cartUpdated", handleStorageUpdate as EventListener)
    }
  }, [activePanel])

  const LogoComponent = ({ size = 32, className = "" }) => {
    return (
      <div
        className={`relative overflow-hidden rounded-full flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        {/* Avatar Layer */}
        <Image
          src={currentUser?.avatar || "/placeholder.svg"}
          alt="User Avatar"
          width={size}
          height={size}
          priority
          quality={85}
          className="rounded-full object-cover absolute inset-0"
          style={{
            opacity: avatarOpacity,
            transition: "opacity 0.016s linear",
          }}
        />

        {/* Logo Layer */}
        <Image
          src="/logo-cat.png"
          alt="Logo"
          width={size}
          height={size}
          priority
          quality={85}
          className="rounded-full object-cover absolute inset-0"
          style={{
            opacity: logoOpacity,
            transition: "opacity 0.016s linear",
          }}
        />
      </div>
    )
  }

  const saveMenuScrollPosition = useCallback(() => {
    const scrollableNav = document.querySelector(".scrollable-nav") as HTMLElement
    if (scrollableNav) {
      setMenuScrollPosition(scrollableNav.scrollTop)
    }
  }, [])

  const restoreMenuScrollPosition = useCallback(() => {
    const scrollableNav = document.querySelector(".scrollable-nav") as HTMLElement
    if (scrollableNav && menuScrollPosition !== undefined) {
      scrollableNav.scrollTop = menuScrollPosition
    }
  }, [menuScrollPosition])

  const closeSideMenuWithOverlay = useCallback(() => {
    saveMenuScrollPosition()
    setSideMenuOpen(false)
    setMenuOverlayOpacity(0)
    setSwipeTransform("")
    setIsSwiping(false)
  }, [saveMenuScrollPosition])

  const openSideMenuWithOverlay = useCallback(() => {
    if (activePanel) {
      animatePanel(activePanel, false)
    }
    setSideMenuOpen(true)
    setMenuOverlayOpacity(0.5)
    setTimeout(() => {
      restoreMenuScrollPosition()
    }, 100)
  }, [restoreMenuScrollPosition, activePanel])

  const toggleSideMenu = useCallback(() => {
    if (isSideMenuOpen) {
      closeSideMenuWithOverlay()
    } else {
      openSideMenuWithOverlay()
    }
  }, [isSideMenuOpen, closeSideMenuWithOverlay, openSideMenuWithOverlay])

  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let touchCurrentX = 0
    let touchCurrentY = 0
    let isDragging = false
    let isSwipeFromEdge = false
    let swipeStartTime = 0
    const EDGE_THRESHOLD = 20
    const SWIPE_THRESHOLD = 100
    const SWIPE_VELOCITY_THRESHOLD = 0.3

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      touchCurrentX = touchStartX
      touchCurrentY = touchStartY
      swipeStartTime = Date.now()
      isSwipeFromEdge = touchStartX <= EDGE_THRESHOLD && !isSideMenuOpen
      if (isSwipeFromEdge) {
        setIsSwipeIndicatorVisible(true)
      }
      isDragging = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX) return
      touchCurrentX = e.touches[0].clientX
      touchCurrentY = e.touches[0].clientY
      const deltaX = touchCurrentX - touchStartX
      const deltaY = Math.abs(touchCurrentY - touchStartY)

      if (Math.abs(deltaX) < deltaY && Math.abs(deltaX) < 10) return
      e.preventDefault()
      isDragging = true

      if (isSwipeFromEdge && deltaX > 0) {
        const clampedDeltaX = Math.min(deltaX, 256)
        const progress = Math.min(clampedDeltaX / 256, 1)
        setIsSwiping(true)
        setSwipeTransform(`translateX(${-256 + clampedDeltaX}px)`)
        setMenuOverlayOpacity(0.5 * progress)

        const sideMenuElement = document.getElementById("sideMenu")
        if (clampedDeltaX > 30 && sideMenuElement) {
          sideMenuElement.classList.add("swipe-feedback")
        }
      } else if (isSideMenuOpen && deltaX < -30) {
        const clampedDeltaX = Math.max(deltaX, -256)
        const progress = Math.min(Math.abs(clampedDeltaX) / 256, 1)
        setIsSwiping(true)
        setSwipeTransform(`translateX(${clampedDeltaX}px)`)
        setMenuOverlayOpacity(0.5 * (1 - progress))
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX) return
      const deltaX = touchCurrentX - touchStartX
      const deltaY = Math.abs(touchCurrentY - touchStartY)
      const swipeTime = Date.now() - swipeStartTime
      const swipeVelocity = Math.abs(deltaX) / swipeTime

      setIsSwipeIndicatorVisible(false)
      setIsSwiping(false)
      setSwipeTransform("")

      const sideMenuElement = document.getElementById("sideMenu")
      if (sideMenuElement) {
        sideMenuElement.classList.remove("swipe-feedback")
      }

      const shouldTrigger = Math.abs(deltaX) > SWIPE_THRESHOLD || swipeVelocity > SWIPE_VELOCITY_THRESHOLD

      if (isDragging && Math.abs(deltaX) > deltaY) {
        if (isSwipeFromEdge && deltaX > 0 && shouldTrigger) {
          openSideMenuWithOverlay()
        } else if (isSideMenuOpen && deltaX < -30 && shouldTrigger) {
          closeSideMenuWithOverlay()
        } else {
          if (isSwipeFromEdge) {
            setMenuOverlayOpacity(0)
          } else if (isSideMenuOpen) {
            setMenuOverlayOpacity(0.5)
          }
        }
      }

      touchStartX = 0
      touchStartY = 0
      touchCurrentX = 0
      touchCurrentY = 0
      isDragging = false
      isSwipeFromEdge = false
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isSideMenuOpen, openSideMenuWithOverlay, closeSideMenuWithOverlay])

  const handleMenuItemClick = useCallback(() => {
    closeSideMenuWithOverlay()
  }, [closeSideMenuWithOverlay])

  const applySearchFilters = (results: any[]) => {
    let filtered = [...results]

    if (searchFilters.searchType === "all") {
      // Keep all results for "all" search type
      // Optionally sort by relevance/type
    } else if (searchFilters.searchType === "product") {
      filtered = filtered.filter((item) => item.type === "product" || item.type === "reward" || item.type === "deal")

      // Filter by category
      if (searchFilters.category !== "all") {
        filtered = filtered.filter((item) => item.type === searchFilters.category)
      }

      // Filter by price range (if item has price)
      filtered = filtered.filter((item) => {
        if (!item.price) return true
        const price = typeof item.price === "string" ? Number.parseFloat(item.price.replace(/[^0-9]/g, "")) : item.price
        return price >= searchFilters.priceRange.min && price <= searchFilters.priceRange.max
      })

      // Filter by stock status
      if (searchFilters.inStock) {
        filtered = filtered.filter((item) => item.inStock !== false)
      }

      // Sort results
      switch (searchFilters.sortBy) {
        case "price-asc":
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
          break
        case "price-desc":
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
          break
        case "popular":
          filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
        case "newest":
        default:
          filtered.sort((a, b) => (b.id || 0) - (a.id || 0))
          break
      }
    } else if (searchFilters.searchType === "category") {
      filtered = filtered.filter((item) => item.type === "category")

      // Filter by category type
      if (searchFilters.categoryType !== "all") {
        filtered = filtered.filter((item) => item.categoryType === searchFilters.categoryType)
      }

      // Sort categories
      filtered.sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    } else if (searchFilters.searchType === "user") {
      filtered = filtered.filter((item) => item.type === "user")

      // Filter by user activity
      if (searchFilters.userActivity !== "all") {
        filtered = filtered.filter((item) => item.activity === searchFilters.userActivity)
      }

      // Sort users
      switch (searchFilters.userSort) {
        case "posts":
          filtered.sort((a, b) => (b.posts || 0) - (a.posts || 0))
          break
        case "joined":
          filtered.sort((a, b) => (b.joinedDate || 0) - (a.joinedDate || 0))
          break
        case "followers":
        default:
          filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0))
          break
      }
    }

    return filtered
  }

  const resetFilters = () => {
    setSearchFilters({
      ...searchFilters,
      category: "all",
      priceRange: { min: 0, max: 10000000 },
      sortBy: "newest",
      inStock: false,
      userActivity: "all",
      userSort: "followers",
      categoryType: "all",
    })
  }
  // </CHANGE>

  useEffect(() => {
    if (!isSideMenuOpen && showPlaylist) {
      setShowPlaylist(false)
    }
  }, [isSideMenuOpen, showPlaylist, setShowPlaylist])

  // Placeholder functions for the undeclared variables
  const handleSaveCustomize = () => {
    console.log("HandleSaveCustomize called")
    // Implement save logic here
    setShowCustomizePanel(false)
  }

  const handleNavbarSave = () => {
    console.log("HandleNavbarSave called")
    // Implement navbar save logic here
  }

  return (
    <div
      className={`${isDarkMode ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900"} text-white`}
    >
      <AvatarUploadModal
        isOpen={isAvatarOverlayOpen}
        previewImage={previewImage}
        selectedAvatar={selectedAvatar}
        onClose={closeAvatarOverlay}
        onFileSelect={handleFileSelect}
        onPresetSelect={selectPresetAvatar}
        onUpdateAvatar={(avatarData) => {
          if (avatarData) {
            updateAvatar(avatarData)
          }
          closeAvatarOverlay()
        }}
      />

      <RemoveConfirmationModal
        isOpen={isCartRemovalModalOpen}
        title="Xóa sản phẩm khỏi giỏ hàng"
        message={`Bạn có chắc chắn muốn xóa "${cartItemToRemove?.name}" khỏi giỏ hàng?`}
        itemName={cartItemToRemove?.name || ""}
        onConfirm={handleConfirmCartRemoval}
        onCancel={handleCancelCartRemoval}
        isDarkMode={isDarkMode}
        confirmText="Xóa"
        icon={<ShoppingCart className="w-8 sm:w-10 h-8 sm:h-10 text-orange-500" />}
      />

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        userName={currentUser?.name || ""}
        onConfirm={performLogout}
        onCancel={hideLogoutConfirmation}
        isDarkMode={isDarkMode}
      />

      {isMobileHeaderBottom && (
        <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                {!isSearchExpanded && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 backdrop-blur-md shadow-sm flex items-center justify-center">
                    <LogoComponent size={26} />
                  </div>
                )}

                {!isSearchExpanded ? (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className={`p-2 bg-white/20 backdrop-blur-md rounded-full transition-colors shadow-sm ${
                      isDarkMode ? "text-gray-600 hover:text-orange-500" : "text-gray-600 hover:text-orange-500"
                    }`}
                  >
                    <Search className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 relative" ref={searchRef}>
                      <input
                        type="search"
                        placeholder="Tìm kiếm..."
                        value={searchQueryHook}
                        onChange={(e) => setSearchQueryHook(e.target.value)}
                        onFocus={() => searchQueryHook && setShowSearchResults(true)}
                        className={`w-full py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 ${isDarkMode ? "bg-gray-700 border border-gray-600 focus:ring-orange-400 text-white" : "bg-gray-100 focus:ring-orange-300 text-gray-600"} ${
                          isSearchFocused || searchQueryHook ? "pl-4 pr-7" : "pl-[36px] pr-7"
                        } ${isMobileHeaderBottom ? "pr-12" : ""}`}
                      />
                      <Search
                        className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDarkMode ? "text-gray-500" : "text-gray-400"} ${
                          isSearchFocused || searchQueryHook ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
                        }`}
                      />
                      {/* Microphone Button - Shows when no search query or on bottom header */}
                      {(!searchQueryHook || isMobileHeaderBottom) && (
                        <button
                          onClick={handleMicClick}
                          className={`absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all backdrop-blur-md shadow-sm flex items-center justify-center z-10 ${
                            isListening
                              ? isDarkMode
                                ? "bg-red-500/90 text-white"
                                : "bg-red-400/90 text-white animate-pulse"
                              : isDarkMode
                                ? "bg-gray-600/70 hover:bg-gray-500/90 text-gray-300"
                                : "bg-white/70 hover:bg-white/90 text-gray-600"
                          }`}
                          title={isListening ? "Dừng nghe" : "Bắt đầu nghe"}
                        >
                          <Mic className={`h-3 w-3 ${isListening ? "animate-pulse" : ""}`} />
                        </button>
                      )}

                      {searchQueryHook && !isMobileHeaderBottom && (
                        <button
                          onClick={() => setIsSearchFilterOpen(!isSearchFilterOpen)}
                          className={`absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full backdrop-blur-md transition-all shadow-sm flex items-center justify-center ${isDarkMode ? "bg-gray-600/70 hover:bg-gray-500/90" : "bg-white/70 hover:bg-white/90"} ${
                            isSearchFilterOpen ? "bg-orange-500/90 text-white" : "text-gray-600 hover:text-orange-500"
                          }`}
                          title="Bộ lọc tìm kiếm"
                        >
                          <Filter className="h-3 w-3" />
                        </button>
                      )}
                      <SearchDropdown
                        results={applySearchFilters(searchResults)}
                        query={searchQueryHook}
                        isOpen={showSearchResults}
                        isLoading={isSearchLoading}
                        highlightText={highlightText}
                        getTypeLabel={getTypeLabel}
                        isMobileHeaderBottom={isMobileHeaderBottom}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <button
                      onClick={() => setIsSearchFilterOpen(!isSearchFilterOpen)}
                      className={`p-2 bg-white/20 backdrop-blur-md rounded-full transition-colors shadow-sm ${
                        isSearchFilterOpen ? "text-orange-500" : "text-gray-600 hover:text-orange-500"
                      }`}
                    >
                      <Filter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSearchFilters({
                          ...searchFilters,
                          searchType: searchFilters.searchType === "product" ? "all" : "product",
                        })
                      }}
                      className={`p-2 rounded-full transition-colors shadow-sm ${
                        searchFilters.searchType === "product"
                          ? "bg-orange-500 text-white"
                          : "bg-white/20 backdrop-blur-md text-gray-600 hover:text-orange-500"
                      }`}
                      title="Tìm sản phẩm"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSearchFilters({
                          ...searchFilters,
                          searchType: searchFilters.searchType === "category" ? "all" : "category",
                        })
                      }}
                      className={`p-2 rounded-full transition-colors shadow-sm ${
                        searchFilters.searchType === "category"
                          ? "bg-orange-500 text-white"
                          : "bg-white/20 backdrop-blur-md text-gray-600 hover:text-orange-500"
                      }`}
                      title="Tìm danh mục"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSearchFilters({
                          ...searchFilters,
                          searchType: searchFilters.searchType === "user" ? "all" : "user",
                        })
                      }}
                      className={`p-2 rounded-full transition-colors shadow-sm ${
                        searchFilters.searchType === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-white/20 backdrop-blur-md text-gray-600 hover:text-orange-500"
                      }`}
                      title="Tìm người dùng"
                    >
                      <User className="h-4 w-4" />
                    </button>
                    {/* </CHANGE> */}
                    <button
                      onClick={() => {
                        setIsSearchExpanded(false)
                        setIsSearchFilterOpen(false)
                      }}
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full text-gray-400 hover:text-gray-600 shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {!isSearchExpanded && (
                <div className="flex items-center gap-1">
                  <button
                    data-panel="notifications"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePanelWithBadgeLogic("notifications") // Changed to togglePanelWithBadgeLogic
                    }}
                    className={`p-2 bg-white/20 backdrop-blur-md rounded-full text-gray-600 hover:text-orange-500 transition-colors shadow-sm ${notificationCount > 0 && !notificationPanelViewed ? "bell-shake" : ""}`}
                  >
                    <Bell className="h-4 w-4" />
                    <span
                      className={`notification-badge ${showNotificationBadge ? "show" : ""} ${notificationCount > 9 ? "overflow" : ""} ${isMobileHeaderBottom ? "bottom-badge" : ""}`}
                    >
                      {" "}
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  </button>

                  <button
                    data-panel="favorites"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePanel("favorites")
                    }}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-gray-600 hover:text-orange-500 transition-colors shadow-sm"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  <button
                    data-panel="cart"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePanelWithBadgeLogic("cart") // Changed to togglePanelWithBadgeLogic
                    }}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-gray-600 hover:text-orange-500 transition-colors relative shadow-sm"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span
                      className={`notification-badge ${showCartBadge ? "show" : ""} ${cartItemCount > 9 ? "overflow" : ""} ${isMobileHeaderBottom ? "bottom-badge" : ""}`}
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>{" "}
                    {/* Updated to showCartBadge */}
                  </button>

                  <button
                    data-panel="account"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePanel("account")
                    }}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-gray-600 hover:text-orange-500 transition-colors shadow-sm"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300 ${
          isMobileHeaderBottom
            ? "-translate-y-full opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto"
            : "translate-y-0 opacity-100"
        } ${isDarkMode ? "bg-gray-800/90 backdrop-blur-sm" : "bg-white shadow-sm"}`}
      >
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between gap-4">
            <Link href="/trangchu" className="flex-shrink-0">
              <LogoComponent size={32} />
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                href="/trangchu"
                className={`flex items-center transition-colors ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Home className="h-5 w-5 mr-2" />
                Trang Chủ
              </Link>
              <Link
                href="/sanpham"
                className={`flex items-center transition-colors ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Package className="h-5 w-5 mr-2" />
                Sản Phẩm
              </Link>
              <Link
                href="/doithuong"
                className={`flex items-center transition-colors ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Gift className="h-5 w-5 mr-2" />
                Đổi Thưởng
              </Link>
              <Link
                href="/uudai"
                className={`flex items-center transition-colors ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Tag className="h-5 w-5 mr-2" />
                Ưu Đãi
              </Link>
            </nav>

            <div className="flex-1 relative max-w-xl mx-auto" ref={searchRef}>
              <div className="relative">
                <input
                  id="searchInput"
                  ref={searchInputRef}
                  type="search"
                  placeholder="Tìm kiếm"
                  value={searchQueryHook}
                  onChange={(e) => setSearchQueryHook(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true)
                    searchQueryHook && setShowSearchResults(true)
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 ${isDarkMode ? "bg-gray-700 border border-gray-600 focus:ring-orange-400 text-white" : "bg-gray-100 focus:ring-orange-300 text-gray-600"} ${
                    isSearchFocused || searchQueryHook ? "pl-4 pr-7" : "pl-[36px] pr-7"
                  } ${isMobileHeaderBottom ? "pr-12" : ""}`}
                />
                <Search
                  className={`h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isDarkMode ? "text-violet-400" : "text-gray-400"} ${
                    isSearchFocused || searchQueryHook ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"
                  }`}
                />

                {/* Microphone Button - Shows when no search query or on bottom header */}
                {(!searchQueryHook || isMobileHeaderBottom) && (
                  <button
                    onClick={handleMicClick}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all backdrop-blur-md shadow-sm flex items-center justify-center z-10 ${
                      isListening
                        ? isDarkMode
                          ? "bg-red-500/90 text-white"
                          : "bg-red-400/90 text-white animate-pulse"
                        : isDarkMode
                          ? "bg-gray-600/70 hover:bg-gray-500/90 text-gray-300"
                          : "bg-white/70 hover:bg-white/90 text-gray-600"
                    }`}
                    title={isListening ? "Dừng nghe" : "Bắt đầu nghe"}
                  >
                    <Mic className={`h-3 w-3 ${isListening ? "animate-pulse" : ""}`} />
                  </button>
                )}

                {searchQueryHook && !isMobileHeaderBottom && (
                  <button
                    onClick={() => setIsSearchFilterOpen(!isSearchFilterOpen)}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full backdrop-blur-md transition-all shadow-sm flex items-center justify-center ${isDarkMode ? "bg-gray-600/70 hover:bg-gray-500/90" : "bg-white/70 hover:bg-white/90"} ${
                      isSearchFilterOpen ? "bg-orange-500/90 text-white" : "text-gray-600 hover:text-orange-500"
                    }`}
                    title="Bộ lọc tìm kiếm"
                  >
                    <Filter className="h-3 w-3" />
                  </button>
                )}
              </div>

              <SearchDropdown
                results={applySearchFilters(searchResults)}
                query={searchQueryHook}
                isOpen={showSearchResults}
                isLoading={isSearchLoading}
                highlightText={highlightText}
                getTypeLabel={getTypeLabel}
                isMobileHeaderBottom={isMobileHeaderBottom}
                isDarkMode={isDarkMode}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                id="notificationButton"
                data-panel="notifications"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePanelWithBadgeLogic("notifications")
                }}
                className={`panel-button icon-button transition-colors active:scale-90 relative ${notificationCount > 0 && !notificationPanelViewed ? "bell-shake" : ""} ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Bell className="h-6 w-6" id="notificationIcon" />
                <span
                  className={`notification-badge ${showNotificationBadge ? "show" : ""} ${notificationCount > 9 ? "overflow" : ""} ${isMobileHeaderBottom ? "bottom-badge" : ""}`}
                >
                  {" "}
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              </button>

              <button
                id="favoritesButton"
                data-panel="favorites"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePanel("favorites")
                }}
                className={`panel-button icon-button transition-colors active:scale-90 ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Heart className="h-6 w-6" />
              </button>

              <button
                id="cartButton"
                data-panel="cart"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePanelWithBadgeLogic("cart")
                }}
                className={`panel-button icon-button transition-colors active:scale-90 relative ${cartItemCount > 0 && !cartPanelViewed ? "cart-pulse" : ""} ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <ShoppingCart className="h-6 w-6" id="cartButton2" />
                <span
                  className={`notification-badge ${showCartBadge ? "show" : ""} ${cartItemCount > 9 ? "overflow" : ""} ${isMobileHeaderBottom ? "bottom-badge" : ""}`}
                >
                  {" "}
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              </button>

              <button
                id="accountButton"
                data-panel="account"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePanel("account")
                }}
                className={`panel-button icon-button transition-colors active:scale-90 ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <User className="h-6 w-6" />
              </button>

              <button
                onClick={toggleSideMenu}
                className={`transition-colors lg:hidden ${isDarkMode ? "text-gray-300 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"}`}
                id="mobileMenuButton"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavbar
        isMobileHeaderBottom={isMobileHeaderBottom}
        onHeaderToggle={() => setIsMobileHeaderBottom(!isMobileHeaderBottom)}
        toggleSideMenu={toggleSideMenu}
      />

      {/* rest of code here */}

      <div
        id="sideMenu"
        className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSwiping ? "swiping" : ""}`}
        style={{
          transform: swipeTransform || undefined,
        }}
      >
        <div
          className={`flex-shrink-0 p-3 ${isDarkMode ? "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" : "bg-gradient-to-r from-orange-400 to-red-500"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-white"}`}>Menu</h2>
            <div className="flex items-center space-x-2">
              <button
                id="weatherWidgetBtn"
                onClick={toggleWeatherWidgetHandler}
                className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                title="Weather Widget"
              >
                {isWeatherWidgetActive ? <CalendarClock className="h-6 w-6" /> : <CloudyIcon className="h-6 w-6" />}
              </button>
              <label className="switch" title="Chế độ sáng/tối">
                <input
                  type="checkbox"
                  id="darkModeToggle"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
              <button
                id="audioToggleBtn"
                onClick={toggleAudioHandler}
                className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                title="Audio Toggle"
              >
                {isAudioOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </button>
              <button
                id="closeSideMenu"
                onClick={closeSideMenuWithOverlay}
                className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {isAudioOn && isMusicPlayerVisible && !isWeatherWidgetActive && (
            <div
              id="musicPlayer"
              className={`mt-2 p-2 z-60 ${isDarkMode ? "bg-gray-700/50 backdrop-blur-md" : "bg-white bg-opacity-30 backdrop-blur-md"} rounded-lg shadow-lg`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <img
                    src={currentSong.image || "/placeholder.svg"}
                    alt={currentSong.title}
                    className="w-10 h-10 rounded-lg object-cover shadow-sm ml-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 max-w-[180px] mr-3">
                    <div className={`text-xs font-medium truncate ${isDarkMode ? "text-white" : "text-white"}`}>
                      {currentSong.title}
                    </div>
                    <div className={`text-xs opacity-75 truncate ${isDarkMode ? "text-white" : "text-white"}`}>
                      {currentSong.artist}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                  <style dangerouslySetInnerHTML={{ __html: heartStyles }} />
                  <label className="heart-container">
                    <input
                      type="checkbox"
                      checked={favoriteSongs.has(currentSongIndex)}
                      onChange={() => toggleFavorite(currentSongIndex)}
                    />
                    <div className="heart-checkmark">
                      <svg viewBox="0 0 256 256">
                        <rect fill="none" height="256" width="256"></rect>
                        <path
                          d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
                          strokeWidth="20px"
                          stroke="#FFF"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </label>
                  <div className="relative">
                    <button
                      id="playlistBtn"
                      onClick={handlePlaylistToggle}
                      className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                    >
                      <List className="h-[18px] w-[18px]" />
                    </button>
                    {showPlaylist &&
                      typeof document !== "undefined" &&
                      ReactDOM.createPortal(
                        <div
                          id="playlistDropdown"
                          className={`fixed z-[100] w-40 rounded-md shadow-lg text-sm flex flex-col ${isDarkMode ? "border border-violet-500/30 shadow-xl" : "bg-white border border-gray-200"}`}
                          style={{
                            background: isDarkMode ? "linear-gradient(135deg, #1e1b4b 0%, #1f2937 100%)" : "white",
                            maxHeight: `${64 + Math.min(4, 4 + (userPlaylists?.length || 0)) * 36}px`,
                            top: "0",
                            left: "0",
                          }}
                          ref={(el) => {
                            if (el && typeof document !== "undefined") {
                              const btn = document.getElementById("playlistBtn")
                              if (btn) {
                                const rect = btn.getBoundingClientRect()
                                el.style.top = rect.bottom + 8 + "px"
                                el.style.left = rect.right - 160 + "px"
                              }
                            }
                          }}
                        >
                          <div
                            className={`px-4 py-2 border-b flex-shrink-0 ${isDarkMode ? "border-violet-500/20" : "border-gray-200"}`}
                          >
                            <input
                              type="text"
                              id="songSearch"
                              placeholder="Tìm kiếm bài hát..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setShowPlaylist(false)
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 ${isDarkMode ? "bg-violet-900/30 border-violet-500/30 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-gray-400" : "focus:ring-orange-500 focus:border-orange-500 text-gray-800"}`}
                            />
                          </div>
                          <div className="overflow-y-auto flex-1">
                            <button
                              className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left border-b transition-colors ${isDarkMode ? "text-gray-200 hover:bg-violet-600/30 border-violet-500/10" : "text-gray-800 hover:bg-gray-50 border-gray-200/60"}`}
                              onClick={() => showCategory("music")}
                            >
                              <TrendingUp
                                className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? "text-violet-400" : "text-orange-500/80"}`}
                              />
                              <span className="truncate">Nghe nhiều nhất</span>
                            </button>
                            <button
                              className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left border-b transition-colors ${isDarkMode ? "text-gray-200 hover:bg-violet-600/30 border-violet-500/10" : "text-gray-800 hover:bg-gray-50 border-gray-200/60"}`}
                              onClick={() => showCategory("favorites")}
                            >
                              <Heart
                                className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? "text-violet-400" : "text-orange-500/80"}`}
                              />
                              <span className="truncate">Yêu thích</span>
                            </button>
                            {isLoggedIn && userPlaylists && userPlaylists.length > 0 && (
                              <>
                                {userPlaylists.map((playlist) => (
                                  <button
                                    key={playlist.id}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left border-b transition-colors ${isDarkMode ? "text-gray-200 hover:bg-violet-600/30 border-violet-500/10" : "text-gray-800 hover:bg-gray-50 border-gray-200/60"}`}
                                    onClick={() => showCategory(`user-playlist-${playlist.id}`)}
                                  >
                                    <User
                                      className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? "text-violet-400" : "text-orange-500/80"}`}
                                    />
                                    <span className="truncate">{playlist.name}</span>
                                  </button>
                                ))}
                              </>
                            )}
                            <button
                              className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left border-b transition-colors ${isDarkMode ? "text-gray-200 hover:bg-violet-600/30 border-violet-500/10" : "text-gray-800 hover:bg-gray-50 border-gray-200/60"}`}
                              onClick={() => showCategory("audiobook")}
                            >
                              <Headphones
                                className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? "text-violet-400" : "text-orange-500/80"}`}
                              />
                              <span className="truncate">Podcast</span>
                            </button>
                            <button
                              className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors ${isDarkMode ? "text-gray-200 hover:bg-violet-600/30 border-violet-500/10" : "text-gray-800 hover:bg-gray-50 border-gray-200/60"}`}
                              onClick={() => showCategory("instrumental")}
                            >
                              <Music
                                className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? "text-violet-400" : "text-orange-500/80"}`}
                              />
                              <span className="truncate">Nhạc không lời</span>
                            </button>
                          </div>
                        </div>,
                        document.body,
                      )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  id="prevBtn"
                  onClick={prevSong}
                  className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  id="playPauseBtn"
                  onClick={() => togglePlayPause("header")}
                  className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                >
                  {isPlaying && isActivePlayer("header") ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  id="nextBtn"
                  onClick={nextSong}
                  className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <div className="w-24">
                  <div
                    id="progressBar"
                    className={`h-1 rounded-full cursor-pointer ${isDarkMode ? "bg-gray-600" : "bg-white bg-opacity-30"}`}
                    onClick={handleProgressClick}
                  >
                    <div
                      id="progress"
                      className={`h-full rounded-full transition-all duration-100 ${isDarkMode ? "bg-violet-300" : "bg-white"}`}
                      style={{
                        width: `${duration > 0 && currentTime >= 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <span id="currentTime" className={`text-xs min-w-[32px] ${isDarkMode ? "text-white" : "text-white"}`}>
                  {currentTime >= 0 ? formatTime(currentTime) : "0:00"}
                </span>
                <button
                  id="repeatShuffleBtn"
                  onClick={toggleRepeatMode}
                  className={`text-white hover:text-gray-200 transition-colors ${isDarkMode ? "" : ""}`}
                >
                  {repeatShuffleState === "repeat-one" ? (
                    <Repeat1 className="h-4 w-4" />
                  ) : repeatShuffleState === "shuffle" ? (
                    <Shuffle className="h-4 w-4" />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {isWeatherWidgetActive && <WeatherWidget isDarkMode={isDarkMode} weatherData={weatherData} />}

          {showSongList && (
            <div
              id="songList"
              className={`mt-2 p-2 z-80 ${isDarkMode ? "bg-gray-700/50 backdrop-blur-md" : "bg-white bg-opacity-30 backdrop-blur-md"} rounded-lg shadow-lg`}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-white"}`}>Danh sách phát</h2>
                <button
                  id="addSongBtn"
                  onClick={() => {
                    router.push("/music")
                    closeSideMenuWithOverlay()
                  }}
                  className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm
                </button>
              </div>
              <ul id="songListItems" className="space-y-2 overflow-y-auto max-h-48">
                {filteredSongs.length === 0 ? (
                  <li className={`p-4 text-sm text-center ${isDarkMode ? "text-white" : "text-white"}`}>
                    {currentPlaylistCategory === "favorites" && !isLoggedIn
                      ? "Bạn cần đăng nhập để mở danh sách yêu thích"
                      : searchQuery && searchQuery.trim().length >= 2
                        ? "Không tìm thấy bài hát"
                        : "Không có bài hát nào"}
                  </li>
                ) : (
                  filteredSongs.map((song, index) => {
                    const originalIndex = playlist.indexOf(song)
                    return (
                      <li key={originalIndex} className="rounded hover:bg-white hover:bg-opacity-20">
                        <div className="flex items-center justify-between p-2">
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <img
                              src={song.image || "/placeholder.svg"}
                              alt={song.title}
                              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            />
                            <span className={`truncate text-sm ${isDarkMode ? "text-white" : "text-white"}`}>
                              {song.title}
                            </span>
                          </div>
                          <button
                            onClick={() => playSongByIndex(originalIndex)}
                            className={`text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2 ${isDarkMode ? "" : ""}`}
                          >
                            {currentSongIndex === originalIndex && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollable-nav">
          <nav className="ios-modern-menu">
            <div className="ios-modern-menu__section">
              <div className="ios-modern-menu__header">Điều hướng</div>
              <div className="ios-modern-menu__card-group">
                <Link
                  href="/trangchu"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}
                  >
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Trang Chủ</div>
                  </div>
                </Link>
                <Link
                  href="/sanpham"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}
                  >
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Sản Phẩm</div>
                  </div>
                </Link>
                <Link
                  href="/doithuong"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)" }}
                  >
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Đổi Thưởng</div>
                  </div>
                </Link>
                <Link
                  href="/uudai"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #EF4444, #F87171)" }}
                  >
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Ưu Đãi</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="ios-modern-menu__section">
              <div className="ios-modern-menu__header">Khám phá</div>
              <div className="ios-modern-menu__card-group">
                <Link
                  href="/xu-huong"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #F97316, #FB923C)" }}
                  >
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Xu Hướng</div>
                  </div>
                </Link>
                <Link
                  href="/giaitrisangtao"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #EC4899, #F472B6)" }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Giải trí & Sáng tạo</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="ios-modern-menu__section">
              <div className="ios-modern-menu__header">Dịch vụ</div>
              <div className="ios-modern-menu__card-group">
                <Link
                  href="#"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}
                  >
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Gói đăng ký</div>
                  </div>
                </Link>
                <Link
                  href="#"
                  className={`ios-modern-menu__card menu-item ${isDarkMode ? "dark" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  <div
                    className="ios-modern-menu__icon"
                    style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}
                  >
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="ios-modern-menu__content">
                    <div className="ios-modern-menu__title">Trợ Giúp</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="space-login-container">
              {currentUser ? (
                <>
                  <div className="button-container">
                    <button className="space-button" id="spaceLoginBtn" onClick={showLogoutConfirmation}>
                      <div className="bright-particles"></div>
                      <UserPlus className="login-icon" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>

                  <div className="button-container settings-button-container">
                    <button
                      className="space-button settings-button"
                      id="spaceSettingsBtn"
                      onClick={() => router.push("/settings")}
                      title="Cài đặt"
                    >
                      <div className="bright-particles"></div>
                      <Settings className="login-icon" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="button-container">
                  <Link href="/login" className="space-button" id="spaceLoginBtn">
                    <div className="bright-particles"></div>
                    <UserPlus className="login-icon" />
                    <span>Đăng nhập/Đăng ký</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {activePanel === "notifications" && (
        <div
          id="notificationPanel"
          className={`notification-panel ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} shadow-lg rounded-b-lg show ${
            isMobileHeaderBottom ? "bottom-header-mode" : ""
          } ${
            panelAnimating === "notifications-opening"
              ? "animate-slide-down"
              : panelAnimating === "notifications-closing"
                ? "animate-slide-up"
                : ""
          }`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div
            className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
          >
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Thông báo</h3>
          </div>
          <NotificationPanel
            isDarkMode={isDarkMode}
            onMarkAsRead={markNotificationAsRead}
            onNotificationSelect={setSelectedNotification}
            selectedNotification={selectedNotification}
          />
        </div>
      )}

      {activePanel === "favorites" && (
        <div
          id="favoritesPanel"
          className={`favorites-panel ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-background border border-border"} shadow-lg rounded-b-lg show ${
            isMobileHeaderBottom ? "bottom-header-mode" : ""
          } ${
            panelAnimating === "favorites-opening"
              ? "animate-slide-down"
              : panelAnimating === "favorites-closing"
                ? "animate-slide-up"
                : ""
          }`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className={`p-4 border-b ${isDarkMode ? "border-gray-600" : "border-border"}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-foreground"}`}>Yêu Thích</h3>
          </div>
          <FavoritesPanel isDarkMode={isDarkMode} />
        </div>
      )}

      {activePanel === "cart" && (
        <div
          id="cartPanel"
          className={`cart-panel ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-background border border-border"} shadow-lg rounded-b-lg show ${
            isMobileHeaderBottom ? "bottom-header-mode" : ""
          } ${
            panelAnimating === "cart-opening"
              ? "animate-slide-down"
              : panelAnimating === "cart-closing"
                ? "animate-slide-up"
                : ""
          }`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className={`p-4 border-b ${isDarkMode ? "border-gray-600" : "border-border"}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-foreground"}`}>Giỏ Hàng</h3>
          </div>
          <div id="cartContainer" className="overflow-y-auto">
            {!isLoggedIn ? (
              <div className="login-prompt p-4 flex flex-col items-center justify-content-center h-full">
                <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-muted-foreground"} mb-4`}>
                  Vui lòng đăng nhập để xem giỏ hàng.
                </p>
                <Link
                  href="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 inline-block"
                >
                  Đăng nhập
                </Link>
              </div>
            ) : currentUser?.cart?.length === 0 ? (
              <div className={`p-4 text-center ${isDarkMode ? "text-gray-300" : "text-muted-foreground"}`}>
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Chưa có sản phẩm nào trong giỏ hàng</p>
              </div>
            ) : (
              currentUser?.cart
                ?.sort((a: any, b: any) => {
                  const dateA = a.addedAt ? new Date(a.addedAt) : new Date(0)
                  const dateB = b.addedAt ? new Date(b.addedAt) : new Date(0)
                  return dateB.getTime() - dateA.getTime()
                })
                .map((item: any) => {
                  const appliedCodes = item.appliedCodes || []
                  const hasDiscount = item.original_price && item.discount_percent

                  let itemDiscountAmount = 0
                  let itemShippingDiscount = 0

                  appliedCodes.forEach((code: any) => {
                    if (code.type === "discount") {
                      if (code.discountType === "percentage") {
                        itemDiscountAmount += (item.price * item.quantity * code.value) / 100
                      } else if (code.discountType === "fixed") {
                        itemDiscountAmount += Math.min(code.value, item.price * item.quantity)
                      }
                    } else if (code.type === "shipping") {
                      if (code.discountType === "percentage") {
                        itemShippingDiscount += code.value
                      } else if (code.discountType === "fixed") {
                        itemShippingDiscount += code.value
                      }
                    }
                  })

                  return (
                    <div
                      data-cart-item-id={item.id}
                      key={item.id}
                      className={`cart-item border-b transition-colors duration-200 cursor-pointer ${isDarkMode ? "border-gray-600 hover:bg-gray-700/50" : "border-gray-100 hover:bg-gray-50"}`}
                      onClick={(e) => {
                        // Prevent triggering when clicking on buttons, links, or checkboxes
                        const target = e.target as HTMLElement
                        const isInteractiveElement = target.closest(
                          "button, a, input, .quantity-controls, .remove-cart-item",
                        )

                        if (!isInteractiveElement) {
                          const checkbox = e.currentTarget.querySelector(".cart-item-checkbox") as HTMLInputElement
                          if (checkbox && !checkbox.checked && item.id === lastAppliedItemId) {
                            setLastAppliedItemId(null)
                          }
                          if (checkbox) {
                            checkbox.checked = !checkbox.checked
                            updateCartSelection()
                          }
                        }
                      }}
                    >
                      <div className="flex items-start relative p-3">
                        <div className="flex items-center">
                          <label className="custom-checkbox" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="cart-item-checkbox"
                              data-id={item.id}
                              onChange={(e) => {
                                if (!e.target.checked && item.id === lastAppliedItemId) {
                                  setLastAppliedItemId(null)
                                }
                                updateCartSelection()
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <div className="w-16 h-16 overflow-hidden rounded-lg shadow-sm relative">
                            {hasDiscount && itemDiscountAmount === 0 && (
                              <div className="absolute top-0 left-0 bg-red-500 text-white font-bold px-1 py-0.5 rounded-br-md shadow-sm z-10 text-xs">
                                -{item.discount_percent}%
                              </div>
                            )}
                            {itemDiscountAmount > 0 && (
                              <div
                                className={`absolute top-0 ${hasDiscount && itemDiscountAmount === 0 ? "right-0 rounded-bl-md" : "left-0 rounded-br-md"} bg-green-500 text-white font-bold px-1 py-0.5 shadow-sm z-10 text-xs`}
                              >
                                -{itemDiscountAmount.toLocaleString("vi-VN")}₫
                              </div>
                            )}
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <a
                            href={`/product-detail?id=${item.id}`}
                            className={`view-eye-btn rounded-lg flex items-center justify-center transition-all duration-200 w-6 h-6 border shadow-sm mx-auto mt-2 ${isDarkMode ? "bg-gray-600 border-gray-500 hover:bg-gray-500" : "bg-gray-100 border-gray-200 hover:bg-gray-200"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <Eye className={`w-3 h-3 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`} />
                          </a>
                        </div>
                        <div className="flex-grow ml-3 pr-8">
                          <p
                            className={`text-sm font-medium truncate max-w-[180px] ${isDarkMode ? "text-white" : "text-gray-800"}`}
                          >
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                              {itemDiscountAmount > 0 ? (
                                <>
                                  <span className="text-green-600 font-semibold">
                                    {(item.price * item.quantity - itemDiscountAmount).toLocaleString("vi-VN")} ₫
                                  </span>
                                  <span
                                    className={`text-xs ml-1 ${isDarkMode ? "text-gray-500" : "text-gray-400 line-through"}`}
                                  >
                                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                                  </span>
                                </>
                              ) : (
                                <>
                                  {item.price.toLocaleString("vi-VN")} ₫
                                  {item.original_price && (
                                    <span
                                      className={`text-xs ml-1 ${isDarkMode ? "text-gray-500" : "text-gray-400 line-through"}`}
                                    >
                                      {item.original_price.toLocaleString("vi-VN")} ₫
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                          </div>

                          <div className="tags-scroll-container mt-1 relative">
                            <div className="tags-scroll-wrapper">
                              {appliedCodes.map((code: any) => (
                                <span
                                  key={code.id}
                                  className={`${
                                    code.type === "discount"
                                      ? `${isDarkMode ? "bg-orange-900 border border-orange-700 text-orange-300" : "discount-badge bg-red-100 text-red-700 border border-red-300"}`
                                      : `${isDarkMode ? "bg-green-900 border border-green-700 text-green-300" : "shipping-badge bg-blue-100 text-blue-700 border border-blue-200"}`
                                  } group relative inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium mr-0 mb-1`}
                                >
                                  {code.type === "discount" ? (
                                    <TicketPercent className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Truck className="w-3 h-3 mr-1" />
                                  )}
                                  {code.type === "shipping" && code.value === 100
                                    ? "Freeship"
                                    : code.type === "shipping"
                                      ? `Giảm ${code.value}%`
                                      : `Giảm ${code.value}%`}
                                  <button
                                    className="delete-tag-btn absolute -top-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeCodeFromItem(item.id, code.id)
                                    }}
                                  >
                                    <X className="w-2 h-2 text-red-500" />
                                  </button>
                                </span>
                              ))}

                              {(!appliedCodes.some((code: any) => code.type === "discount") ||
                                !appliedCodes.some((code: any) => code.type === "shipping")) && (
                                <button
                                  className={`add-code-btn ${isDarkMode ? "bg-orange-800 border border-orange-700 hover:bg-orange-700 text-orange-300" : "bg-orange-100 text-orange-600 border border-orange-200 hover:bg-orange-200"} transition-colors inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${appliedCodes.length === 1 ? "icon-only" : ""}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    showAddCodeModal(item.id)
                                  }}
                                >
                                  <TicketPlus className="w-3 h-3" />
                                  {appliedCodes.length === 0 && <span className="ml-1">Áp dụng mã</span>}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center mt-2 justify-between">
                            <div className="flex items-center quantity-controls">
                              <button
                                className={`quantity-btn minus ${isDarkMode ? "bg-gray-600 border-gray-500 hover:bg-gray-500 text-gray-300" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border`}
                                disabled={item.quantity <= 1}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateCartItemQuantity(item.id, false)
                                }}
                              >
                                −
                              </button>
                              <span
                                className={`quantity mx-2 text-sm font-medium ${isDarkMode ? "text-white" : "text-black"}`}
                              >
                                {item.quantity}
                              </span>
                              <button
                                className={`quantity-btn plus ${isDarkMode ? "bg-gray-600 border-gray-500 hover:bg-gray-500 text-gray-300" : "bg-gray-50 text-gray-600 hover:bg-gray-100"} w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateCartItemQuantity(item.id, true)
                                }}
                              >
                                +
                              </button>
                            </div>
                            <a
                              href={`/product-detail?id=${item.id}`}
                              className={`view-detail-btn font-semibold rounded-lg flex items-center justify-center transition-all text-xs px-2 py-0 border shadow-sm ml-auto h-6 ${isDarkMode ? "bg-gray-600 border-gray-500 hover:bg-gray-500 text-white" : "bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-500"}`}
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1 text-gray-400" />
                              Chi tiết
                            </a>
                          </div>
                        </div>
                        <button
                          className={`remove-cart-item hover:text-red-600 transition-colors absolute top-2 right-2 bg-opacity-75 rounded-full p-1 shadow-md border ${isDarkMode ? "border-gray-500 text-red-400 hover:bg-red-500/20" : "border-gray-200 text-red-500 hover:bg-gray-50"}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCartItem(item.id)
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )
                })
            )}
          </div>
          <div id="cartSummary" className={`${!isLoggedIn || !currentUser?.cart?.length ? "hidden" : ""}`}>
            <div className={`p-4 ${isDarkMode ? "border-t border-gray-600" : "border-t border-gray-200"}`}>
              <div className="mx-4">
                <div
                  className={`select-all-container mb-3 flex items-center p-2 rounded-lg ${isDarkMode ? "bg-violet-900" : "bg-gray-100"}`}
                >
                  <label className="custom-checkbox flex items-center">
                    <input
                      type="checkbox"
                      id="selectAllItems"
                      className="select-all-checkbox"
                      onChange={(e) => {
                        const isChecked = e.target.checked
                        const checkboxes = document.querySelectorAll(
                          ".cart-item-checkbox",
                        ) as NodeListOf<HTMLInputElement>
                        checkboxes.forEach((checkbox) => {
                          checkbox.checked = isChecked
                        })
                        updateCartSelection()
                      }}
                    />
                    <span className="checkmark"></span>
                    <span className={`ml-2 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-500"}`}>
                      Chọn tất cả
                    </span>
                  </label>
                  <span
                    id="selectedProductCount"
                    className={`text-xs ml-auto ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    0 sản phẩm
                  </span>
                </div>
              </div>
              <div className="mx-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDarkMode ? "text-white" : "text-gray-600"}`}>Tạm tính:</span>
                  <span
                    id="cartSubtotal"
                    className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {currentUser?.cart
                      ?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
                      .toLocaleString("vi-VN")}{" "}
                    ₫
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span id="discountLabel" className={`text-sm ${isDarkMode ? "text-white" : "text-gray-600"}`}>
                    Giảm giá:
                  </span>
                  <span id="cartDiscountAmount" className={`text-sm font-medium text-green-600`}>
                    -0 ₫
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDarkMode ? "text-white" : "text-gray-600"}`}>Phí vận chuyển:</span>
                  <span
                    id="cartShippingFee"
                    className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    0 ₫
                  </span>
                </div>
                <div className={`border-t my-3 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}></div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-black"}`}>
                    Tổng cộng:
                  </span>
                  <span
                    id="cartTotal"
                    className={`text-lg font-bold ${isDarkMode ? "text-orange-400" : "text-orange-500"}`}
                  >
                    {currentUser?.cart
                      ?.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
                      .toLocaleString("vi-VN")}{" "}
                    ₫
                  </span>
                </div>
              </div>
              <div className="mx-4">
                <div className="flex justify-center">
                  <button
                    id="checkoutButton"
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onClick={() => {
                      handleCheckout()
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold whitespace-nowrap">Mua Hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel === "account" && (
        <div
          id="accountPanel"
          className={`account-panel ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-background border border-border"} shadow-lg rounded-b-lg show ${
            isMobileHeaderBottom ? "bottom-header-mode" : ""
          } ${
            panelAnimating === "account-opening"
              ? "animate-slide-down"
              : panelAnimating === "account-closing"
                ? "animate-slide-up"
                : ""
          }`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className={`p-4 border-b ${isDarkMode ? "border-gray-600" : "border-border"}`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-foreground"}`}>Tài Khoản</h3>
          </div>
          <div id="accountContainer" className={`p-4 ${isDarkMode ? "panel-content-dark" : "panel-content"}`}>
            {!currentUser ? (
              <div className="login-prompt p-4 flex flex-col items-center justify-content-center h-full">
                <p className={`text-center ${isDarkMode ? "text-gray-300" : "text-muted-foreground"} mb-4`}>
                  Vui lòng đăng nhập để xem thông tin tài khoản.
                </p>
                <Link
                  href="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105
                  inline-block"
                >
                  Đăng nhập
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <img
                    src={currentUser.avatar || "https://picsum.photos/200"}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full mr-4"
                    id="accountAvatar"
                  />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-foreground"}`}>
                      {currentUser.name}
                    </p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-muted-foreground"}`}>
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <nav className="space-y-2">
                  <a
                    href="profile.php"
                    className={`block px-4 py-2 text-sm rounded transition-colors ${isDarkMode ? "text-white hover:bg-gray-600" : "text-foreground hover:bg-accent"}`}
                  >
                    <User className="h-4 w-4 inline-block mr-2" />
                    Thông tin cá nhân
                  </a>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm rounded transition-colors ${isDarkMode ? "text-white hover:bg-gray-600" : "text-foreground hover:bg-accent"}`}
                  >
                    <Package className="h-4 w-4 inline-block mr-2" />
                    Đơn hàng của tôi
                  </a>
                  {currentUser.role === "admin" && (
                    <a
                      href="admin-notifications.php"
                      className={`block px-4 py-2 text-sm rounded transition-colors ${isDarkMode ? "text-white hover:bg-gray-600" : "text-foreground hover:bg-accent"}`}
                    >
                      <Settings className="h-4 w-4 inline-block mr-2" />
                      Quản trị
                    </a>
                  )}
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm rounded transition-colors ${isDarkMode ? "text-white hover:bg-gray-600" : "text-foreground hover:bg-accent"}`}
                  >
                    <Settings className="h-4 w-4 inline-block mr-2" />
                    Cài đặt
                  </a>
                  <button
                    onClick={showLogoutConfirmation}
                    className={`w-full text-left px-4 py-2 text-sm rounded transition-colors ${isDarkMode ? "text-white hover:bg-gray-600" : "text-foreground hover:bg-accent"}`}
                  >
                    <LogOut className="h-4 w-4 inline-block mr-2" />
                    Đăng xuất
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      )}

      <DiscountCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        currentItemId={currentItemId}
        selectedCodes={selectedCodes}
        onSelectCode={toggleCodeSelection}
        onRemoveCode={removeSelectedCode}
        onApply={applySelectedCodesToItem}
        isDarkMode={isDarkMode}
        availableCodes={availableCodes}
      />
      {/* </CHANGE> */}

      {isBubbleModalOpen && (
        <>
          <div id="bubbleOverlay" className="bubble-overlay"></div>
          <div id="bubbleModal" className="bubble-modal">
            <div className="bubble-content">
              <div id="bubbleIcon" className="bubble-icon">
                {/* Icon sẽ được thêm động qua JavaScript */}
              </div>
              <h3 id="bubbleTitle" className="bubble-title"></h3>
              <p id="bubbleMessage" className="bubble-message"></p>
              <div className="bubble-buttons">
                <button id="bubbleCancel" onClick={() => setBubbleModalOpen(false)} className="bubble-button cancel">
                  <X className="w-4 h-4" />
                  Hủy bỏ
                </button>
                <button id="bubbleConfirm" className="bubble-button confirm">
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {(activePanel || isSideMenuOpen) && (
        <div
          className={`fixed inset-0 transition-opacity duration-300 z-30 ${isDarkMode ? "bg-black/50" : "bg-black/25"}`}
          style={{
            opacity: activePanel ? 0.25 : menuOverlayOpacity,
            pointerEvents: activePanel || isSideMenuOpen ? "auto" : "none",
          }}
          onClick={() => {
            if (activePanel) {
              animatePanel(activePanel, false)
            } else if (isSideMenuOpen) {
              closeSideMenuWithOverlay()
            }
          }}
        />
      )}

      {isSwipeIndicatorVisible && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-orange-400 to-orange-600 opacity-70 z-40 transition-all duration-200 rounded-r-full shadow-lg animate-pulse" />
      )}

      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right duration-300">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{notificationMessage}</span>
            <button onClick={() => setShowNotification(false)} className="ml-2 text-white hover:text-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {currentSong?.url && <audio ref={audioPlayerRef} id="header-audio" preload="metadata" src={currentSong.url} />}

      {/* CustomizeLibraryPanel */}
      <CustomizeLibraryPanel
        isOpen={showCustomizePanel}
        onClose={() => setShowCustomizePanel(false)}
        onSave={handleSaveCustomize} // Assuming handleSaveCustomize exists or needs to be defined
        onNavbarSave={handleNavbarSave} // Assuming handleNavbarSave exists or needs to be defined
        onHeaderToggle={() => setIsMobileHeaderBottom(!isMobileHeaderBottom)}
        isMobileHeaderBottom={isMobileHeaderBottom}
      />

      <style jsx global>{`
        /* Enhanced CSS for swipe animations and feedback */
        .swiping {
          transition: none !important;
        }
        
        .swipe-feedback {
          box-shadow: 0 0 20px rgba(251, 146, 60, 0.5);
        }
        
        .swipe-indicator {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 64px;
          background: linear-gradient(to bottom, #fb923c, #f97316);
          opacity: 0;
          z-index: 40;
          transition: opacity 0.2s ease;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
        }
        
        .swipe-indicator.visible {
          opacity: 0.7;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        /* Enhanced menu overlay */
        #menuOverlay {
          backdrop-filter: blur(2px);
        }
        
        /* styles for bottom header mode */
        .bottom-header-mode {
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
        }

        /* Dark mode specific styles for filter panels */
        .search-filter-panel-dark {
          /* Changed to dark purple background instead of dark gray */
          background-color: #1e1b4b; /* Dark purple background */
          border: 1px solid #3d3450; /* Purple-gray border */
        }

        .search-filter-panel-light {
          background-color: #ffffff; /* Light background */
          border: 1px solid #d1d5eb; /* Light border */
        }

        .filter-section-title.light {
          color: #4b5563; /* Gray text for light mode */
        }

        .filter-button-dark {
          /* Changed to dark purple button background */
          background-color: #2d2640; /* Dark purple button background */
          color: #e5e7eb; /* Light gray text */
          border: 1px solid #3d3450; /* Purple-gray border */
        }
        .filter-button-dark:hover {
          /* Changed hover to lighter purple */
          background-color: #3d3450; /* Lighter purple hover background */
        }
        .filter-button-dark.active {
          /* Changed active button to purple instead of blue */
          background-color: #8b5cf6; /* More basic purple background for active */
          color: white;
          border-color: #8b5cf6;
        }

        .filter-button-light {
          background-color: #f3f4f6; /* Light button background */
          color: #4b5563; /* Dark gray text */
          border: 1px solid #e5e7eb; /* Lighter border */
        }
        .filter-button-light:hover {
          background-color: #e5e7eb; /* Slightly darker hover background */
        }
        .filter-button-light.active {
          background-color: #f97316; /* Orange background for active */
          color: white;
          border-color: #f97316;
        }

        .filter-input-dark {
          /* Changed input background to match purple theme */
          background-color: #2d2640; /* Dark purple input background */
          border: 1px solid #3d3450; /* Purple-gray border */
          color: #e5e7eb; /* Light text */
        }
        .filter-input-dark::placeholder {
          color: #9ca3af; /* Lighter placeholder */
        }

        .filter-input-light {
          background-color: #f9fafb; /* Very light input background */
          border: 1px solid #d1d5eb; /* Light border */
          color: #1f2937; /* Dark text */
        }
        .filter-input-light::placeholder {
          color: #9ca3af; /* Gray placeholder */
        }

        .filter-quick-select {
          /* Changed quick select background to purple theme */
          background-color: #2d2640;
          color: #9ca3af;
          border: 1px solid #3d3450;
        }
        .filter-quick-select:hover {
          /* Changed hover to lighter purple */
          background-color: #3d3450;
          color: #e5e7eb;
        }

        .filter-quick-select-light {
          background-color: #f3f4f6;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }
        .filter-quick-select-light:hover {
          background-color: #e5e7eb;
          color: #1f2937;
        }

        .filter-checkbox-dark {
          accent-color: #a855f7; /* Purple accent for dark mode checkbox */
        }

        .filter-checkbox-light {
          accent-color: #f97316; /* Orange accent for light mode checkbox */
        }

        .filter-divider {
          height: 1px;
          /* Changed divider to purple-gray */
          background-color: #3d3450; /* Purple-gray divider */
        }
        .filter-divider.light {
          background-color: #e5e7eb; /* Light divider */
        }

        .filter-info-box {
          /* Changed info box background to dark purple */
          background-color: #2d2640; /* Dark purple background */
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 3px solid #a855f7; /* Purple accent */
        }
        .filter-info-box-light {
          background-color: #fef3c7; /* Light yellow background */
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 3px solid #f97316; /* Orange accent */
        }

        /* Styles for bottom-badge */
        .bottom-badge {
          position: absolute;
          bottom: -4px; /* Adjust as needed */
          right: -6px; /* Adjust as needed */
          transform: scale(0.8); /* Slightly smaller */
        }
        .bottom-badge.overflow {
            min-width: 24px;
            width: auto;
            /* Add smaller font size for "9+" to fit in 4x4 badge */
            font-size: 0.5rem;
            font-weight: bold;
        }

      `}</style>

      {isSearchFilterOpen && (
        <div
          className={`fixed z-40 animate-slide-down overflow-y-auto ${
            isMobileHeaderBottom
              ? "top-16 left-2 right-2 max-h-[70vh] rounded-xl"
              : "top-28 left-2 right-2 md:left-auto md:right-4 md:w-[380px] max-h-[75vh] rounded-xl"
          } ${isDarkMode ? "search-filter-panel-dark" : "search-filter-panel-light"}`}
        >
          <div
            className={`flex items-center justify-between p-4 pb-2 border-b ${isDarkMode ? "border-[#3d3450]" : "border-gray-200"}`}
          >
            <h3 className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Bộ lọc tìm kiếm</h3>
            <button
              onClick={() => setIsSearchFilterOpen(false)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isDarkMode
                  ? "hover:bg-[#3d3450] text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
              title="Đóng bộ lọc"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* </CHANGE> */}

          <div className="p-4 space-y-4">
            {/* Search Type Selection */}
            <div>
              <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Loại tìm kiếm</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "all", label: "Tất cả", icon: Grid3x3Gap8 } /* Added "all" search type as first option */,
                  { value: "product", label: "Sản phẩm", icon: ShoppingBag },
                  { value: "category", label: "Danh mục", icon: Package },
                  { value: "user", label: "Người dùng", icon: User },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSearchFilters({ ...searchFilters, searchType: type.value })}
                    className={`${isDarkMode ? "filter-button-dark" : "filter-button-light"} flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${
                      searchFilters.searchType === type.value ? "active" : ""
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`filter-divider ${isDarkMode ? "" : "light"}`} />

            {/* Product Filters */}
            {searchFilters.searchType === "product" && (
              <>
                {/* Category Filter */}
                <div>
                  <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Danh mục sản phẩm</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "all", label: "Tất cả", icon: Package },
                      { value: "product", label: "Sản phẩm", icon: ShoppingBag },
                      { value: "reward", label: "Đổi thưởng", icon: Gift },
                      { value: "deal", label: "Ưu đãi", icon: Tag },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSearchFilters({ ...searchFilters, category: cat.value })}
                        className={`${isDarkMode ? "filter-button-dark" : "filter-button-light"} flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                          searchFilters.category === cat.value ? "active" : ""
                        }`}
                      >
                        <cat.icon className="h-3.5 w-3.5" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Khoảng giá</div>
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className={`text-xs mb-1 block ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                          Từ
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={searchFilters.priceRange.min}
                          onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              priceRange: { ...searchFilters.priceRange, min: Number.parseInt(e.target.value) || 0 },
                            })
                          }
                          className={`${isDarkMode ? "filter-input-dark" : "filter-input-light"} w-full px-2.5 py-2 rounded-lg text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs mb-1 block ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                          Đến
                        </label>
                        <input
                          type="number"
                          placeholder="10,000,000"
                          value={searchFilters.priceRange.max}
                          onChange={(e) =>
                            setSearchFilters({
                              ...searchFilters,
                              priceRange: {
                                ...searchFilters.priceRange,
                                max: Number.parseInt(e.target.value) || 10000000,
                              },
                            })
                          }
                          className={`${isDarkMode ? "filter-input-dark" : "filter-input-light"} w-full px-2.5 py-2 rounded-lg text-xs`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "< 100K", max: 100000 },
                        { label: "100K - 500K", min: 100000, max: 500000 },
                        { label: "500K - 1M", min: 500000, max: 1000000 },
                        { label: "> 1M", min: 1000000 },
                      ].map((range, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setSearchFilters({
                              ...searchFilters,
                              priceRange: { min: range.min || 0, max: range.max || 10000000 },
                            })
                          }
                          className={`${isDarkMode ? "filter-quick-select" : "filter-quick-select-light"}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Sắp xếp theo</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "newest", label: "Mới nhất" },
                      { value: "popular", label: "Phổ biến" },
                      { value: "price-asc", label: "Giá thấp → cao" },
                      { value: "price-desc", label: "Giá cao → thấp" },
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => setSearchFilters({ ...searchFilters, sortBy: sort.value })}
                        className={`${isDarkMode ? "filter-button-dark" : "filter-button-light"} px-3 py-2 rounded-lg text-xs font-medium ${
                          searchFilters.sortBy === sort.value ? "active" : ""
                        }`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className={`flex items-center gap-2.5 cursor-pointer group ${isDarkMode ? "" : ""}`}>
                    <input
                      type="checkbox"
                      checked={searchFilters.inStock}
                      onChange={(e) => setSearchFilters({ ...searchFilters, inStock: e.target.checked })}
                      className={`${isDarkMode ? "filter-checkbox-dark" : "filter-checkbox-light"} w-4 h-4`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isDarkMode ? "text-gray-300 group-hover:text-white" : "text-gray-800 group-hover:text-gray-900"
                      }`}
                    >
                      Chỉ hiển thị sản phẩm còn hàng
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Category Filters */}
            {searchFilters.searchType === "category" && (
              <>
                <div>
                  <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Loại danh mục</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "all", label: "Tất cả" },
                      { value: "main", label: "Chính" },
                      { value: "sub", label: "Phụ" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSearchFilters({ ...searchFilters, categoryType: type.value })}
                        className={`${isDarkMode ? "filter-button-dark" : "filter-button-light"} px-3 py-2 rounded-lg text-xs font-medium ${
                          searchFilters.categoryType === type.value ? "active" : ""
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`${isDarkMode ? "filter-info-box" : "filter-info-box-light"}`}>
                  <p className={`text-xs ${isDarkMode ? "text-blue-300" : "text-orange-700"}`}>
                    <span className="font-semibold">Mẹo:</span> Tìm kiếm danh mục để khám phá các sản phẩm theo nhóm
                  </p>
                </div>
              </>
            )}

            {/* User Filters */}
            {searchFilters.searchType === "user" && (
              <>
                <div>
                  <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Hoạt động</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "all", label: "Tất cả" },
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Không hoạt động" },
                    ].map((activity) => (
                      <button
                        key={activity.value}
                        onClick={() => setSearchFilters({ ...searchFilters, userActivity: activity.value })}
                        className={`${isDarkMode ? "filter-button-dark" : "filter-button-light"} px-3 py-2 rounded-lg text-xs font-medium ${
                          searchFilters.userActivity === activity.value ? "active" : ""
                        }`}
                      >
                        {activity.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className={`filter-section-title ${isDarkMode ? "" : "light"}`}>Sắp xếp theo</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "followers", label: "Người theo dõi" },
                      { value: "posts", label: "Bài viết" },
                      { value: "joined", label: "Ngày tham gia" },
                    ].map((sort) => (
                      <button
                        key={sort.value}
                        onClick={() => setSearchFilters({ ...searchFilters, userSort: sort.value })}
                        className={`${isDarkMode ? "filter-button-dark" : "filter-button-light"} px-3 py-2 rounded-lg text-xs font-medium ${
                          searchFilters.userSort === sort.value ? "active" : ""
                        }`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${isDarkMode ? "filter-info-box" : "filter-info-box-light"}`}>
                  <p className={`text-xs ${isDarkMode ? "text-blue-300" : "text-orange-700"}`}>
                    <span className="font-semibold">Mẹo:</span> Tìm kiếm người dùng để kết nối và theo dõi những người
                    có cùng sở thích
                  </p>
                </div>
              </>
            )}

            <div className={`filter-divider ${isDarkMode ? "" : "light"}`} />

            {/* Action Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={resetFilters}
                className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-xs ${
                  isDarkMode
                    ? "bg-[#171717] border border-[#262626] text-gray-300 hover:bg-[#1a1a1a] hover:border-[#404040]"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Đặt lại
              </button>
              <button
                onClick={() => setIsSearchFilterOpen(false)}
                className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-xs ${
                  isDarkMode
                    ? /* Changed apply button to purple instead of blue */
                      "bg-[#a855f7] text-white hover:bg-[#9333ea] shadow-lg shadow-purple-500/20"
                    : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkAsRead={markNotificationAsRead}
          formatDate={(date: string) => {
            // Use existing formatDate logic from notifications hook
            return new Date(date).toLocaleDateString("vi-VN")
          }}
          isDarkMode={isDarkMode}
          onDelete={(id: string) => {
            const user = JSON.parse(sessionStorage.getItem("currentUser")!)
            if (user) {
              let userNotifications: any[] = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || "[]")
              userNotifications = userNotifications.filter((n: any) => n.id !== id)
              localStorage.setItem(`notifications_${user.id}`, JSON.stringify(userNotifications))
              window.dispatchEvent(new Event("notificationsUpdated"))
            }
          }}
          onPin={(id: string) => {
            const user = JSON.parse(sessionStorage.getItem("currentUser")!)
            if (user) {
              let pinnedNotifications: Record<string, number | null> = {}
              try {
                const pinnedData = localStorage.getItem(`pinnedNotifications_${user.id}`)
                pinnedNotifications = pinnedData ? JSON.parse(pinnedData) : {}
              } catch (parseError) {
                console.warn("Could not parse pinned notifications")
                pinnedNotifications = {}
              }

              const isCurrentlyPinned = !!pinnedNotifications[id]
              if (!isCurrentlyPinned) {
                const pinnedCount = Object.values(pinnedNotifications).filter(Boolean).length
                if (pinnedCount >= 3) {
                  alert("Bạn chỉ có thể ghim tối đa 3 thông báo")
                  return
                }
                // Pin now - store current timestamp
                pinnedNotifications[id] = Date.now()
              } else {
                // Unpin - set to null
                pinnedNotifications[id] = null
              }
              localStorage.setItem(`pinnedNotifications_${user.id}`, JSON.JSON.stringify(pinnedNotifications))
              window.dispatchEvent(new Event("notificationsUpdated"))
            }
          }}
        />
      )}
    </div>
  )
}
