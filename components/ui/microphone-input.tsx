"use client"

import React, { useState, useRef } from "react"
import { Mic, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MicrophoneInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showAccessoryBar?: boolean
}

export const MicrophoneInput = React.forwardRef<HTMLInputElement, MicrophoneInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder = "Gõ hoặc dùng micro...",
      disabled = false,
      className,
      showAccessoryBar = true,
    },
    ref,
  ) => {
    const [isListening, setIsListening] = useState(false)
    const [isMicSupported, setIsMicSupported] = useState(true)
    const [interimText, setInterimText] = useState("")
    const recognitionRef = useRef<any>(null)

    React.useEffect(() => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsMicSupported(false)
        return
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "vi-VN"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setInterimText("")
      }

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            onChange(value + (value ? " " : "") + transcript)
          } else {
            interimTranscript += transcript
          }
        }
        setInterimText(interimTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setInterimText("")
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.abort()
        }
      }
    }, [value, onChange])

    const handleMicClick = () => {
      if (!isMicSupported) {
        alert("Speech recognition not supported in your browser")
        return
      }

      if (isListening) {
        recognitionRef.current?.stop()
      } else {
        recognitionRef.current?.start()
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        onSubmit()
      }
    }

    return (
      <div className={cn("flex flex-col gap-0", className)}>
        {showAccessoryBar && (
          <div className="flex items-center gap-2 bg-background border-b border-input px-3 py-2 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              disabled={disabled || !isMicSupported}
              className={cn(
                "h-10 w-10 p-0 flex-shrink-0 transition-all rounded-lg",
                isListening && "bg-red-500/20 text-red-500 animate-pulse",
                !isMicSupported && "opacity-50 cursor-not-allowed",
              )}
              title={!isMicSupported ? "Microphone not supported" : isListening ? "Stop listening" : "Start listening"}
            >
              <Mic className={cn("h-5 w-5", isListening && "animate-bounce")} />
            </Button>
            <div className="flex-1 text-xs text-muted-foreground truncate">
              {isListening ? (
                <span className="text-red-500 font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Đang nghe...
                </span>
              ) : interimText ? (
                <span className="text-yellow-600 truncate">{interimText}</span>
              ) : (
                <span>Bấm để nói</span>
              )}
            </div>
          </div>
        )}

        {/* Main Input Container */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border-2 border-input bg-background px-4 py-3 transition-all focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleMicClick}
            disabled={disabled || !isMicSupported}
            className={cn(
              "h-9 w-9 p-0 flex-shrink-0 transition-all rounded-lg hidden md:flex",
              isListening && "bg-red-500/20 text-red-500 animate-pulse",
              !isMicSupported && "opacity-50 cursor-not-allowed",
            )}
            title={!isMicSupported ? "Microphone not supported" : isListening ? "Stop listening" : "Start listening"}
          >
            <Mic className={cn("h-5 w-5", isListening && "animate-bounce")} />
          </Button>

          {/* Input Field */}
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed min-h-10"
          />

          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className="h-9 w-9 p-0 flex-shrink-0 transition-all rounded-lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  },
)

MicrophoneInput.displayName = "MicrophoneInput"
