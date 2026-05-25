"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Bell,
  Zap,
  AlertTriangle,
  X,
  Monitor,
  Smartphone,
  Palette,
  Save,
  Send,
} from "lucide-react"

interface Notification {
  id: number
  title: string
  content: string
  type: "global" | "user"
  category: "activity" | "system" | "transaction"
  icon: string
  startDate: string
  endDate: string | null
  status: "active" | "scheduled" | "expired"
  primaryColor: string
  secondaryColor: string
  showDateTime: boolean
  recipientUsernames?: string[] // Changed to array to support multiple users
}

interface AutomatedRule {
  id: string
  name: string
  triggerEvent: string
  template: string
  icon: string
  primaryColor: string
  secondaryColor: string
  isEnabled: boolean
}

interface Draft {
  id: number
  title: string
  content: string
  type: "global" | "user"
  icon: string
  startDate: string
  endDate: string
  enableEndDate: boolean
  primaryColor: string
  secondaryColor: string
  showDateTime: boolean
  savedAt: string
  recipientUsernames?: string[] // Changed to array to support multiple users
}

interface ColorCombination {
  id: string
  primaryColor: string
  secondaryColor: string
}

interface User {
  username: string
  name: string
}

const iconOptions = [
  { value: "bell", label: "Chuông", icon: Bell },
  { value: "zap", label: "Sét", icon: Zap },
  { value: "alert-triangle", label: "Cảnh báo", icon: AlertTriangle },
]

const categoryOptions = [
  { value: "activity", label: "Hoạt Động", color: "#ef4444" },
  { value: "system", label: "Hệ Thống", color: "#3b82f6" },
  { value: "transaction", label: "Giao Dịch", color: "#10b981" },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [automatedRules, setAutomatedRules] = useState<AutomatedRule[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [showAutomatedModal, setShowAutomatedModal] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AutomatedRule | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "global" | "user">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "scheduled" | "expired">("all")
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<User[]>([])
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])

  // Color presets state
  const [colorCombinations, setColorCombinations] = useState<ColorCombination[]>([])
  const [showColorPresets, setShowColorPresets] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "global" as "global" | "user",
    category: "activity" as "activity" | "system" | "transaction",
    icon: "bell",
    startDate: "",
    endDate: "",
    enableEndDate: false,
    primaryColor: "#f97316",
    secondaryColor: "#ffffff",
    showDateTime: false,
    recipientUsernames: [] as string[], // Changed to array for multiple users
  })

  // Automated rule form state
  const [ruleFormData, setRuleFormData] = useState({
    name: "",
    triggerEvent: "new_user_registration",
    template: "",
    icon: "bell",
    primaryColor: "#4f46e5",
    secondaryColor: "#ffffff",
    isEnabled: true,
  })

  useEffect(() => {
    loadNotifications()
    loadAutomatedRules()
    loadDrafts()
    loadColorCombinations()
    loadUsers()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchQuery, typeFilter, statusFilter])

  useEffect(() => {
    if (userSearchQuery.startsWith("@")) {
      const query = userSearchQuery.substring(1).toLowerCase()
      const results = allUsers.filter(
        (user) =>
          (user.username.toLowerCase().includes(query) || user.name.toLowerCase().includes(query)) &&
          !formData.recipientUsernames.includes(user.username), // Exclude already selected users
      )
      setUserSearchResults(results)
    } else {
      setUserSearchResults([])
    }
  }, [userSearchQuery, allUsers, formData.recipientUsernames])

  const loadUsers = () => {
    const stored = localStorage.getItem("users")
    if (stored) {
      const parsed = JSON.parse(stored)
      const users = parsed.map((user: any) => ({
        username: user.username,
        name: user.name,
      }))
      setAllUsers(users)
    }
  }

  const loadNotifications = () => {
    const stored = localStorage.getItem("notifications")
    if (stored) {
      const parsed = JSON.parse(stored)
      setNotifications(parsed)
    }
  }

  const loadAutomatedRules = () => {
    const stored = localStorage.getItem("automated_rules")
    if (stored) {
      const parsed = JSON.parse(stored)
      setAutomatedRules(parsed)
    }
  }

  const loadDrafts = () => {
    const stored = localStorage.getItem("notification_drafts")
    if (stored) {
      const parsed = JSON.parse(stored)
      setDrafts(parsed)
    }
  }

  const loadColorCombinations = () => {
    const stored = localStorage.getItem("color_combinations")
    if (stored) {
      const parsed = JSON.parse(stored)
      setColorCombinations(parsed)
    } else {
      const defaultColors: ColorCombination[] = [
        { id: "1", primaryColor: "#f97316", secondaryColor: "#ffffff" },
        { id: "2", primaryColor: "#3b82f6", secondaryColor: "#ffffff" },
        { id: "3", primaryColor: "#10b981", secondaryColor: "#ffffff" },
        { id: "4", primaryColor: "#8b5cf6", secondaryColor: "#ffffff" },
        { id: "5", primaryColor: "#ef4444", secondaryColor: "#ffffff" },
      ]
      setColorCombinations(defaultColors)
      localStorage.setItem("color_combinations", JSON.stringify(defaultColors))
    }
  }

  const saveDraft = () => {
    const draft: Draft = {
      id: Date.now(),
      ...formData,
      savedAt: new Date().toISOString(),
    }

    const updatedDrafts = [draft, ...drafts]
    localStorage.setItem("notification_drafts", JSON.stringify(updatedDrafts))
    setDrafts(updatedDrafts)
    showToast("Đã lưu bản nháp", "success")
  }

  const editDraft = (draft: Draft) => {
    setFormData({
      title: draft.title,
      content: draft.content,
      type: draft.type,
      icon: draft.icon,
      startDate: draft.startDate,
      endDate: draft.endDate,
      enableEndDate: draft.enableEndDate,
      primaryColor: draft.primaryColor,
      secondaryColor: draft.secondaryColor,
      showDateTime: draft.showDateTime,
      recipientUsernames: draft.recipientUsernames || [], // Handle array
    })
    setShowModal(true)
  }

  const publishDraft = (draft: Draft) => {
    const now = new Date()
    const startDate = draft.startDate || now.toISOString()
    const endDate = draft.enableEndDate ? draft.endDate : null

    let status: "active" | "scheduled" | "expired" = "active"
    if (new Date(startDate) > now) {
      status = "scheduled"
    }

    const notification: Notification = {
      id: Date.now(),
      title: draft.title,
      content: draft.content,
      type: draft.type,
      icon: draft.icon,
      startDate,
      endDate,
      status,
      primaryColor: draft.primaryColor,
      secondaryColor: draft.secondaryColor,
      showDateTime: draft.showDateTime,
      recipientUsernames: draft.recipientUsernames, // Use array
    }

    const updatedNotifications = [notification, ...notifications]
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    setNotifications(updatedNotifications)

    window.dispatchEvent(new Event("notificationsUpdated"))

    // Remove draft after publishing
    deleteDraft(draft.id)
    showToast("Đã đăng thông báo từ bản nháp", "success")
  }

  const deleteDraft = (id: number) => {
    const updatedDrafts = drafts.filter((d) => d.id !== id)
    localStorage.setItem("notification_drafts", JSON.stringify(updatedDrafts)) // Fixed JSON.JSON.stringify
    setDrafts(updatedDrafts)
  }

  const filterNotifications = () => {
    let filtered = [...notifications]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((n) => {
        const now = new Date()
        const startDate = new Date(n.startDate)
        const endDate = n.endDate ? new Date(n.endDate) : null

        if (statusFilter === "active") {
          return startDate <= now && (!endDate || endDate >= now)
        } else if (statusFilter === "scheduled") {
          return startDate > now
        } else if (statusFilter === "expired") {
          return endDate && endDate < now
        }
        return true
      })
    }

    setFilteredNotifications(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.type === "user" && formData.recipientUsernames.length === 0) {
      showToast("Vui lòng chọn ít nhất một người dùng để gửi thông báo", "error")
      return
    }

    const now = new Date()
    const startDate = formData.startDate || now.toISOString()
    const endDate = formData.enableEndDate ? formData.endDate : null

    let status: "active" | "scheduled" | "expired" = "active"
    if (new Date(startDate) > now) {
      status = "scheduled"
    }

    const notification: Notification = {
      id: selectedNotification?.id || Date.now(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      category: formData.category,
      icon: formData.icon,
      startDate,
      endDate,
      status,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      showDateTime: formData.showDateTime,
      recipientUsernames: formData.type === "user" ? formData.recipientUsernames : undefined, // Only set for user-type
    }

    let updatedNotifications: Notification[]
    if (selectedNotification) {
      updatedNotifications = notifications.map((n) => (n.id === notification.id ? notification : n))
    } else {
      updatedNotifications = [notification, ...notifications]
    }

    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    setNotifications(updatedNotifications)

    window.dispatchEvent(new Event("notificationsUpdated"))

    closeModal()
    showToast(selectedNotification ? "Đã cập nhật thông báo" : "Đã tạo thông báo mới", "success")
  }

  const handleRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const rule: AutomatedRule = {
      id: selectedRule?.id || Date.now().toString(),
      name: ruleFormData.name,
      triggerEvent: ruleFormData.triggerEvent,
      template: ruleFormData.template,
      icon: ruleFormData.icon,
      primaryColor: ruleFormData.primaryColor,
      secondaryColor: ruleFormData.secondaryColor,
      isEnabled: ruleFormData.isEnabled,
    }

    let updatedRules: AutomatedRule[]
    if (selectedRule) {
      updatedRules = automatedRules.map((r) => (r.id === rule.id ? rule : r))
    } else {
      updatedRules = [...automatedRules, rule]
    }

    localStorage.setItem("automated_rules", JSON.stringify(updatedRules)) // Fixed JSON.JSON.stringify
    setAutomatedRules(updatedRules)
    closeAutomatedModal()
    showToast(selectedRule ? "Đã cập nhật quy tắc" : "Đã tạo quy tắc mới", "success")
  }

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification)
    setFormData({
      title: notification.title,
      content: notification.content,
      type: notification.type,
      icon: notification.icon,
      startDate: notification.startDate,
      endDate: notification.endDate || "",
      enableEndDate: !!notification.endDate,
      primaryColor: notification.primaryColor,
      secondaryColor: notification.secondaryColor,
      showDateTime: notification.showDateTime,
      recipientUsernames: notification.recipientUsernames || [], // Handle array
    })
    setShowModal(true)
  }

  const handleEditRule = (rule: AutomatedRule) => {
    setSelectedRule(rule)
    setRuleFormData({
      name: rule.name,
      triggerEvent: rule.triggerEvent,
      template: rule.template,
      icon: rule.icon,
      primaryColor: rule.primaryColor,
      secondaryColor: rule.secondaryColor,
      isEnabled: rule.isEnabled,
    })
    setShowAutomatedModal(true)
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteRule = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quy tắc này?")) {
      const updatedRules = automatedRules.filter((r) => r.id !== id)
      localStorage.setItem("automated_rules", JSON.stringify(updatedRules)) // Fixed JSON.JSON.stringify
      setAutomatedRules(updatedRules)
      showToast("Đã xóa quy tắc", "success")
    }
  }

  const handleToggleRule = (id: string, isEnabled: boolean) => {
    const updatedRules = automatedRules.map((r) => (r.id === id ? { ...r, isEnabled } : r))
    localStorage.setItem("automated_rules", JSON.stringify(updatedRules))
    setAutomatedRules(updatedRules)
    showToast(`Đã ${isEnabled ? "kích hoạt" : "vô hiệu hóa"} quy tắc`, "success")
  }

  const openCreateModal = () => {
    setSelectedNotification(null)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    setFormData({
      title: "",
      content: "",
      type: "global",
      category: "activity",
      icon: "bell",
      startDate: now.toISOString().slice(0, 16),
      endDate: tomorrow.toISOString().slice(0, 16),
      enableEndDate: false,
      primaryColor: "#ef4444",
      secondaryColor: "#ffffff",
      showDateTime: false,
      recipientUsernames: [], // Initialize as empty array
    })
    setUserSearchQuery("")
    setShowModal(true)
  }

  const openCreateRuleModal = () => {
    setSelectedRule(null)
    setRuleFormData({
      name: "",
      triggerEvent: "new_user_registration",
      template: "",
      icon: "bell",
      primaryColor: "#4f46e5",
      secondaryColor: "#ffffff",
      isEnabled: true,
    })
    setShowAutomatedModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedNotification(null)
    setUserSearchQuery("")
    setShowUserDropdown(false)
  }

  const closeAutomatedModal = () => {
    setShowAutomatedModal(false)
    setSelectedRule(null)
  }

  const showToast = (message: string, type: "success" | "error") => {
    // Simple toast implementation
    alert(message)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const getStatusBadge = (notification: Notification) => {
    const now = new Date()
    const startDate = new Date(notification.startDate)
    const endDate = notification.endDate ? new Date(notification.endDate) : null

    if (startDate > now) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Đã lên lịch</span>
      )
    } else if (endDate && endDate < now) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Hết hạn</span>
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Đang hoạt động
        </span>
      )
    }
  }

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find((i) => i.value === iconName)
    return icon ? icon.icon : Bell
  }

  const getEventName = (eventKey: string) => {
    const eventNames: Record<string, string> = {
      new_user_registration: "Đăng ký người dùng mới",
      order_completed: "Hoàn thành đơn hàng",
      product_status_update: "Cập nhật trạng thái sản phẩm",
      low_stock_alert: "Cảnh báo hàng tồn kho thấp",
      new_product_added: "Thêm sản phẩm mới",
    }
    return eventNames[eventKey] || eventKey
  }

  const confirmDelete = () => {
    if (deleteId) {
      const updatedNotifications = notifications.filter((n) => n.id !== deleteId)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      setNotifications(updatedNotifications)

      window.dispatchEvent(new Event("notificationsUpdated"))

      setShowDeleteModal(false)
      setDeleteId(null)
      showToast("Đã xóa thông báo", "success")
    }
  }

  // Color preset functions
  const saveColorCombination = () => {
    const newCombination: ColorCombination = {
      id: Date.now().toString(),
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
    }

    const updatedCombinations = [...colorCombinations, newCombination]
    localStorage.setItem("color_combinations", JSON.stringify(updatedCombinations))
    setColorCombinations(updatedCombinations)
    showToast("Đã lưu kết hợp màu mới", "success")
  }

  const deleteColorCombination = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kết hợp màu này?")) {
      const updatedCombinations = colorCombinations.filter((c) => c.id !== id)
      localStorage.setItem("color_combinations", JSON.stringify(updatedCombinations))
      setColorCombinations(updatedCombinations)
      showToast("Đã xóa kết hợp màu", "success")
    }
  }

  const applyColorCombination = (combination: ColorCombination) => {
    setFormData({
      ...formData,
      primaryColor: combination.primaryColor,
      secondaryColor: combination.secondaryColor,
    })
    setShowColorPresets(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý thông báo</h1>
          <p className="text-gray-600 text-sm mt-1">Tạo và quản lý thông báo cho người dùng</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={openCreateModal}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Tạo thông báo mới</span>
          </button>
          <button
            onClick={openCreateRuleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:inline">Tạo quy tắc mới</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tiêu đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại thông báo</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTypeFilter("all")}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  typeFilter === "all"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setTypeFilter("global")}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  typeFilter === "global"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Toàn hệ thống
              </button>
              <button
                onClick={() => setTypeFilter("user")}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  typeFilter === "user"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Người dùng
              </button>
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="hidden md:block bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 text-xs font-medium text-gray-500 uppercase">Thông báo</div>
            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Loại</div>
            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Danh mục</div>
            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Trạng thái</div>
            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">Thời gian</div>
            <div className="col-span-1 text-xs font-medium text-gray-500 uppercase">Thao tác</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Không có thông báo nào</div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const IconComponent = getIconComponent(notification.icon)
              const categoryInfo = categoryOptions.find((c) => c.value === notification.category)
              return (
                <div
                  key={notification.id}
                  className={`p-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
                >
                  <div className="md:grid md:grid-cols-12 md:gap-4 flex flex-col space-y-2 md:space-y-0 items-start md:items-center">
                    {/* Notification info */}
                    <div className="md:col-span-4 flex items-center gap-3 w-full">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: notification.primaryColor }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: notification.secondaryColor }} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium text-gray-900 truncate">{notification.title}</div>
                        <div className="text-sm text-gray-500 truncate">{notification.content}</div>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="md:col-span-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.type === "global" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {notification.type === "global"
                          ? "Toàn hệ thống"
                          : `${notification.recipientUsernames?.length || 0} người dùng`}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white`}
                        style={{ backgroundColor: categoryInfo?.color }}
                      >
                        {categoryInfo?.label}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">{getStatusBadge(notification)}</div>

                    {/* Time */}
                    <div className="md:col-span-2 text-sm text-gray-500">
                      <div>{formatDate(notification.startDate)}</div>
                      {notification.endDate && <div>đến {formatDate(notification.endDate)}</div>}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(notification)}
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Bản nháp đã lưu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {drafts.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">Chưa có bản nháp nào được lưu</div>
          ) : (
            drafts.map((draft) => {
              const IconComponent = getIconComponent(draft.icon)
              return (
                <div key={draft.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 truncate">{draft.title || "Bản nháp không có tiêu đề"}</h3>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(draft.savedAt)}</p>
                    <div className="mt-2 bg-gray-100 rounded p-2" style={{ maxHeight: "100px", overflowY: "auto" }}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: draft.primaryColor }}
                          >
                            <IconComponent className="w-4 h-4" style={{ color: draft.secondaryColor }} />
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="font-medium text-sm text-gray-900">{draft.title}</div>
                          <div className="text-xs text-gray-500 truncate">{draft.content}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {draft.type === "global"
                        ? "Toàn hệ thống"
                        : `${draft.recipientUsernames?.length || 0} người dùng`}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editDraft(draft)}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => publishDraft(draft)}
                        className="text-green-500 hover:text-green-600 transition-colors p-1"
                        title="Đăng ngay"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn xóa bản nháp này?")) {
                            deleteDraft(draft.id)
                            showToast("Đã xóa bản nháp", "success")
                          }
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Automated Notifications Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Thông báo tự động</h2>
          <button
            onClick={openCreateRuleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo quy tắc mới</span>
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {automatedRules.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Chưa có quy tắc tự động nào</div>
          ) : (
            automatedRules.map((rule) => {
              const IconComponent = getIconComponent(rule.icon)
              return (
                <div key={rule.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: rule.primaryColor }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: rule.secondaryColor }} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                        <p className="text-sm text-gray-500">{getEventName(rule.triggerEvent)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={rule.isEnabled}
                            onChange={(e) => handleToggleRule(rule.id, e.target.checked)}
                          />
                          <div
                            className={`w-10 h-5 rounded-full shadow-inner transition-colors ${
                              rule.isEnabled ? "bg-blue-500" : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-1 transition-transform ${
                              rule.isEnabled ? "transform translate-x-5" : ""
                            }`}
                          ></div>
                        </div>
                      </label>
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 ml-13">
                    <p className="text-sm text-gray-600">
                      <strong>Nội dung mẫu:</strong>
                    </p>
                    <p className="text-sm text-gray-800 mt-1">{rule.template}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedNotification ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại thông báo</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="global">Toàn hệ thống</option>
                      <option value="user">Người dùng cụ thể</option>
                    </select>
                  </div>

                  {formData.type === "user" && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm người dùng</label>
                      <input
                        type="text"
                        placeholder="Nhập @username để tìm kiếm..."
                        value={userSearchQuery}
                        onChange={(e) => {
                          setUserSearchQuery(e.target.value)
                          setShowUserDropdown(true)
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {formData.recipientUsernames.length > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {formData.recipientUsernames.map((username) => (
                              <div
                                key={username}
                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 px-2 py-1 rounded-full text-sm"
                              >
                                <span>@{username}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      recipientUsernames: formData.recipientUsernames.filter((u) => u !== username),
                                    })
                                  }}
                                  className="text-blue-600 hover:text-blue-800 ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {showUserDropdown && userSearchQuery.startsWith("@") && userSearchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {userSearchResults.map((user) => (
                            <button
                              key={user.username}
                              type="button"
                              onClick={() => {
                                if (!formData.recipientUsernames.includes(user.username)) {
                                  setFormData({
                                    ...formData,
                                    recipientUsernames: [...formData.recipientUsernames, user.username],
                                  })
                                }
                                setUserSearchQuery("")
                                setShowUserDropdown(false)
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">@{user.username}</div>
                              <div className="text-sm text-gray-500">{user.name}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const selected = categoryOptions.find((c) => c.value === e.target.value)
                        setFormData({
                          ...formData,
                          category: e.target.value as any,
                          primaryColor: selected?.color || formData.primaryColor,
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biểu tượng</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
                      <button
                        type="button"
                        onClick={() => setShowColorPresets(!showColorPresets)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Palette className="w-4 h-4" />
                        {showColorPresets ? "Ẩn bảng màu" : "Bảng màu"}
                      </button>
                    </div>

                    {showColorPresets && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {colorCombinations.map((combo) => (
                            <div key={combo.id} className="relative group">
                              <button
                                type="button"
                                onClick={() => applyColorCombination(combo)}
                                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-orange-500 transition-colors"
                                style={{
                                  background: `linear-gradient(135deg, ${combo.primaryColor} 50%, ${combo.secondaryColor} 50%)`,
                                }}
                                title="Áp dụng kết hợp màu này"
                              />
                              <button
                                type="button"
                                onClick={() => deleteColorCombination(combo.id)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                title="Xóa"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={saveColorCombination}
                            className="w-10 h-10 rounded-full border-2 border-dashed border-gray-400 hover:border-orange-500 flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
                            title="Lưu kết hợp màu hiện tại"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Nhấp vào màu để áp dụng, hoặc nhấp + để lưu màu hiện tại
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu chính</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-mono"
                            placeholder="#f97316"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu phụ</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                            className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.secondaryColor}
                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-mono"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={formData.enableEndDate}
                        onChange={(e) => setFormData({ ...formData, enableEndDate: e.target.checked })}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Đặt ngày kết thúc</span>
                    </label>
                    {formData.enableEndDate && (
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.showDateTime}
                        onChange={(e) => setFormData({ ...formData, showDateTime: e.target.checked })}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Hiển thị ngày giờ</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {selectedNotification ? "Cập nhật" : "Tạo mới"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        saveDraft()
                        closeModal()
                      }}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Lưu nháp
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>

                {/* Preview */}
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("desktop")}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          previewMode === "desktop"
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Monitor className="w-4 h-4 inline mr-1" />
                        Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("mobile")}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          previewMode === "mobile"
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        Mobile
                      </button>
                    </div>
                  </div>

                  <div className={`bg-gray-50 rounded-lg p-4 ${previewMode === "mobile" ? "max-w-xs mx-auto" : ""}`}>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          {(() => {
                            const IconComponent = getIconComponent(formData.icon)
                            return <IconComponent className="w-5 h-5" style={{ color: formData.secondaryColor }} />
                          })()}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium text-gray-900">{formData.title || "Tiêu đề thông báo"}</div>
                          <div className="text-sm text-gray-500">{formData.content || "Nội dung thông báo"}</div>
                          {formData.showDateTime && formData.startDate && (
                            <div className="text-xs text-gray-400 mt-1">
                              {formatDate(formData.startDate)}
                              {formData.enableEndDate && formData.endDate && ` - ${formatDate(formData.endDate)}`}
                            </div>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automated Rule Modal */}
      {showAutomatedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedRule ? "Chỉnh sửa quy tắc tự động" : "Tạo quy tắc tự động"}
                </h2>
                <button onClick={closeAutomatedModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleRuleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên quy tắc</label>
                  <input
                    type="text"
                    required
                    value={ruleFormData.name}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Chào mừng người dùng mới"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sự kiện kích hoạt</label>
                  <select
                    value={ruleFormData.triggerEvent}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, triggerEvent: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="new_user_registration">Đăng ký người dùng mới</option>
                    <option value="order_completed">Hoàn thành đơn hàng</option>
                    <option value="product_status_update">Cập nhật trạng thái sản phẩm</option>
                    <option value="low_stock_alert">Cảnh báo hàng tồn kho thấp</option>
                    <option value="new_product_added">Thêm sản phẩm mới</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung mẫu</label>
                  <textarea
                    required
                    rows={4}
                    value={ruleFormData.template}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, template: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sử dụng {{userName}} hoặc {{username}} để chèn tên người dùng"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Biến có sẵn: <code className="bg-gray-100 px-1 rounded">{"{{userName}}"}</code>,{" "}
                    <code className="bg-gray-100 px-1 rounded">{"{{username}}"}</code>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biểu tượng</label>
                  <select
                    value={ruleFormData.icon}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Màu chính</label>
                    <input
                      type="color"
                      value={ruleFormData.primaryColor}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, primaryColor: e.target.value })}
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Màu phụ</label>
                    <input
                      type="color"
                      value={ruleFormData.secondaryColor}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, secondaryColor: e.target.value })}
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ruleFormData.isEnabled}
                      onChange={(e) => setRuleFormData({ ...ruleFormData, isEnabled: e.target.checked })}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Kích hoạt quy tắc</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {selectedRule ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    type="button"
                    onClick={closeAutomatedModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
