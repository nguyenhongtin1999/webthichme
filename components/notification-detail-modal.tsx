"use client"
import { X, Clock, Pin, Trash2 } from "lucide-react"
import type { Notification } from "@/hooks/use-notifications"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface NotificationDetailModalProps {
  notification: Notification | null
  onClose: () => void
  onMarkAsRead?: (id: string) => void
  formatDate: (date: string) => string
  isDarkMode?: boolean
  onDelete?: (id: string) => void
  onPin?: (id: string) => void
}

export function NotificationDetailModal({
  notification,
  onClose,
  onMarkAsRead,
  formatDate,
  isDarkMode = false,
  onDelete,
  onPin,
}: NotificationDetailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (notification && !notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
  }, [notification, onMarkAsRead]) // Updated to use the entire notification object

  if (!notification || !mounted) return null

  const getCategoryLabel = (category?: string) => {
    const categoryMap: Record<string, string> = {
      activity: "Hoạt Động",
      system: "Hệ Thống",
      transaction: "Giao Dịch",
    }
    return categoryMap[category || ""] || "Thông báo"
  }

  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      activity: isDarkMode
        ? "bg-orange-900/40 text-orange-200 border border-orange-700/30"
        : "bg-orange-50 text-orange-700 border border-orange-200",
      system: isDarkMode
        ? "bg-blue-900/40 text-blue-200 border border-blue-700/30"
        : "bg-blue-50 text-blue-700 border border-blue-200",
      transaction: isDarkMode
        ? "bg-emerald-900/40 text-emerald-200 border border-emerald-700/30"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200",
    }
    return (
      colorMap[category || ""] ||
      (isDarkMode
        ? "bg-slate-700/40 text-slate-200 border border-slate-600/30"
        : "bg-slate-100 text-slate-700 border border-slate-200")
    )
  }

  const formatDetailedTime = (dateString?: string) => {
    if (!dateString) return "thời gian không xác định"
    try {
      const date = new Date(dateString)
      const time = date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      const dateFormatted = date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      return `${time} ${dateFormatted}`
    } catch {
      return "thời gian không xác định"
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id)
      onClose()
    }
  }

  const handlePin = () => {
    if (onPin) {
      onPin(notification.id)
    }
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm ${
        isDarkMode ? "bg-black/50" : "bg-black/30"
      }`}
    >
      <div
        className={`rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto ${
          isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-100"
        }`}
      >
        {/* Header - Compact */}
        <div
          className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between ${
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
          }`}
        >
          <h2 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            Chi tiết thông báo
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode
                ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Optimized for compact display */}
        <div className="px-6 py-5 space-y-4">
          {/* Icon and Title Section */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: notification.primaryColor || "#f97316" }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center text-2xl"
                style={{ color: notification.secondaryColor || "#ffffff" }}
              >
                {notification.icon === "gift" && "🎁"}
                {notification.icon === "zap" && "⚡"}
                {notification.icon === "megaphone" && "📢"}
                {notification.icon === "alert-triangle" && "⚠️"}
                {notification.icon === "bell" && "🔔"}
              </div>
            </div>
            <div className="flex-grow">
              <h1
                className={`text-xl font-bold mb-2 leading-tight line-clamp-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
              >
                {notification.title}
              </h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}
              >
                {getCategoryLabel(notification.category)}
              </span>
            </div>
          </div>

          {/* Content Section - Compact */}
          {notification.content && (
            <div
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-slate-700/30 border-slate-600/40 text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <p className="text-sm leading-relaxed line-clamp-5 whitespace-pre-wrap break-words">
                {notification.content}
              </p>
            </div>
          )}

          {/* End Date - Compact Alert */}
          {notification.endDate && (
            <div
              className={`p-3 rounded-lg border flex items-start gap-3 ${
                isDarkMode ? "bg-orange-950/30 border-orange-700/40" : "bg-orange-50 border-orange-200"
              }`}
            >
              <Clock className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDarkMode ? "text-orange-300" : "text-orange-600"}`} />
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isDarkMode ? "text-orange-300" : "text-orange-900"
                  }`}
                >
                  Hạn cuối
                </p>
                <p className={`text-sm font-semibold ${isDarkMode ? "text-orange-200" : "text-orange-900"}`}>
                  {formatDate(notification.endDate)}
                </p>
              </div>
            </div>
          )}

          <div className={`pt-3 border-t text-sm text-center ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
            <p className={`${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Thông báo gửi vào lúc{" "}
              <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                {formatDetailedTime(notification.createdAt || notification.startDate)}
              </span>
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handlePin}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                notification.isPinned
                  ? isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  : isDarkMode
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Pin className="w-4 h-4" />
              {notification.isPinned ? "Đã ghim" : "Ghim"}
            </button>
            <button
              onClick={handleDelete}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? "bg-red-900/40 text-red-200 hover:bg-red-800/50 border border-red-700/30"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
