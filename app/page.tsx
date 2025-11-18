"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Play, Pause, Wand2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AudioVisualizer } from "@/components/audio-visualizer"

export default function DiaGenApp() {
  const [inputText, setInputText] = useState(
    "[S1] Dia is an open weights text to dialogue model. [S2] You get full control over scripts and voices. [S1] Wow. Amazing. (laughs) [S2] Try it now on Git hub or Hugging Face.",
  )
  const [audioPrompt, setAudioPrompt] = useState<File | null>(null)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeTab, setActiveTab] = useState<"input" | "output">("input")
  const [showParticles, setShowParticles] = useState(false)

  // Parameter states
  const [maxNewTokens, setMaxNewTokens] = useState(860)
  const [cfgScale, setCfgScale] = useState(1)
  const [temperature, setTemperature] = useState(1)
  const [topP, setTopP] = useState(0.8)
  const [cfgFilterTopK, setCfgFilterTopK] = useState(15)
  const [speedFactor, setSpeedFactor] = useState(0.8)

  useEffect(() => {
    // Show particles effect when generating audio
    if (isGenerating) {
      setShowParticles(true)
    } else {
      const timer = setTimeout(() => setShowParticles(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isGenerating])

  const handleAudioPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioPrompt(e.target.files[0])
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const generateAudio = async () => {
    try {
      setIsGenerating(true)
      setLoadingProgress(0) // Reset progress
      setActiveTab("output")

      const formData = new FormData()
      formData.append("text_input", inputText)
      if (audioPrompt) {
        formData.append("audio_prompt_input", audioPrompt)
      }
      formData.append("max_new_tokens", maxNewTokens.toString())
      formData.append("cfg_scale", cfgScale.toString())
      formData.append("temperature", temperature.toString())
      formData.append("top_p", topP.toString())
      formData.append("cfg_filter_top_k", cfgFilterTopK.toString())
      formData.append("speed_factor", speedFactor.toString())

      // Simulate progress for a better user experience while waiting for the API
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 500)

      const response = await fetch("/api/generate-audio", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval) // Stop simulating progress

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.audioDataUrl) {
        setGeneratedAudio(result.audioDataUrl)
        setLoadingProgress(100)
      } else {
        throw new Error(result.error || "API returned an error")
      }
    } catch (error) {
      console.error("Error generating audio:", error)
      // Optionally, set an error state to display a message to the user
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white overflow-hidden">
      {/* Background particles effect */}
      {showParticles && <ParticlesBackground />}

      <div className="flex flex-col p-8 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              DiaGen
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "input" ? "default" : "outline"}
              onClick={() => setActiveTab("input")}
              className="rounded-full transition-all duration-300 hover:shadow-glow-blue"
            >
              Input
            </Button>
            <Button
              variant={activeTab === "output" ? "default" : "outline"}
              onClick={() => setActiveTab("output")}
              className="rounded-full transition-all duration-300 hover:shadow-glow-purple"
              disabled={!generatedAudio && !isGenerating}
            >
              Output
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {activeTab === "input" ? (
              <motion.div
                key="input-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 space-y-6 p-6 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-xl"
              >
                <div className="space-y-2">
                  <label className="text-xl font-medium text-blue-300">Input Text</label>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="h-40 bg-zinc-800/80 border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none text-white rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xl font-medium text-blue-300">Audio Prompt (Optional)</label>
                  <div
                    className="h-32 flex items-center justify-center border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-lg cursor-pointer transition-all duration-300 group"
                    onClick={() => document.getElementById("audio-upload")?.click()}
                  >
                    <input
                      type="file"
                      id="audio-upload"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioPromptChange}
                    />
                    {audioPrompt ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                      >
                        <p className="text-green-400 font-medium">{audioPrompt.name}</p>
                        <p className="text-xs text-zinc-400">{(audioPrompt.size / 1024 / 1024).toFixed(2)} MB</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center text-zinc-400 group-hover:text-blue-400 transition-colors duration-300">
                        <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <span>Upload audio prompt</span>
                      </div>
                    )}
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={generateAudio}
                    disabled={isGenerating}
                    className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-none shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isGenerating ? (
                      <>
                        Generating Audio... {Math.round(loadingProgress)}%
                        <div className="w-full bg-white/20 h-1 mt-1 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                            className="bg-blue-300 h-full"
                          />
                        </div>
                      </>
                    ) : (
                      "Generate Audio"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="output-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 space-y-6 p-6 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-xl"
              >
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-6">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animation-delay-150"></div>
                      <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-blue-400 animate-spin animation-delay-300"></div>
                    </div>
                    <p className="text-xl font-medium text-blue-300">Generating your audio...</p>
                    <p className="text-zinc-400">This may take a few moments</p>
                  </div>
                ) : generatedAudio ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-purple-300">Generated Audio</h3>
                      <div className="text-sm text-zinc-400">Ready to play</div>
                    </div>

                    <div className="bg-zinc-800/80 p-6 rounded-lg border border-zinc-700 shadow-inner">
                      <div className="flex items-center mb-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePlayPause}
                          className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 mr-4 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </motion.button>

                        <div className="flex-1 relative h-16">
                          <AudioVisualizer isPlaying={isPlaying} />
                        </div>

                        <div className="ml-4 text-zinc-300 font-mono">0:12</div>
                      </div>

                      <audio
                        ref={audioRef}
                        src={generatedAudio}
                        onEnded={() => setIsPlaying(false)}
                        onError={(e) => {
                          console.error("Audio error:", e)
                          setIsPlaying(false)
                        }}
                        className="hidden"
                      />

                      <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="text-sm font-medium text-zinc-300 mb-2">Transcript</h4>
                        <p className="text-sm text-zinc-400 italic">"{inputText.substring(0, 120)}..."</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full hover:bg-zinc-800 transition-all duration-300"
                        onClick={() => setActiveTab("input")}
                      >
                        Back to Input
                      </Button>
                      <Button
                        className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                        onClick={generateAudio}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <p className="text-xl font-medium text-zinc-400">No audio generated yet</p>
                    <Button
                      onClick={() => setActiveTab("input")}
                      className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                    >
                      Go to Input
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 p-6 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-xl"
          >
            <h3 className="text-xl font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Parameters
            </h3>

            <div className="space-y-6">
              <ParameterSlider
                label="Max New Tokens"
                value={maxNewTokens}
                min={100}
                max={3072}
                step={1}
                onChange={setMaxNewTokens}
              />

              <ParameterSlider
                label="CFG Scale"
                value={cfgScale}
                min={0.1}
                max={10}
                step={0.1}
                onChange={setCfgScale}
              />

              <ParameterSlider
                label="Temperature"
                value={temperature}
                min={0.1}
                max={2}
                step={0.1}
                onChange={setTemperature}
              />

              <ParameterSlider label="Top P" value={topP} min={0.1} max={1} step={0.1} onChange={setTopP} />

              <ParameterSlider
                label="CFG Filter Top K"
                value={cfgFilterTopK}
                min={1}
                max={50}
                step={1}
                onChange={setCfgFilterTopK}
              />

              <ParameterSlider
                label="Speed Factor"
                value={speedFactor}
                min={0.1}
                max={2}
                step={0.1}
                onChange={setSpeedFactor}
              />
            </div>

            <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Preset Configurations</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-xs transition-all duration-300"
                  onClick={() => {
                    setTemperature(0.7)
                    setTopP(0.9)
                    setCfgScale(1.5)
                  }}
                >
                  Natural
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-xs transition-all duration-300"
                  onClick={() => {
                    setTemperature(1.3)
                    setTopP(0.95)
                    setCfgScale(2.5)
                  }}
                >
                  Creative
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-xs transition-all duration-300"
                  onClick={() => {
                    setSpeedFactor(0.7)
                    setTemperature(0.5)
                  }}
                >
                  Slow & Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-xs transition-all duration-300"
                  onClick={() => {
                    setSpeedFactor(1.2)
                    setTemperature(0.8)
                  }}
                >
                  Fast Pace
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

interface ParameterSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function ParameterSlider({ label, value, min, max, step, onChange }: ParameterSliderProps) {
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-zinc-300 group-hover:text-blue-300 transition-colors duration-300">
          {label}
        </label>
        <span className="text-sm font-mono text-zinc-400 group-hover:text-blue-300 transition-colors duration-300">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className="py-1.5 group-hover:scale-[1.02] transition-transform duration-300"
      />
    </div>
  )
}

function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-blue-500/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animation: `float ${5 + Math.random() * 10}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}
