"use client"

import { useState } from "react"

const GiaiTriSangTaoPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const tiles = [
    // Công cụ sáng tạo
    {
      id: 1,
      title: "AI Tạo Ảnh",
      desc: "Tạo ảnh độc đáo với AI",
      img: "https://picsum.photos/seed/ai-image/600/400",
      btn: "Tạo ngay",
      icon: "fa-magic",
      badge: "Mới",
    },
    {
      id: 2,
      title: "Nâng Cao Ảnh",
      desc: "Cải thiện chất lượng ảnh",
      img: "https://picsum.photos/seed/image-enhance/600/400",
      btn: "Thử ngay",
      icon: "fa-image",
      badge: null,
    },
    {
      id: 3,
      title: "Sáng Tạo Nhạc",
      desc: "Tạo nhạc trực tuyến",
      img: "https://picsum.photos/seed/music/600/400",
      btn: "Bắt đầu",
      icon: "fa-music",
      badge: null,
    },
    {
      id: 4,
      title: "Chỉnh Sửa Video",
      desc: "Tạo video chuyên nghiệp",
      img: "https://picsum.photos/seed/video-edit/600/400",
      btn: "Chỉnh sửa",
      icon: "fa-film",
      badge: null,
    },
    {
      id: 5,
      title: "Mô Hình 3D",
      desc: "Tạo mô hình 3D trực tuyến",
      img: "https://picsum.photos/seed/3d-model/600/400",
      btn: "Tạo mô hình",
      icon: "fa-cube",
      badge: null,
    },
    {
      id: 6,
      title: "Phòng Vẽ Số",
      desc: "Sáng tạo nghệ thuật số độc đáo",
      img: "https://picsum.photos/seed/digital-art/600/400",
      btn: "Vẽ ngay",
      icon: "fa-paint-brush",
      badge: "Hot",
    },

    // Giải trí
    {
      id: 7,
      title: "Bói Bài Tarot",
      desc: "Khám phá tương lai",
      img: "https://picsum.photos/seed/tarot/600/400",
      btn: "Bắt đầu",
      icon: "fa-star",
      badge: null,
    },
    {
      id: 8,
      title: "Tạo Meme",
      desc: "Sáng tạo meme hài hước",
      img: "https://picsum.photos/seed/meme/600/400",
      btn: "Tạo meme",
      icon: "fa-laugh-squint",
      badge: null,
    },
    {
      id: 9,
      title: "Ghép Hình",
      desc: "Thử thách trí óc",
      img: "https://picsum.photos/seed/puzzle/600/400",
      btn: "Chơi ngay",
      icon: "fa-puzzle-piece",
      badge: null,
    },
    {
      id: 10,
      title: "Thú Cưng Ảo",
      desc: "Nuôi thú cưng ảo",
      img: "https://picsum.photos/seed/pet/600/400",
      btn: "Nhận nuôi",
      icon: "fa-paw",
      badge: null,
    },
    {
      id: 11,
      title: "AI Kể Chuyện",
      desc: "Tạo câu chuyện với AI",
      img: "https://picsum.photos/seed/story/600/400",
      btn: "Tạo chuyện",
      icon: "fa-book",
      badge: null,
    },
    {
      id: 12,
      title: "Tạo Emoji",
      desc: "Thiết kế emoji cá nhân",
      img: "https://picsum.photos/seed/emoji/600/400",
      btn: "Tạo emoji",
      icon: "fa-smile-beam",
      badge: "Vui nhộn",
    },

    // Trải nghiệm mới
    {
      id: 13,
      title: "Thực Tế Ảo",
      desc: "Khám phá thế giới ảo",
      img: "https://picsum.photos/seed/vr/600/400",
      btn: "Khám phá",
      icon: "fa-vr-cardboard",
      badge: null,
    },
    {
      id: 14,
      title: "Game AR",
      desc: "Chơi game thực tế ảo tăng cường",
      img: "https://picsum.photos/seed/ar-game/600/400",
      btn: "Chơi ngay",
      icon: "fa-gamepad",
      badge: null,
    },
    {
      id: 15,
      title: "Chat Bot AI",
      desc: "Trò chuyện với AI thông minh",
      img: "https://picsum.photos/seed/chatbot/600/400",
      btn: "Bắt đầu",
      icon: "fa-comments",
      badge: null,
    },
    {
      id: 16,
      title: "Karaoke Online",
      desc: "Hát karaoke trực tuyến",
      img: "https://picsum.photos/seed/karaoke/600/400",
      btn: "Hát ngay",
      icon: "fa-microphone",
      badge: null,
    },
    {
      id: 17,
      title: "Nhà Thiết Kế AI",
      desc: "Tạo trang phục với AI",
      img: "https://picsum.photos/seed/fashion/600/400",
      btn: "Thiết kế",
      icon: "fa-tshirt",
      badge: "Sành điệu",
    },
    {
      id: 18,
      title: "Giải Mã Giấc Mơ",
      desc: "Khám phá ý nghĩa giấc mơ",
      img: "https://picsum.photos/seed/dream/600/400",
      btn: "Giải mã",
      icon: "fa-moon",
      badge: "Huyền bí",
    },
  ]

  const floatingShapes = [
    { icon: "fa-star", color: "text-yellow-700", top: "5%", left: "5%" },
    { icon: "fa-heart", color: "text-red-700", top: "5%", left: "20%" },
    { icon: "fa-music", color: "text-blue-700", top: "5%", left: "40%" },
    { icon: "fa-paint-brush", color: "text-green-700", top: "5%", left: "60%" },
    { icon: "fa-gamepad", color: "text-purple-700", top: "5%", left: "80%" },
    { icon: "fa-camera", color: "text-indigo-700", top: "20%", left: "10%" },
    { icon: "fa-film", color: "text-pink-700", top: "20%", left: "30%" },
    { icon: "fa-palette", color: "text-orange-700", top: "20%", left: "50%" },
    { icon: "fa-headphones", color: "text-teal-700", top: "20%", left: "70%" },
    { icon: "fa-dice", color: "text-amber-700", top: "20%", left: "90%" },
    { icon: "fa-puzzle-piece", color: "text-lime-700", top: "35%", left: "15%" },
    { icon: "fa-microphone", color: "text-cyan-700", top: "35%", left: "35%" },
    { icon: "fa-book", color: "text-amber-700", top: "35%", left: "55%" },
    { icon: "fa-chess", color: "text-rose-700", top: "35%", left: "75%" },
    { icon: "fa-guitar", color: "text-emerald-700", top: "35%", left: "95%" },
    { icon: "fa-rocket", color: "text-fuchsia-700", top: "50%", left: "5%" },
    { icon: "fa-apple-alt", color: "text-green-800", top: "50%", left: "25%" },
    { icon: "fa-tree", color: "text-emerald-800", top: "50%", left: "45%" },
    { icon: "fa-sun", color: "text-yellow-500", top: "50%", left: "65%" },
    { icon: "fa-cloud", color: "text-purple-500", top: "50%", left: "85%" },
    { icon: "fa-moon", color: "text-indigo-800", top: "65%", left: "10%" },
    { icon: "fa-leaf", color: "text-lime-600", top: "65%", left: "30%" },
    { icon: "fa-bolt", color: "text-yellow-600", top: "65%", left: "50%" },
    { icon: "fa-snowflake", color: "text-blue-500", top: "65%", left: "70%" },
    { icon: "fa-heartbeat", color: "text-red-500", top: "65%", left: "90%" },
    { icon: "fa-umbrella", color: "text-teal-800", top: "80%", left: "5%" },
    { icon: "fa-lightbulb", color: "text-yellow-700", top: "80%", left: "30%" },
    { icon: "fa-bicycle", color: "text-pink-600", top: "80%", left: "50%" },
    { icon: "fa-camera-retro", color: "text-purple-800", top: "80%", left: "70%" },
    { icon: "fa-paw", color: "text-amber-700", top: "80%", left: "90%" },
    { icon: "fa-burger", color: "text-orange-800", top: "95%", left: "5%" },
    { icon: "fa-laptop", color: "text-teal-600", top: "95%", left: "25%" },
    { icon: "fa-hat-cowboy", color: "text-indigo-700", top: "95%", left: "45%" },
    { icon: "fa-basketball-ball", color: "text-orange-900", top: "95%", left: "65%" },
    { icon: "fa-bowling-ball", color: "text-blue-800", top: "95%", left: "85%" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        :root {
          --primary-color: #FF6B6B;
          --secondary-color: #4ECDC4;
          --accent-color: #FFD93D;
          --text-color: #333;
          --bg-color: #f0f0f0;
        }

        body.dark-mode {
          --primary-color: #FF6B6B;
          --secondary-color: #4ECDC4;
          --accent-color: #FFD93D;
          --text-color: #E5E5E5;
          --bg-color: linear-gradient(135deg, #1e1b4b 0%, #1f2937 100%);
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: background-color 0.3s, color 0.3s;
        }
        
        .tile {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          position: relative;
          z-index: 1;
        }
        
        .tile:hover {
          transform: translateY(-5px) rotate(2deg);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
          border-color: var(--accent-color);
        }
        
        .tile-image {
          height: 0;
          padding-bottom: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .tile-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .tile:hover .tile-image img {
          transform: scale(1.1) rotate(-2deg);
        }
        
        .tile-content {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 44%;
        }
        
        .tile-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.25rem;
        }
        
        .tile-description {
          font-size: 0.7rem;
          color: var(--text-color);
          opacity: 0.8;
          margin-bottom: 0.25rem;
          height: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .tile-button {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          background-color: var(--primary-color);
          color: white;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.7rem;
          position: relative;
          overflow: hidden;
          margin-top: 0.3rem;
          border: none;
          cursor: pointer;
        }
        
        .tile-button:hover {
          background-color: #FF8787;
          transform: scale(1.05);
        }
        
        .tile-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background-color: rgba(255, 255, 255, 0.2);
          transform: rotate(45deg);
          transition: all 0.3s ease;
        }

        .tile-button:hover::after {
          top: -100%;
          left: -100%;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-color);
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        
        .section-title::after {
          content: '';
          display: block;
          width: 50px;
          height: 4px;
          background-color: var(--primary-color);
          margin: 0.5rem auto 0;
        }
        
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
          position: relative;
          z-index: 1;
          padding-bottom: 10rem;
        }
        
        @media (max-width: 640px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 768px) {
          .grid-container {
            padding-bottom: 8rem;
          }
        }
        
        .category-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 1rem;
          grid-column: 1 / -1;
          text-align: center;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .category-title::before,
        .category-title::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 50%;
          height: 2px;
          background-color: var(--accent-color);
        }

        .category-title::before {
          left: -50%;
        }

        .category-title::after {
          right: -50%;
        }
        
        .floating-shapes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          background: var(--bg-color);
        }
        
        .shape {
          position: absolute;
          opacity: 0.1;
          animation: float 25s infinite;
          font-size: 1.5rem;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(0, -60px) rotate(180deg); }
          75% { transform: translate(-30px, -30px) rotate(270deg); }
        }

        .tile-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--accent-color);
          color: #000;
          padding: 0.2rem 0.4rem;
          border-radius: 0.3rem;
          font-size: 0.6rem;
          font-weight: bold;
          transform: rotate(15deg);
          z-index: 2;
        }

        main {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="floating-shapes">
        {floatingShapes.map((shape, idx) => (
          <i
            key={idx}
            className={`fas ${shape.icon} shape ${shape.color}`}
            style={{ top: shape.top, left: shape.left }}
          />
        ))}
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="section-title">Giải trí & Sáng tạo</h1>

        <div className="grid-container">
          {/* Công cụ sáng tạo */}
          <h2 className="category-title">Công cụ sáng tạo</h2>
          {tiles.slice(0, 6).map((tile) => (
            <div key={tile.id} className="tile">
              <div className="tile-image">
                <img src={tile.img || "/placeholder.svg"} alt={tile.title} loading="lazy" />
                {tile.badge && <div className="tile-badge">{tile.badge}</div>}
              </div>
              <div className="tile-content">
                <h2 className="tile-title">{tile.title}</h2>
                <p className="tile-description">{tile.desc}</p>
                <a href="#" className="tile-button">
                  <i className={`fas ${tile.icon} mr-1`} />
                  {tile.btn}
                </a>
              </div>
            </div>
          ))}

          {/* Giải trí */}
          <h2 className="category-title">Giải trí</h2>
          {tiles.slice(6, 12).map((tile) => (
            <div key={tile.id} className="tile">
              <div className="tile-image">
                <img src={tile.img || "/placeholder.svg"} alt={tile.title} loading="lazy" />
                {tile.badge && <div className="tile-badge">{tile.badge}</div>}
              </div>
              <div className="tile-content">
                <h2 className="tile-title">{tile.title}</h2>
                <p className="tile-description">{tile.desc}</p>
                <a href="#" className="tile-button">
                  <i className={`fas ${tile.icon} mr-1`} />
                  {tile.btn}
                </a>
              </div>
            </div>
          ))}

          {/* Trải nghiệm mới */}
          <h2 className="category-title">Trải nghiệm mới</h2>
          {tiles.slice(12, 18).map((tile) => (
            <div key={tile.id} className="tile">
              <div className="tile-image">
                <img src={tile.img || "/placeholder.svg"} alt={tile.title} loading="lazy" />
                {tile.badge && <div className="tile-badge">{tile.badge}</div>}
              </div>
              <div className="tile-content">
                <h2 className="tile-title">{tile.title}</h2>
                <p className="tile-description">{tile.desc}</p>
                <a href="#" className="tile-button">
                  <i className={`fas ${tile.icon} mr-1`} />
                  {tile.btn}
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export default GiaiTriSangTaoPage
