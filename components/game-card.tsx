import type { LucideIcon } from "lucide-react"

interface GameCardProps {
  title: string
  points: number
  icon: LucideIcon
  image: string
  bgColor: string
  borderColor: string
  iconColor: string
}

export function GameCard({ title, points, icon: Icon, image, bgColor, borderColor, iconColor }: GameCardProps) {
  return (
    <div className="snap-start shrink-0 w-40 card-patch stitch-border rounded-2xl p-4 flex flex-col items-center gap-3 transition-transform active:scale-95 cursor-pointer">
      <div className="relative w-20 h-20">
        <div className={`absolute inset-0 ${bgColor} rounded-2xl rotate-3 shadow-sm`}></div>
        <div
          className={`absolute inset-0 bg-white rounded-2xl -rotate-3 border-2 border-dashed ${borderColor} shadow-sm flex items-center justify-center overflow-hidden`}
        >
          <img alt={title} className="w-full h-full object-cover opacity-80" src={image || "/placeholder.svg"} />
          <Icon className={`${iconColor} absolute w-8 h-8 drop-shadow-md`} />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-text-main font-bold text-sm">{title}</h3>
        <p className="text-primary-dark text-xs font-bold mt-1">+{points} Pts</p>
      </div>
      <button className="w-full py-1.5 rounded-full bg-text-main text-white text-xs font-bold mt-1 shadow-lg shadow-text-main/20">
        Play
      </button>
    </div>
  )
}
