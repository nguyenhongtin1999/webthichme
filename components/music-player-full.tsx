"use client"

import { useState, useEffect } from "react"
import { useMusicPlayer } from "../hooks/useMusicPlayer"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
  Volume2,
  VolumeX,
  Volume1,
  List,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Slider } from "./ui/slider"

interface MusicPlayerFullProps {
  className?: string
}

export default function MusicPlayerFull({ className = "" }: MusicPlayerFullProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    repeatShuffleState,
    volume,
    togglePlayPause,
    prevSong,
    nextSong,
    toggleRepeatMode,
    handleProgressClick,
    toggleFavorite,
    currentSongIndex,
    isSongInFavorites,
    setVolumeLevel,
    toggleMute,
    isActivePlayer,
    setShowSongList,
    showSongList,
    audioPlayerRef,
  } = useMusicPlayer()

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const audioElement = document.getElementById("music-page-audio") as HTMLAudioElement
    if (audioElement && audioPlayerRef) {
      audioPlayerRef.current = audioElement
    }
  }, [audioPlayerRef])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    console.log("[v0] Music page play/pause clicked")
    togglePlayPause("music-page")
  }

  const handlePrevSong = () => {
    prevSong()
  }

  const handleNextSong = () => {
    nextSong()
  }

  const handleProgressChange = (value: number[]) => {
    if (duration > 0) {
      const newTime = (value[0] / 100) * duration
      const audio = audioPlayerRef.current
      if (audio) {
        audio.currentTime = newTime
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolumeLevel(value[0] / 100)
  }

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX
    if (volume < 0.5) return Volume1
    return Volume2
  }

  const VolumeIcon = getVolumeIcon()

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (currentSong.title === "Chọn bài hát") {
    return null
  }

  return (
    <>
      {currentSong.url && (
        <audio id="music-page-audio" preload="metadata" style={{ display: "none" }} src={currentSong.url} />
      )}

      <Card
        className={`fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-primary/95 to-secondary/95 backdrop-blur-md border-primary/20 shadow-2xl ${className}`}
      >
        <CardContent className="p-0">
          {/* Compact Player */}
          <div className="flex items-center gap-3 p-4">
            {/* Song Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentSong.image || "/placeholder.svg?height=56&width=56"}
                alt={currentSong.title}
                className="w-14 h-14 rounded-lg object-cover shadow-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate mb-1">{currentSong.title}</h3>
                <p className="text-white/70 text-xs truncate">{currentSong.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handlePrevSong}
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={handlePlayPause}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white h-10 w-10 p-0 rounded-full"
              >
                {isPlaying && isActivePlayer("music-page") ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                onClick={handleNextSong}
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-xs min-w-[35px]">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span className="text-white/70 text-xs min-w-[35px]">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Expanded Controls */}
          {isExpanded && (
            <div className="border-t border-white/20 p-4 pt-3">
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleFavorite(currentSongIndex)}
                    size="sm"
                    variant="ghost"
                    className={`h-8 w-8 p-0 ${
                      isSongInFavorites(currentSong.id)
                        ? "text-red-400 hover:text-red-300"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSongInFavorites(currentSong.id) ? "fill-current" : ""}`} />
                  </Button>

                  <Button
                    onClick={() => setShowSongList(!showSongList)}
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Center Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={toggleRepeatMode}
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white h-8 w-8 p-0"
                  >
                    {repeatShuffleState === "repeat-one" ? (
                      <Repeat1 className="h-4 w-4" />
                    ) : repeatShuffleState === "shuffle" ? (
                      <Shuffle className="h-4 w-4" />
                    ) : (
                      <Repeat className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Right Controls - Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white h-8 w-8 p-0"
                  >
                    <VolumeIcon className="h-4 w-4" />
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
