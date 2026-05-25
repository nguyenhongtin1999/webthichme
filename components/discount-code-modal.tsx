"use client"
import { useState } from "react"
import { X, Search, TicketPercent, Truck, Package, UserPlus, TicketX, Check, Zap, Flame, Eye } from "lucide-react"

interface DiscountCodeModalProps {
  isOpen: boolean
  onClose: () => void
  currentItemId: number | null
  selectedCodes: any[]
  onSelectCode: (code: any) => void
  onRemoveCode: (codeId: string) => void
  onApply: () => void
  isDarkMode: boolean
  availableCodes: any[]
}

export default function DiscountCodeModal({
  isOpen,
  onClose,
  currentItemId,
  selectedCodes,
  onSelectCode,
  onRemoveCode,
  onApply,
  isDarkMode,
  availableCodes,
}: DiscountCodeModalProps) {
  const [codeFilter, setCodeFilter] = useState("all")
  const [codeSearchTerm, setCodeSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("available") // "available" or "hunting"
  const [huntingCodes] = useState([
    {
      id: "SUMMER20",
      name: "SUMMER20",
      description: "Giảm 20% cho đơn hàng trên 500K",
      type: "discount",
      icon: "ticket-percent",
      color: "bg-red-100",
      textColor: "text-red-700",
      viewCount: 2500,
      usageLimit: 5000,
      usageCount: 3200,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "SHIP50K",
      name: "SHIP50K",
      description: "Freeship đơn trên 50K",
      type: "shipping",
      icon: "truck",
      color: "bg-green-100",
      textColor: "text-green-700",
      viewCount: 1800,
      usageLimit: 3000,
      usageCount: 2100,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "LASTDAY",
      name: "LASTDAY",
      description: "Giảm 15% toàn bộ",
      type: "discount",
      icon: "ticket-percent",
      color: "bg-red-100",
      textColor: "text-red-700",
      viewCount: 900,
      usageLimit: 2000,
      usageCount: 1950,
      expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const getFilteredCodes = () => {
    let filtered = availableCodes

    if (codeFilter !== "all") {
      filtered = filtered.filter((code) => code.type === codeFilter)
    }

    if (codeSearchTerm) {
      filtered = filtered.filter(
        (code) =>
          code.name.toLowerCase().includes(codeSearchTerm.toLowerCase()) ||
          code.description.toLowerCase().includes(codeSearchTerm.toLowerCase()),
      )
    }

    return filtered
  }

  const toggleCodeSelection = (code: any) => {
    if (selectedCodes.some((c) => c.id === code.id)) {
      onRemoveCode(code.id)
    } else {
      onSelectCode(code)
    }
  }

  const addCodeFromHunting = (huntingCode: any) => {
    if (selectedCodes.some((c) => c.id === huntingCode.id)) {
      onRemoveCode(huntingCode.id)
    } else {
      onSelectCode(huntingCode)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const getDaysLeft = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft
  }

  const getUrgencyBadge = (daysLeft: number) => {
    if (daysLeft <= 0)
      return { text: "Hết hạn", color: isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700" }
    if (daysLeft <= 2)
      return { text: `Còn ${daysLeft} ngày`, color: isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700" }
    if (daysLeft <= 7)
      return {
        text: `Còn ${daysLeft} ngày`,
        color: isDarkMode ? "bg-orange-900 text-orange-200" : "bg-orange-100 text-orange-700",
      }
    return {
      text: `Còn ${daysLeft} ngày`,
      color: isDarkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-700",
    }
  }

  if (!isOpen) return null

  return (
    <div
      id="codeModal"
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={`w-full max-w-md mx-auto animate-fade-in overflow-y-auto max-h-[90vh] rounded-xl shadow-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex justify-between items-center sticky top-0 z-10 ${
            isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Mã giảm giá</h3>
          <button
            id="closeCodeModal"
            onClick={onClose}
            className={`transition-colors p-1 rounded-lg ${
              isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`p-3 border-b flex gap-2 sticky top-14 z-9 ${
            isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "available"
                ? isDarkMode
                  ? "bg-purple-700 text-white"
                  : "bg-purple-100 text-purple-700"
                : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TicketPercent className="w-4 h-4" />
              <span>Có sẵn</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("hunting")}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors relative ${
              activeTab === "hunting"
                ? isDarkMode
                  ? "bg-purple-700 text-white"
                  : "bg-purple-100 text-purple-700"
                : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-4 h-4" />
              <span>Săn mã</span>
            </div>
          </button>
        </div>

        {/* Search and Filters */}
        {activeTab === "available" && (
          <div className={`p-4 border-b ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <div className="relative mb-3">
              <input
                type="text"
                id="codeSearchInput"
                placeholder="Tìm mã giảm giá..."
                value={codeSearchTerm}
                onChange={(e) => setCodeSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-purple-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500"
                }`}
              />
              <Search
                className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "discount", "shipping"].map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1 text-sm font-medium rounded-lg border transition-colors ${
                    codeFilter === filter
                      ? `${isDarkMode ? "bg-purple-600 border-purple-600 text-white" : "bg-purple-500 text-white border-purple-500"}`
                      : `${
                          isDarkMode
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`
                  }`}
                  onClick={() => setCodeFilter(filter)}
                >
                  {filter === "all" ? "Tất cả" : filter === "discount" ? "Giảm giá" : "Freeship"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div
          id="codeListContainer"
          className={`p-4 max-h-60 overflow-y-auto ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
        >
          {activeTab === "available" ? (
            // Available Codes Tab
            getFilteredCodes().length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <TicketX className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-300"}`} />
                <p className="font-medium">Không tìm thấy mã giảm giá nào</p>
                <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Hãy thử từ khóa khác hoặc chuyển sang tab "Săn mã"
                </p>
              </div>
            ) : (
              getFilteredCodes().map((code) => {
                const isSelected = selectedCodes.some((c) => c.id === code.id)
                const isDisabled = selectedCodes.length >= 2 && !isSelected
                const daysLeft = getDaysLeft(code.expiryDate)
                const urgency = getUrgencyBadge(daysLeft)

                return (
                  <div
                    key={code.id}
                    className={`p-3 border rounded-lg mb-3 transition-all cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? "border-purple-500 bg-purple-900/30"
                          : "border-purple-400 bg-purple-50"
                        : isDarkMode
                          ? "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                          : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !isDisabled && toggleCodeSelection(code)}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${code.color}`}>
                          {code.icon === "ticket-percent" && <TicketPercent className={`w-5 h-5 ${code.textColor}`} />}
                          {code.icon === "truck" && <Truck className={`w-5 h-5 ${code.textColor}`} />}
                          {code.icon === "package" && <Package className={`w-5 h-5 ${code.textColor}`} />}
                          {code.icon === "user-plus" && <UserPlus className={`w-5 h-5 ${code.textColor}`} />}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {code.name}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {code.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? "bg-purple-500" : "bg-purple-500"}`}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className={`inline-block px-2 py-1 rounded-full font-medium ${urgency.color}`}>
                        {urgency.text}
                      </span>
                      {code.usageCount !== undefined && code.usageLimit !== undefined && (
                        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Đã sử dụng {code.usageCount}/{code.usageLimit}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )
          ) : (
            // Code Hunting Tab
            <div className="space-y-3">
              <div
                className={`p-4 rounded-lg border-l-4 ${isDarkMode ? "bg-purple-900/30 border-purple-500" : "bg-purple-50 border-purple-400"}`}
              >
                <div className="flex gap-2">
                  <Zap className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                  <div>
                    <p className={`font-semibold text-sm ${isDarkMode ? "text-purple-200" : "text-purple-900"}`}>
                      Khám phá mã mới
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-purple-300/80" : "text-purple-700"}`}>
                      Những mã đang hot từ cộng đồng. Thêm vào mục "Có sẵn" để sử dụng.
                    </p>
                  </div>
                </div>
              </div>

              {huntingCodes.map((huntingCode) => {
                const isSelected = selectedCodes.some((c) => c.id === huntingCode.id)
                const isDisabled = selectedCodes.length >= 2 && !isSelected
                const daysLeft = getDaysLeft(huntingCode.expiryDate)
                const urgency = getUrgencyBadge(daysLeft)
                const usagePercentage = (huntingCode.usageCount / huntingCode.usageLimit) * 100

                return (
                  <div
                    key={huntingCode.id}
                    className={`p-3 border rounded-lg transition-all ${
                      isSelected
                        ? isDarkMode
                          ? "border-purple-500 bg-purple-900/30"
                          : "border-purple-400 bg-purple-50"
                        : isDarkMode
                          ? "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                          : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {huntingCode.name}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              huntingCode.viewCount > 2000
                                ? isDarkMode
                                  ? "bg-orange-900/50 text-orange-300"
                                  : "bg-orange-100 text-orange-700"
                                : isDarkMode
                                  ? "bg-blue-900/50 text-blue-300"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            <Eye className="w-3 h-3" />
                            {huntingCode.viewCount > 1000
                              ? `${Math.round(huntingCode.viewCount / 1000)}K`
                              : huntingCode.viewCount}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {huntingCode.description}
                        </p>
                      </div>
                      <button
                        onClick={() => !isDisabled && addCodeFromHunting(huntingCode)}
                        disabled={isDisabled}
                        className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? isDarkMode
                              ? "bg-purple-600 text-white"
                              : "bg-purple-500 text-white"
                            : isDarkMode
                              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        {isSelected ? "Đã thêm" : "Thêm"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full font-medium ${urgency.color}`}>{urgency.text}</span>
                      <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Sử dụng: {huntingCode.usageCount}/{huntingCode.usageLimit}
                      </span>
                    </div>

                    <div className="w-full bg-gray-300 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-orange-500" : "bg-green-500"
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
          <div className="mb-3">
            <p className={`text-sm mb-2 font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Đã chọn:{" "}
              <span id="selectedCodesCount" className="text-purple-500">
                {selectedCodes.length}
              </span>
              /2 mã
            </p>
            <div id="selectedCodesList" className="flex flex-wrap gap-2 min-h-8">
              {selectedCodes.map((code) => (
                <div
                  key={code.id}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${code.color} ${code.textColor}`}
                >
                  {code.icon === "ticket-percent" && <TicketPercent className="w-3 h-3" />}
                  {code.icon === "truck" && <Truck className="w-3 h-3" />}
                  {code.icon === "package" && <Package className="w-3 h-3" />}
                  {code.icon === "user-plus" && <UserPlus className="w-3 h-3" />}
                  <span>{code.name}</span>
                  <button
                    className={`ml-1 rounded-full w-4 h-4 flex items-center justify-center transition-colors ${
                      isDarkMode ? "hover:bg-white/20" : "hover:bg-white/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveCode(code.id)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              id="cancelCodeSelection"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                isDarkMode
                  ? "bg-gray-600 border border-gray-500 text-gray-200 hover:bg-gray-500"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Hủy bỏ
            </button>
            <button
              id="applySelectedCodes"
              onClick={onApply}
              disabled={selectedCodes.length === 0 || activeTab !== "available"}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                selectedCodes.length === 0 || activeTab !== "available"
                  ? isDarkMode
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
