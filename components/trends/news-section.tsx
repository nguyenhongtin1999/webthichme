"use client"

import { useEffect, useState } from "react"
import { Newspaper, Clock, ChevronRight } from "lucide-react"

export default function NewsSection() {
  const [newsItems] = useState([
    { title: "Công nghệ AI mới nhất: GPT-4 Turbo ra mắt", time: "Mới nhất" },
    { title: "Xu hướng thời trang mùa thu 2024: Sự trở lại của Y2K", time: "5 phút trước" },
    { title: "Top 5 ứng dụng học ngoại ngữ hiệu quả nhất", time: "15 phút trước" },
    { title: "Bí quyết làm việc từ xa hiệu quả trong thời đại số", time: "30 phút trước" },
    { title: "Khám phá 10 điểm du lịch hot nhất năm 2024", time: "1 giờ trước" },
  ])

  useEffect(() => {
    const newsFeed = document.getElementById("newsFeed")
    if (!newsFeed) return

    let currentScroll = 0
    const scrollAmount = 300

    const scrollInterval = setInterval(() => {
      if (currentScroll >= (newsItems.length - 1) * scrollAmount) {
        currentScroll = 0
        newsFeed.scrollTo({ left: currentScroll, behavior: "auto" })
      } else {
        currentScroll += scrollAmount
        newsFeed.scrollTo({ left: currentScroll, behavior: "smooth" })
      }
    }, 3000)

    return () => clearInterval(scrollInterval)
  }, [newsItems])

  return (
    <div className="mt-12 glass-effect p-6 rounded-lg" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Tin Tức Cập Nhật Mới</h2>
      <div id="newsFeed" className="news-scroll flex overflow-x-auto gap-4 pb-4">
        {newsItems.map((item, i) => (
          <div
            key={i}
            className="news-item flex-shrink-0 w-72 bg-gradient-to-br from-white to-gray-100 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 flex flex-col h-full"
          >
            <div className="flex items-start mb-2">
              <Newspaper className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" />
              <h3 className="font-semibold text-gray-800 flex-grow">{item.title}</h3>
            </div>
            <div className="flex justify-between items-center text-sm mt-auto">
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {item.time}
              </span>
              <a href="#" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center group">
                Đọc thêm
                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
