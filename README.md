# VoiceShield - AI Voice Deepfake Detector

VoiceShield is an open-source real-time AI voice deepfake detector. Upload a WAV file and get a heuristic deepfake probability score.

## What it does

- Upload WAV voice notes (PCM16)
- Analyze audio for AI synthesis markers
- Detect voice cloning signatures (ElevenLabs, Respeecher, Coqui, VALL-E)
- Calculate deepfake probability score (0-100%)
- Provide actionable recommendations
- One-click share results and report scams

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Features

### Detection Engine
- Spectral anomaly detection
- Voice cloning model fingerprinting
- Natural voice signal validation
- Short audio scam detection

### Supported Cloning Signatures
- ElevenLabs
- Respeecher
- Coqui TTS
- Bark
- VALL-E

### Input format

- Current real analyzer supports PCM16 `.wav` files.
- Compressed formats (`.mp3`, `.m4a`, `.ogg`) can be added with ffmpeg decoding in next step.

## API Endpoints

- `POST /api/analyze` - Upload `.wav` audio file for analysis

## Tech Stack

- Node.js + Express
- Multer for file handling
- Web Audio API for waveform visualization
- Pure CSS dark theme with cyan/purple accents

## Disclaimer

VoiceShield is an assistive tool and may produce false positives/negatives. Always verify through alternative channels when in doubt.
