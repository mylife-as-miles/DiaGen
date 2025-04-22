import { type NextRequest, NextResponse } from "next/server"
import { Client } from "@gradio/client"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const textInput = formData.get("text_input") as string
    const audioPromptInput = formData.get("audio_prompt_input") as Blob | null
    const maxNewTokens = Number.parseInt(formData.get("max_new_tokens") as string)
    const cfgScale = Number.parseFloat(formData.get("cfg_scale") as string)
    const temperature = Number.parseFloat(formData.get("temperature") as string)
    const topP = Number.parseFloat(formData.get("top_p") as string)
    const cfgFilterTopK = Number.parseInt(formData.get("cfg_filter_top_k") as string)
    const speedFactor = Number.parseFloat(formData.get("speed_factor") as string)

    // Connect to the Dia-1.6B model API
    const client = await Client.connect("nari-labs/Dia-1.6B")

    // Generate audio using the model
    const result = await client.predict("/generate_audio", {
      text_input: textInput,
      audio_prompt_input: audioPromptInput,
      max_new_tokens: maxNewTokens,
      cfg_scale: cfgScale,
      temperature: temperature,
      top_p: topP,
      cfg_filter_top_k: cfgFilterTopK,
      speed_factor: speedFactor,
    })

    // Return the generated audio
    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error generating audio:", error)
    return NextResponse.json({ success: false, error: "Failed to generate audio" }, { status: 500 })
  }
}
