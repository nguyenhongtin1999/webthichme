"use client"

export default function PersonalizedSection() {
  const personalizedSuggestions = [
    { title: "10 xu hướng TikTok hot", image: "https://picsum.photos/300/200?random=1" },
    { title: "Cách tạo content viral", image: "https://picsum.photos/300/200?random=2" },
    { title: "Bí quyết làm influencer", image: "https://picsum.photos/300/200?random=3" },
    { title: "Kỹ năng thời đại số", image: "https://picsum.photos/300/200?random=4" },
    { title: "AR trong thời trang", image: "https://picsum.photos/300/200?random=5" },
    { title: "Làm podcast thu hút", image: "https://picsum.photos/300/200?random=6" },
    { title: "Xu hướng làm đẹp 2024", image: "https://picsum.photos/300/200?random=7" },
    { title: "Công thức nấu ăn nhanh", image: "https://picsum.photos/300/200?random=8" },
  ]

  return (
    <div className="mt-12 glass-effect p-6 rounded-lg" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Đề xuất cho bạn</h2>
      <div id="personalizedContent" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {personalizedSuggestions.map((item, i) => (
          <article key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-24 object-cover" />
            <div className="p-2">
              <h3 className="font-medium text-sm text-gray-800">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
