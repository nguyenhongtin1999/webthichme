'use client'

import { useEffect, useState, useRef } from 'react'
import { Mic } from 'lucide-react'
import '../styles/voice-input.css'

interface VoiceInputOverlayProps {
  isListening: boolean
  transcript: string
  onClose?: () => void
}

const WaveformArc = ({ isListening }: { isListening: boolean }) => {
  const barCount = 12
  const bars = Array.from({ length: barCount }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1.5 h-20">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`waveform-bar bg-gradient-to-t from-violet-500 to-violet-300 dark:from-violet-400 dark:to-violet-200 rounded-full ${
            isListening ? 'animate-waveform' : 'h-1'
          }`}
          style={{
            width: '2px',
            animation: isListening
              ? `waveform 0.6s ease-in-out ${index * 0.05}s infinite`
              : 'none',
          }}
        />
      ))}
    </div>
  )
}

export function VoiceInputOverlay({
  isListening,
  transcript,
  onClose,
}: VoiceInputOverlayProps) {
  const [isVisible, setIsVisible] = useState(isListening)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isListening) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isListening])

  useEffect(() => {
    if (!isListening) return

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        // Check if click is on the plus button
        const target = e.target as HTMLElement
        if (!target.closest('[data-voice-button]')) {
          onClose?.()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isListening, onClose])

  if (!isVisible) return null

  return (
    <div
      ref={overlayRef}
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isListening ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {/* Background blur container */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl px-8 py-6 border border-violet-200 dark:border-violet-500/20 max-w-xs mx-auto">
        {/* Mic Icon with pulse */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Pulse rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              </>
            )}
            <div
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-100'
                  : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/50 scale-90'
              }`}
            >
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Waveform Animation */}
        <WaveformArc isListening={isListening} />

        {/* Status Text */}
        <div className="text-center mt-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {isListening ? 'Đang nghe...' : 'Sẵn sàng'}
          </p>
          {transcript && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-h-16 overflow-y-auto line-clamp-3">
              {transcript}
            </p>
          )}
        </div>

        {/* Instruction Text */}
        {!transcript && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
            Nói để mở tính năng
          </p>
        )}
      </div>

      {/* Release indicator */}
      {isListening && (
        <div className="text-center mt-3 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
          Nhả để hoàn tất
        </div>
      )}
    </div>
  )
}
