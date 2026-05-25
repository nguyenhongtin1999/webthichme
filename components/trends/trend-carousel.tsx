"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    Swiper?: any
  }
}

export default function TrendCarousel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const initSwiper = async () => {
      if (typeof window !== "undefined" && !window.Swiper) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"
        script.onload = () => {
          if (window.Swiper) {
            new window.Swiper(".swiper", {
              loop: true,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
              },
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
              autoplay: {
                delay: 5000,
              },
            })
          }
        }
        document.head.appendChild(script)

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"
        document.head.appendChild(link)
      }
    }

    initSwiper()
  }, [])

  const slides = [
    { alt: "Xu hướng thời trang", label: "Xu hướng thời trang", image: "https://picsum.photos/800/600?random=6" },
    { alt: "Âm nhạc thịnh hành", label: "Âm nhạc thịnh hành", image: "https://picsum.photos/800/600?random=7" },
    { alt: "Công nghệ mới", label: "Công nghệ mới", image: "https://picsum.photos/800/600?random=8" },
    { alt: "Ẩm thực độc đáo", label: "Ẩm thực độc đáo", image: "https://picsum.photos/800/600?random=9" },
  ]

  return (
    <div
      className={`mb-12 rounded-xl overflow-hidden transition-all duration-700 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="swiper">
        <div className="swiper-wrapper">
          {slides.map((slide, index) => (
            <div key={index} className="swiper-slide">
              <img src={slide.image || "/placeholder.svg"} alt={slide.alt} />
              <span>{slide.label}</span>
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>
    </div>
  )
}
