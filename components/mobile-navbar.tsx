"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Flame, User, MonitorPlay as TvMinimalPlay, ShoppingBag, Menu, Camera, ArrowBigUpDash, MessageCircle, QrCode, Gamepad2, Settings2 } from "lucide-react"
import { CustomizeLibraryPanel } from "@/components/customize-library-panel"
import { VoiceInputOverlay } from "@/components/voice-input-overlay"
import { useVoiceInput } from "@/hooks/use-voice-input"
import { matchVoiceCommand } from "@/utils/voice-commands"

// Add dark mode styles to document
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    /* Mobile Navbar Dark Mode - Premium Styling */
    body.dark-mode nav.mobile-navbar-bottom {
      background: linear-gradient(180deg, #0a0e27 0%, #1a1a3e 40%, #2d1b69 100%) !important;
      border-top: 1px solid rgba(124, 58, 237, 0.3) !important;
      box-shadow: 
        0 -30px 80px rgba(0, 0, 0, 0.6),
        0 -10px 30px rgba(124, 58, 237, 0.08),
        0 -1px 0px rgba(124, 58, 237, 0.2) !important;
      backdrop-filter: blur(16px) !important;
      position: fixed !important;
    }

    /* Enhanced glass morphism overlay */
    body.dark-mode nav.mobile-navbar-bottom::before {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(
        ellipse at center top,
        rgba(124, 58, 237, 0.08) 0%,
        rgba(109, 40, 217, 0.03) 50%,
        transparent 100%
      );
      pointer-events: none;
      border-radius: 3rem 3rem 0 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: auto;
    }

    /* Premium plus button styling - Violet gradient with white border */
    body.dark-mode .mobile-navbar-button {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%) !important;
      border: 4px solid rgba(255, 255, 255, 0.95) !important;
      box-shadow: 
        0 12px 40px rgba(124, 58, 237, 0.4),
        0 4px 15px rgba(139, 92, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }

    body.dark-mode .mobile-navbar-button:hover {
      box-shadow: 
        0 16px 56px rgba(124, 58, 237, 0.45),
        0 6px 20px rgba(139, 92, 246, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 1) !important;
    }

    body.dark-mode .mobile-navbar-button:active {
      box-shadow: 
        0 6px 20px rgba(124, 58, 237, 0.3),
        inset 0 2px 4px rgba(0, 0, 0, 0.15) !important;
      transform: translateY(-1px);
    }

    /* Enhanced radial glow */
    body.dark-mode .radial-glow {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.5) 0%, rgba(109, 40, 217, 0.3) 100%) !important;
      box-shadow: 0 0 30px rgba(124, 58, 237, 0.3) !important;
    }

    /* Dark mode text color */
    body.dark-mode .mobile-navbar-bottom {
      color: #f1f5fe;
    }

    /* Enhanced nav item hover state */
    body.dark-mode .mobile-navbar-bottom button:not(.mobile-navbar-button) {
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    body.dark-mode .mobile-navbar-bottom button:not(.mobile-navbar-button):hover {
      filter: drop-shadow(0 6px 16px rgba(124, 58, 237, 0.25));
      transform: translateY(-1px);
    }

    /* Premium navbar item icon styling */
    body.dark-mode .mobile-navbar-bottom .w-10.h-10 {
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `
  document.head.appendChild(style)
}

function HouseHeartIcon({ className }: { className?: string }) {
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
      <path d="M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}

const CurvedText = ({ text, index }: { text: string; index: number }) => {
  const pathId = `curved-text-path-${index}`

  return (
    <svg className="absolute -top-5 left-1/2 -translate-x-1/2 w-16 h-8 overflow-visible" viewBox="0 0 64 32">
      <defs>
        <path id={pathId} d="M 4 28 Q 32 4 60 28" fill="none" />
      </defs>
      <text
        className="fill-white text-[9px] font-semibold"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
      >
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

function NavItem({
  icon: Icon,
  name,
  activeNav,
  setActiveNav,
  onMenuClick,
  toggleSideMenu,
}: {
  icon: any
  name: string
  activeNav: string | null
  setActiveNav: (name: string) => void
  onMenuClick?: () => void
  toggleSideMenu?: () => void
}) {
  const router = useRouter()
  const isActive = activeNav === name
  const isDarkMode = typeof document !== "undefined" && document.body.classList.contains("dark-mode")

  const handleNavClick = () => {
    setActiveNav(name)
    
    // Navigate based on button name
    switch (name) {
      case "home":
        router.push("/trangchu")
        break
      case "flame":
        router.push("/xu-huong")
        break
      case "user":
        router.push("/login")
        break
      case "menu":
        // Menu button - toggle side menu from header
        toggleSideMenu?.()
        break
      case "shop":
        router.push("/")
        break
      case "tv":
        router.push("/")
        break
      default:
        break
    }
  }

  return (
    <button className="flex flex-col items-center gap-1 group" onClick={handleNavClick}>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isActive ? "scale-110" : "scale-100 group-active:scale-95"
        }`}
      >
        <div
          style={{
            color: isDarkMode
              ? isActive
                ? "#a78bfa" // violet-500
                : "#e0e7ff" // violet-300
              : isActive
                ? "#f97316" // orange-500
                : "#6b7280", // gray-500
            transition: "all 0.2s",
          }}
          className="w-6 h-6 flex items-center justify-center"
        >
          {Icon && (typeof Icon === "function" || typeof Icon === "object") ? <Icon className="w-6 h-6" /> : Icon}
        </div>
      </div>
    </button>
  )
}

export function MobileNavbar({
  isMobileHeaderBottom,
  onHeaderToggle,
  toggleSideMenu,
}: { isMobileHeaderBottom: boolean; onHeaderToggle?: () => void; toggleSideMenu?: () => void }) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<string | null>("home")
  const [isRadialOpen, setIsRadialOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [customizeSelectedButtons, setCustomizeSelectedButtons] = useState<any[]>([])
  const [navbarButtons, setNavbarButtons] = useState<any[] | null>(null)
  const { isListening, transcript, startListening, stopListening } = useVoiceInput()
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const longPressStartRef = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedNavbarIds")
      if (stored) {
        try {
          const ids = JSON.parse(stored)
          // We don't have the full button definitions here, so we'll rely on NavbarCustomizeSection to provide them
          // For now, if we have stored IDs, we'll let the default rendering handle it until onNavbarSave is called
        } catch (e) {
          console.error("[v0] Lỗi parse selectedNavbarIds", e)
        }
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 300 && currentScrollY < lastScrollY) {
        setShowScrollTop(true)
        setIsExiting(false)
      } else if (currentScrollY > 900 || currentScrollY >= lastScrollY) {
        if (showScrollTop && !isExiting) {
          setIsExiting(true)
          setTimeout(() => {
            setShowScrollTop(false)
            setIsExiting(false)
          }, 400)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, showScrollTop, isExiting])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleScrollButtonClick = (e: any) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    scrollToTop()
  }

  const handleNavbarSave = (newConfig: any[]) => {
    setNavbarButtons(newConfig)
    console.log("[v0] MobileNavbar đã nhận cấu hình Navbar mới:", newConfig)
  }

  const handleMenuButtonClick = () => {
    setActiveNav("menu")
    toggleSideMenu?.()
  }

  const handleVoiceFinalTranscript = (finalTranscript: string) => {
    console.log("[v0] Final transcript:", finalTranscript)
    const command = matchVoiceCommand(finalTranscript)
    if (command) {
      console.log("[v0] Voice command matched:", command)
      setActiveNav(command.label.toLowerCase())
      router.push(command.route)
    } else {
      console.log("[v0] No voice command matched for:", finalTranscript)
    }
    // Auto stop listening after processing final transcript
    stopListening()
  }

  const handlePlusButtonMouseDown = () => {
    longPressStartRef.current = true
    longPressTimerRef.current = setTimeout(() => {
      if (longPressStartRef.current) {
        startListening(handleVoiceFinalTranscript)
      }
    }, 500) // 500ms long press duration
  }

  const handlePlusButtonMouseUp = () => {
    longPressStartRef.current = false
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
    // Don't stop listening here - let the speech recognition complete naturally
    // The stopListening() will be called after the final transcript is received
  }

  const handlePlusButtonTouchStart = (e: React.TouchEvent) => {
    longPressStartRef.current = true
    longPressTimerRef.current = setTimeout(() => {
      if (longPressStartRef.current) {
        startListening(handleVoiceFinalTranscript)
      }
    }, 500) // 500ms long press duration
  }

  const handlePlusButtonTouchEnd = () => {
    longPressStartRef.current = false
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }
    // Don't stop listening here - let the speech recognition complete naturally
    // The stopListening() will be called after the final transcript is received
  }

  const defaultRadialItems = [
    { icon: Camera, label: "Camera", color: "from-rose-400 to-rose-500", shadowColor: "shadow-rose-400/40" },
    { icon: MessageCircle, label: "Chat", color: "from-violet-400 to-violet-500", shadowColor: "shadow-violet-400/40" },
    { icon: QrCode, label: "QR", color: "from-sky-400 to-sky-500", shadowColor: "shadow-sky-400/40" },
    { icon: Gamepad2, label: "Game", color: "from-amber-400 to-amber-500", shadowColor: "shadow-amber-400/40" },
    {
      icon: Settings2,
      label: "Tuỳ chọn",
      color: "from-green-400 to-green-500",
      shadowColor: "shadow-green-400/40",
      onClick: () => {
        setIsRadialOpen(false)
        setIsOptionsOpen(true)
      },
    },
  ]

  // Enhance customized buttons with action callbacks
  const enhancedCustomizeSelectedButtons = customizeSelectedButtons.map((btn) => {
    if (btn.id === "header-toggle") {
      return {
        ...btn,
        onClick: () => {
          if (typeof onHeaderToggle === "function") {
            onHeaderToggle()
          }
          setIsRadialOpen(false)
        },
      }
    }
    return btn
  })

  const radialItems =
    customizeSelectedButtons.length > 0
      ? [...enhancedCustomizeSelectedButtons, defaultRadialItems[defaultRadialItems.length - 1]]
      : defaultRadialItems

  const getItemPosition = (index: number, total: number) => {
    const selectedCount = customizeSelectedButtons.filter((btn) => btn !== null).length
    const radius = selectedCount === 5 ? 100 : 85
    let startAngle, endAngle
    if (isMobileHeaderBottom) {
      startAngle = 200
      endAngle = 340
    } else {
      startAngle = 250 // Increased radius and adjusted angles for header top state to give buttons more space below the plus button
      endAngle = 370
    }
    const angleRange = endAngle - startAngle
    const angle = startAngle + (angleRange / (total - 1)) * index
    const angleRad = (angle * Math.PI) / 180
    return {
      x: Math.cos(angleRad) * radius,
      y: Math.sin(angleRad) * radius,
    }
  }

  return (
    <>
      {(isOptionsOpen || isRadialOpen) && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            setIsOptionsOpen(false)
            setIsRadialOpen(false)
          }}
        />
      )}

      <CustomizeLibraryPanel
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        onSave={(selectedButtons) => setCustomizeSelectedButtons(selectedButtons)}
        onNavbarSave={handleNavbarSave}
        onHeaderToggle={onHeaderToggle}
        isMobileHeaderBottom={isMobileHeaderBottom}
      />

      <nav
        className={`mobile-navbar-bottom fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-950/98 backdrop-blur-md rounded-t-[3rem] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(88,28,135,0.15)] border-t border-white/50 dark:border-purple-600/20 z-50 transition-all duration-500 ease-out ${
          isMobileHeaderBottom !== false
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-around p-4 pb-6">
          {navbarButtons ? (
            navbarButtons.map((btn, idx) => {
              if (idx === 3) {
                return (
                  <React.Fragment key="radial-wrapper">
                    <div className="relative -mt-10 flex items-center">
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 ${
                          isRadialOpen
                            ? "bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 dark:from-purple-600 dark:via-indigo-500 dark:to-purple-700 blur-xl opacity-60 dark:opacity-50 scale-150"
                            : "bg-orange-400/30 dark:bg-purple-600/20 blur-md opacity-100 scale-100"
                        }`}
                      />

                      <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] rounded-full border-2 border-dashed border-white/20 dark:border-purple-500/30 transition-all duration-500 ${
                          isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
                        }`}
                      />

                      {radialItems.map((item, index) => {
                        const Icon = item.icon
                        const { x, y } = getItemPosition(index, radialItems.length)

                        return (
                          <div
                            key={item.label}
                            className={`absolute left-1/2 top-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                              isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                            }`}
                            style={{
                              transform: isRadialOpen
                                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                                : "translate(-50%, -50%)",
                              transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
                            }}
                          >
                            <button
                              className="group relative flex flex-col items-center"
                              onClick={() => {
                                item.onClick?.()
                                setIsRadialOpen(false)
                              }}
                            >
                              <div
                                className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.color} shadow-lg ${item.shadowColor} flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 border-2 border-white/30`}
                              >
                                {Icon && (typeof Icon === "function" || typeof Icon === "object") ? (
                                  <Icon className="w-5 h-5 text-white drop-shadow-sm" />
                                ) : (
                                  (Icon as any)
                                )}
                              </div>
                            </button>
                          </div>
                        )
                      })}

                      {radialItems.map((item, index) => {
                        const { x, y } = getItemPosition(index, radialItems.length)

                        return (
                          <div
                            key={`text-${item.label}`}
                            className={`absolute left-1/2 top-1/2 z-[60] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                              isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                            }`}
                            style={{
                              transform: isRadialOpen
                                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px - 22px))`
                                : "translate(-50%, -50%)",
                              transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
                            }}
                          >
                            <CurvedText text={item.label} index={index} />
                          </div>
                        )
                      })}

                      <div
                        className={`mobile-navbar-button relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-300 to-purple-600 dark:from-violet-400 dark:via-purple-600 dark:to-purple-700 shadow-lg shadow-purple-500/40 dark:shadow-purple-500/50 border-4 border-white dark:border-white overflow-hidden z-[55] transition-all duration-300 ${
                          !showScrollTop ? "hover:scale-105 active:scale-95" : ""
                        }`}
                      >
                        {showScrollTop || isExiting ? (
                          <div
                            className={`flex flex-col h-full w-full ${isExiting ? "animate-out fade-out zoom-out-95 duration-400 ease-in fill-mode-forwards" : ""}`}
                          >
                            <button
                              className="flex-1 w-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                              onClick={() => !isListening && setIsRadialOpen(!isRadialOpen)}
                              disabled={isListening}
                            >
                              <Plus
                                className={`w-6 h-6 text-white transition-all duration-300 transform translate-y-1 ${
                                  isRadialOpen ? "rotate-45 scale-90" : "rotate-0 scale-100"
                                }`}
                                strokeWidth={4}
                              />
                            </button>

                            <div className="h-[2px] w-full bg-white/0" />

                            <button
                              className="flex-1 w-full flex items-center justify-center relative overflow-hidden active:scale-90"
                              onClick={handleScrollButtonClick}
                            >
                              <div
                                className={`absolute w-10 h-10 bg-emerald-500/80 rounded-full flex items-center justify-center mt-5 shadow-lg shadow-emerald-500/30 ${isExiting ? "animate-out fade-out zoom-out slide-out-to-bottom-4 duration-300 ease-in fill-mode-forwards" : "animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 ease-out"}`}
                              />
                              {ripples.map((ripple) => (
                                <div
                                  key={ripple.id}
                                  className="absolute rounded-full bg-white/30 pointer-events-none animate-pulse"
                                  style={{
                                    left: `${ripple.x}px`,
                                    top: `${ripple.y}px`,
                                    width: "8px",
                                    height: "8px",
                                    transform: "translate(-50%, -50%)",
                                    animation: `ripple-expand 0.6s ease-out forwards`,
                                  }}
                                />
                              ))}
                              <ArrowBigUpDash
                                className={`relative z-10 w-5 h-5 text-white ${isExiting ? "animate-out fade-out zoom-out slide-out-to-bottom-2 duration-300 ease-in" : "animate-in fade-in zoom-in slide-in-from-bottom-2 duration-700 delay-150 ease-out"}`}
                                strokeWidth={2.5}
                              />
                            </button>
                          </div>
                        ) : (
              <button
                data-voice-button
                className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-300 select-none"
                onClick={() => !isListening && setIsRadialOpen(!isRadialOpen)}
                onMouseDown={handlePlusButtonMouseDown}
                onMouseUp={handlePlusButtonMouseUp}
                onMouseLeave={handlePlusButtonMouseUp}
                onTouchStart={handlePlusButtonTouchStart}
                onTouchEnd={handlePlusButtonTouchEnd}
                disabled={isListening}
              >
                <Plus
                  className={`w-9 h-9 text-white transition-all duration-300 ${
                    isRadialOpen ? "rotate-45 scale-90" : "rotate-0 scale-100"
                  }`}
                  strokeWidth={3}
                />
              </button>
                        )}
                      </div>
                    </div>
                    <NavItem icon={btn.icon} name={btn.id} activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
                  </React.Fragment>
                )
              }
              return (
                <NavItem key={btn.id} icon={btn.icon} name={btn.id} activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
              )
            })
          ) : (
            <>
              <NavItem icon={HouseHeartIcon} name="home" activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
              <NavItem icon={ShoppingBag} name="shop" activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
              <NavItem icon={Flame} name="flame" activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />

              <div className="relative -mt-10">
                <div
                  className={`radial-glow absolute inset-0 rounded-full transition-all duration-500 ${
                    isRadialOpen
                      ? "bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 dark:from-purple-600 dark:via-indigo-500 dark:to-purple-700 blur-xl opacity-60 dark:opacity-50 scale-150"
                      : "bg-orange-400/30 dark:bg-purple-600/20 blur-md opacity-100 scale-100"
                  }`}
                />

                <div
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] rounded-full border-2 border-dashed border-white/20 dark:border-purple-500/30 transition-all duration-500 ${
                    isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}
                />

                {radialItems.map((item, index) => {
                  const Icon = item.icon
                  const { x, y } = getItemPosition(index, radialItems.length)

                  return (
                    <div
                      key={item.label}
                      className={`absolute left-1/2 top-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}
                      style={{
                        transform: isRadialOpen
                          ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                          : "translate(-50%, -50%)",
                        transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
                      }}
                    >
                      <button
                        className="group relative flex flex-col items-center"
                        onClick={() => {
                          item.onClick?.()
                          setIsRadialOpen(false)
                        }}
                      >
                        <div
                          className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.color} shadow-lg ${item.shadowColor} flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 border-2 border-white/30`}
                        >
                          {Icon && (typeof Icon === "function" || typeof Icon === "object") ? (
                            <Icon className="w-5 h-5 text-white drop-shadow-sm" />
                          ) : (
                            (Icon as any)
                          )}
                        </div>
                      </button>
                    </div>
                  )
                })}

                {radialItems.map((item, index) => {
                  const { x, y } = getItemPosition(index, radialItems.length)

                  return (
                    <div
                      key={`text-${item.label}`}
                      className={`absolute left-1/2 top-1/2 z-[60] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}
                      style={{
                        transform: isRadialOpen
                          ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px - 22px))`
                          : "translate(-50%, -50%)",
                        transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
                      }}
                    >
                      <CurvedText text={item.label} index={index} />
                    </div>
                  )
                })}

                <div
                  className={`mobile-navbar-button relative w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 dark:from-purple-600 dark:to-indigo-600 shadow-lg shadow-orange-400/40 dark:shadow-purple-500/40 border-4 border-white dark:border-purple-500/30 overflow-hidden z-[55] transition-all duration-300 ${
                    !showScrollTop ? "hover:scale-105 active:scale-95" : ""
                  }`}
                >
                  {showScrollTop || isExiting ? (
                    <div
                      className={`flex flex-col h-full w-full ${isExiting ? "animate-out fade-out zoom-out-95 duration-400 ease-in fill-mode-forwards" : ""}`}
                    >
                      <button
                        className="flex-1 w-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                        onClick={() => !isListening && setIsRadialOpen(!isRadialOpen)}
                        disabled={isListening}
                      >
                        <Plus
                          className={`w-6 h-6 text-white transition-all duration-300 transform translate-y-1 ${
                            isRadialOpen ? "rotate-45 scale-90" : "rotate-0 scale-100"
                          }`}
                          strokeWidth={4}
                        />
                      </button>

                      <div className="h-[2px] w-full bg-white/0" />

                      <button
                        className="flex-1 w-full flex items-center justify-center relative overflow-hidden active:scale-90"
                        onClick={handleScrollButtonClick}
                      >
                        <div
                          className={`absolute w-10 h-10 bg-emerald-500/80 rounded-full flex items-center justify-center mt-5 shadow-lg shadow-emerald-500/30 ${isExiting ? "animate-out fade-out zoom-out slide-out-to-bottom-4 duration-300 ease-in fill-mode-forwards" : "animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 ease-out"}`}
                        />
                        {ripples.map((ripple) => (
                          <div
                            key={ripple.id}
                            className="absolute rounded-full bg-white/30 pointer-events-none animate-pulse"
                            style={{
                              left: `${ripple.x}px`,
                              top: `${ripple.y}px`,
                              width: "8px",
                              height: "8px",
                              transform: "translate(-50%, -50%)",
                              animation: `ripple-expand 0.6s ease-out forwards`,
                            }}
                          />
                        ))}
                        <ArrowBigUpDash
                          className={`relative z-10 w-5 h-5 text-white ${isExiting ? "animate-out fade-out zoom-out slide-out-to-bottom-2 duration-300 ease-in" : "animate-in fade-in zoom-in slide-in-from-bottom-2 duration-700 delay-150 ease-out"}`}
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  ) : (
              <button
                data-voice-button
                className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-300 select-none"
                onClick={() => !isListening && setIsRadialOpen(!isRadialOpen)}
                onMouseDown={handlePlusButtonMouseDown}
                onMouseUp={handlePlusButtonMouseUp}
                onMouseLeave={handlePlusButtonMouseUp}
                onTouchStart={handlePlusButtonTouchStart}
                onTouchEnd={handlePlusButtonTouchEnd}
                disabled={isListening}
              >
                      <Plus
                        className={`w-9 h-9 text-white transition-all duration-300 ${
                          isRadialOpen ? "rotate-45 scale-90" : "rotate-0 scale-100"
                        }`}
                        strokeWidth={3}
                      />
                    </button>
                  )}
                </div>
              </div>

              <NavItem icon={TvMinimalPlay} name="tv" activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
              <NavItem icon={User} name="user" activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
              <NavItem icon={Menu} name="menu" activeNav={activeNav} setActiveNav={setActiveNav} onMenuClick={handleMenuButtonClick} toggleSideMenu={toggleSideMenu} />
            </>
          )}
        </div>
      </nav>

      {!isMobileHeaderBottom && (
        <div className="fixed bottom-8 right-8 z-50 max-w-md mx-auto">
          <div className="relative w-16 h-16">
            <div
              className={`radial-glow absolute inset-0 rounded-full transition-all duration-500 ${
                isRadialOpen
                  ? "bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 dark:from-purple-600 dark:via-indigo-500 dark:to-purple-700 blur-xl opacity-60 dark:opacity-50 scale-150"
                  : "bg-orange-400/30 dark:bg-purple-600/20 blur-md opacity-100 scale-100"
              }`}
            />

            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] rounded-full border-2 border-dashed border-white/20 dark:border-purple-500/30 transition-all duration-500 ${
                isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            />

            {radialItems.map((item, index) => {
              const Icon = item.icon
              const { x, y } = getItemPosition(index, radialItems.length)

              return (
                <div
                  key={item.label}
                  className={`absolute left-1/2 top-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{
                    transform: isRadialOpen
                      ? `translate(calc(-50% + ${-x}px), calc(-50% + ${y}px))`
                      : "translate(-50%, -50%)",
                    transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
                  }}
                >
                  <button
                    className="group relative flex flex-col items-center"
                    onClick={() => {
                      item.onClick?.()
                      setIsRadialOpen(false)
                    }}
                  >
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.color} shadow-lg ${item.shadowColor} flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 border-2 border-white/30`}
                    >
                      {Icon && (typeof Icon === "function" || typeof Icon === "object") ? (
                        <Icon className="w-5 h-5 text-white drop-shadow-sm" />
                      ) : (
                        (Icon as any)
                      )}
                    </div>
                  </button>
                </div>
              )
            })}

            {radialItems.map((item, index) => {
              const { x, y } = getItemPosition(index, radialItems.length)

              return (
                <div
                  key={`text-${item.label}`}
                  className={`absolute left-1/2 top-1/2 z-[60] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isRadialOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{
                    transform: isRadialOpen
                      ? `translate(calc(-50% + ${-x}px), calc(-50% + ${y}px - 22px))`
                      : "translate(-50%, -50%)",
                    transitionDelay: isRadialOpen ? `${index * 60}ms` : "0ms",
                  }}
                >
                  <CurvedText text={item.label} index={index} />
                </div>
              )
            })}

            <div
              className={`mobile-navbar-button absolute bottom-0 right-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 dark:from-violet-500 dark:to-purple-700 shadow-lg shadow-orange-400/40 dark:shadow-violet-500/40 border-4 border-white dark:border-gray-800 overflow-hidden z-[55] transition-all duration-300 flex items-center justify-center`}
            >
              {showScrollTop || isExiting ? (
                <div
                  className={`flex flex-col h-full w-full ${isExiting ? "animate-out fade-out zoom-out-95 duration-400 ease-in fill-mode-forwards" : ""}`}
                >
                  <button
                    className="flex-1 w-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                    onClick={() => !isListening && setIsRadialOpen(!isRadialOpen)}
                    onMouseDown={handlePlusButtonMouseDown}
                    onMouseUp={handlePlusButtonMouseUp}
                    onMouseLeave={handlePlusButtonMouseUp}
                    onTouchStart={handlePlusButtonTouchStart}
                    onTouchEnd={handlePlusButtonTouchEnd}
                    disabled={isListening}
                  >
                    <Plus
                      className={`w-6 h-6 text-white transition-all duration-300 transform translate-y-1 ${
                        isRadialOpen ? "rotate-45 scale-90" : "rotate-0 scale-100"
                      }`}
                      strokeWidth={4}
                    />
                  </button>

                  <div className="h-[2px] w-full bg-white/0" />

                  <button
                    className="flex-1 w-full flex items-center justify-center relative overflow-hidden active:scale-90"
                    onClick={handleScrollButtonClick}
                  >
                    <div
                      className={`absolute w-10 h-10 bg-emerald-500/80 rounded-full flex items-center justify-center mt-5 shadow-lg shadow-emerald-500/30 ${isExiting ? "animate-out fade-out zoom-out slide-out-to-bottom-4 duration-300 ease-in fill-mode-forwards" : "animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 ease-out"}`}
                    />
                    {ripples.map((ripple) => (
                      <div
                        key={ripple.id}
                        className="absolute rounded-full bg-white/30 pointer-events-none animate-pulse"
                        style={{
                          left: `${ripple.x}px`,
                          top: `${ripple.y}px`,
                          width: "8px",
                          height: "8px",
                          transform: "translate(-50%, -50%)",
                          animation: `ripple-expand 0.6s ease-out forwards`,
                        }}
                      />
                    ))}
                    <ArrowBigUpDash
                      className={`relative z-10 w-5 h-5 text-white ${isExiting ? "animate-out fade-out zoom-out slide-out-to-bottom-2 duration-300 ease-in" : "animate-in fade-in zoom-in slide-in-from-bottom-2 duration-700 delay-150 ease-out"}`}
                      strokeWidth={2.5}
                    />
                  </button>
                </div>
              ) : (
                <button
                  className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-300"
                  onClick={() => !isListening && setIsRadialOpen(!isRadialOpen)}
                  onMouseDown={handlePlusButtonMouseDown}
                  onMouseUp={handlePlusButtonMouseUp}
                  onMouseLeave={handlePlusButtonMouseUp}
                  onTouchStart={handlePlusButtonTouchStart}
                  onTouchEnd={handlePlusButtonTouchEnd}
                  disabled={isListening}
                >
                  <Plus
                    className={`w-9 h-9 text-white transition-all duration-300 ${
                      isRadialOpen ? "rotate-45 scale-90" : "rotate-0 scale-100"
                    }`}
                    strokeWidth={3}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <VoiceInputOverlay 
        isListening={isListening} 
        transcript={transcript}
        onClose={() => {
          if (isListening) {
            stopListening()
          }
        }}
      />
    </>
  )
}
