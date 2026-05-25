"use client"

import type React from "react"
import { useState, forwardRef, useImperativeHandle } from "react"
import {
  Home,
  ShoppingBag,
  Flame,
  MonitorPlay,
  User,
  Menu,
  GripVertical,
  Heart,
  Download,
  Share2,
  Settings,
  Bell,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
} from "lucide-react"

interface NavbarButton {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  visible: boolean
  color: string
  isDefault?: boolean
}

// Default navbar buttons (Home and Menu) - always shown, not customizable
const DEFAULT_NAVBAR_BUTTONS: NavbarButton[] = [
  {
    id: "home",
    icon: Home,
    label: "Home",
    visible: true,
    color: "text-orange-500",
    isDefault: true,
  },
  {
    id: "menu",
    icon: Menu,
    label: "Menu",
    visible: true,
    color: "text-gray-500",
    isDefault: true,
  },
]

// Customizable navbar buttons (4 available to choose from + 5 others)
const CUSTOMIZABLE_NAVBAR_BUTTONS: NavbarButton[] = [
  {
    id: "shop",
    icon: ShoppingBag,
    label: "Shop",
    visible: true,
    color: "text-blue-500",
  },
  {
    id: "fire",
    icon: Flame,
    label: "Fire",
    visible: true,
    color: "text-red-500",
  },
  {
    id: "tv",
    icon: MonitorPlay,
    label: "TV",
    visible: true,
    color: "text-purple-500",
  },
  {
    id: "user",
    icon: User,
    label: "User",
    visible: true,
    color: "text-green-500",
  },
  {
    id: "heart",
    icon: Heart,
    label: "Favorites",
    visible: true,
    color: "text-pink-500",
  },
  {
    id: "download",
    icon: Download,
    label: "Download",
    visible: true,
    color: "text-cyan-500",
  },
  {
    id: "share",
    icon: Share2,
    label: "Share",
    visible: true,
    color: "text-teal-500",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    visible: true,
    color: "text-slate-600",
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    visible: true,
    color: "text-yellow-500",
  },
]

const DEFAULT_SELECTED_NAVBAR_IDS = ["shop", "fire", "tv", "user"]

interface NavbarCustomizeSectionProps {
  onNavbarChange?: (navbarConfig: NavbarButton[]) => void
  onValidationChange?: (isValid: boolean) => void // thêm callback để báo trạng thái validation cho component cha
  onContentChange?: () => void // thêm callback để báo khi nội dung thay đổi (chưa lưu)
  showHeader?: boolean
}

export const NavbarCustomizeSection = forwardRef<{ handleSaveChanges: () => void }, NavbarCustomizeSectionProps>(
  ({ onNavbarChange, onValidationChange, onContentChange, showHeader = false }, ref) => {
    const [tempSelectedNavbarIds, setTempSelectedNavbarIds] = useState<(string | null)[]>(() => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("selectedNavbarIds") : null
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            return [...parsed, ...Array(Math.max(0, 4 - parsed.length)).fill(null)].slice(0, 4)
          }
          return DEFAULT_SELECTED_NAVBAR_IDS
        } catch {
          return DEFAULT_SELECTED_NAVBAR_IDS
        }
      }
      return DEFAULT_SELECTED_NAVBAR_IDS
    })

    const [savedNavbarIds, setSavedNavbarIds] = useState<(string | null)[]>(tempSelectedNavbarIds)
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

    useImperativeHandle(ref, () => ({
      handleSaveChanges,
      setDraggedId,
    }))

    const currentNavbar = [
      DEFAULT_NAVBAR_BUTTONS.find((b) => b.id === "home")!,
      ...tempSelectedNavbarIds.map((id) => {
        if (!id) return null
        return CUSTOMIZABLE_NAVBAR_BUTTONS.find((btn) => btn.id === id) || null
      }),
      DEFAULT_NAVBAR_BUTTONS.find((b) => b.id === "menu")!,
    ]

    const availableNavbarButtons = CUSTOMIZABLE_NAVBAR_BUTTONS.filter((btn) => !tempSelectedNavbarIds.includes(btn.id))

    const handleAddNavbarButton = (id: string) => {
      const emptyIndex = tempSelectedNavbarIds.indexOf(null)
      if (emptyIndex !== -1) {
        const updated = [...tempSelectedNavbarIds]
        updated[emptyIndex] = id
        setTempSelectedNavbarIds(updated)
        setHasChanges(true)
        onContentChange?.()
        const isComplete = updated.every((id) => id !== null)
        onValidationChange?.(isComplete)
      }
    }

    const handleMoveNavbar = (index: number, direction: "up" | "down") => {
      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= tempSelectedNavbarIds.length) return

      const updated = [...tempSelectedNavbarIds]
      const temp = updated[newIndex]
      updated[newIndex] = updated[index]
      updated[index] = temp
      setTempSelectedNavbarIds(updated)
      setHasChanges(true)
      onContentChange?.()
      onValidationChange?.(updated.every((id) => id !== null))
    }

    const handleRemoveNavbarAt = (index: number) => {
      const updated = [...tempSelectedNavbarIds]
      updated[index] = null
      setTempSelectedNavbarIds(updated)
      setHasChanges(true)
      onContentChange?.()
      onValidationChange?.(false)
    }

    const handleResetNavbar = () => {
      setTempSelectedNavbarIds(DEFAULT_SELECTED_NAVBAR_IDS)
      setSavedNavbarIds(DEFAULT_SELECTED_NAVBAR_IDS)
      setHasChanges(false)

      if (typeof window !== "undefined") {
        localStorage.setItem("selectedNavbarIds", JSON.stringify(DEFAULT_SELECTED_NAVBAR_IDS))
      }

      const fullConfig = [
        DEFAULT_NAVBAR_BUTTONS[0], // Home
        ...DEFAULT_SELECTED_NAVBAR_IDS.map((id) => CUSTOMIZABLE_NAVBAR_BUTTONS.find((b) => b.id === id)).filter(
          (b): b is NavbarButton => !!b,
        ),
        DEFAULT_NAVBAR_BUTTONS[1], // Menu
      ]
      onNavbarChange?.(fullConfig)
      onValidationChange?.(true)

      console.log("[v0] Đã khôi phục Navbar về mặc định")
    }

    const handleSaveChanges = () => {
      const isComplete = tempSelectedNavbarIds.every((id) => id !== null)
      if (!isComplete) {
        console.warn("[v0] Không thể lưu vì Navbar chưa đủ 4 nút tuỳ chỉnh")
        return
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedNavbarIds", JSON.stringify(tempSelectedNavbarIds))
      }
      setSavedNavbarIds(tempSelectedNavbarIds)
      setHasChanges(false)

      const fullConfig = [
        DEFAULT_NAVBAR_BUTTONS[0], // Home
        ...tempSelectedNavbarIds
          .map((id) => CUSTOMIZABLE_NAVBAR_BUTTONS.find((b) => b.id === id))
          .filter((b): b is NavbarButton => !!b),
        DEFAULT_NAVBAR_BUTTONS[1], // Menu
      ]

      onNavbarChange?.(fullConfig)

      console.log("[v0] Đã lưu cấu hình Navbar:", tempSelectedNavbarIds)
    }

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault()
      if (!draggedId) return

      const draggedIndex = tempSelectedNavbarIds.indexOf(draggedId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const updated = [...tempSelectedNavbarIds]
        const temp = updated[targetIndex]
        updated[targetIndex] = updated[draggedIndex]
        updated[draggedIndex] = temp
        setTempSelectedNavbarIds(updated)
      }

      setDraggedId(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
    }

    const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id)
    }

    return (
      <div className="space-y-4">
        {showHeader && (
          <div>
            <h3 className="text-xl font-bold text-indigo-100 mb-2">Tuỳ chỉnh thanh điều hướng (Navbar)</h3>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-100 mb-1">Danh sách nút tuỳ chỉnh</h4>
          </div>
          <button
            onClick={handleResetNavbar}
            className="p-2 hover:bg-indigo-900/30 rounded-lg transition-colors group"
            title="Khôi phục mặc định"
          >
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            <span className="sr-only">Khôi phục mặc định</span>
          </button>
        </div>

        {/* Selected Navbar Buttons */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-indigo-300/70">
            Các nút đã chọn ({tempSelectedNavbarIds.filter((id) => id !== null).length + 2})
          </p>
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border-2 border-indigo-800/40 p-4 space-y-3">
            {currentNavbar.map((button, indexInNavbar) => {
              const customIndex = indexInNavbar - 1

              if (button === null) {
                return (
                  <div
                    key={`empty-nav-${customIndex}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, customIndex)}
                    className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-indigo-700/40 bg-slate-800/30 h-[56px] group transition-colors hover:border-indigo-600/60 hover:bg-slate-800/50"
                  >
                    <div className="w-8 h-8 rounded-lg border-2 border-dashed border-indigo-700/40 flex items-center justify-center text-indigo-500/50 group-hover:border-indigo-600 group-hover:text-indigo-300 transition-colors">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-indigo-500/60 text-xs font-medium group-hover:text-indigo-300 transition-colors">
                      Vị trí trống {customIndex + 1}
                    </span>
                  </div>
                )
              }

              const Icon = button.icon
              const isDefault = button.isDefault

              return (
                <div
                  key={button.id}
                  draggable={!isDefault}
                  onDragStart={(e) => !isDefault && handleDragStart(e, button.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => !isDefault && handleDrop(e, customIndex)}
                  className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isDefault
                      ? "bg-slate-800 border-indigo-800/40 cursor-not-allowed opacity-75"
                      : draggedId === button.id
                        ? "bg-slate-800 border-indigo-600 shadow-md opacity-50 cursor-move"
                        : "bg-slate-800 border-transparent hover:border-indigo-700/50 hover:shadow-md cursor-move"
                  }`}
                >
                  {!isDefault && <GripVertical className="w-5 h-5 text-slate-400 shrink-0" />}
                  {isDefault && <div className="w-5 h-5 shrink-0" />}

                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${button.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="flex-1 font-medium text-indigo-100 truncate">
                    {button.label}
                    {isDefault && <span className="ml-2 text-xs text-indigo-500/60">(mặc định)</span>}
                  </span>

                  {!isDefault && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveNavbar(customIndex, "up")}
                        disabled={customIndex === 0}
                        className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-indigo-900/40 text-indigo-500/50 hover:text-indigo-300 rounded-full transition-all disabled:opacity-30 disabled:hover:bg-slate-700"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveNavbar(customIndex, "down")}
                        disabled={customIndex === tempSelectedNavbarIds.length - 1}
                        className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-indigo-900/40 text-indigo-500/50 hover:text-indigo-300 rounded-full transition-all disabled:opacity-30 disabled:hover:bg-slate-700"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveNavbarAt(customIndex)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-red-900/40 text-red-500/50 hover:text-red-300 rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {availableNavbarButtons.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-indigo-100">Thư viện nút ({availableNavbarButtons.length})</p>
            <div className="grid grid-cols-2 gap-2">
              {availableNavbarButtons.map((button) => {
                const Icon = button.icon

                return (
                  <button
                    key={button.id}
                    onClick={() => handleAddNavbarButton(button.id)}
                    disabled={!tempSelectedNavbarIds.includes(null)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      !tempSelectedNavbarIds.includes(null)
                        ? "bg-slate-800 border-indigo-800/40 opacity-50 cursor-not-allowed"
                        : "bg-slate-800 border-indigo-800/40 hover:border-indigo-700/60 hover:shadow-md hover:shadow-indigo-600/20 cursor-pointer"
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${button.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-300/70 text-center">{button.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
)
