"use client"

import { useRef, useEffect } from "react"

interface AudioWaveformProps {
  audioUrl: string
  isPlaying: boolean
}

export function AudioWaveform({ audioUrl, isPlaying }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Create audio context
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256
      } catch (error) {
        console.error("Failed to create audio context:", error)
        return
      }
    }

    // Set up audio element
    if (!audioRef.current) {
      try {
        audioRef.current = new Audio()
        audioRef.current.crossOrigin = "anonymous"
        audioRef.current.src = audioUrl

        // Add error handling for audio loading
        audioRef.current.onerror = (e) => {
          console.error("Audio loading error:", e)
        }

        if (sourceRef.current) {
          sourceRef.current.disconnect()
        }

        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
      } catch (error) {
        console.error("Failed to set up audio element:", error)
        return
      }
    } else {
      // Update source if URL changes
      audioRef.current.src = audioUrl
    }

    // Play/pause based on prop
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err)
      })
      startAnimation()
    } else {
      audioRef.current.pause()
      stopAnimation()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Clean up audio resources
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [audioUrl, isPlaying])

  const startAnimation = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!analyserRef.current || !ctx) return

      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#0060df"

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }

  return <canvas ref={canvasRef} className="w-full h-12" />
}
