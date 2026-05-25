"use client"

import { Gift } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { useTheme } from "@/hooks/use-theme"

interface GiftGridProps {
  currentPoints: number
  onPointsSpent: (points: number) => void
}

const gifts = [
  { name: "Bộ Lego Minecraft", points: 500, image: "https://picsum.photos/seed/gift1/300/200" },
  { name: "Rubik 3x3", points: 300, image: "https://picsum.photos/seed/gift2/300/200" },
  { name: "Bộ Thí Nghiệm Mini", points: 800, image: "https://picsum.photos/seed/gift3/300/200" },
  { name: "Sách STEM", points: 400, image: "https://picsum.photos/seed/gift4/300/200" },
  { name: "Robot Lập Trình", points: 1000, image: "https://picsum.photos/seed/gift5/300/200" },
  { name: "Kính Thiên Văn", points: 1200, image: "https://picsum.photos/seed/gift6/300/200" },
  { name: "Bộ Vẽ Chuyên Nghiệp", points: 600, image: "https://picsum.photos/seed/gift7/300/200" },
  { name: "Máy Tính Casio", points: 350, image: "https://picsum.photos/seed/gift8/300/200" },
  { name: "Bộ Cờ Vua", points: 250, image: "https://picsum.photos/seed/gift9/300/200" },
  { name: "Đàn Ukulele", points: 700, image: "https://picsum.photos/seed/gift10/300/200" },
]

export default function GiftGrid({ currentPoints, onPointsSpent }: GiftGridProps) {
  const { currentUser } = useAuth()
  const { isDarkMode } = useTheme()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      // Assuming setIsDarkMode is declared in a utils file
      // const setIsDarkMode = (isDark: boolean) => {
      //   document.body.classList.toggle("dark-mode", isDark)
      // }
      // setIsDarkMode(document.body.classList.contains("dark-mode"))
    }

    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  const handleRedeem = (giftPoints: number) => {
    if (!currentUser) {
      setShowLoginPrompt(true)
      return
    }

    if (currentPoints >= giftPoints) {
      onPointsSpent(-giftPoints)

      const activityKey = `userActivity_${currentUser.id}`
      const exchangeHistoryKey = `userExchangeHistory_${currentUser.id}`

      const existingActivities = localStorage.getItem(activityKey)
      const activities = existingActivities ? JSON.parse(existingActivities) : []

      const now = new Date()
      const timestamp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      // Find the gift name
      const gift = gifts.find((g) => g.points === giftPoints)
      const giftName = gift?.name || "Phần thưởng"

      // Add to activities (earned points history)
      activities.unshift({
        taskName: `Đổi thưởng: ${giftName}`,
        points: -giftPoints,
        timestamp: timestamp,
        source: "exchange",
        type: "spent",
      })

      localStorage.setItem(activityKey, JSON.stringify(activities))

      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent("activityUpdated"))

      showConfetti()
      alert("Đổi thưởng thành công!")
    } else {
      alert("Bạn không đủ điểm để đổi phần thưởng này.")
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gifts.map((gift, index) => (
          <div
            key={index}
            className={`gift-item rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
              isDarkMode ? "bg-indigo-900 border border-indigo-500/30" : "bg-white"
            } ${!currentUser ? "opacity-60" : "hover:shadow-lg hover:-translate-y-1"}`}
          >
            <img src={gift.image || "/placeholder.svg"} alt={gift.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3
                className={`font-semibold text-sm mb-2 ${
                  !currentUser
                    ? isDarkMode
                      ? "text-slate-400"
                      : "text-gray-500"
                    : isDarkMode
                      ? "text-slate-100"
                      : "text-gray-800"
                }`}
              >
                {gift.name}
              </h3>
              <div className="flex flex-col items-center">
                <span
                  className={`font-bold text-lg mb-2 ${
                    !currentUser
                      ? isDarkMode
                        ? "text-slate-500"
                        : "text-gray-400"
                      : isDarkMode
                        ? "text-indigo-400"
                        : "text-orange-500"
                  }`}
                >
                  {gift.points} điểm
                </span>
                <button
                  onClick={() => handleRedeem(gift.points)}
                  disabled={!currentUser}
                  className={`redeem-button text-white px-6 py-2 rounded-full text-sm transition-all duration-300 transform focus:outline-none flex items-center justify-center w-full gap-1 whitespace-nowrap ${
                    !currentUser
                      ? isDarkMode
                        ? "bg-slate-600 cursor-not-allowed opacity-60"
                        : "bg-gray-400 cursor-not-allowed opacity-60"
                      : isDarkMode
                        ? "bg-[#8b5cf6] hover:bg-[#7c3aed] hover:scale-105 focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50"
                        : "bg-orange-500 hover:bg-orange-600 hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  Đổi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg shadow-lg p-6 max-w-sm mx-4 ${
              isDarkMode ? "bg-indigo-950 border border-indigo-500/30" : "bg-white"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
              Đăng nhập để tiếp tục
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              Bạn cần đăng nhập để đổi thưởng và sử dụng điểm của mình.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all ${
                  isDarkMode
                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Hủy
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-all ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                }`}
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
