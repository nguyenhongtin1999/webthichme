"use client"

import { useState, useEffect } from "react"
import PointsInputSection from "@/components/rewards/points-input-section"
import CheckinSection from "@/components/rewards/checkin-section"
import UserProfileCard from "@/components/rewards/user-profile-card"
import GiftGrid from "@/components/rewards/gift-grid"
import TasksList from "@/components/rewards/tasks-list"
import { useAuth } from "@/hooks/use-auth"

export default function DoiThuongPage() {
  const { currentUser } = useAuth()
  const [currentPoints, setCurrentPoints] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentCheckinDay, setCurrentCheckinDay] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const calculateLevel = (points: number) => {
    let level = 1
    let totalPointsNeeded = 0

    while (level < 50) {
      const pointsForNextLevel = level <= 5 ? level * 50 : level <= 15 ? level * 100 : level * 200
      if (totalPointsNeeded + pointsForNextLevel > points) {
        break
      }
      totalPointsNeeded += pointsForNextLevel
      level++
    }
    return level
  }

  useEffect(() => {
    if (currentUser?.id) {
      const userPointsKey = `userPoints_${currentUser.id}`
      const userTotalPointsKey = `userTotalPoints_${currentUser.id}`

      const savedCurrentPoints = localStorage.getItem(userPointsKey)
      const savedTotalPoints = localStorage.getItem(userTotalPointsKey)

      if (savedCurrentPoints !== null && savedTotalPoints !== null) {
        const current = Number.parseInt(savedCurrentPoints, 10)
        const total = Number.parseInt(savedTotalPoints, 10)
        setCurrentPoints(current)
        setTotalPoints(total)
        setCurrentLevel(calculateLevel(total))
      } else if (currentUser?.points) {
        // If no saved data, use currentUser.points as initial value
        setCurrentPoints(currentUser.points)
        setTotalPoints(currentUser.points)
        setCurrentLevel(calculateLevel(currentUser.points))
      }
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (currentUser?.id) {
      const userPointsKey = `userPoints_${currentUser.id}`
      const userTotalPointsKey = `userTotalPoints_${currentUser.id}`

      localStorage.setItem(userPointsKey, currentPoints.toString())
      localStorage.setItem(userTotalPointsKey, totalPoints.toString())
    }
  }, [currentPoints, totalPoints, currentUser?.id])

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"))
    }

    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  const updatePointsReceived = (pointsReceived: number) => {
    setCurrentPoints((prev) => prev + pointsReceived)
    setTotalPoints((prev) => {
      const newTotal = prev + pointsReceived
      const newLevel = calculateLevel(newTotal)
      setCurrentLevel(newLevel)
      return newTotal
    })
  }

  const updatePointsSpent = (pointsSpent: number) => {
    setCurrentPoints((prev) => Math.max(0, prev + pointsSpent))
  }

  return (
    <div
      className={
        isDarkMode
          ? "fixed inset-0 overflow-y-auto pt-20 pb-20 md:pb-8"
          : "fixed inset-0 bg-gray-100 overflow-y-auto pt-20 pb-20 md:pb-8"
      }
      style={isDarkMode ? { background: "linear-gradient(135deg, #1e1b4b 0%, #1f2937 100%)" } : undefined}
    >
      <main className={`container mx-auto px-4 pb-8 ${isDarkMode ? "bg-transparent" : ""}`}>
        <h1 className={`text-4xl font-bold text-center py-6 ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}>
          Đổi Thưởng
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <PointsInputSection onPointsAdded={updatePointsReceived} />
            <CheckinSection
              onPointsAdded={updatePointsReceived}
              currentCheckinDay={currentCheckinDay}
              setCurrentCheckinDay={setCurrentCheckinDay}
            />
          </div>

          {/* Right Column */}
          <UserProfileCard currentPoints={currentPoints} totalPoints={totalPoints} currentLevel={currentLevel} />
        </div>

        {/* Gift Redemption Section - Full Width */}
        <section className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Đổi Thưởng</h2>
          <GiftGrid currentPoints={currentPoints} onPointsSpent={updatePointsSpent} />
        </section>

        {/* Tasks Section - Full Width */}
        <TasksList onPointsEarned={updatePointsReceived} />
      </main>

      {/* Confetti Container */}
      <div id="confettiContainer" className="fixed inset-0 pointer-events-none z-50"></div>
    </div>
  )
}
