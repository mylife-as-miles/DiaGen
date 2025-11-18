import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const textInput = formData.get("text_input") as string
    const audioPromptInput = formData.get("audio_prompt_input") as Blob | null

    const input: any = {
      text: textInput,
      max_new_tokens: Number.parseInt(formData.get("max_new_tokens") as string),
      cfg_scale: Number.parseFloat(formData.get("cfg_scale") as string),
      temperature: Number.parseFloat(formData.get("temperature") as string),
      top_p: Number.parseFloat(formData.get("top_p") as string),
      cfg_filter_top_k: Number.parseInt(formData.get("cfg_filter_top_k") as string),
      speed_factor: Number.parseFloat(formData.get("speed_factor") as string),
    }

    if (audioPromptInput) {
      const audioBuffer = await audioPromptInput.arrayBuffer()
      const buffer = Buffer.from(audioBuffer)
      const mimeType = audioPromptInput.type
      const base64 = buffer.toString("base64")
      input.audio_prompt = `data:${mimeType};base64,${base64}`
    }

    console.log("Replicate input:", input)

    const output = await replicate.run(
      "zsxkib/dia:2119e338ca5c0dacd3def83158d6c80d431f2ac1024146d8cca9220b74385599",
      {
        input,
      },
    )

    console.log("Replicate output:", output)

    const audioUrl = Array.isArray(output) ? output[0] : output

    if (!audioUrl) {
      throw new Error("API did not return an audio file.")
    }

    return NextResponse.json({
      success: true,
      audioDataUrl: audioUrl,
    })
  } catch (error) {
    console.error("Error generating audio:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      { success: false, error: "Failed to generate audio", details: errorMessage },
      { status: 500 },
    )
  }
}
