"use client"

import { useState, useEffect } from "react"
import TrendItem from "./trend-item"

export default function TrendGrid() {
  const [items, setItems] = useState(initialTrendItems)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const setRandomSizes = () => {
      const trendItems = document.querySelectorAll(".trend-item")
      trendItems.forEach((item, index) => {
        if (typeof window !== "undefined" && window.innerWidth <= 640) {
          if (index % 4 === 1 || index % 4 === 2) {
            ;(item as HTMLElement).style.gridRow = "span 2"
          } else {
            ;(item as HTMLElement).style.gridRow = "span 1"
          }
        } else {
          ;(item as HTMLElement).style.gridRow = ""
        }
      })
    }

    setRandomSizes()
    window.addEventListener("resize", setRandomSizes)
    return () => window.removeEventListener("resize", setRandomSizes)
  }, [items])

  const handleLoadMore = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newItems = []
    for (let i = 0; i < 20; i++) {
      newItems.push({
        id: items.length + i,
        type: "article",
        title: `Xu hướng mới ${items.length + i + 1}`,
        description: "Mô tả ngắn về xu hướng mới. Nội dung này có thể dài hoặc ngắn tùy thuộc vào từng bài viết.",
        image: `https://picsum.photos/600/400?random=${page * 20 + i}`,
        link: "#",
      })
    }

    setItems([...items, ...newItems])
    setPage(page + 1)
    setIsLoading(false)
  }

  return (
    <div>
      <style>{`
        .trend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-gap: 1rem;
          grid-auto-flow: dense;
        }

        .trend-item {
          break-inside: avoid;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .trend-item .content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 640px) {
          .trend-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .trend-item:nth-child(4n-3),
          .trend-item:nth-child(4n) {
            grid-row: span 1;
          }

          .trend-item:nth-child(4n-2),
          .trend-item:nth-child(4n-1) {
            grid-row: span 2;
          }
        }
      `}</style>

      <div className="trend-grid">
        {items.map((item) => (
          <TrendItem key={item.id} item={item} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          Xem thêm
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
    </div>
  )
}

const initialTrendItems = [
  {
    id: 1,
    type: "article",
    title: "Xu hướng thời trang mùa hè 2024",
    description: "Khám phá phong cách nổi bật mùa hè.",
    image: "https://picsum.photos/600/400?random=1",
    link: "#",
  },
  {
    id: 2,
    type: "video",
    title: "Top 10 bài hát viral TikTok",
    description: "Cùng điểm qua những bản hit đang gây sốt.",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    type: "survey",
    title: "Bạn thích phong cách nào?",
    description: "",
    options: ["Tối giản", "Đường phố", "Cổ điển"],
  },
  {
    id: 4,
    type: "tips",
    title: "5 mẹo trang điểm tự nhiên",
    description: "",
    tips: [
      "Chuẩn bị da kỹ lưỡng",
      "Sử dụng kem nền mỏng nhẹ",
      "Tạo điểm nhấn cho mắt",
      "Chọn son môi màu tự nhiên",
      "Hoàn thiện với phấn má hồng",
    ],
  },
  {
    id: 5,
    type: "article",
    title: "Giải mã ngôn ngữ Gen Z",
    description: "Tìm hiểu ý nghĩa đằng sau slang phổ biến.",
    image: "https://picsum.photos/600/400?random=2",
    link: "#",
  },
  {
    id: 6,
    type: "quiz",
    title: "Quiz: Bạn biết gì về K-pop?",
    description: "BTS là viết tắt của gì?",
  },
  {
    id: 7,
    type: "article",
    title: "Sự trở lại của Y2K",
    description: "Kết hợp Y2K vào tủ đồ hiện đại.",
    image: "https://picsum.photos/600/400?random=3",
    link: "#",
  },
  {
    id: 8,
    type: "hashtags",
    title: "Hashtags thịnh hành",
    description: "",
  },
  {
    id: 9,
    type: "article",
    title: "Top 5 series Netflix hot",
    description: "Những bộ phim đang gây sốt.",
    image: "https://picsum.photos/600/400?random=4",
    link: "#",
  },
  {
    id: 10,
    type: "challenge",
    title: "Challenge: 30 ngày sống xanh",
    description: "Góp phần bảo vệ môi trường mỗi ngày.",
  },
  {
    id: 11,
    type: "article",
    title: "Công nghệ AI đang thay đổi cuộc sống",
    description: "Khám phá ứng dụng AI trong đời sống.",
    image: "https://picsum.photos/600/400?random=10",
    link: "#",
  },
  {
    id: 12,
    type: "article",
    title: "Xu hướng ẩm thực fusion",
    description: "Khám phá hương vị mới lạ.",
    image: "https://picsum.photos/600/400?random=11",
    link: "#",
  },
  {
    id: 13,
    type: "meditation",
    title: "5 phút thiền mỗi ngày",
    description: "Cải thiện sức khỏe tinh thần.",
  },
  {
    id: 14,
    type: "article",
    title: "Xu hướng làm việc từ xa",
    description: "Khám phá cách tối ưu hiệu suất khi làm việc tại nhà.",
    link: "#",
  },
  {
    id: 15,
    type: "article",
    title: "Du lịch xanh - Xu hướng mới",
    description: "Khám phá cách du lịch bền vững và thân thiện với môi trường.",
    image: "https://picsum.photos/600/400?random=12",
    link: "#",
  },
  {
    id: 16,
    type: "podcasts",
    title: "Podcast nổi bật tuần này",
    description: "",
  },
]
