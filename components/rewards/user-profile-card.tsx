"use client"

import { Award, RefreshCw, PlusCircle, ChevronDown, CircleDollarSign, Star, History } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"

interface UserProfileCardProps {
  currentPoints: number
  totalPoints: number
  currentLevel: number
}

interface ActivityRecord {
  taskName: string
  points: number
  timestamp: string
  source?: string
  type?: string
}

export default function UserProfileCard({ currentPoints, totalPoints, currentLevel }: UserProfileCardProps) {
  const { currentUser, isLoading } = useAuth()
  const { isDarkMode } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activities, setActivities] = useState<ActivityRecord[]>([])
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && currentUser?.id) {
      const activityKey = `userActivity_${currentUser.id}`
      const savedActivities = localStorage.getItem(activityKey)
      if (savedActivities) {
        try {
          setActivities(JSON.parse(savedActivities))
        } catch (e) {
          console.log("[v0] Failed to load activities:", e)
        }
      }

      const handleStorageChange = () => {
        const updatedActivities = localStorage.getItem(activityKey)
        if (updatedActivities) {
          try {
            const parsed = JSON.parse(updatedActivities)
            setActivities(parsed)
          } catch (e) {
            console.log("[v0] Failed to parse updated activities:", e)
          }
        }
      }

      window.addEventListener("activityUpdated", handleStorageChange)
      window.addEventListener("storage", handleStorageChange)

      return () => {
        window.removeEventListener("activityUpdated", handleStorageChange)
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [mounted, currentUser?.id])

  const getPointsRequiredForLevel = (level: number) => {
    if (level <= 5) return level * 50
    if (level <= 15) return level * 100
    return level * 200
  }

  const getTotalPointsForLevel = (level: number) => {
    let total = 0
    for (let i = 1; i < level; i++) {
      total += getPointsRequiredForLevel(i)
    }
    return total
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // This allows components to sync points without full page reload
    try {
      if (currentUser?.id) {
        const userPointsKey = `userPoints_${currentUser.id}`
        const userTotalPointsKey = `userTotalPoints_${currentUser.id}`

        // Trigger storage change event to refresh component
        const event = new StorageEvent("storage", {
          key: userPointsKey,
          newValue: currentPoints.toString(),
        })
        window.dispatchEvent(event)

        // Also dispatch custom event for other components
        window.dispatchEvent(
          new CustomEvent("pointsRefreshed", {
            detail: { currentPoints, totalPoints },
          }),
        )
      }
    } catch (e) {
      console.log("[v0] Refresh error:", e)
    }
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const pointsNeededForCurrentLevel = getPointsRequiredForLevel(currentLevel)
  const pointsAlreadyEarned = getTotalPointsForLevel(currentLevel)
  const pointsInCurrentLevel = totalPoints - pointsAlreadyEarned
  const progress = Math.min((pointsInCurrentLevel / pointsNeededForCurrentLevel) * 100, 100)

  const formatTime = (timestamp: string) => {
    try {
      return timestamp
    } catch {
      return timestamp
    }
  }

  if (!mounted || isLoading) {
    return (
      <section
        className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20" : "bg-white"}`}
      >
        <div className="text-center py-8">
          <p className={isDarkMode ? "text-slate-300" : "text-gray-600"}>Đang tải...</p>
        </div>
      </section>
    )
  }

  if (!currentUser) {
    return (
      <section
        className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20" : "bg-white"}`}
      >
        <div className="text-center py-8">
          <p className={`mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            Vui lòng đăng nhập để xem thông tin thưởng của bạn
          </p>
          <a
            href="/login"
            className={`inline-block text-white px-6 py-2 rounded-lg transition-all ${isDarkMode ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"}`}
          >
            Đăng nhập
          </a>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20" : "bg-white"}`}
    >
      <div className="flex items-center mb-4">
        <img
          src={currentUser.avatar || "https://picsum.photos/seed/user/100"}
          alt={currentUser.name}
          className="w-16 h-16 rounded-full mr-4 object-cover"
        />
        <div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
            {currentUser.name}
          </h2>
          <div className="flex items-center mt-1">
            <Award className={`w-5 h-5 mr-1 ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`} />
            <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              Thành viên hạng:{" "}
              <span className={`font-semibold ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}>Bạc</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className={`level-card relative rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-br from-orange-500 to-pink-500"
              : "bg-gradient-to-br from-orange-400 to-pink-500"
          }`}
        >
          <div className="absolute inset-0 bg-white opacity-20 transform skew-y-6"></div>
          <div className="relative z-10 text-center">
            <p className="text-sm text-white font-semibold mb-1">Bạn đang ở cấp độ</p>
            <p className="text-3xl font-bold text-white">{currentLevel}</p>
          </div>
          <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div
          className={`points-card relative rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-500 to-indigo-500"
              : "bg-gradient-to-br from-blue-400 to-indigo-500"
          }`}
        >
          <div className="absolute inset-0 bg-white opacity-20 transform -skew-y-6"></div>
          <div className="relative z-10 text-center">
            <p className="text-sm text-white font-semibold mb-1">Tổng điểm của bạn</p>
            <p className="text-3xl font-bold text-white">{totalPoints}</p>
          </div>
          <div className="absolute bottom-0 right-0 transform translate-y-1/4 translate-x-1/4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className={`text-sm mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>Số điểm hiện tại</p>
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-4xl font-bold ${isDarkMode ? "text-indigo-400" : "text-orange-500"} ${
                isRefreshing ? "animate-pulse" : ""
              }`}
            >
              {currentPoints}
            </span>
            <span className={`ml-2 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>điểm</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`transition-all ${isRefreshing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-orange-500 hover:text-orange-600"}`}
          >
            <RefreshCw className={`w-6 h-6 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>
            Tiến trình vượt cấp !
          </span>
          <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            {pointsInCurrentLevel} / {pointsNeededForCurrentLevel}
          </span>
        </div>
        <div
          className={`w-full h-4 rounded-full overflow-hidden shadow-md ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}
        >
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isDarkMode
                ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                : "bg-gradient-to-r from-orange-400 to-pink-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={`text-sm mt-2 text-center ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          Còn <span className="font-semibold">{Math.max(0, pointsNeededForCurrentLevel - pointsInCurrentLevel)}</span>{" "}
          điểm để đạt cấp độ tiếp theo
        </p>
      </div>

      <div className="mb-6 border-t pt-6" style={{ borderColor: isDarkMode ? "#818cf8" : "#fed7aa" }}>
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className={`w-full flex items-center justify-between px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            isDarkMode
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
              : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 hover:from-amber-200 hover:to-orange-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <span>Lịch sử điểm thưởng</span>
            {activities.length > 0 && (
              <span
                className={`text-sm px-2.5 py-1 rounded-full font-bold ${isDarkMode ? "bg-white/20 text-white" : "bg-white/60 text-amber-900"}`}
              >
                {activities.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${isHistoryExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {isHistoryExpanded && (
          <div
            className={`mt-4 rounded-lg overflow-hidden border-2 ${
              isDarkMode
                ? "bg-slate-800/50 border-indigo-500/30"
                : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
            }`}
          >
            {activities.length === 0 ? (
              <div className={`p-6 text-center ${isDarkMode ? "text-slate-400" : "text-amber-700"}`}>
                <CircleDollarSign className={`w-8 h-8 mx-auto mb-2 opacity-50`} />
                <p className="font-medium">Chưa có hoạt động nào</p>
                <p className="text-sm">Hoàn thành các nhiệm vụ để bắt đầu kiếm điểm</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {activities.slice(0, 20).map((activity, idx) => (
                  <div
                    key={idx}
                    className={`p-4 flex items-start gap-4 border-b transition-all hover:scale-102 ${
                      isDarkMode ? "border-indigo-500/20 hover:bg-slate-700/30" : "border-amber-200 hover:bg-white/60"
                    }`}
                  >
                    <div className="relative flex flex-col items-center pt-1.5">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                        style={{
                          background:
                            activity.type === "spent"
                              ? isDarkMode
                                ? "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, transparent 100%)"
                                : "linear-gradient(180deg, #ff6b6b 0%, #ff4444 50%, transparent 100%)"
                              : isDarkMode
                                ? "linear-gradient(180deg, #818cf8 0%, #6366f1 50%, transparent 100%)"
                                : "linear-gradient(180deg, #fb923c 0%, #f97316 50%, transparent 100%)",
                        }}
                      />
                      <Star
                        className={`w-5 h-5 relative z-10 ml-2 ${
                          activity.type === "spent"
                            ? isDarkMode
                              ? "text-red-400"
                              : "text-red-500"
                            : isDarkMode
                              ? "text-indigo-400"
                              : "text-orange-500"
                        }`}
                        fill={
                          activity.type === "spent"
                            ? isDarkMode
                              ? "#f87171"
                              : "#ef4444"
                            : isDarkMode
                              ? "#818cf8"
                              : "#f97316"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm truncate ${isDarkMode ? "text-slate-100" : "text-amber-900"}`}
                      >
                        {activity.taskName}
                      </h4>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-amber-700"}`}>
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm whitespace-nowrap ${
                        activity.type === "spent"
                          ? isDarkMode
                            ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                            : "bg-red-200/80 text-red-900 ring-1 ring-red-300/50"
                          : isDarkMode
                            ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30"
                            : "bg-orange-200/80 text-orange-900 ring-1 ring-orange-300/50"
                      }`}
                    >
                      <CircleDollarSign className="w-4 h-4" />
                      {activity.points < 0 ? `-${Math.abs(activity.points)}` : `+${activity.points}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <a
        href="#tasks"
        className={`block w-full text-white text-center py-3 rounded-lg transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 animate-gradient ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        }`}
      >
        <PlusCircle className="w-5 h-5" />
        Thêm các nhiệm vụ tích điểm
      </a>
    </section>
  )
}
