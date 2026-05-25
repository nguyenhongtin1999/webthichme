import { useState, useRef, useEffect, useCallback } from 'react'

interface UseVoiceInputReturn {
  isListening: boolean
  transcript: string
  isSupported: boolean
  startListening: (onFinal?: (finalTranscript: string) => void) => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(false)
  const onFinalTranscriptRef = useRef<((finalTranscript: string) => void) | undefined>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'vi-VN'

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setError(null)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          setError(event.error)
          setIsListening(false)
        }

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript

            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' '
            } else {
              interimTranscript += transcript
            }
          }

          const displayTranscript = finalTranscript || interimTranscript
          setTranscript(displayTranscript)

          // If final transcript and callback is provided, trigger the callback
          if (finalTranscript && onFinalTranscriptRef.current) {
            onFinalTranscriptRef.current(finalTranscript.trim())
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const startListening = useCallback((onFinal?: (finalTranscript: string) => void) => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError(null)
      onFinalTranscriptRef.current = onFinal
      recognitionRef.current.start()
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  }
}
