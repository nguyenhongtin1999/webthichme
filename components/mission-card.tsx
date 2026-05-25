import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MissionCardProps {
  icon: LucideIcon
  title: string
  description: string
  points: number
  progress: number
  total: number
  iconBgColor?: string
  iconTextColor?: string
}

export function MissionCard({
  icon: Icon,
  title,
  description,
  points,
  progress,
  total,
  iconBgColor = "bg-lavender/30",
  iconTextColor = "text-indigo-500",
}: MissionCardProps) {
  const percentage = Math.min(100, (progress / total) * 100)

  return (
    <div className="card-patch stitch-border rounded-2xl p-5 flex flex-col gap-3 transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner",
              iconBgColor,
              iconTextColor,
            )}
          >
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-text-main font-bold text-base leading-tight">{title}</h3>
            <p className="text-text-muted text-xs mt-1">{description}</p>
          </div>
        </div>
        <div className="bg-primary/10 text-primary-dark font-bold text-xs px-2 py-1 rounded-lg">+{points} Pts</div>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100">
          <div
            className="h-full bg-primary progress-stripe rounded-full shadow-[0_2px_4px_rgba(37,233,244,0.4)] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-text-muted text-sm font-bold w-6 text-right">
          {progress}/{total}
        </span>
      </div>
    </div>
  )
}
