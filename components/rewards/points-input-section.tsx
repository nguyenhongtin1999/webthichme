"use client"

import { useState } from "react"
import { Gift } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/hooks/use-theme"

interface PointsInputSectionProps {
  onPointsAdded: (points: number) => void
}

export default function PointsInputSection({ onPointsAdded }: PointsInputSectionProps) {
  const { currentUser, updatePoints } = useAuth()
  const { isDarkMode } = useTheme()
  const [code, setCode] = useState("")
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const handleInputClick = () => {
    if (!currentUser) {
      setShowLoginPrompt(true)
    }
  }

  const showConfetti = () => {
    const confettiContainer = document.getElementById("confettiContainer")
    if (!confettiContainer) return

    confettiContainer.innerHTML = ""
    const colors = ["#f97316", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"]
    const confettiCount = 50
    let delay = 0

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.className = "confetti"
        confetti.style.left = `${Math.random() * 100}%`
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`
        confettiContainer.appendChild(confetti)

        setTimeout(() => {
          confetti.remove()
        }, 4000)
      }, delay)

      delay += Math.random() * 100
    }
  }

  const handleSubmitCode = () => {
    if (!currentUser) {
      setShowLoginPrompt(true)
      return
    }

    if (code) {
      const pointsEarned = Math.floor(Math.random() * 100) + 50
      const userActivityKey = `userActivity_${currentUser.id}`

      try {
        const existingActivities = localStorage.getItem(userActivityKey)
        const allActivities = existingActivities ? JSON.parse(existingActivities) : []

        allActivities.unshift({
          taskName: "Nhập mã tích điểm",
          points: pointsEarned,
          source: "points-input",
          timestamp: new Date().toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
        localStorage.setItem(userActivityKey, JSON.stringify(allActivities))
        window.dispatchEvent(new Event("activityUpdated"))
      } catch (error) {
        console.error("[v0] Error logging points-input activity:", error)
      }

      onPointsAdded(pointsEarned)
      updatePoints(pointsEarned)
      showConfetti()
      alert(`Mã hợp lệ! Bạn đã nhận được ${pointsEarned} điểm.`)
      setCode("")
    } else {
      alert("Vui lòng nhập mã tích điểm.")
    }
  }

  return (
    <>
      <section
        className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20" : "bg-white"}`}
      >
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
            Nhập mã tích điểm
          </h2>
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute inset-0 bg-white opacity-60"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onFocus={handleInputClick}
                    placeholder={currentUser ? "Nhập mã tích điểm" : "Đăng nhập để nhập mã"}
                    disabled={!currentUser}
                    className={`points-input w-full border-2 rounded-full px-4 py-2 text-sm transition-all duration-300 focus:outline-none ${
                      !currentUser
                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "border-orange-300 bg-white focus:border-orange-500"
                    }`}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitCode()}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Gift className={`w-5 h-5 ${!currentUser ? "text-gray-300" : "text-orange-400"}`} />
                  </div>
                </div>
                <button
                  onClick={handleSubmitCode}
                  disabled={!currentUser}
                  className={`px-4 py-2 rounded-full text-sm transition-all transform focus:outline-none whitespace-nowrap ${
                    !currentUser
                      ? "bg-gray-400 text-gray-300 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 hover:scale-105 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 animate-gradient"
                  }`}
                >
                  Xác nhận
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </section>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg shadow-lg p-6 max-w-sm mx-4 ${isDarkMode ? "bg-indigo-950 border border-indigo-500/30" : "bg-white"}`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
              Đăng nhập để tiếp tục
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              Bạn cần đăng nhập để nhập mã tích điểm và nhận thưởng.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all ${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                Hủy
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-all ${isDarkMode ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"}`}
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
