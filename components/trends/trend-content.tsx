"use client"

import { useEffect } from "react"
import TrendHeader from "./trend-header"
import TrendCarousel from "./trend-carousel"
import TrendGrid from "./trend-grid"
import NewsSection from "./news-section"
import WordCloudSection from "./word-cloud-section"
import StatisticsSection from "./statistics-section"
import PersonalizedSection from "./personalized-section"
import TrendFooter from "./trend-footer"

const backgroundStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @keyframes changeBackground {
    0%, 100% { background-image: url('https://picsum.photos/1920/1080?random=1'); }
    25% { background-image: url('https://picsum.photos/1920/1080?random=2'); }
    50% { background-image: url('https://picsum.photos/1920/1080?random=3'); }
    75% { background-image: url('https://picsum.photos/1920/1080?random=4'); }
  }

  @keyframes slideDownFade {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes zoomInFade {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .trend-content-bg {
    font-family: 'Inter', sans-serif;
    background-image: url('https://picsum.photos/1920/1080?random=1');
    background-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    animation: changeBackground 30s infinite;
    min-height: 100vh;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }

  .swiper {
    width: 100%;
    height: 300px;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
    aspect-ratio: 4 / 3;
    overflow: hidden;
    position: relative;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  .swiper-slide span {
    position: relative;
    z-index: 10;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #f97316;
  }

  .swiper-pagination-bullet-active {
    background-color: #f97316;
  }

  .news-scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .news-scroll::-webkit-scrollbar {
    display: none;
  }

  .news-item {
    flex: 0 0 auto;
    scroll-snap-align: start;
    transition: all 0.3s ease;
  }

  .news-item:hover {
    transform: translateY(-5px);
  }

  .hashtag {
    transition: all 0.3s ease;
  }

  .hashtag:hover {
    transform: scale(1.05);
  }
`

let AOS: any = null
if (typeof window !== "undefined") {
  import("aos").then((module) => {
    AOS = module.default
  })
}

export default function TrendContent() {
  useEffect(() => {
    if (typeof window !== "undefined" && AOS) {
      AOS.init({
        duration: 1000,
        once: true,
      })
    }

    setTimeout(() => {
      if (AOS) {
        AOS.refresh()
      }
    }, 100)
  }, [])

  return (
    <>
      <style>{backgroundStyles}</style>
      <div className="min-h-screen custom-scrollbar trend-content-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />

        <main className="container mx-auto px-4 py-12 relative z-10">
          <TrendHeader />
          <TrendCarousel />
          <TrendGrid />
          <NewsSection />
          <WordCloudSection />
          <StatisticsSection />
          <PersonalizedSection />
        </main>

        <TrendFooter />
      </div>
    </>
  )
}
