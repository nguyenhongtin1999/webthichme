"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Star, Share2, Users, ClipboardCheck } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/hooks/use-theme"

interface TasksListProps {
  onPointsEarned: (points: number) => void
}

interface Task {
  name: string
  points: number
  iconType: string
  progress: number
  total: number
}

interface ActivityLog {
  taskName: string
  points: number
  source: string
  timestamp: string
}

export default function TasksList({ onPointsEarned }: TasksListProps) {
  const { currentUser } = useAuth()
  const { isDarkMode } = useTheme()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    { name: "Mua sắm lần đầu", points: 100, iconType: "shopping-cart", progress: 0, total: 1 },
    { name: "Đánh giá sản phẩm", points: 50, iconType: "star", progress: 0, total: 5 },
    { name: "Chia sẻ trên mạng xã hội", points: 30, iconType: "share", progress: 0, total: 3 },
    { name: "Giới thiệu bạn bè", points: 200, iconType: "users", progress: 0, total: 5 },
    { name: "Hoàn thành khảo sát", points: 80, iconType: "clipboard", progress: 0, total: 1 },
  ])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])

  const getIcon = (iconType: string) => {
    const iconProps = "w-8 h-8"
    switch (iconType) {
      case "shopping-cart":
        return <ShoppingCart className={iconProps} />
      case "star":
        return <Star className={iconProps} />
      case "share":
        return <Share2 className={iconProps} />
      case "users":
        return <Users className={iconProps} />
      case "clipboard":
        return <ClipboardCheck className={iconProps} />
      default:
        return null
    }
  }

  useEffect(() => {
    if (currentUser?.id) {
      const userTasksKey = `userTasks_${currentUser.id}`
      const savedTasks = localStorage.getItem(userTasksKey)
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks))
        } catch (e) {
          console.error("[v0] Error loading tasks:", e)
        }
      }
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (currentUser?.id) {
      const userTasksKey = `userTasks_${currentUser.id}`
      try {
        localStorage.setItem(userTasksKey, JSON.stringify(tasks))
      } catch (error) {
        console.error("[v0] Error saving tasks to localStorage:", error)
      }
    }
  }, [tasks, currentUser?.id])

  const handleTaskProgress = (index: number) => {
    if (!currentUser) {
      setShowLoginPrompt(true)
      return
    }

    const newTasks = [...tasks]
    if (newTasks[index].progress < newTasks[index].total) {
      newTasks[index].progress++

      if (newTasks[index].progress === newTasks[index].total) {
        const now = new Date()
        const userActivityKey = `userActivity_${currentUser.id}`

        try {
          const existingActivities = localStorage.getItem(userActivityKey)
          const allActivities = existingActivities ? JSON.parse(existingActivities) : []

          // Add new activity to the beginning
          allActivities.unshift({
            taskName: newTasks[index].name,
            points: newTasks[index].points,
            source: "tasks",
            timestamp: now.toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          })

          console.log("[v0] Saving activity with existing count:", allActivities.length)

          // Save all activities (old + new)
          localStorage.setItem(userActivityKey, JSON.stringify(allActivities))

          // Dispatch event to update profile card
          window.dispatchEvent(new Event("activityUpdated"))
        } catch (error) {
          console.error("[v0] Error logging task activity:", error)
        }

        onPointsEarned(newTasks[index].points)
        showConfetti()
        alert(
          `Chúc mừng! Bạn đã hoàn thành nhiệm vụ "${newTasks[index].name}" và nhận được ${newTasks[index].points} điểm.`,
        )
      }
      setTasks(newTasks)
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

  return (
    <>
      <section
        id="tasks"
        className={`rounded-lg shadow-md p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/20" : "bg-white"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
            Làm nhiệm vụ tích điểm
          </h2>
        </div>

        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`task-item rounded-lg shadow p-4 flex items-center justify-between ${isDarkMode ? "bg-indigo-900 border border-indigo-500/20" : "bg-white"}`}
            >
              <div className="flex items-center flex-1">
                <div
                  className={`mr-4 ${!currentUser ? "text-gray-400" : isDarkMode ? "text-[#8b5cf6]" : "text-orange-500"}`}
                >
                  {getIcon(task.iconType)}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-lg mb-1 ${!currentUser ? "text-gray-500" : isDarkMode ? "text-slate-100" : ""}`}
                  >
                    {task.name}
                  </h3>
                  <div
                    className={`text-sm ${!currentUser ? "text-gray-400" : isDarkMode ? "text-slate-300" : "text-gray-600"}`}
                  >
                    <span className="font-semibold">{task.progress}</span>/{task.total} hoàn thành
                  </div>
                  <div className={`w-full rounded-full h-2 mt-2 ${isDarkMode ? "bg-slate-600" : "bg-gray-200"}`}>
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${!currentUser ? "bg-gray-300" : isDarkMode ? "bg-indigo-500" : "bg-orange-500"}`}
                      style={{ width: `${(task.progress / task.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end ml-4">
                <span
                  className={`font-semibold text-lg mb-2 ${!currentUser ? "text-gray-400" : isDarkMode ? "text-[#8b5cf6]" : "text-orange-500"}`}
                >
                  +{task.points} điểm
                </span>
                <button
                  onClick={() => handleTaskProgress(index)}
                  disabled={!currentUser}
                  className={`px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ${
                    !currentUser
                      ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                      : isDarkMode
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {task.progress < task.total ? "Tiến hành" : "Hoàn thành"}
                </button>
              </div>
            </div>
          ))}
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
              Bạn cần đăng nhập để làm nhiệm vụ tích điểm và nhận thưởng.
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
