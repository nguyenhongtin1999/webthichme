"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Gift } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/hooks/use-theme"

interface CheckinSectionProps {
  onPointsAdded: (points: number) => void
  currentCheckinDay: number
  setCurrentCheckinDay: (day: number) => void
}

const dayLabels = ["Bắt đầu", "T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const checkinColors = ["#f97316", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"]
const dayRewards = [0, 20, 30, 40, 50, 60, 30, 70]
const dayRewardImages = [
  null,
  null,
  null,
  "https://picsum.photos/seed/gift4/300/200",
  null,
  "https://picsum.photos/seed/gift6/300/200",
  null,
  "https://picsum.photos/seed/gift7/300/200",
]

export default function CheckinSection({
  onPointsAdded,
  currentCheckinDay,
  setCurrentCheckinDay,
}: CheckinSectionProps) {
  const { currentUser, updatePoints } = useAuth()
  const { isDarkMode } = useTheme()
  const [activeRewardBubble, setActiveRewardBubble] = useState<number | null>(null)
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(null)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)

  useEffect(() => {
    if (!currentUser?.id) {
      setCurrentCheckinDay(0)
      setLastCheckinDate(null)
      setHasCheckedInToday(false)
      return
    }

    const userCheckinKey = `checkin_${currentUser.id}`
    const userLastCheckinKey = `lastCheckinDate_${currentUser.id}`

    const savedLastCheckinDate = localStorage.getItem(userLastCheckinKey)
    const savedCurrentDay = localStorage.getItem(userCheckinKey)

    const today = new Date().toISOString().split("T")[0]
    const todayDayOfWeek = getTodayDayOfWeek()

    if (savedLastCheckinDate) {
      setLastCheckinDate(savedLastCheckinDate)
      setHasCheckedInToday(savedLastCheckinDate === today)

      const lastCheckinDate = new Date(savedLastCheckinDate)
      const todayDate = new Date(today)
      const daysDifference = Math.floor((todayDate.getTime() - lastCheckinDate.getTime()) / (1000 * 60 * 60 * 24))

      const lastCheckinDayOfWeek = lastCheckinDate.getDay()
      const lastCheckinDayOfWeekAdjusted = lastCheckinDayOfWeek === 0 ? 7 : lastCheckinDayOfWeek

      // Reset if: (1) it's Monday, (2) last check-in was last week, (3) at least 1 day has passed
      if (todayDayOfWeek === 1 && lastCheckinDayOfWeekAdjusted !== 1 && daysDifference >= 1) {
        setCurrentCheckinDay(0)
        localStorage.removeItem(userCheckinKey)
      } else if (savedCurrentDay) {
        // Only set from localStorage if we didn't reset
        setCurrentCheckinDay(Number.parseInt(savedCurrentDay, 10))
      }
    } else if (savedCurrentDay) {
      setCurrentCheckinDay(Number.parseInt(savedCurrentDay, 10))
    }
  }, [currentUser?.id, setCurrentCheckinDay])

  const getTodayDayOfWeek = (): number => {
    const today = new Date()
    const day = today.getDay()
    return day === 0 ? 7 : day
  }

  const handleCheckin = () => {
    if (!currentUser?.id) {
      alert("Vui lòng đăng nhập để điểm danh nhận thưởng.")
      return
    }

    const userCheckinKey = `checkin_${currentUser.id}`
    const userLastCheckinKey = `lastCheckinDate_${currentUser.id}`
    const userActivityKey = `userActivity_${currentUser.id}`

    const todayDayOfWeek = getTodayDayOfWeek()
    const today = new Date().toISOString().split("T")[0]

    if (lastCheckinDate) {
      const today = new Date().toISOString().split("T")[0]
      if (lastCheckinDate === today) {
        alert("Bạn đã điểm danh hôm nay rồi. Hãy quay lại vào ngày mai!")
        return
      }
    }

    // Only prevent checking in if user hasn't started the week yet or already completed it
    const canCheckin =
      currentCheckinDay === 0 || // Start of week or first check-in
      (todayDayOfWeek > currentCheckinDay && todayDayOfWeek <= 7 && lastCheckinDate !== today) // Any day after the last checked day

    if (canCheckin && todayDayOfWeek <= 7) {
      const newDay = todayDayOfWeek
      setCurrentCheckinDay(newDay)
      setLastCheckinDate(today)
      setHasCheckedInToday(true)

      localStorage.setItem(userLastCheckinKey, today)
      localStorage.setItem(userCheckinKey, newDay.toString())

      const pointsEarned = dayRewards[newDay]

      try {
        const existingActivities = localStorage.getItem(userActivityKey)
        const allActivities = existingActivities ? JSON.parse(existingActivities) : []

        allActivities.unshift({
          taskName: "Điểm danh hàng ngày",
          points: pointsEarned,
          source: "checkin",
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
        console.error("[v0] Error logging checkin activity:", error)
      }

      onPointsAdded(pointsEarned)
      updatePoints(pointsEarned)
      showConfetti()

      if (newDay === 7) {
        alert(
          `Chúc mừng! Bạn đã hoàn thành chuỗi điểm danh 7 ngày và nhận được ${pointsEarned} điểm cùng một phần quà ngẫu nhiên!`,
        )
      } else {
        alert(`Điểm danh thành công! Bạn đã nhận được ${pointsEarned} điểm.`)
      }
    } else if (currentCheckinDay === 7) {
      alert("Bạn đã hoàn thành chuỗi điểm danh 7 ngày. Hãy quay lại vào tuần sau!")
    } else {
      alert(`Bạn không thể điểm danh hôm nay. Hãy quay lại vào ngày mai để tiếp tục chuỗi!`)
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

  const handleMilestoneClick = (index: number) => {
    setActiveRewardBubble(activeRewardBubble === index ? null : index)
    setTimeout(() => {
      setActiveRewardBubble(null)
    }, 3000)
  }

  return (
    <section
      className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20" : "bg-white"}`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
        Điểm danh nhận thưởng
      </h2>
      <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-4 shadow-lg">
        <img
          src="/images/design-mode/CU%CC%9B%CC%89A%20HA%CC%80NG%20vo%CC%82%20Tri.png"
          alt="Giveaway Banner"
          className="w-full h-auto rounded-lg mb-1"
        />

        <div className="checkin-container relative h-10 mb-11">
          <div className="checkin-path w-full absolute top-1/2 transform -translate-y-1/2">
            <div
              className="checkin-progress"
              style={{
                width: `${(currentCheckinDay / 7) * 100}%`,
                background: `linear-gradient(to right, ${checkinColors.slice(0, currentCheckinDay + 1).join(", ")})`,
              }}
            ></div>
          </div>

          {dayLabels.map((label, index) => (
            <div
              key={index}
              className="checkin-milestone"
              style={{
                left: `${(index / 7) * 100}%`,
                color: checkinColors[index],
              }}
              onClick={() => handleMilestoneClick(index)}
            >
              <div className="checkin-label">{label}</div>
              <div
                className={`reward-bubble ${activeRewardBubble === index ? "active" : ""}`}
                style={{ backgroundColor: checkinColors[index], color: "white" }}
              >
                <span>+{dayRewards[index]} điểm</span>
                {dayRewardImages[index] && <img src={dayRewardImages[index] || "/placeholder.svg"} alt="Gift" />}
              </div>
            </div>
          ))}

          <div
            className="checkin-icon"
            id="checkinIcon"
            style={{
              backgroundColor: checkinColors[currentCheckinDay],
              left: `${(currentCheckinDay / 7) * 100}%`,
            }}
          >
            <Gift className="w-4 h-4" />
          </div>
        </div>

        <button
          onClick={handleCheckin}
          disabled={!currentUser || hasCheckedInToday}
          className={`w-full px-6 py-3 rounded-full text-white flex items-center justify-center gap-2 transition-all transform focus:outline-none ${
            !currentUser
              ? "bg-gray-400 cursor-not-allowed opacity-60"
              : hasCheckedInToday
                ? "bg-gradient-to-r from-orange-200 to-pink-200 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:scale-105 shadow-md animate-gradient"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {!currentUser ? "Đăng nhập để điểm danh" : hasCheckedInToday ? "Đã điểm danh hôm nay" : "Điểm danh"}
        </button>
      </div>
    </section>
  )
}
