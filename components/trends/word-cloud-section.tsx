"use client"

export default function WordCloudSection() {
  const wordCloudItems = [
    { text: "AI", size: "text-4xl", color: "text-blue-500" },
    { text: "TikTok", size: "text-3xl", color: "text-pink-500" },
    { text: "Sustainability", size: "text-2xl", color: "text-green-500" },
    { text: "Crypto", size: "text-xl", color: "text-yellow-500" },
    { text: "Mental Health", size: "text-lg", color: "text-purple-500" },
    { text: "5G", size: "text-base", color: "text-red-500" },
    { text: "Remote Work", size: "text-2xl", color: "text-indigo-500" },
    { text: "Metaverse", size: "text-3xl", color: "text-cyan-500" },
    { text: "NFTs", size: "text-xl", color: "text-orange-500" },
    { text: "Wellness", size: "text-lg", color: "text-teal-500" },
  ]

  return (
    <div className="mt-12 glass-effect p-6 rounded-lg" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Chủ Đề Thịnh Hành</h2>
      <div id="wordCloud" className="flex flex-wrap justify-center gap-4">
        {wordCloudItems.map((item, i) => (
          <span
            key={i}
            className={`hashtag ${item.size} ${item.color} font-bold cursor-pointer hover:opacity-75 transition-opacity hover:scale-110`}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}
