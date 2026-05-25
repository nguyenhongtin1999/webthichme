import type React from "react"
import {
  ChevronRight,
  Brain,
  Puzzle,
  Music,
  Microscope,
  Cpu,
  Activity,
  Home,
  Package,
  Gift,
  Tag,
  User,
  LogIn,
  Bell,
  Heart,
  MessageCircle,
  Users,
  Flame,
  Sparkles,
  Crown,
  HelpCircle,
  ImageIcon,
  ImagePlus,
  Laugh,
} from "lucide-react"

interface SearchResult {
  type: "user" | "product" | "category" | "menu" | "trend" | "entertainment" | "subscription" | "help" | "tool"
  name: string
  url: string
  icon?: string
  thumbnail?: string
  avatar?: string
  username?: string
  fullName?: string
}

interface SearchDropdownProps {
  results: SearchResult[]
  query: string
  isOpen: boolean
  isLoading: boolean
  highlightText: (text: string, query: string) => string
  getTypeLabel: (type: string) => string
  isMobileHeaderBottom?: boolean
  isDarkMode?: boolean
}

function getLucideIcon(iconName?: string) {
  if (!iconName) return null

  const iconMap: { [key: string]: React.ReactNode } = {
    brain: <Brain className="w-6 h-6" />,
    puzzle: <Puzzle className="w-6 h-6" />,
    music: <Music className="w-6 h-6" />,
    microscope: <Microscope className="w-6 h-6" />,
    cpu: <Cpu className="w-6 h-6" />,
    activity: <Activity className="w-6 h-6" />,
    home: <Home className="w-6 h-6" />,
    package: <Package className="w-6 h-6" />,
    gift: <Gift className="w-6 h-6" />,
    tag: <Tag className="w-6 h-6" />,
    user: <User className="w-6 h-6" />,
    "log-in": <LogIn className="w-6 h-6" />,
    bell: <Bell className="w-6 h-6" />,
    heart: <Heart className="w-6 h-6" />,
    "message-circle": <MessageCircle className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    flame: <Flame className="w-6 h-6" />,
    sparkles: <Sparkles className="w-6 h-6" />,
    crown: <Crown className="w-6 h-6" />,
    "help-circle": <HelpCircle className="w-6 h-6" />,
    "image-plus": <ImagePlus className="w-6 h-6" />,
    image: <ImageIcon className="w-6 h-6" />,
    laugh: <Laugh className="w-6 h-6" />,
  }

  return iconMap[iconName] || null
}

export function SearchDropdown({
  results,
  query,
  isOpen,
  isLoading,
  highlightText,
  getTypeLabel,
  isMobileHeaderBottom,
  isDarkMode = false,
}: SearchDropdownProps) {
  if (!isOpen || results.length === 0) return null

  const containerBg = isDarkMode ? "bg-[#1e1b2e]" : "bg-white"
  const containerBorder = isDarkMode ? "border-[#3d3450]" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-[#2d2640]" : "hover:bg-gray-100"
  const textPrimary = isDarkMode ? "text-gray-100" : "text-gray-900"
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600"
  const textTertiary = isDarkMode ? "text-gray-500" : "text-gray-500"
  const loadingText = isDarkMode ? "text-gray-300" : "text-gray-500"

  const darkModeStyle = isDarkMode
    ? {
        background: "linear-gradient(135deg, #1e1b4b 0%, #1f2937 100%)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(20px)",
      }
    : {}

  return (
    <div className={`fixed top-16 left-0 z-50 md:hidden ${isMobileHeaderBottom ? "right-12" : "right-40"}`}>
      <div className="mx-4">
        <div
          className={`${!isDarkMode ? containerBg : ""} ${!isDarkMode ? "border " + containerBorder : ""} rounded-lg shadow-lg max-h-96 overflow-y-auto`}
          style={darkModeStyle}
        >
          {isLoading ? (
            <div className={`p-4 text-center ${loadingText}`}>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <span className="mt-2 block">Đang tìm kiếm...</span>
            </div>
          ) : (
            results.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className={`block py-3 px-4 ${hoverBg} flex items-center border-b ${isDarkMode ? "border-[#3d3450]" : "border-gray-200"} last:border-b-0 transition-colors`}
              >
                {item.type === "user" ? (
                  <img
                    src={item.avatar || "/placeholder.svg"}
                    alt={item.username}
                    className={`w-12 h-12 object-cover rounded-full mr-4 border-2 ${isDarkMode ? "border-indigo-600" : "border-orange-200"}`}
                  />
                ) : item.type === "product" ? (
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md mr-4"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 mr-4 ${isDarkMode ? "text-indigo-400" : "text-orange-500"} flex items-center justify-center`}
                  >
                    {getLucideIcon(item.icon)}
                  </div>
                )}

                <div className="flex-1">
                  {item.type === "user" ? (
                    <>
                      <div
                        className={`font-medium text-base ${textPrimary}`}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(item.name, query),
                        }}
                      />
                      <div
                        className={`text-sm ${textSecondary}`}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(
                            item.fullName || "",
                            query.startsWith("@") ? query.substring(1) : query,
                          ),
                        }}
                      />
                      <div className={`text-xs ${textTertiary}`}>{getTypeLabel(item.type)}</div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`font-medium text-base ${textPrimary}`}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(item.name, query),
                        }}
                      />
                      <div className={`text-xs ${textTertiary}`}>{getTypeLabel(item.type)}</div>
                    </>
                  )}
                </div>

                <ChevronRight className={`w-5 h-5 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchDropdown
