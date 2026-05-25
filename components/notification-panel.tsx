"use client"

import type React from "react"
import { useEffect } from "react"

import {
  ScrollText,
  CircleCheck,
  Bell,
  Zap,
  AlertTriangle,
  Gift,
  Megaphone,
  Inbox,
  Settings,
  ShoppingCart,
  BellDot,
  Pin,
} from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { NotificationDetailModal } from "./notification-detail-modal"

interface NotificationPanelProps {
  isDarkMode?: boolean
  onNotificationSelect?: (notification: any) => void
  selectedNotification?: any | null
  onMarkAsRead?: (id: string) => void
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    bell: Bell,
    zap: Zap,
    "alert-triangle": AlertTriangle,
    gift: Gift,
    megaphone: Megaphone,
  }
  return iconMap[iconName] || Bell
}

export function NotificationPanel({
  isDarkMode = false,
  onNotificationSelect,
  selectedNotification,
  onMarkAsRead,
}: NotificationPanelProps) {
  const {
    notifications,
    loading,
    unreadCount,
    hasMore,
    currentUser,
    markAsRead,
    markAllAsRead,
    formatDate,
    togglePinNotification,
  } = useNotifications()

  const [activeCategory, setActiveCategory] = useState<"all" | "activity" | "system" | "transaction">("all")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [showUnpinConfirm, setShowUnpinConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [])

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      })
    }
  }

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const walk = startX - endX

    if (Math.abs(walk) > 20) {
      if (walk > 0) {
        scrollToEnd()
      } else {
        scrollToStart()
      }
    }
  }

  const handleCategoryClick = (category: "all" | "activity" | "system" | "transaction") => {
    setActiveCategory(category)
  }

  const filteredNotifications =
    activeCategory === "all" ? notifications : notifications.filter((n) => n.category === activeCategory)

  const handlePinToggle = (e: React.MouseEvent, notificationId: string, isPinned: boolean) => {
    e.stopPropagation()
    if (isPinned) {
      setShowUnpinConfirm(notificationId)
    } else {
      togglePinNotification(notificationId)
    }
  }

  if (loading) {
    return (
      <div className={`p-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        <div
          className={`animate-spin rounded-full h-6 w-6 ${isDarkMode ? "border-b-2 border-[#8b5cf6]" : "border-b-2 border-orange-500"} mx-auto`}
        ></div>
        <p className="text-sm mt-2">Đang tải thông báo...</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div
        className={`p-8 text-center flex flex-col items-center justify-center h-full ${isDarkMode ? "text-gray-400" : "text-muted-foreground"}`}
      >
        <Bell className={`h-12 w-12 mx-auto mb-3 ${isDarkMode ? "text-gray-600" : "text-muted-foreground/50"}`} />
        <p className="text-sm">Không có thông báo nào</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      {currentUser && (
        <div className={`border-b ${isDarkMode ? "border-gray-600" : "border-gray-100"}`}>
          <div
            ref={scrollContainerRef}
            className={`px-4 py-3 overflow-x-auto notification-scroll-container ${isDarkMode ? "bg-gray-700/50" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex gap-2 min-w-min">
              <button
                onClick={() => handleCategoryClick("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === "all"
                    ? "bg-orange-500 text-white"
                    : isDarkMode
                      ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <Inbox className="w-4 h-4" />
                Tất cả
              </button>

              <button
                onClick={() => handleCategoryClick("activity")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === "activity"
                    ? isDarkMode
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "bg-red-500 text-white"
                    : isDarkMode
                      ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                      : "bg-red-100/60 text-red-500/60 hover:bg-red-200"
                }`}
              >
                <Zap className="w-4 h-4" />
                Hoạt Động
              </button>

              <button
                onClick={() => handleCategoryClick("system")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === "system"
                    ? isDarkMode
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                      : "bg-blue-100/60 text-blue-500/60 hover:bg-blue-200"
                }`}
              >
                <Settings className="w-4 h-4" />
                Hệ Thống
              </button>

              <button
                onClick={() => handleCategoryClick("transaction")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === "transaction"
                    ? isDarkMode
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                      : "bg-green-500 text-white"
                    : isDarkMode
                      ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                      : "bg-green-100/70 text-green-600/60 hover:bg-green-200"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Giao Dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {currentUser && unreadCount > 0 && activeCategory === "all" && (
        <div
          className={`px-4 py-3 ${isDarkMode ? "bg-gradient-to-r from-indigo-900/40 to-indigo-900/30 border-indigo-800" : "bg-gradient-to-r from-orange-50 to-orange-50 border-orange-100"} border-b flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <BellDot className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-orange-500"}`} />
            <span className={`text-sm ${isDarkMode ? "text-gray-200" : "text-black"}`}>
              Bạn có{" "}
              <span className={`font-semibold ${isDarkMode ? "text-blue-300" : "text-orange-600"}`}>{unreadCount}</span>{" "}
              thông báo chưa đọc
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className={`text-xs font-semibold px-4 py-1.5 h-auto rounded-lg transition-all shadow-sm hover:shadow-md border ${
              isDarkMode
                ? "bg-blue-900 border-blue-500 text-white hover:bg-blue-900/20 hover:border-blue-700"
                : "bg-orange-500 border-gray-200 text-white hover:bg-orange-600 hover:border-orange-700"
            }`}
          >
            Đánh dấu đã đọc
          </Button>
        </div>
      )}

      {/* Notifications list */}
      <div className="flex-grow max-h-[19rem] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div
            className={`p-8 text-center flex flex-col items-center justify-center h-full ${isDarkMode ? "text-gray-400" : "text-muted-foreground"}`}
          >
            <Bell className={`h-12 w-12 mx-auto mb-3 ${isDarkMode ? "text-gray-600" : "text-muted-foreground/50"}`} />
            <p className="text-sm">Không có thông báo nào trong danh mục này</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = getIconComponent(notification.icon)

            return (
              <div
                key={notification.id}
                className={`notification-item p-4 border-b cursor-pointer transition-colors ${
                  notification.isPinned
                    ? isDarkMode
                      ? "border-yellow-600/30 bg-yellow-900/15 hover:bg-yellow-900/25"
                      : "border-yellow-200 bg-yellow-50/80 hover:bg-yellow-100/80"
                    : isDarkMode
                      ? "border-gray-600 hover:bg-gray-600/50"
                      : "border-gray-100 hover:bg-gray-50"
                } ${notification.read && !notification.isPinned ? "opacity-70" : ""}`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                  onNotificationSelect?.(notification)
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: notification.primaryColor || "#f97316" }}
                    >
                      <IconComponent className="w-5 h-5" style={{ color: notification.secondaryColor || "#ffffff" }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <p className={`text-sm font-medium line-clamp-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {notification.title}
                    </p>
                    <p className={`text-xs line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {notification.content}
                    </p>
                    {notification.showDateTime && notification.startDate && (
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {formatDate(notification.startDate)}
                      </p>
                    )}
                  </div>

                  {/* Pin Icon */}
                  {currentUser && (
                    <div className="flex items-center gap-2 ml-2">
                      {notification.isPinned && (
                        <button
                          onClick={(e) => handlePinToggle(e, notification.id, notification.isPinned)}
                          className={`p-1.5 rounded-md transition-colors ${
                            isDarkMode
                              ? "bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40"
                              : "bg-yellow-200/70 text-yellow-700 hover:bg-yellow-200"
                          }`}
                          title="Bỏ ghim"
                        >
                          <Pin className="w-4 h-4" fill="currentColor" />
                        </button>
                      )}

                      {!notification.isPinned && (
                        <>
                          {notification.read ? (
                            <div className="notification-read-status">
                              <CircleCheck className="w-4 h-4 text-green-500" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                                onNotificationSelect?.(notification)
                              }}
                              className={`notification-view-btn text-xs px-2 py-1 h-auto ${
                                isDarkMode
                                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                                  : "bg-orange-500 hover:bg-orange-600 text-white"
                              }`}
                            >
                              <ScrollText className="w-3 h-3 mr-1" />
                              Đọc
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Unpin confirmation dialog */}
      {showUnpinConfirm && (
        <div
          className={`fixed inset-0 z-[9998] flex items-center justify-center p-4 backdrop-blur-sm ${
            isDarkMode ? "bg-black/50" : "bg-black/30"
          }`}
        >
          <div
            className={`rounded-lg shadow-xl p-6 max-w-sm w-full ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"
            }`}
          >
            <p className={`text-sm font-medium mb-6 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
              Bạn có muốn bỏ ghim thông báo này không?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUnpinConfirm(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  togglePinNotification(showUnpinConfirm)
                  setShowUnpinConfirm(null)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Bỏ ghim
              </button>
            </div>
          </div>
        </div>
      )}

      {currentUser && notifications.length > 0 && (
        <div className={`border-t ${isDarkMode ? "border-gray-600 bg-gray-700/30" : "border-gray-200 bg-background"}`}>
          <button
            onClick={() => (window.location.href = "notifications.php")}
            className={`w-full p-4 text-center text-base font-semibold transition-colors hover:bg-accent ${
              isDarkMode ? "text-purple-300 hover:text-purple-200" : "text-orange-500 hover:text-orange-600"
            }`}
          >
            Xem tất cả
          </button>
        </div>
      )}

      {/* Footer for non-logged users */}
      {!currentUser && (
        <div
          className={`p-4 text-center border-t ${isDarkMode ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-500"}`}
        >
          <p className="text-sm">Đăng nhập để xem thêm thông báo</p>
        </div>
      )}
    </div>
  )
}

export { NotificationDetailModal }
