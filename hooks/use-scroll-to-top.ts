"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])
}
