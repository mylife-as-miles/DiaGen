DiaGen

An AI-Driven System for Dynamic Dialogue Audio Synthesis

DiaGen is an innovative Next.js 14 + App Router application and research prototype that bridges the gap between written dialogue scripts and naturalistic audio conversation generation. Powered by Startrz AI technology and the open‑weights Dia-1.6B model, DiaGen democratizes access to advanced text-to-audio synthesis, providing creators, developers, educators, and researchers with full control over script design, vocal characteristics, and speech dynamics citeturn0file0.


---

🚀 Key Features

Text-to-Dialogue Conversion: Input structured dialogue text and generate high-fidelity, multi-speaker audio.

Voice Prompt Integration: Upload or record a custom voice sample to guide tone, pitch, and speaker style.

Fine‑Tuned Generation Control: Adjust CFG scale, temperature, top-p sampling, and speed factor to balance creativity vs. coherence.

Open‑Weight Model Philosophy: Leverage Dia-1.6B’s transparent, adaptable weights for reproducibility and research transparency.

Waveform & Visualizer: Real-time audio waveform and bar-visualizations via custom React components.

User‑Friendly Interface: Modern UI built on Tailwind CSS and shadcn/ui components for seamless user experience.



---

🎯 Research Objectives

1. Quality Evaluation: Quantitatively assess the impact of generation parameters (temperature, CFG scale, top-p) on perceived audio realism and coherence.


2. User Personalization: Investigate user experience outcomes when customizing speaker identity through audio prompts.


3. Expressiveness & Fluency: Analyze dialogue fluidity and emotional expressiveness across varying speed factors.


4. Accessibility Impact: Explore DiaGen’s applicability as an assistive tool for visually impaired users, enhancing access to text content.




---

🌐 Potential Applications

Conversational Agents & Chatbots

Audiobook and Podcast Production

Gaming NPC Dialogue Generation

Assistive Technologies for the Visually Impaired

Virtual Storytelling and Education Platforms



---

🛠 Technology Stack


---

📂 Project Structure

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


---

🔧 Prerequisites & Setup

1. Clone the repo:

git clone https://github.com/your-org/diagen.git
cd diagen


2. Install dependencies:

npm install
# or yarn install


3. Run development server:

npm run dev


4. Open http://localhost:3000 in your browser.



DiaGen requires Node.js ≥ v18 and internet access to the Gradio-hosted Space.


---

💡 Usage

API Route: /api/generate-audio

Method: POST

Content‑Type: multipart/form-data

Fields:

text_input (string, required)

audio_prompt_input (file/blob, optional)

max_new_tokens (int)

cfg_scale (float)

temperature (float)

top_p (float)

cfg_filter_top_k (int)

speed_factor (float)



Response:

{
  "success": true,
  "audioDataUrl": "data:audio/wav;base64,..."
}

Client Wrapper (lib/api.ts)

Import and call:

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


---

📈 Performance & Caching

Singleton Client: Caches the Gradio client connection to reduce latency.

Node.js Runtime: Ensures full Buffer support in /api routes (export const runtime = "nodejs").



---

📝 License

MIT © Startrz

Built with ♥️ using Next.js, Tailwind CSS, shadcn/ui, and Dia-1.6B

