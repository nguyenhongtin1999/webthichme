'use client'

import { useEffect, useState } from 'react'
import { X, Mic } from 'lucide-react'
import { useVoiceInput } from '@/hooks/use-voice-input'
import '../styles/voice-input.css'

interface VoiceInputModalProps {
  isOpen: boolean
  onClose: () => void
  onTranscript: (text: string) => void
}

const WaveformBars = ({ isListening }: { isListening: boolean }) => {
  const barCount = 12
  const bars = Array.from({ length: barCount }, (_, i) => i)

  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`waveform-bar bg-gradient-to-t from-violet-500 to-violet-300 dark:from-violet-400 dark:to-violet-200 rounded-full transition-all ${
            isListening ? 'animate-waveform' : 'h-2'
          }`}
          style={{
            width: '3px',
            animation: isListening
              ? `waveform 0.6s ease-in-out ${index * 0.05}s infinite`
              : 'none',
          }}
        />
      ))}
    </div>
  )
}

export function VoiceInputModal({
  isOpen,
  onClose,
  onTranscript,
}: VoiceInputModalProps) {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useVoiceInput()
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (transcript) {
      setDisplayText(transcript)
    }
  }, [transcript])

  const handleStart = () => {
    if (isSupported) {
      resetTranscript()
      setDisplayText('')
      startListening()
    }
  }

  const handleStop = () => {
    stopListening()
    if (displayText.trim()) {
      onTranscript(displayText)
      onClose()
    }
  }

  const handleClose = () => {
    if (isListening) {
      stopListening()
    }
    resetTranscript()
    setDisplayText('')
    onClose()
  }

  if (!isOpen || !isSupported) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nghe giọng nói</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isListening ? 'Đang lắng nghe...' : 'Sẵn sàng để nghe'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Waveform Section */}
          <div className="p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            <div className="flex flex-col items-center gap-6">
              {/* Mic Button */}
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110'
                    : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/50'
                }`}
              >
                <Mic className="w-10 h-10 text-white" />
              </div>

              {/* Waveform Animation */}
              <WaveformBars isListening={isListening} />

              {/* Text Display */}
              {displayText && (
                <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 min-h-20 max-h-32 overflow-y-auto">
                  <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed">
                    {displayText}
                  </p>
                </div>
              )}

              {!displayText && !isListening && (
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                  Nhấn nút microphone để bắt đầu nói
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition-colors"
            >
              Đóng
            </button>
            {!isListening ? (
              <button
                onClick={handleStart}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all active:scale-95"
              >
                Bắt đầu
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all active:scale-95"
              >
                Dừng
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
