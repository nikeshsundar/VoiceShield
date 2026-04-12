<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=50&color=00D4FF&center=true&vCenter=true&height=80&width=500&lines=VoiceShield" alt="VoiceShield">
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-00D4FF?style=for-the-badge&logo=version&logoColor=white">
  <img src="https://img.shields.io/badge/License-MIT-FF6B6B?style=for-the-badge&logo=license&logoColor=white">
  <img src="https://img.shields.io/badge/Node.js-18+-00D4FF?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/Open%20Source-%F0%9F%92%9A-green?style=for-the-badge&logo=opensource&logoColor=white">
</p>

---

<div align="center">

![VoiceShield Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2D2D2D,26,00D4FF&height=300&section=header&text=AI+Voice+Deepfake+Detector&fontSize=60&animation=fadeIn&align=center)

</div>

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Microphone.png" width="30"/> What is VoiceShield?
</h2>

**VoiceShield** is an open-source real-time AI voice deepfake detector that analyzes audio files to determine if they contain AI-generated or cloned voice content. Protect yourself and your loved ones from voice scam attacks.

> 🔒 **Privacy-First**: Your audio is processed locally and never stored

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Lightning.png" width="30"/> Features
</h2>

| Feature | Description |
|---------|-------------|
| 🎯 **Real-time Analysis** | Instant deepfake probability scoring |
| 🔊 **Waveform Visualization** | Beautiful audio waveform display |
| 🧠 **Heuristic Detection** | Advanced signal processing algorithms |
| 📊 **Risk Scoring** | 0-100% AI probability score |
| 💡 **Smart Recommendations** | Actionable security suggestions |
| 🔗 **One-click Sharing** | Share results instantly |
| 🚨 **Scam Reporting** | Built-in scam report system |

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Rocket.png" width="30"/> Quick Start
</h2>

```bash
# Clone the repository
git clone https://github.com/nikeshsundar/VoiceShield.git

# Navigate to project directory
cd VoiceShield

# Install dependencies
npm install

# Start the server
npm start
```

Then open **http://localhost:3002** in your browser

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" width="30"/> How It Works
</h2>

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌─────────────┐
│  Upload     │────▶│   WAV        │────▶│   Heuristic     │────▶│   Risk      │
│  Audio      │     │   Parser      │     │   Analysis      │     │   Score     │
└─────────────┘     └──────────────┘     └─────────────────┘     └─────────────┘
```

### Detection Algorithm

1. **WAV Parsing** - Extract PCM16 audio data
2. **Signal Analysis** - RMS variance, zero-crossing rate
3. **Prosody Detection** - Pause structure, loudness dynamics
4. **Risk Calculation** - Combine signals for final score

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Bar%20Chart.png" width="30"/> API Endpoint
</h2>

```http
POST /api/analyze
Content-Type: multipart/form-data

Body: audio file (.wav format)
```

**Response:**
```json
{
  "score": 78,
  "verdict": "Likely AI Generated",
  "findings": [
    {"reason": "Low loudness variation", "weight": 20},
    {"reason": "Almost no pauses detected", "weight": 12}
  ],
  "recommendations": [
    "Call the person back on a known number",
    "Ask a private memory question"
  ]
}
```

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png" width="30"/> Tech Stack
</h2>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6B6B?style=flat&logo=npm&logoColor=white)

</div>

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Warning.png" width="30"/> Disclaimer
</h2>

> ⚠️ VoiceShield is an assistive tool and may produce false positives/negatives. Always verify through alternative channels when in doubt. This tool uses heuristic analysis and is not a substitute for professional security advice.

---

<h2>
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Red%20Heart.png" width="30"/> Contributing
</h2>

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">

![Star Badge](https://img.shields.io/github/stars/nikeshsundar/VoiceShield?style=social)
![Fork Badge](https://img.shields.io/github/forks/nikeshsundar/VoiceShield?style=social)
![Watch Badge](https://img.shields.io/github/watchers/nikeshsundar/VoiceShield?style=social)

**Made with ❤️ by [Nikesh Sundar](https://github.com/nikeshsundar)**

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2D2D2D,26,00D4FF&height=100&section=footer)

</div>