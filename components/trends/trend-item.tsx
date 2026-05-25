"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

export default function TrendItem({ item }: { item: any }) {
  const [selectedStyle, setSelectedStyle] = useState("")
  const [surveySubmitted, setSurveySubmitted] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState("")
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const glassEffectClasses =
    "glass-effect bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg overflow-hidden transition-all hover:shadow-xl hover:bg-white/25"

  const animationClasses = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStyle) {
      alert(`Cảm ơn bạn đã chọn phong cách ${selectedStyle}!`)
      setSurveySubmitted(true)
    } else {
      alert("Vui lòng chọn một phong cách!")
    }
  }

  const handleQuizSubmit = () => {
    if (quizAnswer) {
      if (quizAnswer === "b") {
        alert("Chính xác! BTS là viết tắt của Bangtan Sonyeondan.")
      } else {
        alert("Rất tiếc, đáp án chưa chính xác. Hãy thử lại nhé!")
      }
      setQuizSubmitted(true)
    } else {
      alert("Vui lòng chọn một đáp án!")
    }
  }

  const handleChallenge = () => {
    alert("Chúc mừng bạn đã tham gia thử thách 30 ngày sống xanh! Hãy theo dõi email để nhận hướng dẫn chi tiết nhé.")
  }

  const handleMeditation = () => {
    alert("Hãy tìm một nơi yên tĩnh, ngồi thoải mái và tập trung vào hơi thở của bạn trong 5 phút.")
  }

  const isTitleShort = (title: string) => title.length < 30

  const getGridRowSpan = (title: string) => {
    return isTitleShort(title) ? "row-span-1" : ""
  }

  switch (item.type) {
    case "article":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out ${getGridRowSpan(item.title)} trend-item`}
          data-aos="fade-up"
        >
          {item.image && (
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-32 object-cover" />
          )}
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 mb-2 flex-grow">{item.description}</p>
            <a href={item.link} className="text-orange-500 hover:underline text-sm mt-auto">
              Đọc tiếp
            </a>
          </div>
        </div>
      )

    case "video":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="relative pb-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={item.video}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 mb-2 flex-grow">{item.description}</p>
          </div>
        </div>
      )

    case "survey":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <form onSubmit={handleSurveySubmit} className="space-y-2">
              {item.options.map((option: string) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="style"
                    value={option}
                    checked={selectedStyle === option}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="form-radio text-orange-500"
                  />
                  <span className="text-sm text-gray-600">{option}</span>
                </label>
              ))}
              <button
                type="submit"
                className="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors w-full"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      )

    case "tips":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 flex-grow">
              {item.tips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ol>
          </div>
        </div>
      )

    case "quiz":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <div className="space-y-2 flex-grow">
              <p className="text-sm font-medium text-gray-600">{item.description}</p>
              <div className="space-y-1">
                {["Big Time Singers", "Bangtan Sonyeondan", "Best Top Stars"].map((answer, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="q1"
                      value={String.fromCharCode(97 + index)}
                      checked={quizAnswer === String.fromCharCode(97 + index)}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      className="form-radio text-orange-500"
                    />
                    <span className="text-sm text-gray-600">{answer}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={handleQuizSubmit}
              className="mt-2 bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors w-full"
            >
              Kiểm tra
            </button>
          </div>
        </div>
      )

    case "hashtags":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <div className="flex flex-wrap gap-2 flex-grow">
              {[
                { tag: "#OOTD", bg: "bg-orange-100", text: "text-orange-800" },
                { tag: "#TikTokMadeMeBuyIt", bg: "bg-blue-100", text: "text-blue-800" },
                { tag: "#SelfCare", bg: "bg-green-100", text: "text-green-800" },
                { tag: "#WFH", bg: "bg-purple-100", text: "text-purple-800" },
                { tag: "#FoodPorn", bg: "bg-pink-100", text: "text-pink-800" },
                { tag: "#Wanderlust", bg: "bg-yellow-100", text: "text-yellow-800" },
              ].map((item, i) => (
                <span
                  key={i}
                  className={`hashtag ${item.bg} ${item.text} px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:scale-110 transition-transform`}
                >
                  {item.tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )

    case "challenge":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description}</p>
            <button
              onClick={handleChallenge}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors w-full mt-auto"
            >
              Tham gia ngay
            </button>
          </div>
        </div>
      )

    case "meditation":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description}</p>
            <button
              onClick={handleMeditation}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors w-full mt-auto"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      )

    case "podcasts":
      return (
        <div
          ref={ref}
          className={`${glassEffectClasses} ${animationClasses} transition-all duration-500 ease-out trend-item`}
          data-aos="fade-up"
        >
          <div className="content p-4 flex flex-col">
            <h2 className={`font-semibold mb-2 text-gray-800 ${isTitleShort(item.title) ? "text-base" : "text-lg"}`}>
              {item.title}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 flex-grow">
              {[
                "Chuyện Đêm Muộn",
                "Gõ Cửa Thăm Nhà",
                "Tri Kỷ Cảm Xúc",
                "Sunhuyn Radio",
                "Đắp Chăn Nằm Nghe Tun Kể",
              ].map((podcast, i) => (
                <li key={i}>{podcast}</li>
              ))}
            </ul>
          </div>
        </div>
      )

    default:
      return null
  }
}
