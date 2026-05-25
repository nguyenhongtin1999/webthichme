"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp } from "lucide-react"

declare global {
  interface Window {
    Chart?: any
  }
}

export default function StatisticsSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)
  const [chartLoaded, setChartLoaded] = useState(false)

  useEffect(() => {
    const loadChartLibrary = async () => {
      if (typeof window !== "undefined" && !window.Chart) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/chart.js"
        script.onload = () => {
          setChartLoaded(true)
        }
        document.head.appendChild(script)
      } else if (typeof window !== "undefined" && window.Chart) {
        setChartLoaded(true)
      }
    }

    loadChartLibrary()
  }, [])

  useEffect(() => {
    if (!chartLoaded || !window.Chart || !canvasRef.current) return

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
      chartInstanceRef.current = null
    }

    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      chartInstanceRef.current = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Thời trang", "Âm nhạc", "Công nghệ", "Ẩm thực", "Sức khỏe"],
          datasets: [
            {
              label: "Mức độ quan tâm",
              data: [65, 59, 80, 81, 56],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: "top" as const,
            },
            title: {
              display: true,
              text: "Xu hướng quan tâm 2025",
            },
          },
        },
      })
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [chartLoaded])

  return (
    <div className="mt-12 glass-effect p-6 rounded-lg" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Thống kê xu hướng</h2>
      <div className="w-full max-w-2xl mx-auto">
        <canvas id="trendChart" ref={canvasRef} width="400" height="200"></canvas>
        <div className="mt-4 text-center">
          <a href="#" className="text-orange-500 hover:text-orange-600 underline inline-flex items-center">
            <span>Đến trang thống kê</span>
            <TrendingUp className="ml-1 w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
