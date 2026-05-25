"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export const useMusicPagePlayer = () => {
  // Music player state - riêng biệt với header player
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [repeatShuffleState, setRepeatShuffleState] = useState("repeat-all")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [favoriteSongs, setFavoriteSongs] = useState(new Set())
  const [currentPlaylistCategory, setCurrentPlaylistCategory] = useState("most-played")
  const [searchResults, setSearchResults] = useState([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [userFavoritesPlaylist, setUserFavoritesPlaylist] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [volume, setVolume] = useState(1)

  const audioPlayerRef = useRef(null)
  const loadFavoritesTimeoutRef = useRef(null)
  const playerId = "music-page-player"

  const notifyOtherPlayersToStop = () => {
    if (typeof window !== "undefined") {
      console.log("[v0] Music page player notifying others to stop")
      window.dispatchEvent(
        new CustomEvent("musicPlayerStop", {
          detail: { fromPlayer: playerId },
        }),
      )
    }
  }

  const handleStopFromOtherPlayer = useCallback(
    (event) => {
      if (event.detail.fromPlayer !== playerId && isPlaying) {
        console.log("[v0] Music page player received stop request from:", event.detail.fromPlayer)
        pauseSong()
      }
    },
    [isPlaying],
  )

  const checkAuthStatus = () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(sessionStorage.getItem("currentUser") || "null")
      setCurrentUser(user)
      setIsLoggedIn(!!user)
      return !!user
    }
    return false
  }

  const loadUserFavorites = useCallback(() => {
    // Clear existing timeout
    if (loadFavoritesTimeoutRef.current) {
      clearTimeout(loadFavoritesTimeoutRef.current)
    }

    // Debounce the actual loading
    loadFavoritesTimeoutRef.current = setTimeout(() => {
      if (typeof window !== "undefined") {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null")
        console.log("[v0] Music page loading user favorites for user:", currentUser?.id)

        if (currentUser && currentUser.favoriteSongs) {
          setUserFavoritesPlaylist([...currentUser.favoriteSongs])
          updateFavoriteIconStates(currentUser.favoriteSongs)
          console.log("[v0] Music page loaded favorites:", currentUser.favoriteSongs.length)
        } else {
          setUserFavoritesPlaylist([])
          setFavoriteSongs(new Set())
          console.log("[v0] Music page loaded favorites: 0")
        }
      }
    }, 100) // 100ms debounce
  }, [])

  const syncAuthState = useCallback(() => {
    const isAuth = checkAuthStatus()
    if (isAuth) {
      loadUserFavorites()
    } else {
      setUserFavoritesPlaylist([])
      setFavoriteSongs(new Set())
    }
  }, [loadUserFavorites])

  const songLibrary = {
    1: {
      id: 1,
      title: "Apt Rose - Bruno Mars",
      artist: "Rose & Bruno Mars",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apt-rose-bruno-mars-aye30BKqI2WuENctRa1PAjYReXj5Tm.mp3",
      image: "/modern-music-album-cover-with-vibrant-colors.png",
    },
    2: {
      id: 2,
      title: "Đừng Làm Trái Tim Anh Đau",
      artist: "Sơn Tùng M-TP",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nhac-Chuong-Dung-Lam-Trai-Tim-Anh-Dau-DK-Son-Tung-M-TP-koNLbopTHY2PfOUgqOs6WwYKC0V5Mz.mp3",
      image: "/acoustic-guitar-album-cover-with-warm-tones.png",
    },
    3: {
      id: 3,
      title: "Birds of a Feather",
      artist: "Billie Eilish",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/us-uk-birds-of-a-feather-billie-eilish-Dux8fqsBTyX9zLTcpUFl3SMyq5PfEW.mp3",
      image: "/electronic-music-neon-album-cover.png",
    },
    4: {
      id: 4,
      title: "Toxic Till The End",
      artist: "Rose",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/toxic-till-the-end-rose-itRW479B9LsUMm4OLKYU54V5mbouib.mp3",
      image: "/modern-music-album-cover-with-vibrant-colors.png",
    },
    5: {
      id: 5,
      title: "Lâu Đài Cát",
      artist: "Thơ Trauma",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nhac-chuong-lau-dai-cat-tho-trauma-S7msou7LTH6tlcOwFXBJcbavQfDTFK.mp3",
      image: "/peaceful-nature-scene-for-relaxing-music.png",
    },
    6: {
      id: 6,
      title: "Nhạc Chuông Báo Thức Trong Quân Đội",
      artist: "Unknown",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nhac%20Chuong%20Bao%20Thuc%20Trong%20Quan%20Doi-4RLmsZxZde3rbdO1yehUrbHBYE4r4g.mp3",
      image: "/classical-instruments-orchestra-album-cover.png",
    },
    7: {
      id: 7,
      title: "Thương Ly Biệt",
      artist: "Chu Thúy Quỳnh",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nhac-Chuong-Thuong-Ly-Biet-Loi-Viet-Chu-Thuy-Quynh-IJyB5l9aSM9vbvL8IGfXMLwKQNjGfU.mp3",
      image: "/acoustic-guitar-album-cover-with-warm-tones.png",
    },
    8: {
      id: 8,
      title: "Tình Đầu Quá Chén",
      artist: "Anh Trai Say Hi",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nhac-chuong-tinh-dau-qua-chen-anh-trai-say-hi-iQNPPVLni5dswyo9ouaNuiHkSSegWj.mp3",
      image: "/modern-music-album-cover-with-vibrant-colors.png",
    },
    9: {
      id: 9,
      title: "Triệu Điều Nhớ",
      artist: "Xiu Xiu Long Đen Kim Long",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nhac-chuong-trieu-dieu-nho-xiu-xieu-long-den-kim-long-xrmbw7odzRxtmwHnaV3ta3ijTbeToZ.mp3",
      image: "/electronic-music-neon-album-cover.png",
    },
    10: {
      id: 10,
      title: "Đi Giữa Trời Rực Rỡ OST",
      artist: "Ngô Lan Hương",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/di-giua-troi-ruc-ro-ost-ngo-lan-huong-5bvEYvolmjMNXt1AxEKEnuRx9DwREn.mp3",
      image: "/peaceful-nature-scene-for-relaxing-music.png",
    },
  }

  const playlists = {
    "most-played": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // All songs in "Nghe nhiều nhất"
    favorites: [], // Will be dynamically updated from user data
    podcast: [], // Empty podcast playlist as requested
    instrumental: [5, 10], // Added "Lâu Đài Cát" and "Đi Giữa Trời Rực Rỡ OST" as instrumental-style songs
  }

  playlists.favorites = userFavoritesPlaylist

  const getPlaylistSongs = (playlistKey) => {
    const songIds = playlists[playlistKey] || []
    return songIds.map((id) => songLibrary[id]).filter(Boolean)
  }

  const getAllSongs = () => {
    return Object.values(songLibrary)
  }

  const playlist = isSearchMode ? searchResults : getPlaylistSongs(currentPlaylistCategory)
  const currentSong = playlist[currentSongIndex] || { title: "Chọn bài hát", artist: "Unknown", url: "" }

  const addSongToPlaylist = (songId, playlistKey) => {
    if (songLibrary[songId] && playlists[playlistKey]) {
      if (!playlists[playlistKey].includes(songId)) {
        playlists[playlistKey].push(songId)
      }
    }
  }

  const removeSongFromPlaylist = (songId, playlistKey) => {
    if (playlists[playlistKey]) {
      const index = playlists[playlistKey].indexOf(songId)
      if (index > -1) {
        playlists[playlistKey].splice(index, 1)
      }
    }
  }

  const addSongToLibrary = (songData) => {
    const newId = Math.max(...Object.keys(songLibrary).map(Number)) + 1
    songLibrary[newId] = { ...songData, id: newId }
    return newId
  }

  const isSongInFavorites = (songId) => {
    return userFavoritesPlaylist.includes(songId)
  }

  const isCurrentSongFavorite = (songIndex) => {
    const song = playlist[songIndex]
    return song ? userFavoritesPlaylist.includes(song.id) : false
  }

  // Music player functions
  const loadSong = (index) => {
    if (audioPlayerRef.current && playlist[index] && playlist[index].url) {
      const songUrl = playlist[index].url.trim()
      if (songUrl) {
        audioPlayerRef.current.src = songUrl
        setCurrentTime(0)
        setDuration(0)
        audioPlayerRef.current.load()
      }
    }
  }

  const playSong = async () => {
    notifyOtherPlayersToStop()
    setIsPlaying(true)
    if (audioPlayerRef.current && audioPlayerRef.current.src) {
      try {
        await audioPlayerRef.current.play()
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("[v0] Music page audio play aborted - this is normal when switching songs quickly")
        } else {
          console.log("[v0] Music page audio play error:", error.name, error.message)
          setIsPlaying(false)
        }
      }
    }
  }

  const pauseSong = () => {
    setIsPlaying(false)
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSong()
    } else {
      playSong()
    }
  }

  const prevSong = () => {
    const newIndex = currentSongIndex - 1 < 0 ? playlist.length - 1 : currentSongIndex - 1
    setCurrentSongIndex(newIndex)
    loadSong(newIndex)
    if (isPlaying) {
      setTimeout(() => playSong(), 100)
    }
  }

  const nextSong = () => {
    const newIndex = currentSongIndex + 1 >= playlist.length ? 0 : currentSongIndex + 1
    setCurrentSongIndex(newIndex)
    loadSong(newIndex)
    if (isPlaying) {
      setTimeout(() => playSong(), 100)
    }
  }

  const toggleRepeatMode = () => {
    setRepeatShuffleState((prev) => {
      switch (prev) {
        case "repeat-all":
          return "repeat-one"
        case "repeat-one":
          return "shuffle"
        case "shuffle":
          return "repeat-all"
        default:
          return "repeat-all"
      }
    })
  }

  const handleProgressClick = (e) => {
    if (audioPlayerRef.current && duration > 0) {
      const progressBar = e.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      audioPlayerRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const searchSongs = (query) => {
    console.log("[v0] Music page searching for:", query)

    if (!query || query.trim().length < 2) {
      setSearchResults([])
      setIsSearchMode(false)
      setCurrentSongIndex(0)
      return []
    }

    const allSongs = Object.values(songLibrary)
    const results = allSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)
    setIsSearchMode(results.length > 0)

    if (results.length > 0) {
      setCurrentSongIndex(0)
      // Auto-load first search result
      setTimeout(() => loadSong(0), 100)
    }

    console.log("[v0] Music page search results:", results.length)
    return results
  }

  const showCategory = (category) => {
    const categoryMap = {
      music: "most-played",
      sound: "favorites",
      audiobook: "podcast",
      instrumental: "instrumental",
    }

    const playlistKey = categoryMap[category] || "most-played"
    setCurrentPlaylistCategory(playlistKey)
    setCurrentSongIndex(0) // Reset to first song of new playlist
    setIsSearchMode(false)
    setSearchQuery("")
    setSearchResults([])

    console.log("[v0] Music page category changed to:", playlistKey, "Songs:", playlists[playlistKey].length)

    // Load first song of new playlist if it exists
    if (playlists[playlistKey].length > 0) {
      loadSong(0)
    }
  }

  const playSongByIndex = (index) => {
    setCurrentSongIndex(index)
    loadSong(index)
    setTimeout(() => playSong(), 100)
  }

  const toggleFavorite = async (songIndex) => {
    if (isTogglingFavorite) return

    setIsTogglingFavorite(true)

    try {
      const currentUser =
        typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("currentUser") || "null") : null

      const currentSong = playlist[songIndex]
      if (!currentSong) return

      if (!currentUser) {
        // For non-logged-in users: still toggle the visual state but show notification
        setFavoriteSongs((prev) => {
          const newFavorites = new Set(prev)
          if (newFavorites.has(songIndex)) {
            newFavorites.delete(songIndex)
          } else {
            newFavorites.add(songIndex)
          }
          return newFavorites
        })

        // Show login notification
        setNotificationMessage("Đăng nhập để thêm vào danh sách yêu thích")
        setShowNotification(true)

        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowNotification(false)
        }, 3000)

        return
      }

      if (typeof window !== "undefined") {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u) => u.id === currentUser.id)

        if (userIndex !== -1) {
          if (!users[userIndex].favoriteSongs) {
            users[userIndex].favoriteSongs = []
          }

          const isCurrentlyFavorite = users[userIndex].favoriteSongs.includes(currentSong.id)

          if (isCurrentlyFavorite) {
            // Remove from favorites playlist
            users[userIndex].favoriteSongs = users[userIndex].favoriteSongs.filter((id) => id !== currentSong.id)
            setNotificationMessage("Đã xóa khỏi danh sách yêu thích")
          } else {
            // Add to favorites playlist
            users[userIndex].favoriteSongs.push(currentSong.id)
            setNotificationMessage("Đã thêm vào danh sách yêu thích")
          }

          setUserFavoritesPlaylist([...users[userIndex].favoriteSongs])
          updateFavoriteIconStates(users[userIndex].favoriteSongs)

          localStorage.setItem("users", JSON.stringify(users))
          sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))

          window.dispatchEvent(
            new CustomEvent("favoritesUpdated", {
              detail: {
                userId: currentUser.id,
                favorites: users[userIndex].favoriteSongs,
              },
            }),
          )

          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
          }, 2000)
        }
      }
    } catch (error) {
      console.error("[v0] Music page error toggling favorite:", error)
      setNotificationMessage("Có lỗi xảy ra khi cập nhật yêu thích")
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    } finally {
      setTimeout(() => {
        setIsTogglingFavorite(false)
      }, 100)
    }
  }

  const updateFavoriteIconStates = (userFavoriteIds) => {
    const favoriteIndices = new Set()
    playlist.forEach((song, index) => {
      if (userFavoriteIds.includes(song.id)) {
        favoriteIndices.add(index)
      }
    })
    setFavoriteSongs(favoriteIndices)
  }

  const isValidSearchQuery = (query) => {
    if (!query || query.trim().length < 2) return false

    // Check if query contains at least one word with 2+ consecutive characters
    const words = query.trim().split(/\s+/)
    return words.some((word) => word.length >= 2)
  }

  const isActiveSearchMode = () => {
    return searchQuery && searchQuery.trim().length >= 2 && isValidSearchQuery(searchQuery)
  }

  const filteredSongs = isActiveSearchMode() ? searchResults : playlist

  useEffect(() => {
    if (searchQuery.trim() && isValidSearchQuery(searchQuery)) {
      const results = searchSongs(searchQuery)
      if (results.length > 0) {
        setCurrentSongIndex(0) // Reset to first song in search results
        // Load first song from search results
        setTimeout(() => {
          if (results[0]) {
            loadSong(0)
          }
        }, 100)
      }
    } else {
      setSearchResults([])
      setIsSearchMode(false)
      // Return to current playlist category
      const currentPlaylist = getPlaylistSongs(currentPlaylistCategory)
      if (currentPlaylist.length > 0) {
        setCurrentSongIndex(0)
        loadSong(0)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    if (!isSearchMode && playlist.length > 0) {
      loadSong(0)
    }
  }, [currentPlaylistCategory, isSearchMode])

  useEffect(() => {
    const audio = audioPlayerRef.current
    if (!audio) return

    audio.volume = volume

    const handleTimeUpdate = () => {
      if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = async () => {
      if (repeatShuffleState === "repeat-one") {
        audio.currentTime = 0
        try {
          await audio.play()
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("[v0] Music page repeat play aborted - this is normal")
          } else {
            console.log("[v0] Music page repeat play error:", error.name, error.message)
            setIsPlaying(false)
          }
        }
      } else if (repeatShuffleState === "shuffle") {
        const randomIndex = Math.floor(Math.random() * playlist.length)
        setCurrentSongIndex(randomIndex)
        loadSong(randomIndex)
        setTimeout(() => playSong(), 100)
      } else {
        nextSong()
      }
    }

    const handleError = () => {
      console.log("[v0] Music page audio loading error, resetting time states")
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [repeatShuffleState, currentSongIndex, volume])

  useEffect(() => {
    if (playlist.length > 0) {
      loadSong(0)
    }
  }, [])

  useEffect(() => {
    syncAuthState()
  }, [])

  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only sync auth state for relevant storage changes
      if (e.key === "currentUser") {
        console.log("[v0] Music page storage changed: currentUser")
        syncAuthState()
      } else if (e.key === "users") {
        // Only reload if current user data might have changed
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null")
        if (currentUser) {
          console.log("[v0] Music page storage changed: users")
          loadUserFavorites()
        }
      }
    }

    // Listen for session storage changes (same tab login/logout)
    const handleSessionChange = () => {
      console.log("[v0] Music page session changed, syncing auth state")
      syncAuthState()
    }

    window.addEventListener("storage", handleStorageChange)
    // Custom event for same-tab session changes
    window.addEventListener("sessionChange", handleSessionChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sessionChange", handleSessionChange)
      if (loadFavoritesTimeoutRef.current) {
        clearTimeout(loadFavoritesTimeoutRef.current)
      }
    }
  }, [syncAuthState, loadUserFavorites])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("musicPlayerStop", handleStopFromOtherPlayer)

      return () => {
        window.removeEventListener("musicPlayerStop", handleStopFromOtherPlayer)
      }
    }
  }, [handleStopFromOtherPlayer])

  const setVolumeLevel = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = clampedVolume
    }
  }

  const toggleMute = () => {
    if (volume > 0) {
      setVolumeLevel(0)
    } else {
      setVolumeLevel(1)
    }
  }

  return {
    // State
    isPlaying,
    currentSongIndex,
    repeatShuffleState,
    currentTime,
    duration,
    searchQuery,
    setSearchQuery,
    favoriteSongs,
    playlist,
    currentSong,
    filteredSongs,
    audioPlayerRef,
    currentPlaylistCategory,
    searchResults,
    isSearchMode,
    isActiveSearchMode,
    showNotification,
    notificationMessage,
    setShowNotification,
    userFavoritesPlaylist,
    isLoggedIn,
    currentUser,
    checkAuthStatus,
    syncAuthState,
    isTogglingFavorite,
    volume,

    songLibrary,
    getAllSongs,
    addSongToPlaylist,
    removeSongFromPlaylist,
    addSongToLibrary,
    getPlaylistSongs,
    loadUserFavorites,
    isSongInFavorites,
    isCurrentSongFavorite,

    // Functions
    loadSong,
    playSong,
    pauseSong,
    togglePlayPause,
    prevSong,
    nextSong,
    toggleRepeatMode,
    handleProgressClick,
    showCategory,
    playSongByIndex,
    toggleFavorite,
    searchSongs,
    setVolumeLevel,
    toggleMute,
  }
}
