"use client"

import { useEffect, useState } from "react"
import { Bell, Users, TrendingUp, Activity } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotifications: 0,
    activeNotifications: 0,
    automatedRules: 0,
  })

  useEffect(() => {
    // Load statistics
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const automatedRules = JSON.parse(localStorage.getItem("automated_rules") || "[]")

    const now = new Date()
    const activeNotifications = notifications.filter((n: any) => {
      const startDate = new Date(n.startDate)
      const endDate = n.endDate ? new Date(n.endDate) : null
      return startDate <= now && (!endDate || endDate >= now)
    })

    setStats({
      totalUsers: users.length,
      totalNotifications: notifications.length,
      activeNotifications: activeNotifications.length,
      automatedRules: automatedRules.length,
    })
  }, [])

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Tổng thông báo",
      value: stats.totalNotifications,
      icon: Bell,
      color: "bg-orange-500",
    },
    {
      title: "Thông báo đang hoạt động",
      value: stats.activeNotifications,
      icon: Activity,
      color: "bg-green-500",
    },
    {
      title: "Quy tắc tự động",
      value: stats.automatedRules,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-2">Chào mừng đến với trang quản trị</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bắt đầu nhanh</h2>
        <div className="space-y-3">
          <a
            href="/admin/notifications"
            className="block p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Quản lý thông báo</h3>
            <p className="text-sm text-gray-600 mt-1">Tạo, chỉnh sửa và quản lý thông báo cho người dùng</p>
          </a>
        </div>
      </div>
    </div>
  )
}
