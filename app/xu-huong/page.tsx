"use client"

import { useEffect, useState } from "react"

// Dynamic imports for client-side only libraries
import dynamic from "next/dynamic"

const TrendContent = dynamic(() => import("@/components/trends/trend-content"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  ),
})

export default function TrendsPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TrendContent />
    </div>
  )
}
