import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MODEL_NAME = process.env.MODEL || "gemini-2.0-flash";
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "You are Intellichat, a helpful, accurate, and friendly AI assistant. Give clear and structured answers. Use markdown for code.";

// ── Validate API Key on startup ─────────────────────────────────
if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ ERROR: GOOGLE_API_KEY is not set in your .env file!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ── Rate Limiter (20 requests/min per IP) ───────────────────────
const rateMap = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60_000;
  const maxReqs = 20;

  if (!rateMap.has(ip)) rateMap.set(ip, []);
  const hits = rateMap.get(ip).filter((t) => now - t < windowMs);

  if (hits.length >= maxReqs) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute." });
  }

  hits.push(now);
  rateMap.set(ip, hits);
  next();
}

// ── Helper: Build Gemini-compatible content array ───────────────
function buildContents(message, history = []) {
  const contents = [];

  history.slice(-10).forEach((m) => {
    contents.push({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    });
  });

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  return contents;
}

// ── Health Check ────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: MODEL_NAME });
});

// ── Streaming Chat (SSE) ────────────────────────────────────────
app.post("/api/chat/stream", rateLimit, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (message.length > 4000) {
    return res.status(400).json({ error: "Message too long (max 4000 chars)." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
    });

    const stream = await model.generateContentStream({
      contents: buildContents(message.trim(), history),
    });

    for await (const chunk of stream.stream) {
      const text = chunk.text?.();
      if (text) {
        res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("❌ Stream error:", error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// ── Non-Streaming Chat ──────────────────────────────────────────
app.post("/api/chat", rateLimit, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (message.length > 4000) {
    return res.status(400).json({ error: "Message too long (max 4000 chars)." });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent({
      contents: buildContents(message.trim(), history),
    });

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ── Title Generator ─────────────────────────────────────────────
app.post("/api/title", rateLimit, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "Generate a short, creative title (3-5 words) for a chat conversation that starts with this message. Return ONLY the title text, no quotes, no punctuation at the end.\n\n" +
                message,
            },
          ],
        },
      ],
    });

    res.json({ title: result.response.text().trim() });
  } catch (error) {
    console.error("❌ Title error:", error.message);
    res.json({ title: "New Conversation" });
  }
});

// ── 404 Handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Intellichat Server running!`);
  console.log(`📍 URL:   http://localhost:${PORT}`);
  console.log(`🤖 Model: ${MODEL_NAME}`);
  console.log(`----------------------------------\n`);
});