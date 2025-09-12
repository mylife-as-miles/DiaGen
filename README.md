
# DiaGen

**An AI-Driven System for Emotionally Coherent, Low-Latency, and Ethically Governed Dialogue Audio Synthesis**

DiaGen is an innovative Next.js 14 application and research prototype designed to solve critical challenges in dialogue generation. It delivers emotionally rich, broadcast-quality audio instantly and affordably. Powered by the **Dia Fast Generation 1 model**—a sophisticated, LoRA fine-tuned version of the open-weights Dia-1.6B model—DiaGen democratizes access to state-of-the-art text-to-audio synthesis. It provides creators, developers, and educators with a platform for generating high-quality dialogue while ensuring ethical use through a novel, blockchain-based consent framework.

---

## 🚀 Key Features

- **State-of-the-Art Dialogue Model**: Utilizes the **Dia Fast Generation 1 model**, a LoRA fine-tuned version of Dia-1.6B, for highly realistic and emotionally consistent speech.
- **High-Performance Synthesis**: Achieves real-time generation (>120 tokens/sec) on consumer GPUs (<6GB VRAM) through optimized architecture, quantization, and caching.
- **Advanced Prosody Control**: Go beyond basic text-to-speech with fine-grained control over pitch, energy, speaking rate, and emotional valence for truly expressive dialogue.
- **Ethical Voice Cloning**: Features an opt-in, blockchain-based speaker consent module to ensure that voice samples are used responsibly and with verifiable permission.
- **Voice Prompt Integration**: Upload or record a custom voice sample to guide tone, pitch, and speaker style, enabling personalized voice cloning.
- **Text-to-Dialogue Conversion**: Input structured dialogue text and generate high-fidelity, multi-speaker audio.
- **Waveform & Visualizer**: Real-time audio waveform and bar-visualizations via custom React components.

---

## 🎯 Project Aim

The aim of DiaGen is to design, implement, and validate a production-ready platform that addresses critical shortcomings in modern dialogue generation. The project focuses on three core challenges:

1. **Solving Inconsistent Prosody & Emotion**: Overcoming the "robotic or mismatched affect" in multi-turn dialogue by implementing models that maintain emotional continuity and natural prosodic flow between speakers.
2. **Eliminating High Latency & Compute Costs**: Making real-time, high-fidelity dialogue generation accessible on consumer hardware by leveraging parameter-efficient models, optimized architectures, and quantization.
3. **Addressing Ethical & Legal Ambiguity**: Pioneering a new standard for ethical AI by integrating a novel, decentralized speaker-consent verification system to prevent unauthorized voice cloning and ensure user protection.

---

## ⚖️ Ethical Considerations

The power of modern voice synthesis raises significant ethical concerns, primarily the potential for unauthorized use and deep-fake scams. As technology democratizes, the risk of a person's voice being cloned without their consent for malicious purposes grows.

DiaGen confronts this challenge directly by integrating a robust ethical framework into its core design:

- **Verifiable Consent**: An opt-in speaker-consent module cryptographically binds voice samples to an Ethereum-based ledger. This creates an immutable, publicly verifiable record of a speaker's permission to have their voice cloned.
- **User Empowerment**: The system is designed to support revocation and time-limited consent, giving individuals full control over how and when their voice data is used.
- **Transparency & Accountability**: By building on a decentralized ledger, DiaGen provides a transparent audit trail for voice usage, setting a new standard for responsible innovation in the field.

---

## 🌐 Significance & Applications

By providing accessible, high-quality, and ethically-governed dialogue generation, DiaGen has transformative potential across numerous domains:

- **Game Development & Animation**: Dramatically reduce voice-acting budgets and accelerate iteration cycles. Indie studios can create richer character narratives and generate thousands of lines of dynamic dialogue that adapt to player choices.
- **Educational Technology**: Localize e-learning content at scale, especially for low-resource languages. Create accessible audio textbooks, interactive language exercises, and personalized tutoring systems.
- **Content Creation & Media**: Empower independent creators to produce professional-quality podcasts, audiobooks, and animations without the need for expensive studio time or voice talent, democratizing the media landscape.
- **Accessibility & Assistive Tech**: Move beyond robotic screen readers to provide natural, engaging audio for the visually impaired. Customizable voices and emotional tones reduce cognitive load and create a more human-centric experience.
- **Open-Source Community & Research**: Provide a powerful benchmark system for extending research into singing synthesis, audiobook narration, and other advanced audio applications, fostering innovation and collaboration.

---

## 🛠 Technology Stack

- **Core Model**: Dia Fast Generation 1, a diffusion-based dialogue model enhanced with **LoRA (Low-Rank Adaptation)** for parameter-efficient fine-tuning.
- **Performance**: Real-time synthesis (>120 tokens/sec) on consumer hardware (<6GB VRAM) via 8-bit quantization, optimized attention mechanisms, and advanced caching.
- **Ethics & Governance**: Smart contract integration with an **Ethereum-based ledger** for immutable speaker consent verification.
- **Frontend**: Next.js 14 with App Router, React, TypeScript.
- **Styling**: Tailwind CSS, shadcn/ui components.
- **Backend**: Node.js API routes for handling generation requests.
- **Visualization**: Custom React components for waveform and bar visualizers.

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

For detailed explanations of each parameter, refer to the [Parameter Documentation](Parameters.md).

---

## 📈 Performance & Caching

To optimize performance:
- **Singleton Client**: Caches the Gradio client connection to reduce latency on subsequent requests.
- **Node.js Runtime**: Ensures full Buffer support in `/api` routes for efficient handling of audio data (`export const runtime = "nodejs"`).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Built with ♥️ using Next.js, Tailwind CSS, shadcn/ui, and the Dia Fast Generation 1 model
