const http = require("http");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { analyzeVoiceFile } = require("./voiceEngine");

const PORT = process.env.PORT || 3002;
const PUBLIC_DIR = path.join(__dirname, "public");

const upload = multer({
  dest: path.join(__dirname, "uploads"),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: mp3, wav, m4a, ogg, flac, webm"));
    }
  },
});

if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    serveFile(res, path.join(PUBLIC_DIR, "index.html"), "text/html; charset=utf-8");
    return;
  }

  if (req.method === "GET" && req.url === "/styles.css") {
    serveFile(res, path.join(PUBLIC_DIR, "styles.css"), "text/css; charset=utf-8");
    return;
  }

  if (req.method === "GET" && req.url === "/app.js") {
    serveFile(res, path.join(PUBLIC_DIR, "app.js"), "application/javascript; charset=utf-8");
    return;
  }

  if (req.method === "POST" && req.url === "/api/analyze") {
    upload.single("audio")(req, res, (err) => {
      if (err) {
        sendJson(res, 400, { error: err.message });
        return;
      }

      const file = req.file;
      if (!file) {
        sendJson(res, 400, { error: "No audio file uploaded" });
        return;
      }

      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== ".wav") {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        sendJson(res, 400, {
          error: "Real analysis currently supports WAV PCM16 only. Convert your file to .wav and retry.",
        });
        return;
      }

      let result;
      try {
        result = analyzeVoiceFile(file.path);
      } catch (analyzeErr) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        sendJson(res, 400, { error: analyzeErr.message || "Failed to analyze audio" });
        return;
      }

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      sendJson(res, 200, result);
    });
    return;
  }

  sendJson(res, 404, { error: "Route not found" });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} in use. Try: set PORT=3001 && npm start`);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`VoiceShield running at http://localhost:${PORT}`);
});
