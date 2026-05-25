"use client"
import { Trash2, X } from "lucide-react"
import React from "react"

import type { ReactNode } from "react"

import { useState } from "react"
import { createPortal } from "react-dom"

interface RemoveConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  isDarkMode?: boolean
  confirmText?: string
  icon?: ReactNode
  buttonColor?: "orange" | "blue" | "red"
  iconWrapperColor?: "orange" | "blue" | "red"
}

export function RemoveConfirmationModal({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
  isDarkMode = false,
  confirmText = "Xóa",
  icon,
  buttonColor = "orange",
  iconWrapperColor = "orange",
}: RemoveConfirmationModalProps) {
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

  const buttonColorClass = {
    orange: isDarkMode ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600",
    blue: isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
    red: isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600",
  }[buttonColor]

  const iconWrapperClass = {
    orange: isDarkMode ? "logout-icon-wrapper-orange dark-mode" : "logout-icon-wrapper-orange",
    blue: isDarkMode ? "logout-icon-wrapper-blue dark-mode" : "logout-icon-wrapper-blue",
    red: isDarkMode ? "logout-icon-wrapper-red dark-mode" : "logout-icon-wrapper-red",
  }[iconWrapperColor]

  const iconColorLight = {
    orange: "text-orange-500",
    blue: "text-blue-500",
    red: "text-red-500",
  }[iconWrapperColor]

  return createPortal(
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
              <div className={`logout-icon-wrapper ${iconWrapperClass}`}>
                {icon ? (
                  typeof icon === "string" ? (
                    <span className={icon} />
                  ) : (
                    React.cloneElement(icon as React.ReactElement, {
                      className: `logout-icon-inner w-8 sm:w-10 h-8 sm:h-10 ${isDarkMode ? "text-white" : iconColorLight}`,
                    })
                  )
                ) : (
                  <Trash2
                    className={`logout-icon-inner w-8 sm:w-10 h-8 sm:h-10 ${isDarkMode ? "text-white" : iconColorLight}`}
                  />
                )}
              </div>
            </div>

            <h3
              className={`bubble-title text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}
            >
              {title}
            </h3>

            <p
              className={`bubble-message text-sm sm:text-base mb-4 sm:mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              {message}
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
                className={`bubble-button confirm px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 font-medium whitespace-nowrap ${buttonColorClass}`}
              >
                <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
