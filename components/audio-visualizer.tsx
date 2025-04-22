"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

interface AudioVisualizerProps {
  isPlaying: boolean
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-between">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: "20%" }}
          animate={
            isPlaying
              ? {
                  height: [`${20 + Math.random() * 30}%`, `${50 + Math.random() * 50}%`, `${20 + Math.random() * 30}%`],
                  transition: {
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }
              : { height: "20%" }
          }
          className="w-1.5 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full"
        />
      ))}
    </div>
  )
}
