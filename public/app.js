const dropzone = document.getElementById("dropzone");
const audioInput = document.getElementById("audioInput");
const visualizer = document.getElementById("visualizer");
const waveformCanvas = document.getElementById("waveform");
const visualizerStatus = document.getElementById("visualizerStatus");
const resultSection = document.getElementById("result");
const scoreValue = document.getElementById("scoreValue");
const scoreArc = document.getElementById("scoreArc");
const verdictText = document.getElementById("verdictText");
const findingsList = document.getElementById("findingsList");
const recommendationsList = document.getElementById("recommendationsList");
const shareBtn = document.getElementById("shareBtn");
const reportBtn = document.getElementById("reportBtn");
const debugPanel = document.getElementById("debugPanel");

let audioContext;
let analyser;
let dataArray;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
}

function drawWaveform() {
  const canvas = waveformCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;

  function draw() {
    if (!analyser) return;

    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "#12121a";
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#00d4ff";
    ctx.beginPath();

    const sliceWidth = width / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  draw();
}

function setScore(score) {
  const safeScore = Number.isFinite(Number(score)) ? Math.max(0, Math.min(100, Number(score))) : 0;
  scoreValue.textContent = Math.round(safeScore);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (safeScore / 100) * circumference;
  scoreArc.style.strokeDashoffset = offset;

  let color;
  if (safeScore >= 65) color = "#ef4444";
  else if (safeScore >= 40) color = "#f59e0b";
  else if (safeScore >= 20) color = "#fbbf24";
  else color = "#10b981";

  scoreArc.style.stroke = color;
  scoreArc.parentElement.style.color = color;
}

function getVerdictClass(verdict) {
  if (verdict === "Likely AI Generated") return "verdict-likely-ai";
  if (verdict === "Possibly Synthetic") return "verdict-possibly-synthetic";
  if (verdict === "Uncertain") return "verdict-uncertain";
  return "verdict-likely-natural";
}

function renderResult(data) {
  setScore(data.score);

  verdictText.textContent = data.verdict;
  verdictText.className = getVerdictClass(data.verdict);

  findingsList.innerHTML = "";
  for (const finding of data.findings || []) {
    const li = document.createElement("li");
    li.textContent = `${finding.reason} (${finding.weight})`;
    findingsList.appendChild(li);
  }

  recommendationsList.innerHTML = "";
  for (const rec of data.recommendations || []) {
    const li = document.createElement("li");
    li.textContent = rec;
    recommendationsList.appendChild(li);
  }

  resultSection.style.display = "block";
  resultSection.classList.remove("hidden");
}

function showVisualizer() {
  visualizer.style.display = "block";
  initAudioContext();
  drawWaveform();
  visualizerStatus.textContent = "Analyzing audio...";
}

async function analyzeAudio(file) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (ext !== "wav") {
    visualizer.style.display = "block";
    visualizerStatus.textContent = "Please upload a PCM16 .wav file for real analysis.";
    return;
  }

  showVisualizer();

  const formData = new FormData();
  formData.append("audio", file);

  try {
    debugPanel.style.display = "block";
    debugPanel.textContent = "Uploading and analyzing...";
    
    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    debugPanel.textContent = "Response: " + JSON.stringify(data).substring(0, 200);
    
    if (!response.ok) throw new Error(data.error || "Analysis failed");

    visualizerStatus.textContent = "Analysis complete!";
    renderResult(data);
  } catch (err) {
    visualizerStatus.textContent = `Error: ${err.message}`;
    debugPanel.textContent = "Error: " + err.message;
    console.error(err);
  }
}

window.addEventListener("error", (e) => {
  visualizerStatus.textContent = `UI error: ${e.message}`;
});

dropzone.addEventListener("click", () => audioInput.click());

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("audio/")) {
    analyzeAudio(file);
  }
});

audioInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    analyzeAudio(file);
  }
});

shareBtn.addEventListener("click", () => {
  const score = scoreValue.textContent;
  const verdict = verdictText.textContent;
  const text = `🎙️ VoiceShield detected ${verdict} (${score}% AI probability). Test any voice note for free.`;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    shareBtn.textContent = "Copied!";
    setTimeout(() => {
      shareBtn.innerHTML = "<span>📤</span> Share Result";
    }, 2000);
  }
});

reportBtn.addEventListener("click", () => {
  alert("🚨 Report submitted! This helps build the community scam database. Thank you!");
});
