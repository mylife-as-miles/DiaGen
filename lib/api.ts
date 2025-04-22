import { Client } from "@gradio/client"

export interface GenerateAudioParams {
  text_input: string
  audio_prompt_input?: Blob
  max_new_tokens: number
  cfg_scale: number
  temperature: number
  top_p: number
  cfg_filter_top_k: number
  speed_factor: number
}

export async function generateAudio(params: GenerateAudioParams): Promise<{ audioUrl: string }> {
  try {
    const client = await Client.connect("nari-labs/Dia-1.6B")

    const result = await client.predict("/generate_audio", {
      text_input: params.text_input,
      audio_prompt_input: params.audio_prompt_input || null,
      max_new_tokens: params.max_new_tokens,
      cfg_scale: params.cfg_scale,
      temperature: params.temperature,
      top_p: params.top_p,
      cfg_filter_top_k: params.cfg_filter_top_k,
      speed_factor: params.speed_factor,
    })

    // In the real implementation, result.data would contain the audio URL
    return { audioUrl: result.data }
  } catch (error) {
    console.error("Error generating audio:", error)
    throw error
  }
}
