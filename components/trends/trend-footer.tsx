"use client"

import { ArrowUp, ChevronRight } from "lucide-react"

export default function TrendFooter() {
  const socialLinks = [
    {
      icon: (
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
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 10v4h3v7h4v-7h3l1-4h-4v-2a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2h-3"
          />
        </svg>
      ),
      label: "Facebook",
    },
    {
      icon: (
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
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v.01" />
        </svg>
      ),
      label: "Instagram",
    },
    {
      icon: (
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
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"
          />
        </svg>
      ),
      label: "TikTok",
    },
    {
      icon: (
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
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-8z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 9l5 3l-5 3z" />
        </svg>
      ),
      label: "YouTube",
    },
  ]

  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="font-bold text-2xl mb-4 text-gray-800 border-b-2 border-orange-500 pb-2 inline-block">
              Cửa Hàng Vô Tri
            </h3>
            <p className="text-gray-600">
              Liên tục cập nhật các xu hướng và phong cách sống hiện đại. Chúng tôi cung cấp thông tin, sản phẩm và dịch
              vụ mới nhất để bạn luôn cập nhật với thế giới không ngừng thay đổi.
            </p>
            <a href="/" className="text-orange-500 hover:text-orange-600 underline inline-flex items-center">
              <span>Về Trang Chủ</span>
              <ArrowUp className="ml-1 w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-2xl mb-4 text-gray-800 border-b-2 border-orange-500 pb-2 inline-block">
              Kết nối với chúng tôi
            </h3>
            <div className="flex space-x-6">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-600 hover:text-orange-500 transition-colors transform hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-600 italic">Theo dõi chúng tôi để nhận những thông tin mới nhất!</p>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-2xl mb-4 text-gray-800 border-b-2 border-orange-500 pb-2 inline-block">
              Chính Sách
            </h3>
            <ul className="text-gray-600 space-y-3">
              {[
                "Chính sách đổi trả",
                "Chính sách bảo mật thông tin",
                "Chính sách vận chuyển",
                "Điều khoản sử dụng",
              ].map((item, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-orange-500 transition-colors flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4 text-orange-500" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-gray-500">
          <p>&copy; 2025 Cửa Hàng Vô Tri</p>
        </div>
      </div>
    </footer>
  )
}
