"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ShoppingCart,
  Heart,
  ExternalLink,
  Bookmark,
  Play,
  Star,
  Flame,
  Sparkles,
  Crown,
  Clock,
  Percent,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  original_price?: number
  discount_percent?: number
  image: string
  tags?: ProductTag[]
}

interface ProductTag {
  id: string
  name: string
  color: string
  textColor: string
  icon: string
}

interface App {
  id: number
  name: string
  description: string
  icon: string
  type: string
}

interface Article {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  type: string
}

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  type: string
}

interface User {
  id: number
  username: string
  name: string
  email: string
  favorites: Product[]
  favoriteApps: App[]
  favoriteArticles: Article[]
  favoriteVideos: Video[]
  cart: (Product & { quantity: number; addedAt: string })[]
  isAdmin?: boolean
}

export default function TrangChu() {
  const [products, setProducts] = useState<Product[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const mockNotifications = {
    activity: [
      {
        id: "activity-1",
        title: "Bạn có hoạt động mới",
        content: "Người dùng Nguyễn Văn A đã thích sản phẩm của bạn",
        icon: "heart",
        category: "activity" as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: "activity-2",
        title: "Bình luận mới",
        content: "Trần Thị B đã bình luận về bài viết của bạn",
        icon: "message-circle",
        category: "activity" as const,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "activity-3",
        title: "Người theo dõi mới",
        content: "Lê Văn C đã theo dõi tài khoản của bạn",
        icon: "user-plus",
        category: "activity" as const,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    system: [
      {
        id: "system-1",
        title: "Bảo trì hệ thống",
        content: "Hệ thống sẽ bảo trì vào lúc 2:00 AM - 4:00 AM hôm nay",
        icon: "alert-circle",
        category: "system" as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: "system-2",
        title: "Cập nhật phiên bản mới",
        content: "Phiên bản 2.5.0 đã được phát hành với nhiều tính năng mới",
        icon: "package",
        category: "system" as const,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "system-3",
        title: "Thông báo bảo mật",
        content: "Vui lòng cập nhật mật khẩu của bạn để bảo vệ tài khoản",
        icon: "shield-alert",
        category: "system" as const,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
    transaction: [
      {
        id: "transaction-1",
        title: "Đơn hàng được xác nhận",
        content: "Đơn hàng #12345 của bạn đã được xác nhận và sẽ được giao sớm",
        icon: "check-circle",
        category: "transaction" as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: "transaction-2",
        title: "Thanh toán thành công",
        content: "Thanh toán 299.000 ₫ cho đơn hàng #12344 đã hoàn tất",
        icon: "credit-card",
        category: "transaction" as const,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "transaction-3",
        title: "Sản phẩm đã giao",
        content: "Đơn hàng #12343 đã được giao thành công",
        icon: "truck",
        category: "transaction" as const,
        createdAt: new Date(Date.now() - 604800000).toISOString(),
      },
    ],
  }

  const productTagTypes: Record<string, ProductTag> = {
    discount: {
      id: "discount",
      name: "Giảm giá",
      color: "bg-red-500",
      textColor: "text-white",
      icon: "percent",
    },
    new: {
      id: "new",
      name: "Hàng Mới",
      color: "bg-green-500",
      textColor: "text-white",
      icon: "sparkles",
    },
    trending: {
      id: "trending",
      name: "Thịnh Hành",
      color: "bg-blue-500",
      textColor: "text-white",
      icon: "trending-up",
    },
    hot: {
      id: "hot",
      name: "Hot Trend",
      color: "bg-orange-500",
      textColor: "text-white",
      icon: "flame",
    },
    bestseller: {
      id: "bestseller",
      name: "Bán Chạy",
      color: "bg-purple-500",
      textColor: "text-white",
      icon: "star",
    },
    exclusive: {
      id: "exclusive",
      name: "Độc Quyền",
      color: "bg-yellow-500",
      textColor: "text-black",
      icon: "crown",
    },
    limited: {
      id: "limited",
      name: "Giới Hạn",
      color: "bg-gray-600",
      textColor: "text-white",
      icon: "clock",
    },
  }

  useEffect(() => {
    // Initialize products data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Robot Thông Minh STEM",
        price: 299000,
        original_price: 399000,
        discount_percent: 25,
        image: "/robot-toy-for-kids.png",
        tags: [productTagTypes.new, productTagTypes.trending],
      },
      {
        id: 2,
        name: "Bộ Lego Sáng Tạo",
        price: 199000,
        image: "/colorful-lego-blocks.png",
        tags: [productTagTypes.hot, productTagTypes.bestseller],
      },
      {
        id: 3,
        name: "Đồ Chơi Giáo Dục Montessori",
        price: 149000,
        original_price: 199000,
        discount_percent: 25,
        image: "/montessori-educational-toys.png",
        tags: [productTagTypes.discount],
      },
      {
        id: 4,
        name: "Bảng Vẽ Điện Tử",
        price: 399000,
        image: "/electronic-drawing-tablet-for-kids.png",
        tags: [productTagTypes.exclusive],
      },
      {
        id: 5,
        name: "Kính Hiển Vi Trẻ Em",
        price: 249000,
        image: "/kids-microscope-science-toy.png",
        tags: [productTagTypes.trending],
      },
      {
        id: 6,
        name: "Bộ Thí Nghiệm Khoa Học",
        price: 179000,
        image: "/science-experiment-kit-for-children.png",
        tags: [productTagTypes.new],
      },
      {
        id: 7,
        name: "Đàn Piano Điện Tử",
        price: 599000,
        image: "/electronic-piano-keyboard-for-kids.png",
        tags: [productTagTypes.bestseller, productTagTypes.limited],
      },
      {
        id: 8,
        name: "Xe Điều Khiển Từ Xa",
        price: 299000,
        original_price: 399000,
        discount_percent: 25,
        image: "/remote-control-car-toy.png",
        tags: [productTagTypes.discount, productTagTypes.hot],
      },
      {
        id: 9,
        name: "Bộ Xếp Hình 3D Puzzle",
        price: 159000,
        original_price: 219000,
        discount_percent: 27,
        image: "/3d-puzzle-building-blocks.png",
        tags: [productTagTypes.discount, productTagTypes.new],
      },
      {
        id: 10,
        name: "Máy Bay Điều Khiển Drone",
        price: 799000,
        image: "/kids-drone-remote-control.png",
        tags: [productTagTypes.exclusive, productTagTypes.hot],
      },
      {
        id: 11,
        name: "Bộ Đồ Chơi Bác Sĩ",
        price: 129000,
        image: "/doctor-medical-play-set.png",
        tags: [productTagTypes.bestseller],
      },
      {
        id: 12,
        name: "Kính Thiên Văn Trẻ Em",
        price: 449000,
        original_price: 599000,
        discount_percent: 25,
        image: "/kids-telescope-astronomy.png",
        tags: [productTagTypes.discount, productTagTypes.trending],
      },
      {
        id: 13,
        name: "Bộ Mô Hình Năng Lượng Mặt Trời",
        price: 189000,
        image: "/solar-energy-science-kit.png",
        tags: [productTagTypes.new, productTagTypes.trending],
      },
      {
        id: 14,
        name: "Đồng Hồ Thông Minh Trẻ Em",
        price: 349000,
        image: "/kids-smart-watch-gps.png",
        tags: [productTagTypes.hot, productTagTypes.limited],
      },
      {
        id: 15,
        name: "Bộ Công Cụ Kỹ Sư Nhí",
        price: 219000,
        original_price: 289000,
        discount_percent: 24,
        image: "/kids-engineering-tool-set.png",
        tags: [productTagTypes.discount, productTagTypes.bestseller],
      },
      {
        id: 16,
        name: "Máy Chiếu Truyện Kể",
        price: 279000,
        image: "/story-projector-for-kids.png",
        tags: [productTagTypes.exclusive, productTagTypes.new],
      },
    ]

    // Initialize apps data
    const mockApps: App[] = [
      {
        id: 101,
        name: "Sudoku Master",
        description: "Trò chơi Sudoku với nhiều cấp độ khó",
        icon: "/sudoku-game-icon.png",
        type: "Game",
      },
      {
        id: 102,
        name: "Từ điển Anh-Việt",
        description: "Ứng dụng từ điển hỗ trợ học tiếng Anh",
        icon: "/dictionary-app-icon.png",
        type: "Học tập",
      },
      {
        id: 103,
        name: "Flashcard Toán Học",
        description: "Ứng dụng học toán với thẻ ghi nhớ thông minh",
        icon: "/math-flashcard-app-icon.png",
        type: "Giáo dục",
      },
      {
        id: 104,
        name: "Luyện Nói Tiếng Anh",
        description: "Ứng dụng luyện phát âm và giao tiếp tiếng Anh",
        icon: "/english-speaking-app-icon.png",
        type: "Học tập",
      },
      {
        id: 105,
        name: "Cờ Vua Thông Minh",
        description: "Học và chơi cờ vua với AI thông minh",
        icon: "/chess-game-icon.png",
        type: "Game",
      },
      {
        id: 106,
        name: "Tô Màu Sáng Tạo",
        description: "Ứng dụng tô màu với hàng trăm mẫu tranh",
        icon: "/coloring-app-icon.png",
        type: "Giải trí",
      },
      {
        id: 107,
        name: "Học Chữ Cái Vui",
        description: "Học bảng chữ cái qua trò chơi tương tác",
        icon: "/alphabet-learning-icon.png",
        type: "Giáo dục",
      },
      {
        id: 108,
        name: "Ghép Hình Thông Minh",
        description: "Trò chơi ghép hình phát triển tư duy logic",
        icon: "/puzzle-game-icon.png",
        type: "Game",
      },
      {
        id: 109,
        name: "Học Đàn Piano",
        description: "Ứng dụng học đàn piano từ cơ bản đến nâng cao",
        icon: "/piano-learning-icon.png",
        type: "Âm nhạc",
      },
      {
        id: 110,
        name: "Trắc Nghiệm IQ",
        description: "Kiểm tra và rèn luyện chỉ số thông minh",
        icon: "/iq-test-icon.png",
        type: "Giáo dục",
      },
      {
        id: 111,
        name: "Vẽ Tranh 3D",
        description: "Ứng dụng vẽ tranh 3D với công cụ chuyên nghiệp",
        icon: "/3d-drawing-icon.png",
        type: "Sáng tạo",
      },
      {
        id: 112,
        name: "Học Lịch Sử Việt Nam",
        description: "Khám phá lịch sử Việt Nam qua câu chuyện",
        icon: "/history-learning-icon.png",
        type: "Giáo dục",
      },
      {
        id: 113,
        name: "Đua Xe Tốc Độ",
        description: "Trò chơi đua xe với đồ họa sống động",
        icon: "/racing-game-icon.png",
        type: "Game",
      },
      {
        id: 114,
        name: "Học Địa Lý Thế Giới",
        description: "Khám phá các quốc gia và thủ đô trên thế giới",
        icon: "/geography-learning-icon.png",
        type: "Giáo dục",
      },
      {
        id: 115,
        name: "Trồng Cây Ảo",
        description: "Trò chơi trồng và chăm sóc vườn cây ảo",
        icon: "/virtual-garden-icon.png",
        type: "Giải trí",
      },
      {
        id: 116,
        name: "Học Coding Cơ Bản",
        description: "Học lập trình qua trò chơi và thử thách",
        icon: "/coding-learning-icon.png",
        type: "Công nghệ",
      },
    ]

    // Initialize articles data
    const mockArticles: Article[] = [
      {
        id: 201,
        title: "10 cách giúp trẻ phát triển tư duy logic",
        excerpt: "Bài viết chia sẻ các phương pháp giúp trẻ phát triển kỹ năng tư duy logic từ sớm",
        image: "/children-learning-logic-thinking.png",
        date: "2023-05-15T08:30:00",
        type: "article",
      },
      {
        id: 202,
        title: "Hướng dẫn chọn đồ chơi phù hợp với lứa tuổi",
        excerpt: "Tìm hiểu cách chọn đồ chơi phù hợp với từng giai đoạn phát triển của trẻ",
        image: "/age-appropriate-toys-for-children.png",
        date: "2023-06-10T10:15:00",
        type: "article",
      },
      {
        id: 203,
        title: "Phương pháp Montessori trong giáo dục trẻ em",
        excerpt: "Tìm hiểu về phương pháp giáo dục Montessori và cách áp dụng tại nhà",
        image: "/montessori-education-method.png",
        date: "2023-07-05T09:00:00",
        type: "article",
      },
      {
        id: 204,
        title: "Lợi ích của việc đọc sách cho trẻ mỗi ngày",
        excerpt: "Khám phá những lợi ích tuyệt vời khi đọc sách cùng con mỗi ngày",
        image: "/reading-books-with-children.png",
        date: "2023-07-20T14:30:00",
        type: "article",
      },
      {
        id: 205,
        title: "Cách dạy trẻ quản lý cảm xúc hiệu quả",
        excerpt: "Hướng dẫn cha mẹ giúp trẻ nhận biết và kiểm soát cảm xúc của mình",
        image: "/emotional-management-for-kids.png",
        date: "2023-08-01T11:00:00",
        type: "article",
      },
      {
        id: 206,
        title: "Hoạt động ngoài trời giúp trẻ phát triển toàn diện",
        excerpt: "Những hoạt động ngoài trời bổ ích cho sự phát triển thể chất và tinh thần",
        image: "/outdoor-activities-for-children.png",
        date: "2023-08-15T10:00:00",
        type: "article",
      },
      {
        id: 207,
        title: "Xây dựng thói quen tốt cho trẻ từ nhỏ",
        excerpt: "Cách giúp trẻ hình thành những thói quen tích cực từ sớm",
        image: "/building-good-habits-kids.png",
        date: "2023-09-01T08:45:00",
        type: "article",
      },
      {
        id: 208,
        title: "Phát triển kỹ năng xã hội cho trẻ mầm non",
        excerpt: "Hướng dẫn cha mẹ giúp trẻ phát triển kỹ năng giao tiếp và làm việc nhóm",
        image: "/social-skills-development.png",
        date: "2023-09-15T13:20:00",
        type: "article",
      },
      {
        id: 209,
        title: "Dinh dưỡng cân bằng cho trẻ trong độ tuổi phát triển",
        excerpt: "Chế độ dinh dưỡng khoa học giúp trẻ phát triển khỏe mạnh",
        image: "/balanced-nutrition-for-kids.png",
        date: "2023-10-01T09:30:00",
        type: "article",
      },
      {
        id: 210,
        title: "Khuyến khích trẻ sáng tạo qua nghệ thuật",
        excerpt: "Các hoạt động nghệ thuật giúp kích thích óc sáng tạo của trẻ",
        image: "/art-creativity-for-children.png",
        date: "2023-10-15T15:00:00",
        type: "article",
      },
      {
        id: 211,
        title: "Giáo dục STEM cho trẻ em hiện đại",
        excerpt: "Tầm quan trọng của giáo dục STEM trong thời đại công nghệ 4.0",
        image: "/stem-education-for-kids.png",
        date: "2023-11-01T10:15:00",
        type: "article",
      },
      {
        id: 212,
        title: "Cách dạy trẻ về tiền bạc và tiết kiệm",
        excerpt: "Hướng dẫn trẻ hiểu giá trị của tiền và cách quản lý tài chính cá nhân",
        image: "/financial-education-for-kids.png",
        date: "2023-11-15T11:45:00",
        type: "article",
      },
      {
        id: 213,
        title: "Phát triển tư duy phản biện cho trẻ",
        excerpt: "Cách rèn luyện khả năng tư duy phản biện và giải quyết vấn đề",
        image: "/critical-thinking-development.png",
        date: "2023-12-01T09:00:00",
        type: "article",
      },
      {
        id: 214,
        title: "Vai trò của cha mẹ trong việc học của con",
        excerpt: "Cách cha mẹ đồng hành và hỗ trợ con trong hành trình học tập",
        image: "/parental-role-in-education.png",
        date: "2023-12-15T14:00:00",
        type: "article",
      },
      {
        id: 215,
        title: "Học ngoại ngữ sớm: Lợi ích và phương pháp",
        excerpt: "Tại sao nên cho trẻ học ngoại ngữ từ sớm và cách học hiệu quả",
        image: "/early-language-learning.png",
        date: "2024-01-05T10:30:00",
        type: "article",
      },
      {
        id: 216,
        title: "Giúp trẻ vượt qua nỗi sợ hãi và lo lắng",
        excerpt: "Cách nhận biết và giúp trẻ đối phó với nỗi sợ hãi một cách tích cực",
        image: "/overcoming-childhood-fears.png",
        date: "2024-01-20T13:15:00",
        type: "article",
      },
      {
        id: 217,
        title: "Tầm quan trọng của giấc ngủ đối với trẻ em",
        excerpt: "Giấc ngủ chất lượng ảnh hưởng như thế nào đến sự phát triển của trẻ",
        image: "/importance-of-sleep-for-kids.png",
        date: "2024-02-01T08:00:00",
        type: "article",
      },
    ]

    // Initialize videos data
    const mockVideos: Video[] = [
      {
        id: 301,
        title: "Hướng dẫn lắp ráp robot đơn giản",
        description: "Video hướng dẫn chi tiết cách lắp ráp robot từ bộ kit cơ bản",
        thumbnail: "/robot-assembly-tutorial-video.png",
        duration: "15:30",
        views: "1.2K",
        type: "video",
      },
      {
        id: 302,
        title: "Thí nghiệm khoa học tại nhà cho trẻ em",
        description: "Các thí nghiệm khoa học đơn giản và an toàn có thể thực hiện tại nhà",
        thumbnail: "/kids-science-experiments-at-home.png",
        duration: "20:45",
        views: "3.5K",
        type: "video",
      },
      {
        id: 303,
        title: "Học vẽ tranh phong cảnh cho trẻ em",
        description: "Hướng dẫn từng bước vẽ tranh phong cảnh đẹp mắt",
        thumbnail: "/landscape-drawing-tutorial.png",
        duration: "18:20",
        views: "2.8K",
        type: "video",
      },
      {
        id: 304,
        title: "Làm đồ chơi từ vật liệu tái chế",
        description: "Sáng tạo đồ chơi thú vị từ các vật liệu tái chế trong nhà",
        thumbnail: "/recycled-toys-diy.png",
        duration: "12:15",
        views: "4.2K",
        type: "video",
      },
      {
        id: 305,
        title: "Học đàn piano cơ bản cho người mới bắt đầu",
        description: "Bài học piano đầu tiên dành cho trẻ em và người mới học",
        thumbnail: "/beginner-piano-lessons.png",
        duration: "25:00",
        views: "5.1K",
        type: "video",
      },
      {
        id: 306,
        title: "Thí nghiệm núi lửa phun trào",
        description: "Tạo mô hình núi lửa phun trào tại nhà với nguyên liệu đơn giản",
        thumbnail: "/volcano-experiment-video.png",
        duration: "10:30",
        views: "6.7K",
        type: "video",
      },
      {
        id: 307,
        title: "Học tiếng Anh qua bài hát cho trẻ",
        description: "Những bài hát tiếng Anh vui nhộn giúp trẻ học từ vựng",
        thumbnail: "/english-songs-for-kids.png",
        duration: "22:40",
        views: "8.3K",
        type: "video",
      },
      {
        id: 308,
        title: "Origami - Gấp giấy nghệ thuật Nhật Bản",
        description: "Hướng dẫn gấp các hình động vật đơn giản từ giấy",
        thumbnail: "/origami-tutorial-for-kids.png",
        duration: "16:50",
        views: "3.9K",
        type: "video",
      },
      {
        id: 309,
        title: "Bài tập thể dục buổi sáng cho trẻ",
        description: "Các bài tập thể dục vui nhộn giúp trẻ khỏe mạnh",
        thumbnail: "/morning-exercise-for-children.png",
        duration: "14:25",
        views: "2.6K",
        type: "video",
      },
      {
        id: 310,
        title: "Học toán qua trò chơi tương tác",
        description: "Phương pháp học toán thú vị qua các trò chơi",
        thumbnail: "/interactive-math-games.png",
        duration: "19:15",
        views: "4.8K",
        type: "video",
      },
      {
        id: 311,
        title: "Làm slime an toàn tại nhà",
        description: "Công thức làm slime đơn giản và an toàn cho trẻ",
        thumbnail: "/safe-slime-making-tutorial.png",
        duration: "11:40",
        views: "7.2K",
        type: "video",
      },
      {
        id: 312,
        title: "Học lập trình Scratch cho trẻ em",
        description: "Bài học lập trình đầu tiên với Scratch dành cho trẻ",
        thumbnail: "/scratch-programming-for-kids.png",
        duration: "28:30",
        views: "3.4K",
        type: "video",
      },
      {
        id: 313,
        title: "Kỹ năng sống: Dọn dẹp phòng ngủ",
        description: "Hướng dẫn trẻ cách tự dọn dẹp và sắp xếp phòng ngủ",
        thumbnail: "/room-cleaning-life-skills.png",
        duration: "13:20",
        views: "2.1K",
        type: "video",
      },
      {
        id: 314,
        title: "Thí nghiệm với nước và màu sắc",
        description: "Các thí nghiệm thú vị về màu sắc và nước",
        thumbnail: "/water-color-experiments.png",
        duration: "17:05",
        views: "5.6K",
        type: "video",
      },
      {
        id: 315,
        title: "Học vẽ nhân vật hoạt hình yêu thích",
        description: "Hướng dẫn vẽ các nhân vật hoạt hình phổ biến",
        thumbnail: "/cartoon-character-drawing.png",
        duration: "21:15",
        views: "9.1K",
        type: "video",
      },
      {
        id: 316,
        title: "Làm vườn mini trong nhà",
        description: "Hướng dẫn trẻ trồng và chăm sóc cây trong nhà",
        thumbnail: "/indoor-mini-garden-tutorial.png",
        duration: "15:45",
        views: "3.7K",
        type: "video",
      },
      {
        id: 317,
        title: "Học múa ballet cơ bản cho trẻ",
        description: "Các động tác ballet cơ bản dành cho trẻ mới bắt đầu",
        thumbnail: "/basic-ballet-for-children.png",
        duration: "24:10",
        views: "4.5K",
        type: "video",
      },
    ]

    setProducts(mockProducts)
    setApps(mockApps)
    setArticles(mockArticles)
    setVideos(mockVideos)

    // Get current user from session storage
    const userString = sessionStorage.getItem("currentUser")
    if (userString) {
      setCurrentUser(JSON.parse(userString))
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null
        setCurrentUser(newUser)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const triggerNotification = (category: "activity" | "system" | "transaction") => {
    if (!currentUser) {
      showToast("Vui lòng đăng nhập để nhận thông báo!", "error")
      return
    }

    const notifications = mockNotifications[category]
    const userNotifications = JSON.parse(localStorage.getItem(`notifications_${currentUser.id}`) || "[]")

    // Add all notifications for this category
    notifications.forEach((notif) => {
      const exists = userNotifications.some((n: any) => n.id === notif.id)
      if (!exists) {
        userNotifications.push(notif)
      }
    })

    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(userNotifications))

    // Trigger update event
    window.dispatchEvent(new Event("notificationsUpdated"))

    const categoryNames: Record<string, string> = {
      activity: "Hoạt động",
      system: "Hệ thống",
      transaction: "Giao dịch",
    }

    showToast(`Đã thêm thông báo ${categoryNames[category]}!`, "success")
  }

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const toast = document.createElement("div")

    let icon = ""
    switch (type) {
      case "success":
        icon =
          '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>'
        break
      case "error":
        icon =
          '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
        break
      default:
        icon =
          '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }

    toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center ${
      type === "error" ? "bg-red-500" : type === "success" ? "bg-green-500" : "bg-blue-500"
    } text-white z-50 transform translate-y-20 opacity-0`

    toast.innerHTML = `${icon}<span>${message}</span>`
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      toast.style.transform = "translateY(0)"
      toast.style.opacity = "1"
    }, 10)

    setTimeout(() => {
      toast.style.transform = "translateY(20px)"
      toast.style.opacity = "0"
      setTimeout(() => toast.remove(), 500)
    }, 3000)
  }

  const addToCart = (productId: number) => {
    if (!currentUser) {
      showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "error")
      return
    }

    const product = products.find((p) => p.id === productId)
    if (!product) return

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)

    if (userIndex === -1) return

    if (!users[userIndex].cart) {
      users[userIndex].cart = []
    }

    const cartItem = users[userIndex].cart.find((item: any) => item.id === productId)
    if (cartItem) {
      cartItem.quantity++
    } else {
      users[userIndex].cart.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      })
    }

    localStorage.setItem("users", JSON.stringify(users))
    sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    setCurrentUser(users[userIndex])

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { userId: currentUser.id, cartLength: users[userIndex].cart.length },
      }),
    )

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "currentUser",
        newValue: JSON.stringify(users[userIndex]),
        oldValue: JSON.stringify(currentUser),
      }),
    )

    showToast("Đã thêm vào giỏ hàng!", "success")
  }

  const toggleFavorite = (productId: number) => {
    if (!currentUser) {
      showToast("Vui lòng đăng nhập để thêm vào yêu thích!", "error")
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)

    if (userIndex === -1) return

    if (!users[userIndex].favorites) {
      users[userIndex].favorites = []
    }

    const favIndex = users[userIndex].favorites.findIndex((f: Product) => f.id === productId)
    const product = products.find((p) => p.id === productId)

    if (favIndex === -1 && product) {
      users[userIndex].favorites.push(product)
      showToast("Đã thêm vào danh sách yêu thích!", "success")
    } else {
      users[userIndex].favorites.splice(favIndex, 1)
      showToast("Đã xóa khỏi danh sách yêu thích!", "info")
    }

    localStorage.setItem("users", JSON.stringify(users))
    sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    setCurrentUser(users[userIndex])
  }

  const toggleAppFavorite = (appId: number) => {
    if (!currentUser) {
      showToast("Vui lòng đăng nhập để thêm vào yêu thích!", "error")
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)

    if (userIndex === -1) return

    if (!users[userIndex].favoriteApps) {
      users[userIndex].favoriteApps = []
    }

    const app = apps.find((a) => a.id === appId)
    const favoriteIndex = users[userIndex].favoriteApps.findIndex((a: App) => a.id === appId)

    if (favoriteIndex === -1 && app) {
      users[userIndex].favoriteApps.push(app)
      showToast(`Đã thêm "${app.name}" vào danh sách yêu thích!`, "success")
    } else {
      users[userIndex].favoriteApps.splice(favoriteIndex, 1)
      showToast(`Đã xóa "${app?.name}" khỏi danh sách yêu thích!`, "info")
    }

    localStorage.setItem("users", JSON.stringify(users))
    sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    setCurrentUser(users[userIndex])
  }

  const toggleSavedItem = (itemId: number, itemType: "article" | "video") => {
    if (!currentUser) {
      showToast("Vui lòng đăng nhập để lưu nội dung!", "error")
      return
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id)

    if (userIndex === -1) return

    let item: Article | Video | undefined
    let favoriteKey: "favoriteArticles" | "favoriteVideos"

    if (itemType === "article") {
      item = articles.find((a) => a.id === itemId)
      favoriteKey = "favoriteArticles"
    } else {
      item = videos.find((v) => v.id === itemId)
      favoriteKey = "favoriteVideos"
    }

    if (!users[userIndex][favoriteKey]) {
      users[userIndex][favoriteKey] = []
    }

    const favoriteItems = users[userIndex][favoriteKey]
    const favoriteIndex = favoriteItems.findIndex((i: any) => i.id === itemId)

    if (favoriteIndex === -1 && item) {
      favoriteItems.push(item)
      showToast(`Đã lưu "${item.title}"!`, "success")
    } else {
      favoriteItems.splice(favoriteIndex, 1)
      showToast(`Đã bỏ lưu "${item?.title}"!`, "info")
    }

    localStorage.setItem("users", JSON.stringify(users))
    sessionStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    setCurrentUser(users[userIndex])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      percent: Percent,
      sparkles: Sparkles,
      "trending-up": TrendingUp,
      flame: Flame,
      star: Star,
      crown: Crown,
      clock: Clock,
    }
    const IconComponent = iconMap[iconName] || Star
    return <IconComponent className="w-3 h-3" />
  }

  const isFavorited = (productId: number) => {
    return currentUser?.favorites?.some((f) => f.id === productId) || false
  }

  const isAppFavorited = (appId: number) => {
    return currentUser?.favoriteApps?.some((a) => a.id === appId) || false
  }

  const isArticleSaved = (articleId: number) => {
    return currentUser?.favoriteArticles?.some((a) => a.id === articleId) || false
  }

  const isVideoSaved = (videoId: number) => {
    return currentUser?.favoriteVideos?.some((v) => v.id === videoId) || false
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {currentUser && (
          <div className="mb-12 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">🔔 Kích hoạt thông báo giả lập</h2>
            <p className="text-gray-600 mb-4">Nhấn các nút dưới để kích hoạt các thông báo mẫu:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => triggerNotification("activity")}
                className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>⚡</span> Hoạt động
              </button>
              <button
                onClick={() => triggerNotification("system")}
                className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>⚙️</span> Hệ thống
              </button>
              <button
                onClick={() => triggerNotification("transaction")}
                className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>🛒</span> Giao dịch
              </button>
            </div>
            {currentUser.isAdmin && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 mb-3 text-sm">Quản trị viên:</p>
                <Link
                  href="/admin/notifications"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-colors"
                >
                  <span>⚙️</span> Quản lý thông báo
                </Link>
              </div>
            )}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6">Sản phẩm nổi bật</h1>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div key={product.id} className="product-card bg-white rounded-2xl shadow-md overflow-hidden relative">
              {product.discount_percent && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                  -{product.discount_percent}%
                </div>
              )}

              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />

              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>

                {/* Product Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tag.color} ${tag.textColor}`}
                      >
                        {getIconComponent(tag.icon)}
                        <span>{tag.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mb-2">
                  <span className="text-orange-600 font-bold">{product.price.toLocaleString()} ₫</span>
                  {product.original_price && (
                    <span className="text-gray-500 line-through text-sm ml-2">
                      {product.original_price.toLocaleString()} ₫
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Thêm
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md"
              >
                <Heart
                  className={`h-6 w-6 ${isFavorited(product.id) ? "text-red-500 fill-current" : "text-gray-400"}`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Apps Section */}
        <h2 className="text-3xl font-bold mt-12 mb-6">Ứng dụng & Game Mini</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {apps.map((app) => (
            <div key={app.id} className="app-card bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                    <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">{app.type}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{app.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Mở
                  </button>
                  <button
                    onClick={() => toggleAppFavorite(app.id)}
                    className={`flex-1 py-2 rounded-full transition-colors flex items-center justify-center ${
                      isAppFavorited(app.id)
                        ? "bg-gray-200 text-gray-800"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {isAppFavorited(app.id) ? "Bỏ thích" : "Yêu thích"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Saved Content Section */}
        <h2 className="text-3xl font-bold mt-12 mb-6">Bài viết & Video đã lưu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Articles */}
          {articles.map((article) => (
            <div key={article.id} className="saved-item flex bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="w-1/3 relative">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                  Bài viết
                </div>
              </div>
              <div className="w-2/3 p-4">
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
                  <button
                    onClick={() => toggleSavedItem(article.id, "article")}
                    className={`transition-colors ${isArticleSaved(article.id) ? "text-blue-500" : "text-gray-400 hover:text-blue-600"}`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Videos */}
          {videos.map((video) => (
            <div key={video.id} className="saved-item flex bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="w-1/3 relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-lg">Video</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="w-2/3 p-4">
                <h3 className="font-semibold mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{video.views} lượt xem</span>
                  <button
                    onClick={() => toggleSavedItem(video.id, "video")}
                    className={`transition-colors ${isVideoSaved(video.id) ? "text-blue-500" : "text-gray-400 hover:text-blue-600"}`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
