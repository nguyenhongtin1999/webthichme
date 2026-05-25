"use client"

import type React from "react"

import { ChevronRight, Facebook, Instagram, Youtube, Mail, Phone, MapPin, ArrowUp, Heart } from "lucide-react"
import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"

export default function RewardsFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const { isDarkMode } = useTheme()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      className={`py-12 border-t-2 ${isDarkMode ? "bg-gradient-to-b from-indigo-950 to-slate-900 border-indigo-500/30" : "bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200"}`}
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3
              className={`font-bold text-xl border-b-2 pb-2 inline-block ${isDarkMode ? "text-indigo-400 border-indigo-500/50" : "text-orange-600 border-orange-500"}`}
            >
              Về Chúng Tôi
            </h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              Cửa Hàng Vô Tri - Nơi mang đến niềm vui và sự sáng tạo cho trẻ em thông qua đồ chơi thông minh và giáo
              dục.
            </p>
            <div className="space-y-3 pt-2">
              <div className={`flex items-center space-x-3 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                <MapPin className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`} />
                <span className="text-sm">Hà Nội, Việt Nam</span>
              </div>
              <div className={`flex items-center space-x-3 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                <Phone className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`} />
                <a
                  href="tel:+84123456789"
                  className={`text-sm transition-colors ${isDarkMode ? "hover:text-indigo-400" : "hover:text-orange-500"}`}
                >
                  +84 (123) 456-789
                </a>
              </div>
              <div className={`flex items-center space-x-3 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                <Mail className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`} />
                <a
                  href="mailto:info@votri.com"
                  className={`text-sm transition-colors ${isDarkMode ? "hover:text-indigo-400" : "hover:text-orange-500"}`}
                >
                  info@votri.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3
              className={`font-bold text-xl border-b-2 pb-2 inline-block ${isDarkMode ? "text-indigo-400 border-indigo-500/50" : "text-orange-600 border-orange-500"}`}
            >
              Kết Nối Với Chúng Tôi
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              Theo dõi chúng tôi để nhận những thông tin mới nhất!
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className={`transition-colors transform hover:scale-110 duration-200 ${isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className={`transition-colors transform hover:scale-110 duration-200 ${isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className={`transition-colors transform hover:scale-110 duration-200 ${isDarkMode ? "text-slate-400 hover:text-indigo-400" : "text-gray-600 hover:text-orange-500"}`}
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3
              className={`font-bold text-xl border-b-2 pb-2 inline-block ${isDarkMode ? "text-indigo-400 border-indigo-500/50" : "text-orange-600 border-orange-500"}`}
            >
              Chính Sách
            </h3>
            <ul className={`space-y-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              <li>
                <a
                  href="/policies/return"
                  className={`transition-colors flex items-center space-x-2 text-sm group ${isDarkMode ? "hover:text-indigo-400" : "hover:text-orange-500"}`}
                >
                  <ChevronRight
                    className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}
                  />
                  <span>Chính sách đổi trả</span>
                </a>
              </li>
              <li>
                <a
                  href="/policies/privacy"
                  className={`transition-colors flex items-center space-x-2 text-sm group ${isDarkMode ? "hover:text-indigo-400" : "hover:text-orange-500"}`}
                >
                  <ChevronRight
                    className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}
                  />
                  <span>Chính sách bảo mật</span>
                </a>
              </li>
              <li>
                <a
                  href="/policies/shipping"
                  className={`transition-colors flex items-center space-x-2 text-sm group ${isDarkMode ? "hover:text-indigo-400" : "hover:text-orange-500"}`}
                >
                  <ChevronRight
                    className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}
                  />
                  <span>Chính sách vận chuyển</span>
                </a>
              </li>
              <li>
                <a
                  href="/policies/terms"
                  className={`transition-colors flex items-center space-x-2 text-sm group ${isDarkMode ? "hover:text-indigo-400" : "hover:text-orange-500"}`}
                >
                  <ChevronRight
                    className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}
                  />
                  <span>Điều khoản sử dụng</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3
              className={`font-bold text-xl border-b-2 pb-2 inline-block ${isDarkMode ? "text-indigo-400 border-indigo-500/50" : "text-orange-600 border-orange-500"}`}
            >
              Bản Tin
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              Đăng ký để nhận ưu đãi độc quyền và tin tức mới!
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? "bg-slate-700 border-indigo-500/30 text-slate-100 focus:ring-indigo-500 placeholder:text-slate-400" : "bg-white border-orange-300 focus:ring-orange-500"}`}
                required
              />
              <button
                type="submit"
                className={`w-full px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${isDarkMode ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}
              >
                {subscribed ? "✓ Đã đăng ký!" : "Đăng ký"}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t pt-8 ${isDarkMode ? "border-indigo-500/30" : "border-orange-200"}`}>
          {/* Payment Methods & Trust Badges */}
          <div
            className={`flex flex-col md:flex-row items-center justify-between mb-6 pb-6 border-b ${isDarkMode ? "border-indigo-500/30" : "border-orange-200"}`}
          >
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p
                className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
              >
                Phương thức thanh toán
              </p>
              <div className="flex justify-center md:justify-start space-x-3">
                <span
                  className={`px-2 py-1 rounded border text-xs ${isDarkMode ? "bg-slate-700 border-indigo-500/30 text-slate-200" : "bg-white border-orange-200 text-gray-700"}`}
                >
                  💳 Thẻ
                </span>
                <span
                  className={`px-2 py-1 rounded border text-xs ${isDarkMode ? "bg-slate-700 border-indigo-500/30 text-slate-200" : "bg-white border-orange-200 text-gray-700"}`}
                >
                  📱 Ví
                </span>
                <span
                  className={`px-2 py-1 rounded border text-xs ${isDarkMode ? "bg-slate-700 border-indigo-500/30 text-slate-200" : "bg-white border-orange-200 text-gray-700"}`}
                >
                  🏦 Chuyển khoản
                </span>
              </div>
            </div>
            <button
              onClick={scrollToTop}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${isDarkMode ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}
              aria-label="Scroll to top"
            >
              <span>Lên đầu trang</span>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p
              className={`text-sm flex items-center justify-center space-x-1 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
            >
              <span>&copy; 2025 Cửa Hàng Vô Tri. Tất cả các quyền được bảo lưu.</span>
              <Heart className="h-4 w-4 text-red-500" />
            </p>
            <p className={`text-xs mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Thiết kế và phát triển bởi{" "}
              <span className={`font-semibold ${isDarkMode ? "text-indigo-400" : "text-orange-500"}`}>Vô Tri Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
