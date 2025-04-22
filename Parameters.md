
# DiaGen Parameters Documentation

This document provides a comprehensive overview of the parameters available for the `/api/generate-audio` endpoint and the `generateAudio` client wrapper in DiaGen. These parameters allow users to customize the text-to-audio synthesis process, controlling aspects such as dialogue structure, voice characteristics, and generation behavior.

---

## Parameters

| Parameter              | Type          | Required | Default | Description                                                                                  | Range/Constraints                          |
|------------------------|---------------|----------|---------|----------------------------------------------------------------------------------------------|--------------------------------------------|
| `text_input`           | String        | Yes      | N/A     | The dialogue script to convert to audio. Use `[S1]`, `[S2]`, etc., to denote different speakers. | Must be non-empty.                         |
| `audio_prompt_input`   | File/Blob     | No       | None    | An audio file or blob to guide the tone, pitch, and style of the generated voices.            | WAV or MP3 format, <10MB recommended.      |
| `max_new_tokens`       | Integer       | No       | 860     | Maximum number of audio tokens to generate, controlling output length.                        | 1–2048; higher values increase duration.   |
| `cfg_scale`            | Float         | No       | 1.0     | Classifier-Free Guidance scale; higher values increase adherence to the input text.           | 0.1–5.0; typical range: 0.8–1.5.           |
| `temperature`          | Float         | No       | 1.0     | Controls randomness in generation; lower values produce more predictable output.              | 0.1–2.0; typical range: 0.7–1.2.           |
| `top_p`                | Float         | No       | 0.8     | Nucleus sampling parameter; lower values focus on more probable outputs.                      | 0.1–1.0; typical range: 0.7–0.9.           |
| `cfg_filter_top_k`     | Integer       | No       | 15      | Limits the number of top tokens considered during CFG filtering for coherence.                | 1–100; typical range: 10–20.               |
| `speed_factor`         | Float         | No       | 1.0     | Adjusts the speaking speed of the generated audio.                                            | 0.5–2.0; 0.5=slower, 2.0=faster.          |

---

## Parameter Explanations

- **`text_input`**: The core input for dialogue generation. The script should be structured with speaker tags (e.g., `[S1]`, `[S2]`) to indicate different speakers. For example, `[S1] Hello! [S2] Hi there.` generates a conversation between two speakers. Ensure the text is clear and properly formatted to avoid parsing errors.

- **`audio_prompt_input`**: An optional audio file that serves as a reference for the vocal characteristics of the generated audio. This is particularly useful for personalizing speaker voices. For best results, use a high-quality, short audio clip (5–10 seconds) with clear speech.

- **`max_new_tokens`**: Determines the maximum length of the generated audio in terms of audio tokens. Higher values allow for longer dialogues but may increase processing time and resource usage. Adjust this based on the desired output duration.

- **`cfg_scale`**: Controls how closely the generated audio adheres to the input text. A higher `cfg_scale` emphasizes fidelity to the script, while lower values allow for more creative deviations. Values above 1.5 may lead to unnatural-sounding audio.

- **`temperature`**: Influences the randomness of the generation process. Lower values (e.g., 0.7) produce more deterministic and coherent output, while higher values (e.g., 1.2) introduce more variability, which can enhance expressiveness but may reduce coherence.

- **`top_p`**: Implements nucleus sampling, where the model considers only the smallest set of tokens whose cumulative probability exceeds `top_p`. Lower values (e.g., 0.7) produce more focused output, while higher values (e.g., 0.9) allow for more diversity.

- **`cfg_filter_top_k`**: Limits the number of top tokens considered during Classifier-Free Guidance filtering. This parameter helps maintain coherence by focusing on the most relevant tokens. Typical values range from 10 to 20 for balanced results.

- **`speed_factor`**: Modifies the playback speed of the generated audio. A value of 0.5 slows down the speech (useful for clarity or dramatic effect), while 2.0 speeds it up (suitable for fast-paced dialogue). Extreme values may affect audio quality.

---

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:3000/api/generate-audio \
  -F text_input="[S1] Hello! [S2] Dia here." \
  -F audio_prompt_input=@voice_sample.wav \
  -F max_new_tokens=860 \
  -F cfg_scale=1.0 \
  -F temperature=1.0 \
  -F top_p=0.8 \
  -F cfg_filter_top_k=15 \
  -F speed_factor=0.8
```

### JavaScript (Browser)

```javascript
import { generateAudio } from "../lib/api";

const { audioDataUrl } = await generateAudio({
  text_input: "[S1] Story begins... [S2] Next line.",
  // Optional: a File from an <input type="file" />
  audio_prompt_input: fileBlob,
  max_new_tokens: 1024,
  cfg_scale: 1.2,
  temperature: 0.9,
  top_p: 0.85,
  cfg_filter_top_k: 20,
  speed_factor: 1.0,
});

// audioDataUrl is a "data:audio/wav;base64,..." string for <audio> playback
```

---

## Notes

- **File Size for `audio_prompt_input`**: To ensure optimal performance, keep audio prompt files under 10MB. Larger files may cause delays or errors.
- **Parameter Tuning**: Experiment with `cfg_scale`, `temperature`, and `top_p` to balance creativity and coherence based on your use case (e.g., audiobooks vs. conversational agents).
- **Error Handling**: Ensure `text_input` is properly formatted with speaker tags. Invalid inputs may result in a 400 Bad Request response.
- **Performance**: The `max_new_tokens` and `speed_factor` parameters significantly affect processing time. For faster results, use lower `max_new_tokens` values or cache the Gradio client connection.

---

This documentation is part of the DiaGen project, licensed under the MIT License. For further details, refer to the [DiaGen README](README.md).
