"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export const useMusicPlayer = () => {
  // Music player state
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [repeatShuffleState, setRepeatShuffleState] = useState("repeat-all")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [showSongList, setShowSongList] = useState(false)
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
  const [activePlayer, setActivePlayer] = useState("header") // "header" or "music-page"
  const [volume, setVolume] = useState(1)
  const [userPlaylists, setUserPlaylists] = useState([])
  const audioPlayerRef = useRef(null)
  const loadFavoritesTimeoutRef = useRef(null)
  const playerId = "header-player"

  const notifyOtherPlayersToStop = () => {
    if (typeof window !== "undefined") {
      console.log("[v0] Header player notifying others to stop")
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
        console.log("[v0] Header player received stop request from:", event.detail.fromPlayer)
        pauseSong()
      }
    },
    [isPlaying],
  )

  const switchToPlayer = (playerType) => {
    if (activePlayer !== playerType) {
      // Pause current player when switching
      if (isPlaying) {
        pauseSong()
      }
      setActivePlayer(playerType)
      console.log("[v0] Switched to player:", playerType)

      if (typeof window !== "undefined") {
        const audioElement =
          playerType === "music-page"
            ? document.getElementById("music-page-audio")
            : document.getElementById("header-audio")

        if (audioElement && audioPlayerRef.current !== audioElement) {
          audioPlayerRef.current = audioElement
          // Sync the new audio element with current song
          if (currentSong.url) {
            audioElement.src = currentSong.url
            audioElement.currentTime = currentTime
            audioElement.volume = volume
          }
        }
      }
    }
  }

  const isActivePlayer = (playerType) => {
    return activePlayer === playerType
  }

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
        console.log("[v0] Loading user favorites for user:", currentUser?.id)

        if (currentUser && currentUser.favoriteSongs) {
          setUserFavoritesPlaylist([...currentUser.favoriteSongs])
          // Ensure updating icon states right after loading favorites
          setTimeout(() => {
            updateFavoriteIconStates(currentUser.favoriteSongs)
          }, 100)
          console.log("[v0] Loaded favorites:", currentUser.favoriteSongs.length)
        } else {
          setUserFavoritesPlaylist([])
          setFavoriteSongs(new Set())
          console.log("[v0] Loaded favorites: 0")
        }
      }
    }, 100) // 100ms debounce
  }, [])

  const syncAuthState = useCallback(() => {
    const isAuth = checkAuthStatus()
    if (isAuth) {
      loadUserFavorites()
      loadUserPlaylists()
    } else {
      setUserFavoritesPlaylist([])
      setFavoriteSongs(new Set())
      setUserPlaylists([])
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

  if (userPlaylists.length > 0) {
    userPlaylists.forEach((playlist) => {
      playlists[`user-playlist-${playlist.id}`] = playlist.songs ? playlist.songs.map((song) => song.id) : []
    })
  }

  const getPlaylistSongs = (playlistKey) => {
    console.log("[v0] getPlaylistSongs called with playlistKey:", playlistKey)
    console.log("[v0] userFavoritesPlaylist:", userFavoritesPlaylist)
    console.log("[v0] playlists[playlistKey]:", playlists[playlistKey])

    if (playlistKey === "favorites") {
      const result = userFavoritesPlaylist.map((id) => songLibrary[id]).filter(Boolean)
      console.log("[v0] Favorites result length:", result.length, "IDs:", userFavoritesPlaylist)
      return result
    }
    const songIds = playlists[playlistKey] || []
    return songIds.map((id) => songLibrary[id]).filter(Boolean)
  }

  const getAllSongs = () => {
    return Object.values(songLibrary)
  }

  const playlist = isSearchMode ? searchResults : getPlaylistSongs(currentPlaylistCategory)
  const currentSong = playlist[currentSongIndex] || { title: "Chọn bài hát", artist: "Unknown", url: null, image: null }

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

  const loadSong = (index) => {
    if (audioPlayerRef.current && playlist[index] && playlist[index].url) {
      const songUrl = playlist[index].url.trim()
      if (songUrl) {
        audioPlayerRef.current.src = songUrl
        setCurrentTime(0)
        setDuration(0)
        audioPlayerRef.current.load()

        if (typeof window !== "undefined") {
          const inactiveAudioId = activePlayer === "music-page" ? "header-audio" : "music-page-audio"
          const inactiveAudio = document.getElementById(inactiveAudioId)
          if (inactiveAudio) {
            inactiveAudio.src = songUrl
            inactiveAudio.load()
          }
        }
      }
    }
  }

  const playSong = async (skipNotification = false) => {
    if (!skipNotification) {
      notifyOtherPlayersToStop()
    }
    setIsPlaying(true)
    if (audioPlayerRef.current && audioPlayerRef.current.src) {
      try {
        await audioPlayerRef.current.play()
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("[v0] Audio play aborted - this is normal when switching songs quickly")
        } else {
          console.log("[v0] Audio play error:", error.name, error.message)
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

  const togglePlayPause = (playerType = "header") => {
    switchToPlayer(playerType)

    if (isPlaying) {
      pauseSong()
    } else {
      playSong(false)
    }
  }

  const prevSong = () => {
    const newIndex = currentSongIndex - 1 < 0 ? playlist.length - 1 : currentSongIndex - 1
    setCurrentSongIndex(newIndex)
    loadSong(newIndex)
    if (isPlaying) {
      setTimeout(() => playSong(false), 100)
    }
  }

  const nextSong = () => {
    const newIndex = currentSongIndex + 1 >= playlist.length ? 0 : currentSongIndex + 1
    setCurrentSongIndex(newIndex)
    loadSong(newIndex)
    if (isPlaying) {
      setTimeout(() => playSong(false), 100)
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
    console.log("[v0] Searching for:", query)

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
      setTimeout(() => loadSong(0), 100)
    }

    console.log("[v0] Search results:", results.length)
    return results
  }

  const showCategory = (category) => {
    const categoryMap = {
      music: "most-played",
      sound: "favorites",
      favorites: "favorites",
      audiobook: "podcast",
      instrumental: "instrumental",
    }

    let playlistKey = categoryMap[category] || category

    // If it's a user playlist, keep the original category key
    if (category.startsWith("user-playlist-")) {
      playlistKey = category
    } else {
      playlistKey = categoryMap[category] || "most-played"
    }

    setCurrentPlaylistCategory(playlistKey)
    setCurrentSongIndex(0)
    setShowSongList(true)
    setShowPlaylist(false)
    setIsSearchMode(false)
    setSearchQuery("")
    setSearchResults([])

    console.log("[v0] Category changed to:", playlistKey, "Songs:", (playlists[playlistKey] || []).length)

    if ((playlists[playlistKey] || []).length > 0) {
      loadSong(0)
    }
  }

  const playSongByIndex = (index, playerType = "header") => {
    switchToPlayer(playerType)
    setCurrentSongIndex(index)
    loadSong(index)
    setTimeout(() => playSong(false), 100)
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
        setFavoriteSongs((prev) => {
          const newFavorites = new Set(prev)
          if (newFavorites.has(songIndex)) {
            newFavorites.delete(songIndex)
          } else {
            newFavorites.add(songIndex)
          }
          return newFavorites
        })

        setNotificationMessage("Đăng nhập để thêm vào danh sách yêu thích")
        setShowNotification(true)

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
            users[userIndex].favoriteSongs = users[userIndex].favoriteSongs.filter((id) => id !== currentSong.id)
            setNotificationMessage("Đã xóa khỏi danh sách yêu thích")
          } else {
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
      console.error("[v0] Error toggling favorite:", error)
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
    const currentPlaylist = isSearchMode ? searchResults : getPlaylistSongs(currentPlaylistCategory)
    currentPlaylist.forEach((song, index) => {
      if (song && userFavoriteIds.includes(song.id)) {
        favoriteIndices.add(index)
      }
    })
    setFavoriteSongs(favoriteIndices)
    console.log("[v0] Updated favorite icon states:", favoriteIndices.size, "favorites found")
  }

  const handlePlaylistToggle = () => {
    console.log("[v0] Toggling playlist, current states - showSongList:", showSongList, "showPlaylist:", showPlaylist)
    const songSearchInput = document.getElementById("songSearch")
    if (songSearchInput && document.activeElement === songSearchInput) {
      console.log("[v0] Search input is focused, not closing playlist")
      return
    }

    if (showSongList) {
      setShowSongList(false)
      setShowPlaylist(false)
    } else {
      setShowPlaylist(!showPlaylist)
      if (!showPlaylist) {
        setIsSearchMode(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }
  }

  const isValidSearchQuery = (query) => {
    if (!query || query.trim().length < 2) return false

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
        setCurrentSongIndex(0)
        setShowSongList(true)
        setTimeout(() => {
          if (results[0]) {
            loadSong(0)
          }
        }, 100)
      }
    } else {
      setSearchResults([])
      setIsSearchMode(false)
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

    const handleEnded = () => {
      console.log("[v0] Song ended, repeat mode:", repeatShuffleState)

      if (repeatShuffleState === "repeat-one") {
        console.log("[v0] Repeating current song")
        setCurrentTime(0) // Reset state trước
        audio.currentTime = 0

        // Đảm bảo audio sẵn sàng trước khi play
        audio.load()

        setTimeout(async () => {
          try {
            await audio.play()
            console.log("[v0] Song restarted successfully")
            setIsPlaying(true)
          } catch (error) {
            if (error.name === "AbortError") {
              console.log("[v0] Song restart aborted - this is normal")
            } else {
              console.log("[v0] Error restarting song:", error.name, error.message)
              setIsPlaying(false)
            }
          }
        }, 150) // Tăng delay để audio element ổn định
      } else if (repeatShuffleState === "shuffle") {
        const randomIndex = Math.floor(Math.random() * playlist.length)
        console.log("[v0] Shuffling to song index:", randomIndex)
        setCurrentSongIndex(randomIndex)
        loadSong(randomIndex)
        setTimeout(() => playSong(true), 100)
      } else {
        console.log("[v0] Playing next song")
        nextSong()
      }
    }

    const handleError = () => {
      console.log("[v0] Audio loading error, resetting time states")
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    }

    const handleLoadStart = () => {
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("loadstart", handleLoadStart)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("loadstart", handleLoadStart)
    }
  }, [repeatShuffleState, currentSongIndex, volume])

  useEffect(() => {
    syncAuthState()
  }, [])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        console.log("[v0] Storage changed: currentUser")
        syncAuthState()
      } else if (e.key === "users") {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null")
        if (currentUser) {
          console.log("[v0] Storage changed: users")
          loadUserFavorites()
          loadUserPlaylists()
        }
      }
    }

    const handlePlaylistUpdate = () => {
      console.log("[v0] Playlist update event received")
      loadUserPlaylists()
    }

    const handleSessionChange = () => {
      console.log("[v0] Session changed, syncing auth state")
      syncAuthState()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("sessionChange", handleSessionChange)
    window.addEventListener("playlistUpdate", handlePlaylistUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sessionChange", handleSessionChange)
      window.removeEventListener("playlistUpdate", handlePlaylistUpdate)
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

  useEffect(() => {
    const handleFavoritesUpdate = (event) => {
      const { userId, favorites } = event.detail
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null")

      if (currentUser && currentUser.id === userId) {
        console.log("[v0] Favorites updated from another component/tab")
        setUserFavoritesPlaylist([...favorites])
        updateFavoriteIconStates(favorites)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", handleFavoritesUpdate)
      return () => window.removeEventListener("favoritesUpdated", handleFavoritesUpdate)
    }
  }, [])

  // Update favorite icons when playlist changes
  useEffect(() => {
    if (userFavoritesPlaylist.length > 0) {
      updateFavoriteIconStates(userFavoritesPlaylist)
    }
  }, [currentPlaylistCategory, isSearchMode, searchResults, userFavoritesPlaylist])

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

  const loadUserPlaylists = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null")
      console.log("[v0] Loading user playlists for user:", currentUser?.id)

      if (currentUser && currentUser.playlists) {
        setUserPlaylists([...currentUser.playlists])
        console.log("[v0] Loaded playlists:", currentUser.playlists.length)
      } else {
        setUserPlaylists([])
        console.log("[v0] Loaded playlists: 0")
      }
    }
  }, [])

  return {
    isMusicPlayerVisible,
    setIsMusicPlayerVisible,
    isPlaying,
    currentSongIndex,
    repeatShuffleState,
    currentTime,
    duration,
    showPlaylist,
    setShowPlaylist,
    showSongList,
    setShowSongList,
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
    activePlayer,
    volume,
    userPlaylists,

    songLibrary,
    getAllSongs,
    addSongToPlaylist,
    removeSongFromPlaylist,
    addSongToLibrary,
    getPlaylistSongs,
    loadUserFavorites,
    loadUserPlaylists,
    isSongInFavorites,
    isCurrentSongFavorite,

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
    handlePlaylistToggle,
    searchSongs,
    switchToPlayer,
    isActivePlayer,
    setVolumeLevel,
    toggleMute,
  }
}
