"use client"

import type React from "react"
import Link from "next/link"
import {
  Heart,
  Smartphone,
  FileText,
  PlayCircle,
  Play,
  Bookmark,
  Trash2,
  Percent,
  Sparkles,
  TrendingUp,
  Flame,
  Star,
  Crown,
  Clock,
} from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { Button } from "@/components/ui/button"
import { RemoveConfirmationModal } from "@/components/remove-confirmation-modal"
import { useState } from "react"
import "../styles/favorites.css"

interface ConfirmationModalProps {
  isOpen: boolean
  type: "favorite" | "saved" | "app"
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationModal({ isOpen, type, itemName, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null

  const getModalConfig = () => {
    switch (type) {
      case "favorite":
        return {
          icon: <Heart className="w-10 h-10 text-red-500" />,
          bgColor: "bg-red-50 dark:bg-red-950/20",
          title: "Xóa khỏi yêu thích?",
          message: `Bạn có chắc muốn xóa "${itemName}" khỏi danh sách yêu thích?`,
          confirmText: "Xóa",
          confirmClass: "bg-red-500 hover:bg-red-600",
        }
      case "saved":
        return {
          icon: <Bookmark className="w-10 h-10 text-blue-500" />,
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          title: "Bỏ lưu?",
          message: `Bạn có chắc chắn muốn bỏ lưu "${itemName}"?`,
          confirmText: "Bỏ lưu",
          confirmClass: "bg-blue-500 hover:bg-blue-600",
        }
      case "app":
        return {
          icon: <Smartphone className="w-10 h-10 text-orange-500" />,
          bgColor: "bg-orange-50 dark:bg-orange-950/20",
          title: "Xóa khỏi yêu thích?",
          message: `Bạn có chắc muốn xóa "${itemName}" khỏi danh sách yêu thích?`,
          confirmText: "Xóa",
          confirmClass: "bg-orange-500 hover:bg-orange-600",
        }
    }
  }

  const config = getModalConfig()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 max-w-sm mx-4 transform transition-all duration-300 scale-100">
        <div className={`flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-full mx-auto mb-4`}>
          {config.icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground text-center mb-2">{config.title}</h3>
        <p className="text-muted-foreground text-center mb-6">{config.message}</p>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
            Hủy
          </Button>
          <Button onClick={onConfirm} className={`flex-1 text-white ${config.confirmClass}`}>
            <Trash2 className="w-4 h-4 mr-2" />
            {config.confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function FavoritesPanel({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const {
    favoriteProducts,
    favoriteApps,
    favoriteArticles,
    favoriteVideos,
    activeTab,
    savedFilter,
    currentUser,
    hasMoreProducts,
    hasMoreApps,
    hasMoreArticles,
    hasMoreVideos,
    setActiveTab,
    setSavedFilter,
    removeFavorite,
    formatDate,
  } = useFavorites()

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    icon: React.ReactNode
    title: string
    confirmText: string
    itemName: string
    itemId: number
    itemType: string
    buttonColor?: "orange" | "blue" | "red"
    iconWrapperColor?: "orange" | "blue" | "red"
  }>({
    isOpen: false,
    icon: null,
    title: "",
    confirmText: "",
    itemName: "",
    itemId: 0,
    itemType: "",
    buttonColor: "orange",
    iconWrapperColor: "orange",
  })

  const handleRemoveFavorite = (id: number, type: string, name: string) => {
    let icon, title, confirmText, buttonColor, iconWrapperColor

    if (type === "product") {
      icon = <Heart className="w-8 sm:w-10 h-8 sm:h-10 text-red-500" />
      title = "Xóa khỏi yêu thích?"
      confirmText = "Xóa"
      buttonColor = "red"
      iconWrapperColor = "red"
    } else if (type === "app") {
      icon = <Smartphone className="w-8 sm:w-10 h-8 sm:h-10 text-orange-500" />
      title = "Xóa khỏi yêu thích?"
      confirmText = "Xóa"
      buttonColor = "orange"
      iconWrapperColor = "orange"
    } else {
      icon = <Bookmark className="w-8 sm:w-10 h-8 sm:h-10 text-blue-500" />
      title = "Bỏ lưu?"
      confirmText = "Bỏ lưu"
      buttonColor = "blue"
      iconWrapperColor = "blue"
    }

    setConfirmModal({
      isOpen: true,
      icon,
      title,
      confirmText,
      itemName: name,
      itemId: id,
      itemType: type,
      buttonColor,
      iconWrapperColor,
    })
  }

  const confirmRemove = () => {
    removeFavorite(confirmModal.itemId, confirmModal.itemType)
    setConfirmModal({ ...confirmModal, isOpen: false })
  }

  const cancelRemove = () => {
    setConfirmModal({ ...confirmModal, isOpen: false })
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      percent: Percent,
      sparkles: Sparkles,
      "trending-up": TrendingUp,
      flame: Flame,
      star: Star,
      crown: Crown,
      clock: Clock,
    }
    const IconComponent = iconMap[iconName] || Star
    return <IconComponent className="w-3 h-3" />
  }

  const renderProducts = () => {
    if (favoriteProducts.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
          <p>Chưa có sản phẩm yêu thích nào</p>
        </div>
      )
    }

    const displayedProducts = favoriteProducts.slice(0, 15)
    const remainingCount = favoriteProducts.length - 15

    return (
      <div className="max-h-60 overflow-y-auto">
        {displayedProducts.map((item) => (
          <div key={item.id} className="favorite-item px-4 pt-4 pb-2 border-b border-border">
            <div className="flex items-center">
              <div className="relative w-16 h-16 flex-shrink-0 mr-4">
                {item.original_price && item.discount_percent && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white font-bold px-1 py-0.5 rounded-br-md shadow-sm z-10 text-xs">
                    -{item.discount_percent}%
                  </div>
                )}
                <div className="w-full h-full overflow-hidden rounded-lg shadow-sm">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.price.toLocaleString("vi-VN")} ₫
                  {item.original_price && (
                    <span className="text-muted-foreground/70 line-through text-xs ml-1">
                      {item.original_price.toLocaleString("vi-VN")} ₫
                    </span>
                  )}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="product-tags flex flex-wrap justify-start gap-0 mt-2 mb-0">
                    {item.tags.map((tag, index) => (
                      <span key={index} className={`product-tag ${tag.color} ${index > 0 ? "-ml-1" : ""}`}>
                        {getIconComponent(tag.icon)}
                        <span>{tag.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleRemoveFavorite(item.id, "product", item.name)}
                className="remove-favorite-btn frosted-glass text-red-500 hover:text-red-600 transition-colors"
              >
                <Heart className="h-6 w-6 fill-current" />
              </button>
            </div>
          </div>
        ))}
        {hasMoreProducts && (
          <div className="p-4 text-center text-muted-foreground border-t border-border bg-muted/30 dark:bg-gray-800/40">
            <p className="text-sm">
              Còn {remainingCount} sản phẩm khác,{" "}
              <button
                onClick={() => (window.location.href = "/trangchu")}
                className="text-orange-500 font-medium cursor-pointer hover:text-orange-600 hover:underline transition-colors"
              >
                chuyển đến trang chính
              </button>{" "}
              để xem thêm
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderApps = () => {
    if (favoriteApps.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <Smartphone className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
          <p>Chưa có ứng dụng hoặc game mini yêu thích nào</p>
        </div>
      )
    }

    const displayedApps = favoriteApps.slice(0, 15)
    const remainingCount = favoriteApps.length - 15

    return (
      <div className="max-h-60 overflow-y-auto">
        {displayedApps.map((app) => (
          <div key={app.id} className="favorite-item px-4 pt-4 pb-2 border-b border-border">
            <div className="flex items-start">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-muted flex items-center justify-center">
                {app.icon ? (
                  <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-full h-full object-cover" />
                ) : (
                  <Smartphone className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-foreground">{app.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{app.description || "Ứng dụng/Game mini"}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {app.type || "App"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFavorite(app.id, "app", app.name)}
                className="remove-favorite-btn frosted-glass text-red-500 hover:text-red-600 transition-colors"
              >
                <Heart className="h-6 w-6 fill-current" />
              </button>
            </div>
          </div>
        ))}
        {hasMoreApps && (
          <div className="p-4 text-center text-muted-foreground border-t border-border bg-muted/30 dark:bg-gray-800/40">
            <p className="text-sm">
              Còn {remainingCount} ứng dụng và game mini khác,{" "}
              <button
                onClick={() => (window.location.href = "/trangchu")}
                className="text-orange-500 font-medium cursor-pointer hover:text-orange-600 hover:underline transition-colors"
              >
                chuyển đến trang chính
              </button>{" "}
              để xem thêm
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderSavedItems = () => {
    const currentItems = savedFilter === "articles" ? favoriteArticles : favoriteVideos
    const hasMore = savedFilter === "articles" ? hasMoreArticles : hasMoreVideos

    if (currentItems.length === 0) {
      const emptyMessage = savedFilter === "articles" ? "Chưa có bài viết nào được lưu" : "Chưa có video nào được lưu"
      const EmptyIcon = savedFilter === "articles" ? FileText : PlayCircle

      return (
        <div className="p-4 text-center text-muted-foreground">
          <EmptyIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
          <p>{emptyMessage}</p>
        </div>
      )
    }

    const displayedItems = currentItems.slice(0, 15)
    const remainingCount = currentItems.length - 15

    return (
      <div className="max-h-60 overflow-y-auto">
        {savedFilter === "articles" ? (
          <>
            {displayedItems.map((article) => (
              <div key={article.id} className="favorite-item px-4 pt-4 pb-2 border-b border-border">
                <div className="flex items-start">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow pr-2">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{article.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{article.excerpt}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(article.id, "article", article.title)}
                        className="remove-favorite-btn frosted-glass text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0"
                      >
                        <Bookmark className="h-6 w-6 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {displayedItems.map((video) => (
              <div key={video.id} className="favorite-item px-4 pt-4 pb-2 border-b border-border">
                <div className="flex items-start">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="video-play-overlay">
                      <div className="video-play-button">
                        <Play className="video-play-icon" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow pr-2">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{video.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            {video.duration} • {video.views} lượt xem
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(video.id, "video", video.title)}
                        className="remove-favorite-btn frosted-glass text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0"
                      >
                        <Bookmark className="h-6 w-6 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {hasMore && (
          <div className="p-4 text-center text-muted-foreground border-t border-border bg-muted/30 dark:bg-gray-800/40">
            <p className="text-sm">
              Còn {remainingCount} nội dung khác,{" "}
              <button
                onClick={() => (window.location.href = "/trangchu")}
                className="text-orange-500 font-medium cursor-pointer hover:text-orange-600 hover:underline transition-colors"
              >
                chuyển đến trang chính
              </button>{" "}
              để xem thêm
            </p>
          </div>
        )}
      </div>
    )
  }

  const hasItemsInCurrentTab = () => {
    switch (activeTab) {
      case "products":
        return favoriteProducts.length > 0
      case "apps":
        return favoriteApps.length > 0
      case "saved":
        const currentItems = savedFilter === "articles" ? favoriteArticles : favoriteVideos
        return currentItems.length > 0
      default:
        return false
    }
  }

  if (!currentUser) {
    return (
      <div className="login-prompt p-4 flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mb-4 text-center">Vui lòng đăng nhập để xem danh sách yêu thích.</p>
        <Link
          href="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 inline-block"
        >
          Đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <RemoveConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={`Bạn có chắc chắn muốn ${confirmModal.confirmText.toLowerCase()} "${confirmModal.itemName}"?`}
        itemName={confirmModal.itemName}
        onConfirm={confirmRemove}
        onCancel={cancelRemove}
        isDarkMode={isDarkMode}
        confirmText={confirmModal.confirmText}
        icon={confirmModal.icon}
        buttonColor={confirmModal.buttonColor}
        iconWrapperColor={confirmModal.iconWrapperColor}
      />

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
            activeTab === "products"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Sản phẩm
        </button>
        <button
          onClick={() => setActiveTab("apps")}
          className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
            activeTab === "apps"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Apps
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
            activeTab === "saved"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Đã lưu
        </button>
      </div>

      {/* Content - flex-grow to take remaining space */}
      <div className="flex-grow">
        {activeTab === "products" && renderProducts()}
        {activeTab === "apps" && renderApps()}
        {activeTab === "saved" && (
          <div>
            <div className="px-4 py-3 border-b border-border">
              <div className="relative bg-muted dark:bg-white/10 rounded-lg p-1 flex max-w-full overflow-hidden">
                <div
                  className={`absolute top-1 left-1 w-1/2 h-7 bg-orange-500 dark:bg-gray-600 rounded-md transition-transform duration-300 ease-in-out ${
                    savedFilter === "videos" ? "transform translate-x-full" : ""
                  }`}
                  style={{
                    width: "calc(50% - 4px)",
                    transform: savedFilter === "videos" ? "translateX(calc(100% + 0px))" : "translateX(0)",
                  }}
                />
                <button
                  onClick={() => setSavedFilter("articles")}
                  className={`relative z-10 flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors duration-300 min-w-0 ${
                    savedFilter === "articles" ? "text-white" : "text-foreground dark:text-slate-300"
                  }`}
                >
                  <FileText className="w-3 h-3 mr-1.5 inline-block flex-shrink-0" />
                  <span className="truncate">Bài viết</span>
                </button>
                <button
                  onClick={() => setSavedFilter("videos")}
                  className={`relative z-10 flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors duration-300 min-w-0 ${
                    savedFilter === "videos" ? "text-white" : "text-foreground dark:text-slate-300"
                  }`}
                >
                  <PlayCircle className="w-3 h-3 mr-1.5 inline-block flex-shrink-0" />
                  <span className="truncate">Video</span>
                </button>
              </div>
            </div>
            {renderSavedItems()}
          </div>
        )}
      </div>

      {hasItemsInCurrentTab() && (
        <div className="border-t border-border dark:bg-transparent">
          <button
            onClick={() => (window.location.href = "/favorites")}
            className="w-full p-4 text-center text-base font-semibold transition-colors hover:bg-accent text-orange-500 dark:text-purple-300 dark:hover:text-purple-200"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  )
}
