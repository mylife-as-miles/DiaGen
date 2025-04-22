
# DiaGen

**An AI-Driven System for Dynamic Dialogue Audio Synthesis**

DiaGen is an innovative Next.js 14 application and research prototype that bridges the gap between written dialogue scripts and naturalistic audio conversation generation. Powered by Startrz AI technology and the open-weights Dia-1.6B model, DiaGen democratizes access to advanced text-to-audio synthesis, providing creators, developers, educators, and researchers with full control over script design, vocal characteristics, and speech dynamics.

---

## 🚀 Key Features

- **Open-Weight Model Philosophy**: Leverage Dia-1.6B’s transparent, adaptable weights for reproducibility and research transparency.
- **Text-to-Dialogue Conversion**: Input structured dialogue text and generate high-fidelity, multi-speaker audio.
- **Voice Prompt Integration**: Upload or record a custom voice sample to guide tone, pitch, and speaker style.
- **Fine-Tuned Generation Control**: Adjust CFG scale, temperature, top-p sampling, and speed factor to balance creativity vs. coherence.
- **Waveform & Visualizer**: Real-time audio waveform and bar-visualizations via custom React components.
- **User-Friendly Interface**: Modern UI built on Tailwind CSS and shadcn/ui components for seamless user experience.

---

## 🎯 Research Objectives

DiaGen aims to advance the field of text-to-audio synthesis through the following research objectives:

1. **Quality Evaluation**: Quantitatively assess the impact of generation parameters (temperature, CFG scale, top-p) on perceived audio realism and coherence.
2. **User Personalization**: Investigate user experience outcomes when customizing speaker identity through audio prompts.
3. **Expressiveness & Fluency**: Analyze dialogue fluidity and emotional expressiveness across varying speed factors.
4. **Accessibility Impact**: Explore DiaGen’s applicability as an assistive tool for visually impaired users, enhancing access to text content.

---

## 🌐 Potential Applications

- **Conversational Agents & Chatbots**: Enhance virtual assistants with more natural and dynamic dialogue.
- **Audiobook and Podcast Production**: Automate the creation of multi-voice audio content from scripts.
- **Gaming NPC Dialogue Generation**: Provide game developers with tools to create diverse and realistic character interactions.
- **Assistive Technologies for the Visually Impaired**: Convert written content into accessible audio formats.
- **Virtual Storytelling and Education Platforms**: Enable interactive and immersive learning experiences through audio.

---

## 🛠 Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Node.js API routes
- **Audio Processing**: Gradio client for Dia-1.6B model
- **Visualization**: Custom React components for waveform and bar visualizers

---

## 📂 Project Structure

```
├── app
│   ├── api
│   │   └── generate-audio
│   │       └── route.ts        # Node.js API route for /api/generate-audio
│   ├── globals.css            # Tailwind imports
│   ├── layout.tsx             # Root layout & theme
│   └── page.tsx               # UI for recording/uploading & generation
├── components                 # Custom UI + visualizer components
├── lib
│   └── api.ts                 # `generateAudio` client wrapper
├── public                     # Static assets (placeholders, logos)
├── styles                     # Additional global CSS
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript settings
└── README.md                  # This document
```

---

## 🔧 Prerequisites & Setup

1. Clone the repository:
   ```
   git clone https://github.com/mylife-as-miles/DiaGen.git
   cd diagen
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: DiaGen requires Node.js ≥ v18 and internet access to the Gradio-hosted Space.

---

## 💡 Usage

### API Route: `/api/generate-audio`

- **Method**: POST
- **Content-Type**: multipart/form-data

**Fields**:
- `text_input` (string, required)
- `audio_prompt_input` (file/blob, optional)
- `max_new_tokens` (int)
- `cfg_scale` (float)
- `temperature` (float)
- `top_p` (float)
- `cfg_filter_top_k` (int)
- `speed_factor` (float)

**Response**:
```json
{
  "success": true,
  "audioDataUrl": "data:audio/wav;base64,..."
}
```

**Client Wrapper** (`lib/api.ts`):
```typescript
import { generateAudio } from "../lib/api";

const { audioDataUrl } = await generateAudio({
  text_input: "[S1] Hello world! [S2] Dia speaking.",
  audio_prompt_input: myBlob,
  max_new_tokens: 860,
  cfg_scale: 1,
  temperature: 1,
  top_p: 0.8,
  cfg_filter_top_k: 15,
  speed_factor: 0.8,
});
// Use <audio src={audioDataUrl} controls />
```

For detailed explanations of each parameter, refer to the [Parameter Documentation](link-to-docs).

---

## 📈 Performance & Caching

To optimize performance:
- **Singleton Client**: Caches the Gradio client connection to reduce latency on subsequent requests.
- **Node.js Runtime**: Ensures full Buffer support in `/api` routes for efficient handling of audio data (`export const runtime = "nodejs"`).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built with ♥️ using Next.js, Tailwind CSS, shadcn/ui, and Dia-1.6B
