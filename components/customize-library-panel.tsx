"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Camera,
  MessageCircle,
  QrCode,
  Gamepad2,
  GripVertical,
  Plus,
  Music,
  MapPin,
  Star,
  Clock,
  BookOpen,
  Zap,
  Target,
  Palette,
  Radio,
  Gift,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Trash2,
  ChevronDownIcon,
} from "lucide-react"
import { NavbarCustomizeSection } from "@/components/navbar-customize-section"

interface ButtonItem {
  id: string
  icon: React.ElementType // Chuyển từ React.ReactNode sang React.ElementType để truyền component thay vì JSX element
  label: string
  color: string
  shadowColor: string
  isDefault?: boolean
  action?: () => void // Add action callback for toggle functions
}

function Settings2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v6m0 4v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M2 12h6m4 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24" />
    </svg>
  )
}

const DEFAULT_CONTROL_BUTTON: ButtonItem = {
  id: "customize",
  icon: Settings2Icon, // Truyền component thay vì <Settings2Icon />
  label: "Tuỳ chỉnh",
  color: "from-green-400 to-green-500",
  shadowColor: "shadow-green-400/40",
  isDefault: true,
}

const CUSTOMIZABLE_BUTTONS: ButtonItem[] = [
  {
    id: "camera",
    icon: Camera, // Chuyển tất cả sang component để tránh lỗi Slottable/JSX literal
    label: "Camera",
    color: "from-rose-400 to-rose-500",
    shadowColor: "shadow-rose-400/40",
  },
  {
    id: "chat",
    icon: MessageCircle,
    label: "Chat",
    color: "from-violet-400 to-violet-500",
    shadowColor: "shadow-violet-400/40",
  },
  {
    id: "qr",
    icon: QrCode,
    label: "QR",
    color: "from-sky-400 to-sky-500",
    shadowColor: "shadow-sky-400/40",
  },
  {
    id: "game",
    icon: Gamepad2,
    label: "Game",
    color: "from-amber-400 to-amber-500",
    shadowColor: "shadow-amber-400/40",
  },
  {
    id: "music",
    icon: Music,
    label: "Music",
    color: "from-indigo-400 to-indigo-500",
    shadowColor: "shadow-indigo-400/40",
  },
  {
    id: "location",
    icon: MapPin,
    label: "Location",
    color: "from-green-400 to-green-500",
    shadowColor: "shadow-green-400/40",
  },
  {
    id: "star",
    icon: Star,
    label: "Favorites",
    color: "from-yellow-400 to-yellow-500",
    shadowColor: "shadow-yellow-400/40",
  },
  {
    id: "history",
    icon: Clock,
    label: "History",
    color: "from-slate-400 to-slate-500",
    shadowColor: "shadow-slate-400/40",
  },
  {
    id: "learn",
    icon: BookOpen,
    label: "Learning",
    color: "from-cyan-400 to-cyan-500",
    shadowColor: "shadow-cyan-400/40",
  },
  {
    id: "energy",
    icon: Zap,
    label: "Energy",
    color: "from-orange-400 to-orange-500",
    shadowColor: "shadow-orange-400/40",
  },
  {
    id: "target",
    icon: Target,
    label: "Target",
    color: "from-red-400 to-red-500",
    shadowColor: "shadow-red-400/40",
  },
  {
    id: "design",
    icon: Palette,
    label: "Design",
    color: "from-pink-400 to-pink-500",
    shadowColor: "shadow-pink-400/40",
  },
  {
    id: "radio",
    icon: Radio,
    label: "Radio",
    color: "from-fuchsia-400 to-fuchsia-500",
    shadowColor: "shadow-fuchsia-400/40",
  },
  {
    id: "gift",
    icon: Gift,
    label: "Rewards",
    color: "from-lime-400 to-lime-500",
    shadowColor: "shadow-lime-400/40",
  },
]

const DEFAULT_SELECTED_BUTTON_IDS = ["camera", "chat", "qr", "game", null]

interface PreviewButtonItem extends ButtonItem {
  isOpen?: boolean
}

interface CustomizeLibraryPanelProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedButtons: ButtonItem[]) => void
  onNavbarSave?: (navbarConfig: any[]) => void
  onHeaderToggle?: () => void
  isMobileHeaderBottom?: boolean
}

export function CustomizeLibraryPanel({
  isOpen,
  onClose,
  onSave,
  onNavbarSave,
  onHeaderToggle,
  isMobileHeaderBottom = false,
}: CustomizeLibraryPanelProps) {
  const [activeTab, setActiveTab] = useState<"library" | "navbar" | "control">("library")
  const navbarRef = useRef<{ handleSaveChanges: () => void } | null>(null)

  const [tempSelectedButtonIds, setTempSelectedButtonIds] = useState<(string | null)[]>([])

  const [selectedButtonIds, setSelectedButtonIds] = useState<(string | null)[]>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("selectedButtonIds") : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const normalized = [...parsed, ...Array(Math.max(0, 5 - parsed.length)).fill(null)].slice(0, 5)
          return normalized
        }
        return DEFAULT_SELECTED_BUTTON_IDS
      } catch {
        return DEFAULT_SELECTED_BUTTON_IDS
      }
    }
    return DEFAULT_SELECTED_BUTTON_IDS
  })

  const [isNavbarValid, setIsNavbarValid] = useState(true)
  const [isNavbarSaved, setIsNavbarSaved] = useState(false)
  const [isControlSaved, setIsControlSaved] = useState(false)
  const [isNavbarHasChanges, setIsNavbarHasChanges] = useState(false)
  const [isControlHasChanges, setIsControlHasChanges] = useState(false)

  const ALL_CUSTOMIZABLE_BUTTONS: ButtonItem[] = [
    ...CUSTOMIZABLE_BUTTONS,
    {
      id: "header-toggle",
      icon: ChevronDownIcon,
      label: "Header Toggle",
      color: "from-purple-400 to-purple-500",
      shadowColor: "shadow-purple-400/40",
      action: onHeaderToggle,
    },
  ]

  useEffect(() => {
    if (isOpen) {
      setTempSelectedButtonIds(selectedButtonIds)
      setIsControlSaved(false)
      setIsNavbarSaved(false)
      setIsNavbarHasChanges(false)
      setIsControlHasChanges(false)
    }
  }, [isOpen, selectedButtonIds])

  useEffect(() => {
    setIsControlSaved(false)
    setIsControlHasChanges(true)
  }, [tempSelectedButtonIds])

  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragSource, setDragSource] = useState<"available" | "selected" | null>(null)
  const [previewButtons, setPreviewButtons] = useState<PreviewButtonItem[]>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("selectedButtonIds") : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          return CUSTOMIZABLE_BUTTONS.filter((btn) => parsed.includes(btn.id)).map((btn) => ({ ...btn, isOpen: false }))
        }
      } catch {}
    }
    return CUSTOMIZABLE_BUTTONS.filter((btn) => DEFAULT_SELECTED_BUTTON_IDS.includes(btn.id)).map((btn) => ({
      ...btn,
      isOpen: false,
    }))
  })

  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setActiveOverlayId(null)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const availableButtons = ALL_CUSTOMIZABLE_BUTTONS.filter((btn) => !tempSelectedButtonIds.includes(btn.id))

  const handleDragStart = (e: React.DragEvent, buttonId: string, source: "available" | "selected") => {
    setDraggedItem(buttonId)
    setDragSource(source)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDropOnSelected = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    if (dragSource === "available") {
      const updated = [...tempSelectedButtonIds]
      const existingIdx = updated.indexOf(draggedItem)
      if (existingIdx !== -1) updated[existingIdx] = null

      updated[targetIndex] = draggedItem
      setTempSelectedButtonIds(updated)
    } else if (dragSource === "selected") {
      const draggedIndex = tempSelectedButtonIds.indexOf(draggedItem)
      if (draggedIndex !== -1 && targetIndex !== draggedIndex) {
        const updated = [...tempSelectedButtonIds]
        const temp = updated[targetIndex]
        updated[targetIndex] = updated[draggedIndex]
        updated[draggedIndex] = temp
        setTempSelectedButtonIds(updated)
      }
    }

    setDraggedItem(null)
    setDragSource(null)
  }

  const handleRemoveAt = (index: number) => {
    const updated = [...tempSelectedButtonIds]
    updated[index] = null
    setTempSelectedButtonIds(updated)
  }

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= tempSelectedButtonIds.length) return

    const updated = [...tempSelectedButtonIds]
    const temp = updated[newIndex]
    updated[newIndex] = updated[index]
    updated[index] = temp
    setTempSelectedButtonIds(updated)
  }

  const handleAddButton = (buttonId: string) => {
    const emptyIndex = tempSelectedButtonIds.indexOf(null)
    if (emptyIndex !== -1 && !tempSelectedButtonIds.includes(buttonId)) {
      const updated = [...tempSelectedButtonIds]
      updated[emptyIndex] = buttonId
      setTempSelectedButtonIds(updated)
    }
  }

  const handleResetPanel = () => {
    setTempSelectedButtonIds(DEFAULT_SELECTED_BUTTON_IDS)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedButtonIds", JSON.stringify(DEFAULT_SELECTED_BUTTON_IDS))
    }
    setSelectedButtonIds(DEFAULT_SELECTED_BUTTON_IDS)
    const selected = DEFAULT_SELECTED_BUTTON_IDS.map((id) =>
      ALL_CUSTOMIZABLE_BUTTONS.find((btn) => btn.id === id),
    ).filter((btn): btn is ButtonItem => !!btn)
    onSave(selected)
    setIsControlSaved(true)
    setIsControlHasChanges(false)
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedButtonIds", JSON.stringify(tempSelectedButtonIds))
    }
    setSelectedButtonIds(tempSelectedButtonIds)
    const selected = tempSelectedButtonIds
      .map((id) => ALL_CUSTOMIZABLE_BUTTONS.find((btn) => btn.id === id))
      .filter((btn): btn is ButtonItem => !!btn)

    onSave(selected)
    setIsControlSaved(true)
  }

  const handleCancel = () => {
    setTempSelectedButtonIds(selectedButtonIds)
    onClose()
  }

  const handleOpenPreviewButton = (buttonId: string) => {
    if (buttonId === "header-toggle" && typeof onHeaderToggle === "function") {
      onHeaderToggle()
      return
    }
    setPreviewButtons((prev) => prev.map((btn) => (btn.id === buttonId ? { ...btn, isOpen: !btn.isOpen } : btn)))
  }

  const handleNavbarSave = () => {
    if (navbarRef.current) {
      navbarRef.current.handleSaveChanges()
      setIsNavbarSaved(true)
      setIsNavbarHasChanges(false)
    }
  }

  const isDarkMode = typeof document !== "undefined" && document.body.classList.contains("dark-mode")

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-24 z-50 px-4">
        <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[80vh] flex flex-col transition-colors ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-2xl shadow-purple-900/30 border border-indigo-900/30"
            : "bg-white"
        }`}>
          <div className={`p-4 border-b transition-colors ${
            isDarkMode
              ? "bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-indigo-900/30"
              : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200"
          }`}>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setActiveTab("library")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "library"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : isDarkMode
                      ? "bg-slate-800 text-indigo-300/70 hover:text-indigo-200 border border-indigo-700/40 hover:border-indigo-600/60"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                }`}
              >
                Thư viện
              </button>
              <button
                onClick={() => setActiveTab("control")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "control"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : isDarkMode
                      ? "bg-slate-800 text-indigo-300/70 hover:text-indigo-200 border border-indigo-700/40 hover:border-indigo-600/60"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                }`}
              >
                Bảng điều khiển
              </button>
              <button
                onClick={() => setActiveTab("navbar")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "navbar"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : isDarkMode
                      ? "bg-slate-800 text-indigo-300/70 hover:text-indigo-200 border border-indigo-700/40 hover:border-indigo-600/60"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                }`}
              >
                Navbar
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6" ref={panelRef}>
            {activeTab === "library" && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-bold mb-1 transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-900"}`}>Thư viện nút</h3>
                  <p className={`text-sm transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Quản lý và xem trước các thành phần</p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {ALL_CUSTOMIZABLE_BUTTONS.map((button) => {
                    const isOpen = previewButtons.find((b) => b.id === button.id)?.isOpen || false
                    const isOverlayActive = activeOverlayId === button.id

                    return (
                      <div
                        key={button.id}
                        onClick={() => setActiveOverlayId(isOverlayActive ? null : button.id)}
                        className={`relative aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-between p-2 overflow-hidden cursor-pointer ${
                          isOverlayActive
                            ? isDarkMode
                              ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
                              : "bg-white border-green-500 shadow-md ring-2 ring-green-500/20"
                            : isDarkMode
                              ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-indigo-800/40 hover:border-indigo-700/60"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${button.color} flex items-center justify-center text-white shadow-sm ${button.shadowColor} shrink-0 mt-1 transition-transform duration-300 ${isOverlayActive ? "scale-90 blur-[2px]" : ""}`}
                        >
                          {button.icon && (typeof button.icon === "function" || typeof button.icon === "object") ? (
                            <button.icon className="w-5 h-5" />
                          ) : (
                            (button.icon as any)
                          )}
                        </div>

                        <div
                          className={`w-full flex flex-col items-center gap-1 mb-1 transition-opacity duration-300 ${isOverlayActive ? "opacity-20" : ""}`}
                        >
                          <span className={`text-[10px] font-bold truncate w-full text-center leading-tight transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-900"}`}>
                            {button.label}
                          </span>
                        </div>

                        <div
                          className={`absolute inset-0 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 z-10 ${
                            isOverlayActive ? "opacity-100 visible" : "opacity-0 invisible"
                          } ${isDarkMode ? "bg-black/70" : "bg-black/60"}`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenPreviewButton(button.id)
                              setActiveOverlayId(null)
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg transform transition-transform active:scale-95 ${
                              isDarkMode
                                ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/50"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            Mở
                          </button>
                        </div>

                        {isOpen && (
                          <div className="absolute top-1 right-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === "navbar" && (
              <div className="space-y-4">
                <NavbarCustomizeSection
                  showHeader={true}
                  onNavbarChange={onNavbarSave}
                  ref={navbarRef}
                  onValidationChange={(isValid) => setIsNavbarValid(isValid)}
                  onContentChange={() => {
                    setIsNavbarSaved(false)
                    setIsNavbarHasChanges(true)
                  }}
                />
              </div>
            )}

            {activeTab === "control" && (
              <div className="space-y-8">
                <div>
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-900"}`}>Tuỳ chỉnh bảng điều khiển</h3>
                  <p className={`text-sm transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Kéo và thả để sắp xếp các nút</p>
                </div>

                <div className={`rounded-2xl border-2 p-4 space-y-3 transition-colors ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-indigo-900/30"
                    : "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-sm uppercase tracking-wider transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-900"}`}>Cài đặt bố cục</h4>
                      <p className={`text-xs mt-1 transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Chuyển đổi vị trí thanh điều hướng</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (typeof onHeaderToggle === "function") {
                          onHeaderToggle()
                        }
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        !isMobileHeaderBottom
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : isDarkMode
                            ? "bg-slate-800 text-slate-300 border border-slate-600 hover:border-slate-500 hover:text-slate-100"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-purple-300"
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                      Header Trên
                    </button>
                    <button
                      onClick={() => {
                        if (typeof onHeaderToggle === "function") {
                          onHeaderToggle()
                        }
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isMobileHeaderBottom
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : isDarkMode
                            ? "bg-slate-800 text-slate-300 border border-slate-600 hover:border-slate-500 hover:text-slate-100"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-purple-300"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                      Header Dưới
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-sm uppercase tracking-wider transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-900"}`}>
                        Các nút đã chọn ({tempSelectedButtonIds.filter((id) => id !== null).length})
                      </h4>
                      <p className={`text-xs mt-1 transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>Kéo thả hoặc sử dụng nút điều khiển để sắp xếp</p>
                    </div>
                    <button
                      onClick={handleResetPanel}
                      className={`p-2 rounded-lg transition-colors group ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-green-100"}`}
                      title="Trở về mặc định"
                    >
                      <RotateCcw className={`w-4 h-4 transition-colors ${isDarkMode ? "text-emerald-500 group-hover:text-emerald-400" : "text-green-600"}`} />
                    </button>
                  </div>

                  <div
                    className={`rounded-2xl border-2 border-dashed p-4 space-y-3 min-h-[200px] transition-colors ${
                      isDarkMode
                        ? "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-indigo-800/40"
                        : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                    }`}
                    onDragOver={handleDragOver}
                  >
                    {tempSelectedButtonIds.map((id, index) => {
                      const button = ALL_CUSTOMIZABLE_BUTTONS.find((btn) => btn.id === id)

                      if (!button) {
                        return (
                          <div
                            key={`empty-${index}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropOnSelected(e, index)}
                            className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-3 h-[60px] group transition-colors ${
                              isDarkMode
                                ? "bg-slate-800/30 border-indigo-700/40 hover:border-indigo-600/60 hover:bg-slate-800/50"
                                : "bg-white/40 border-slate-200 hover:border-green-300 hover:bg-green-50/30"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                              isDarkMode
                                ? "border-indigo-700/40 text-indigo-500/50 group-hover:border-indigo-600 group-hover:text-indigo-300"
                                : "border-slate-200 text-slate-300 group-hover:border-green-300 group-hover:text-green-400"
                            }`}>
                              <Plus className="w-4 h-4" />
                            </div>
                            <span className={`text-sm font-medium transition-colors ${
                              isDarkMode
                                ? "text-indigo-500/60 group-hover:text-indigo-300"
                                : "text-slate-400 group-hover:text-green-500"
                            }`}>
                              Vị trí trống {index + 1}
                            </span>
                          </div>
                        )
                      }

                      return (
                        <div
                          key={button.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, button.id, "selected")}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOnSelected(e, index)}
                          className={`group flex items-center gap-3 rounded-xl p-3 cursor-move hover:shadow-md transition-all border-2 ${
                            draggedItem === button.id
                              ? isDarkMode
                                ? "border-indigo-600 shadow-md opacity-50 bg-slate-800"
                                : "border-green-400 shadow-md opacity-50 bg-white"
                              : isDarkMode
                                ? "border-transparent bg-slate-800 hover:border-indigo-700/50 hover:shadow-indigo-500/20"
                                : "border-transparent bg-white hover:border-green-300"
                          }`}
                        >
                          <GripVertical className={`w-5 h-5 shrink-0 transition-colors ${isDarkMode ? "text-slate-500 group-hover:text-slate-400" : "text-slate-400 group-hover:text-slate-600"}`} />
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${button.color} flex items-center justify-center text-white shrink-0`}
                          >
                            {button.icon && (typeof button.icon === "function" || typeof button.icon === "object") ? (
                              <button.icon className="w-4 h-4" />
                            ) : (
                              (button.icon as any)
                            )}
                          </div>
                          <span className={`flex-1 font-medium truncate transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-700"}`}>{button.label}</span>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleMove(index, "up")}
                              disabled={index === 0}
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-30 ${
                                isDarkMode
                                  ? "bg-slate-700 hover:bg-blue-900 text-slate-400 hover:text-blue-400 disabled:hover:bg-slate-700 disabled:hover:text-slate-400"
                                  : "bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 disabled:hover:bg-slate-100 disabled:hover:text-slate-500"
                              }`}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMove(index, "down")}
                              disabled={index === tempSelectedButtonIds.length - 1}
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-30 ${
                                isDarkMode
                                  ? "bg-slate-700 hover:bg-blue-900 text-slate-400 hover:text-blue-400 disabled:hover:bg-slate-700 disabled:hover:text-slate-400"
                                  : "bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 disabled:hover:bg-slate-100 disabled:hover:text-slate-500"
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveAt(index)}
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                                isDarkMode
                                  ? "bg-slate-700 hover:bg-red-900 text-slate-400 hover:text-red-400"
                                  : "bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {button.id === "header-toggle" && (
                              <button
                                onClick={button.action}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                                  isDarkMode
                                    ? "bg-slate-700 hover:bg-emerald-900 text-slate-500 hover:text-emerald-400"
                                    : "bg-slate-100 hover:bg-green-100 text-slate-400 hover:text-green-600"
                                }`}
                              >
                                <ChevronDownIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className={`font-bold text-sm uppercase tracking-wider transition-colors ${isDarkMode ? "text-indigo-100" : "text-slate-900"}`}>
                    Thư viện nút ({availableButtons.length})
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {availableButtons.map((button) => (
                      <div
                        key={button.id}
                        draggable={tempSelectedButtonIds.includes(null)}
                        onDragStart={(e) =>
                          tempSelectedButtonIds.includes(null) && handleDragStart(e, button.id, "available")
                        }
                        onDragOver={handleDragOver}
                        onClick={() => handleAddButton(button.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          !tempSelectedButtonIds.includes(null)
                            ? isDarkMode
                              ? "bg-slate-800 border-indigo-800/40 opacity-50"
                              : "bg-slate-50 border-slate-200 opacity-50"
                            : isDarkMode
                              ? "bg-slate-800 border-indigo-800/40 hover:border-indigo-700/60 hover:shadow-indigo-600/20 hover:shadow-md"
                              : "bg-green-50 border-green-200 hover:border-green-400 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${button.color} flex items-center justify-center text-white`}
                        >
                          {button.icon && (typeof button.icon === "function" || typeof button.icon === "object") ? (
                            <button.icon className="w-4 h-4" />
                          ) : (
                            (button.icon as any)
                          )}
                        </div>
                        <span className={`text-xs font-semibold text-center transition-colors ${isDarkMode ? "text-indigo-300/70" : "text-slate-700"}`}>{button.label}</span>
                        <button
                          onClick={() => handleAddButton(button.id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                            isDarkMode
                              ? "text-indigo-500/50 hover:text-indigo-300 hover:bg-slate-700"
                              : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t transition-colors ${isDarkMode ? "bg-slate-900/80 border-indigo-900/30" : "bg-slate-50 border-slate-200"}`}>
            {activeTab === "library" && (
              <button
                onClick={onClose}
                className={`w-32 mx-auto block px-4 py-2 font-semibold rounded-xl transition-all ${
                  isDarkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                    : "bg-slate-500 hover:bg-slate-600 text-white"
                }`}
              >
                Đóng
              </button>
            )}
            {activeTab === "navbar" && (
              <div className="flex flex-col gap-3">
                {!isNavbarValid && (
                  <p className={`text-xs font-medium text-center ${isDarkMode ? "text-red-400" : "text-red-500"}`}>
                    Hãy chọn đầy đủ các nút điều hướng để lưu thay đổi
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleCancel}
                    className={`w-32 px-4 py-2.5 font-semibold rounded-xl transition-all ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                        : "bg-slate-300 hover:bg-slate-400 text-slate-900"
                    }`}
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleNavbarSave}
                    disabled={!isNavbarValid || !isNavbarHasChanges || isNavbarSaved}
                    className={`w-32 px-4 py-2.5 font-semibold rounded-xl transition-all ${
                      isNavbarValid && isNavbarHasChanges
                        ? isNavbarSaved
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : isDarkMode
                          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isNavbarSaved ? "Đã Lưu" : "Lưu"}
                  </button>
                </div>
              </div>
            )}
            {activeTab === "control" && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancel}
                  className={`w-32 px-4 py-2.5 font-semibold rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "bg-slate-300 hover:bg-slate-400 text-slate-900"
                  }`}
                >
                  Đóng
                </button>
                <button
                  onClick={handleSave}
                  disabled={isControlSaved}
                  className={`w-32 px-4 py-2.5 font-semibold rounded-xl transition-all ${
                    isControlSaved
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  }`}
                >
                  {isControlSaved ? "Đã Lưu" : "Lưu"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
