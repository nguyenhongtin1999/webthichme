"use client"

import { useState, useEffect } from "react"
import { useMusicPagePlayer } from "../../hooks/useMusicPagePlayer"
import { useAuth } from "../../hooks/use-auth"
import {
  Play,
  Heart,
  Plus,
  Search,
  Music,
  Headphones,
  Mic2,
  Pause,
  List,
  Trash2,
  UserX,
  Check,
  ChevronDown,
  ChevronUp,
  Edit2,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { useToast } from "../../hooks/use-toast"

export default function MusicPage() {
  const {
    songLibrary,
    getAllSongs,
    currentSong,
    isPlaying,
    currentSongIndex,
    togglePlayPause,
    playSongByIndex,
    toggleFavorite,
    isSongInFavorites,
    showCategory,
    currentPlaylistCategory,
    userFavoritesPlaylist,
    loadUserFavorites,
    isLoggedIn,
    currentUser: musicPlayerCurrentUser,
    syncAuthState,
    searchQuery: globalSearchQuery,
    setSearchQuery: setGlobalSearchQuery,
    searchSongs,
    audioPlayerRef,
    prevSong,
    nextSong,
    toggleRepeatMode,
    handleProgressClick,
    repeatShuffleState,
    currentTime,
    duration,
    volume,
    setVolumeLevel,
    toggleMute,
  } = useMusicPagePlayer()

  const { currentUser, isAuthenticated, redirectToLogin } = useAuth()
  const { toast } = useToast()
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("most-played")
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [userPlaylists, setUserPlaylists] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false)
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null)
  const [expandedPlaylists, setExpandedPlaylists] = useState({})
  const [editingPlaylistId, setEditingPlaylistId] = useState(null) // Added state for tracking which playlist is being renamed
  const [editingPlaylistName, setEditingPlaylistName] = useState("") // Added state for the new playlist name during editing

  const categories = [
    { id: "most-played", label: "Nghe nhiều nhất", icon: Music },
    { id: "favorites", label: "Yêu thích", icon: Heart },
    { id: "podcast", label: "Podcast", icon: Mic2 },
    { id: "instrumental", label: "Nhạc không lời", icon: Headphones },
  ]

  useEffect(() => {
    console.log("[v0] Music page mounted, syncing auth state")
    syncAuthState()
    loadUserFavorites()
  }, [])

  useEffect(() => {
    console.log("[v0] Auth state changed - isLoggedIn:", isLoggedIn, "currentUser:", !!currentUser)
    if (isLoggedIn && currentUser) {
      // Load playlists directly from currentUser instead of calling loadUserPlaylists
      if (currentUser.playlists) {
        setUserPlaylists(currentUser.playlists)
      } else {
        setUserPlaylists([])
      }
      loadUserFavorites()
    } else {
      setUserPlaylists([])
    }
  }, [currentUser, isLoggedIn])

  useEffect(() => {
    if (localSearchQuery !== globalSearchQuery) {
      setGlobalSearchQuery(localSearchQuery)
    }
  }, [localSearchQuery])

  useEffect(() => {
    filterSongs()
  }, [localSearchQuery, selectedCategory, userFavoritesPlaylist, currentPlaylistCategory])

  const handleCategoryChange = (categoryId) => {
    console.log("[v0] Music page category change:", categoryId)
    setSelectedCategory(categoryId)

    // Map category IDs to the format expected by showCategory
    const categoryMapping = {
      "most-played": "music",
      favorites: "sound",
      podcast: "audiobook",
      instrumental: "instrumental",
    }

    showCategory(categoryMapping[categoryId] || "music")
  }

  const handleSearchChange = (query) => {
    console.log("[v0] Music page search:", query)
    setLocalSearchQuery(query)

    // If search is cleared, ensure we return to current category
    if (!query.trim()) {
      handleCategoryChange(selectedCategory)
    }
  }

  const filterSongs = () => {
    const allSongs = getAllSongs()
    let songs = []

    switch (selectedCategory) {
      case "favorites":
        songs = allSongs.filter((song) => userFavoritesPlaylist.includes(song.id))
        break
      case "podcast":
        songs = [] // Empty as per original hook
        break
      case "instrumental":
        songs = allSongs.filter((song) => [5, 10].includes(song.id))
        break
      default:
        songs = allSongs
    }

    if (localSearchQuery.trim()) {
      songs = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(localSearchQuery.toLowerCase()),
      )
    }

    setFilteredSongs(songs)
  }

  const handlePlaySong = (song) => {
    const allSongs = getAllSongs()
    const songIndex = allSongs.findIndex((s) => s.id === song.id)
    if (songIndex !== -1) {
      playSongByIndex(songIndex)
    }
  }

  const handleToggleFavorite = (song) => {
    if (!isLoggedIn) {
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để thêm bài hát vào yêu thích",
        variant: "destructive",
      })
      return
    }

    const allSongs = getAllSongs()
    const songIndex = allSongs.findIndex((s) => s.id === song.id)
    if (songIndex !== -1) {
      toggleFavorite(songIndex)
      toast({
        title: isSongInFavorites(song.id) ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
        description: `"${song.title}" ${isSongInFavorites(song.id) ? "đã được xóa khỏi" : "đã được thêm vào"} danh sách yêu thích`,
      })
    }
  }

  const handleCreatePlaylist = () => {
    console.log("[v0] Starting playlist creation process")
    console.log("[v0] isLoggedIn:", isLoggedIn, "currentUser:", !!currentUser)
    console.log("[v0] newPlaylistName:", newPlaylistName)

    if (!isLoggedIn) {
      console.log("[v0] User not logged in, showing toast and redirecting")
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để tạo playlist",
        variant: "destructive",
      })
      redirectToLogin()
      return
    }

    if (!currentUser) {
      console.log("[v0] No current user found despite isLoggedIn being true")
      toast({
        title: "Lỗi xác thực",
        description: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        variant: "destructive",
      })
      return
    }

    if (!newPlaylistName.trim()) {
      console.log("[v0] Empty playlist name")
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên playlist",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Checking for duplicate playlist name:", newPlaylistName.trim())
    // Check if playlist name already exists
    if (userPlaylists.some((p) => p.name.toLowerCase() === newPlaylistName.trim().toLowerCase())) {
      console.log("[v0] Duplicate playlist name found")
      toast({
        title: "Lỗi",
        description: "Tên playlist đã tồn tại",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("[v0] Attempting to create playlist")
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      console.log("[v0] Found users in localStorage:", users.length)

      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      console.log("[v0] User index:", userIndex, "Current user ID:", currentUser.id)

      if (userIndex === -1) {
        console.log("[v0] User not found in localStorage")
        toast({
          title: "Lỗi",
          description: "Không tìm thấy thông tin người dùng trong hệ thống",
          variant: "destructive",
        })
        return
      }

      if (!users[userIndex].playlists) {
        console.log("[v0] Initializing playlists array for user")
        users[userIndex].playlists = []
      }

      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName.trim(),
        songs: [],
        createdAt: new Date().toISOString(),
      }

      console.log("[v0] Creating new playlist:", newPlaylist)
      users[userIndex].playlists.push(newPlaylist)

      console.log("[v0] Saving to localStorage")
      localStorage.setItem("users", JSON.stringify(users))

      console.log("[v0] Updating sessionStorage")
      sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))

      console.log("[v0] Updating local state")
      setUserPlaylists([...users[userIndex].playlists])
      setNewPlaylistName("")
      setIsCreatePlaylistOpen(false)

      console.log("[v0] Dispatching playlist update event")
      window.dispatchEvent(new CustomEvent("playlistUpdate"))

      console.log("[v0] Playlist created successfully")
      toast({
        title: "Thành công",
        description: `Đã tạo playlist "${newPlaylist.name}"`,
      })
    } catch (error) {
      console.error("[v0] Error creating playlist:", error)
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi tạo playlist: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleDeletePlaylist = (playlistId) => {
    if (!isLoggedIn) {
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để xóa playlist",
        variant: "destructive",
      })
      return
    }

    const playlistToDelete = userPlaylists.find((p) => p.id === playlistId)
    if (!playlistToDelete) return

    if (!confirm(`Bạn có chắc chắn muốn xóa playlist "${playlistToDelete.name}"?`)) {
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u) => u.id === currentUser.id)

    if (userIndex !== -1 && users[userIndex].playlists) {
      users[userIndex].playlists = users[userIndex].playlists.filter((p) => p.id !== playlistId)
      localStorage.setItem("users", JSON.stringify(users))
      sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
      setUserPlaylists([...users[userIndex].playlists])

      window.dispatchEvent(new CustomEvent("playlistUpdate"))

      toast({
        title: "Đã xóa",
        description: `Playlist "${playlistToDelete.name}" đã được xóa`,
      })
    }
  }

  const handleAddToPlaylist = (song) => {
    if (!isLoggedIn) {
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để thêm bài hát vào playlist",
        variant: "destructive",
      })
      return
    }

    if (userPlaylists.length === 0) {
      toast({
        title: "Chưa có playlist",
        description: "Hãy tạo playlist trước khi thêm bài hát",
        variant: "destructive",
      })
      return
    }

    setSelectedSongForPlaylist(song)
    setIsAddToPlaylistOpen(true)
  }

  const addSongToPlaylist = (playlistId) => {
    if (!selectedSongForPlaylist || !isLoggedIn) return

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u) => u.id === currentUser.id)

    if (userIndex !== -1 && users[userIndex].playlists) {
      const playlistIndex = users[userIndex].playlists.findIndex((p) => p.id === playlistId)

      if (playlistIndex !== -1) {
        const playlist = users[userIndex].playlists[playlistIndex]

        // Check if song already exists in playlist
        if (playlist.songs.some((s) => s.id === selectedSongForPlaylist.id)) {
          toast({
            title: "Bài hát đã tồn tại",
            description: `"${selectedSongForPlaylist.title}" đã có trong playlist "${playlist.name}"`,
            variant: "destructive",
          })
          return
        }

        // Add song to playlist
        users[userIndex].playlists[playlistIndex].songs.push(selectedSongForPlaylist)
        localStorage.setItem("users", JSON.stringify(users))
        sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
        setUserPlaylists([...users[userIndex].playlists])

        window.dispatchEvent(new CustomEvent("playlistUpdate"))

        toast({
          title: "Đã thêm vào playlist",
          description: `"${selectedSongForPlaylist.title}" đã được thêm vào "${playlist.name}"`,
        })

        setIsAddToPlaylistOpen(false)
        setSelectedSongForPlaylist(null)
      }
    }
  }

  const handleRemoveSongFromPlaylist = (playlistId, songId, songTitle) => {
    if (!isLoggedIn) {
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để xóa bài hát khỏi playlist",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa "${songTitle}" khỏi playlist?`)) {
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u) => u.id === currentUser.id)

    if (userIndex !== -1 && users[userIndex].playlists) {
      const playlistIndex = users[userIndex].playlists.findIndex((p) => p.id === playlistId)

      if (playlistIndex !== -1) {
        const playlist = users[userIndex].playlists[playlistIndex]

        // Remove song from playlist
        users[userIndex].playlists[playlistIndex].songs = playlist.songs.filter((s) => s.id !== songId)
        localStorage.setItem("users", JSON.stringify(users))
        sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
        setUserPlaylists([...users[userIndex].playlists])

        window.dispatchEvent(new CustomEvent("playlistUpdate"))

        toast({
          title: "Đã xóa khỏi playlist",
          description: `"${songTitle}" đã được xóa khỏi "${playlist.name}"`,
        })
      }
    }
  }

  const togglePlaylistExpansion = (playlistId) => {
    setExpandedPlaylists((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }))
  }

  const handlePlaySongFromPlaylist = (song) => {
    const allSongs = getAllSongs()
    const songIndex = allSongs.findIndex((s) => s.id === song.id)
    if (songIndex !== -1) {
      playSongByIndex(songIndex)
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleRenamePlaylist = (playlistId, currentName) => {
    setEditingPlaylistId(playlistId)
    setEditingPlaylistName(currentName)
  }

  const savePlaylistRename = (playlistId) => {
    if (!isLoggedIn) {
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để đổi tên playlist",
        variant: "destructive",
      })
      return
    }

    if (!editingPlaylistName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên playlist",
        variant: "destructive",
      })
      return
    }

    // Check if playlist name already exists (excluding current playlist)
    if (
      userPlaylists.some(
        (p) => p.id !== playlistId && p.name.toLowerCase() === editingPlaylistName.trim().toLowerCase(),
      )
    ) {
      toast({
        title: "Lỗi",
        description: "Tên playlist đã tồn tại",
        variant: "destructive",
      })
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u) => u.id === currentUser.id)

    if (userIndex !== -1 && users[userIndex].playlists) {
      const playlistIndex = users[userIndex].playlists.findIndex((p) => p.id === playlistId)

      if (playlistIndex !== -1) {
        const oldName = users[userIndex].playlists[playlistIndex].name
        users[userIndex].playlists[playlistIndex].name = editingPlaylistName.trim()
        localStorage.setItem("users", JSON.stringify(users))
        sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
        setUserPlaylists([...users[userIndex].playlists])

        window.dispatchEvent(new CustomEvent("playlistUpdate"))

        toast({
          title: "Đã đổi tên",
          description: `Playlist "${oldName}" đã được đổi tên thành "${editingPlaylistName.trim()}"`,
        })

        setEditingPlaylistId(null)
        setEditingPlaylistName("")
      }
    }
  }

  const cancelPlaylistRename = () => {
    setEditingPlaylistId(null)
    setEditingPlaylistName("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header is now in root layout, so this section is removed */}

      <main className="pt-20 pb-32">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          {!isLoggedIn && (
            <Card className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <UserX className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-800 font-medium text-sm">Chưa đăng nhập</p>
                    <p className="text-amber-700 text-xs">Đăng nhập để sử dụng đầy đủ tính năng</p>
                  </div>
                  <Button
                    onClick={redirectToLogin}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1"
                  >
                    Đăng nhập
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-input border-border h-10"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <IconComponent className="h-3 w-3" />
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>

          {currentSong && currentSong.title !== "Chọn bài hát" && (
            <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentSong.image || "/placeholder.svg?height=48&width=48"}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">{currentSong.title}</h3>
                    <p className="text-muted-foreground text-xs truncate">{currentSong.artist}</p>
                    <div className="mt-2">
                      <div className="h-1 bg-muted rounded-full cursor-pointer" onClick={handleProgressClick}>
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-100"
                          style={{
                            width: `${duration > 0 && currentTime >= 0 ? Math.min((currentTime / duration) * 100, 100) : 0}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={prevSong} size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                      </svg>
                    </Button>
                    <Button onClick={togglePlayPause} size="sm" className="bg-primary hover:bg-primary/90 h-8 w-8 p-0">
                      {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button onClick={nextSong} size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoggedIn && userPlaylists.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Playlist của bạn</h2>
              <div className="space-y-3">
                {userPlaylists.map((playlist) => (
                  <Card key={playlist.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <button
                          onClick={() => togglePlaylistExpansion(playlist.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <List className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingPlaylistId === playlist.id ? (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <Input
                                  value={editingPlaylistName}
                                  onChange={(e) => setEditingPlaylistName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      savePlaylistRename(playlist.id)
                                    } else if (e.key === "Escape") {
                                      cancelPlaylistRename()
                                    }
                                  }}
                                  className="h-6 text-sm"
                                  autoFocus
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => savePlaylistRename(playlist.id)}
                                    className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={cancelPlaylistRename}
                                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
                                <p className="text-xs text-muted-foreground">{playlist.songs?.length || 0} bài hát</p>
                              </>
                            )}
                          </div>
                          {editingPlaylistId !== playlist.id && (
                            <>
                              {expandedPlaylists[playlist.id] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </>
                          )}
                        </button>
                        <div className="flex items-center gap-1 ml-2">
                          {editingPlaylistId !== playlist.id && (
                            <button
                              onClick={() => handleRenamePlaylist(playlist.id, playlist.name)}
                              className="p-1 text-muted-foreground hover:text-primary transition-colors"
                              title="Đổi tên playlist"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="Xóa playlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {expandedPlaylists[playlist.id] && (
                        <div className="p-3 pt-0">
                          {playlist.songs?.length > 0 ? (
                            <div className="space-y-2">
                              {playlist.songs.map((song, index) => (
                                <div
                                  key={`${playlist.id}-${song.id}-${index}`}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <img
                                    src={song.image || "/placeholder.svg?height=32&width=32"}
                                    alt={song.title}
                                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs truncate mb-1">{song.title}</p>
                                    <p className="text-xs text-muted-foreground truncate mb-2">{song.artist}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handlePlaySongFromPlaylist(song)}
                                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <Play className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveSongFromPlaylist(playlist.id, song.id, song.title)}
                                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                      title="Xóa khỏi playlist"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Music className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground text-sm">Playlist trống</p>
                              <p className="text-muted-foreground text-sm">Thêm bài hát để bắt đầu</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {categories.find((c) => c.id === selectedCategory)?.label || "Tất cả bài hát"}
              </h2>
              <span className="text-muted-foreground text-xs">{filteredSongs.length} bài</span>
            </div>

            {filteredSongs.length === 0 ? (
              <div className="text-center py-12">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">
                  {selectedCategory === "favorites" ? "Chưa có bài hát yêu thích" : "Không tìm thấy bài hát"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredSongs.map((song) => (
                  <Card key={song.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <img
                          src={song.image || "/placeholder.svg?height=150&width=150"}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handlePlaySong(song)}
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        >
                          <Play className="h-6 w-6 text-white" />
                        </button>
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold text-xs truncate mb-1">{song.title}</h3>
                        <p className="text-xs text-muted-foreground truncate mb-2">{song.artist}</p>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleToggleFavorite(song)}
                            className={`p-1 rounded-full transition-colors ${
                              isSongInFavorites(song.id)
                                ? "text-red-500 hover:text-red-600"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            disabled={!isLoggedIn}
                          >
                            <Heart className={`h-3 w-3 ${isSongInFavorites(song.id) ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={() => handleAddToPlaylist(song)}
                            className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                            disabled={!isLoggedIn}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {isLoggedIn && (
        <Dialog open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen}>
          <DialogTrigger asChild>
            <button className="fixed bottom-20 right-4 w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-40">
              <Plus className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Tạo playlist mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  console.log("[v0] Form submitted via onSubmit")
                  handleCreatePlaylist()
                }}
              >
                <Input
                  placeholder="Tên playlist..."
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      console.log("[v0] Enter key pressed in input")
                      handleCreatePlaylist()
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("[v0] Create button clicked")
                      handleCreatePlaylist()
                    }}
                  >
                    Tạo playlist
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      console.log("[v0] Cancel button clicked")
                      setIsCreatePlaylistOpen(false)
                      setNewPlaylistName("")
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isAddToPlaylistOpen} onOpenChange={setIsAddToPlaylistOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Thêm vào playlist</DialogTitle>
          </DialogHeader>
          {selectedSongForPlaylist && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <img
                  src={selectedSongForPlaylist.image || "/placeholder.svg?height=40&width=40"}
                  alt={selectedSongForPlaylist.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{selectedSongForPlaylist.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedSongForPlaylist.artist}</p>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {userPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => addSongToPlaylist(playlist.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <List className="h-4 w-4" />
                      <div className="text-left">
                        <p className="font-medium text-sm">{playlist.name}</p>
                        <p className="text-xs text-muted-foreground">{playlist.songs?.length || 0} bài hát</p>
                      </div>
                    </div>
                    {playlist.songs?.some((s) => s.id === selectedSongForPlaylist.id) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setIsAddToPlaylistOpen(false)
                  setSelectedSongForPlaylist(null)
                }}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <audio ref={audioPlayerRef} id="music-page-audio" preload="metadata" src={currentSong.url} />
    </div>
  )
}
