const fs = require("fs");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readWavPcm16Mono(buffer) {
  if (buffer.length < 44) {
    throw new Error("Invalid WAV file");
  }

  const riff = buffer.toString("ascii", 0, 4);
  const wave = buffer.toString("ascii", 8, 12);
  if (riff !== "RIFF" || wave !== "WAVE") {
    throw new Error("Only WAV format is supported for real analysis");
  }

  let offset = 12;
  let audioFormat = 1;
  let channels = 1;
  let sampleRate = 16000;
  let bitsPerSample = 16;
  let dataStart = -1;
  let dataSize = 0;

  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;

    if (id === "fmt ") {
      audioFormat = buffer.readUInt16LE(start);
      channels = buffer.readUInt16LE(start + 2);
      sampleRate = buffer.readUInt32LE(start + 4);
      bitsPerSample = buffer.readUInt16LE(start + 14);
    }

    if (id === "data") {
      dataStart = start;
      dataSize = size;
      break;
    }

    offset = start + size + (size % 2);
  }

  if (audioFormat !== 1 || bitsPerSample !== 16) {
    throw new Error("Only PCM16 WAV supported in current real analyzer");
  }

  if (dataStart < 0 || dataStart + dataSize > buffer.length) {
    throw new Error("WAV data chunk missing or corrupted");
  }

  const bytesPerFrame = (bitsPerSample / 8) * channels;
  const frameCount = Math.floor(dataSize / bytesPerFrame);
  const samples = new Float32Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    const idx = dataStart + i * bytesPerFrame;
    const s = buffer.readInt16LE(idx);
    samples[i] = s / 32768;
  }

  return { samples, sampleRate, channels };
}

function frameRms(samples, start, len) {
  let sum = 0;
  const end = Math.min(samples.length, start + len);
  for (let i = start; i < end; i++) {
    const v = samples[i];
    sum += v * v;
  }
  const n = Math.max(1, end - start);
  return Math.sqrt(sum / n);
}

function zeroCrossingRate(samples, start, len) {
  let zc = 0;
  const end = Math.min(samples.length, start + len);
  for (let i = start + 1; i < end; i++) {
    if ((samples[i - 1] >= 0 && samples[i] < 0) || (samples[i - 1] < 0 && samples[i] >= 0)) {
      zc++;
    }
  }
  const n = Math.max(1, end - start);
  return zc / n;
}

function analyzeProsody(samples, sampleRate) {
  const frameSize = Math.max(256, Math.floor(sampleRate * 0.03));
  const hop = Math.max(128, Math.floor(sampleRate * 0.015));
  const rms = [];
  const zcr = [];

  for (let i = 0; i + frameSize < samples.length; i += hop) {
    rms.push(frameRms(samples, i, frameSize));
    zcr.push(zeroCrossingRate(samples, i, frameSize));
  }

  if (rms.length < 8) {
    return { rmsVar: 0, zcrVar: 0, silenceRatio: 0, speakingRatio: 1 };
  }

  const mean = rms.reduce((a, b) => a + b, 0) / rms.length;
  const rmsVar = rms.reduce((a, b) => a + (b - mean) * (b - mean), 0) / rms.length;

  const zMean = zcr.reduce((a, b) => a + b, 0) / zcr.length;
  const zcrVar = zcr.reduce((a, b) => a + (b - zMean) * (b - zMean), 0) / zcr.length;

  const silenceThreshold = Math.max(0.005, mean * 0.25);
  const silentFrames = rms.filter((v) => v < silenceThreshold).length;
  const silenceRatio = silentFrames / rms.length;

  return {
    rmsVar,
    zcrVar,
    silenceRatio,
    speakingRatio: 1 - silenceRatio,
  };
}

function estimateRiskFeatures(samples, sampleRate, channels) {
  const duration = samples.length / sampleRate;
  const absMean = samples.reduce((a, b) => a + Math.abs(b), 0) / Math.max(1, samples.length);
  const peak = samples.reduce((a, b) => Math.max(a, Math.abs(b)), 0);

  const prosody = analyzeProsody(samples, sampleRate);

  const findings = [];
  let score = 0;

  if (duration < 1.2) {
    score += 10;
    findings.push({ reason: "Very short clip (common in social scam snippets)", weight: 10 });
  }

  if (prosody.rmsVar < 0.0006) {
    score += 20;
    findings.push({ reason: "Low loudness variation (possible synthetic smoothness)", weight: 20 });
  }

  if (prosody.zcrVar < 0.000002) {
    score += 12;
    findings.push({ reason: "Low fine-grain signal variation", weight: 12 });
  }

  if (prosody.silenceRatio < 0.04) {
    score += 12;
    findings.push({ reason: "Almost no pauses detected", weight: 12 });
  }

  if (peak > 0.985) {
    score += 8;
    findings.push({ reason: "Near-clipping peak profile", weight: 8 });
  }

  if (absMean < 0.01) {
    score += 6;
    findings.push({ reason: "Extremely flat energy floor", weight: 6 });
  }

  if (channels === 1) {
    score += 3;
    findings.push({ reason: "Mono source (weak signal)", weight: 3 });
  }

  if (sampleRate < 16000) {
    score += 8;
    findings.push({ reason: "Low sample rate", weight: 8 });
  }

  const naturalSignals = [];
  if (prosody.silenceRatio >= 0.08 && prosody.silenceRatio <= 0.45) {
    naturalSignals.push("Natural pause structure");
    score -= 10;
  }

  if (prosody.rmsVar > 0.0012) {
    naturalSignals.push("Healthy loudness dynamics");
    score -= 12;
  }

  if (prosody.zcrVar > 0.000008) {
    naturalSignals.push("Natural micro-variation in waveform");
    score -= 8;
  }

  const finalScore = clamp(Math.round(score), 0, 100);
  return {
    score: finalScore,
    findings,
    naturalSignals,
    duration,
    sampleRate,
    channels,
  };
}

function verdictForScore(score) {
  if (score >= 65) return "Likely AI Generated";
  if (score >= 40) return "Possibly Synthetic";
  if (score >= 20) return "Uncertain";
  return "Likely Natural";
}

function recommendationsForScore(score) {
  if (score >= 65) {
    return [
      "Call the person back on a known number before acting.",
      "Ask a private memory question only they would know.",
      "Do not send money or OTP codes from voice-only requests.",
    ];
  }
  if (score >= 40) {
    return [
      "Verify identity through a second channel.",
      "Check the sender account for recent compromise signs.",
      "Treat urgent payment asks as suspicious until confirmed.",
    ];
  }
  return [
    "Audio looks relatively natural by current heuristics.",
    "Still verify identity for money/security requests.",
  ];
}

function analyzeVoiceFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const wav = readWavPcm16Mono(buffer);
  const stats = estimateRiskFeatures(wav.samples, wav.sampleRate, wav.channels);

  return {
    score: stats.score,
    verdict: verdictForScore(stats.score),
    findings: stats.findings.length > 0 ? stats.findings : [{ reason: "No strong synthetic indicators", weight: 0 }],
    naturalSignals: stats.naturalSignals,
    recommendations: recommendationsForScore(stats.score),
    metadata: {
      analyzedAt: new Date().toISOString(),
      duration: Number(stats.duration.toFixed(2)),
      sampleRate: stats.sampleRate,
      channels: stats.channels,
    },
  };
}

module.exports = {
  analyzeVoiceFile,
};
