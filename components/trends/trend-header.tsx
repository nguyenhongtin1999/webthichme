"use client"

import { useEffect, useState } from "react"

export default function TrendHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="mb-12">
      <h1
        className={`text-6xl font-bold text-center mb-2 text-white transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
      >
        Xu Hướng Mới Nhất
      </h1>
      <p
        className={`text-xl text-center mb-8 text-white opacity-80 transition-all duration-700 delay-300 ${
          mounted ? "opacity-80 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        Khám phá và cập nhật những trào lưu đang gây sốt
      </p>
    </div>
  )
}
