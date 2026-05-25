"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

export default function ClientLayout({
  children,
  interClassName,
}: { children: React.ReactNode; interClassName: string }) {
  useScrollToTop()

  const pathname = usePathname()
  const showHeader = pathname !== "/login"

  return (
    <div className={`${interClassName} min-h-screen font-sans transition-colors duration-300`}>
      {showHeader && <Header />}
      <div className={showHeader ? "pt-20" : ""}>{children}</div>
    </div>
  )
}
