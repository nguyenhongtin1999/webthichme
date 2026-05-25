"use client"
import { LogOut, X } from "lucide-react"
import { useState } from "react"

interface LogoutConfirmationModalProps {
  isOpen: boolean
  userName: string
  onConfirm: () => void
  onCancel: () => void
  isDarkMode?: boolean
}

export function LogoutConfirmationModal({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isDarkMode = false,
}: LogoutConfirmationModalProps) {
  const [closing, setClosing] = useState<"confirm" | "cancel" | null>(null)

  if (!isOpen) return null

  const handleConfirm = () => {
    setClosing("confirm")
    setTimeout(() => {
      onConfirm()
      setClosing(null)
    }, 300)
  }

  const handleCancel = () => {
    setClosing("cancel")
    setTimeout(() => {
      onCancel()
      setClosing(null)
    }, 300)
  }

  const modalAnimationClass = closing
    ? closing === "confirm"
      ? "logout-modal-close-confirm"
      : "logout-modal-close-cancel"
    : "logout-modal-appear"

  return (
    <>
      <div
        className={`fixed inset-0 z-[1000] bubble-overlay show ${isDarkMode ? "bg-black/60" : "bg-black/50"}`}
        onClick={handleCancel}
      />
      <div className={`fixed inset-0 flex items-center justify-center z-[1001] p-4 ${modalAnimationClass}`}>
        <div
          className={`${isDarkMode ? "border border-gray-700" : "bg-white"} rounded-2xl w-full max-w-sm mx-auto bubble-modal show`}
          style={isDarkMode ? { background: "linear-gradient(135deg, #1B1234 0%, #08002E 100%)" } : {}}
        >
          <div className="bubble-content p-4 sm:p-6 text-center">
            <div className="logout-icon-container">
              <div className={`logout-icon-wrapper logout-icon-wrapper-logout ${isDarkMode ? "dark-mode" : ""}`}>
                <LogOut
                  className={`logout-icon-inner w-10 sm:w-12 h-10 sm:h-12 ${isDarkMode ? "text-white" : "text-indigo-500"}`}
                />
              </div>
            </div>

            <h3
              className={`bubble-title text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}
            >
              Tạm biệt! 👋
            </h3>

            <p
              className={`bubble-message text-sm sm:text-base mb-4 sm:mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </p>

            <div className="bubble-buttons flex gap-2 sm:gap-3 justify-between">
              <button
                onClick={handleCancel}
                className={`bubble-button cancel px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 font-medium whitespace-nowrap ${
                  isDarkMode
                    ? "border border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                }`}
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden xs:inline">Hủy bỏ</span>
                <span className="inline xs:hidden">Hủy</span>
              </button>

              <button
                onClick={handleConfirm}
                className={`bubble-button confirm logout px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 font-medium whitespace-nowrap ${
                  isDarkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
