import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 🔐 Check API key
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY missing in .env");
  process.exit(1);
}

// ── Rate Limiter ─────────────────────────────
const rateMap = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60_000;
  const maxReqs = 20;

  if (!rateMap.has(ip)) rateMap.set(ip, []);
  const hits = rateMap.get(ip).filter((t) => now - t < windowMs);

  if (hits.length >= maxReqs) {
    return res.status(429).json({
      error: "Too many requests. Please wait a minute.",
    });
  }

  hits.push(now);
  rateMap.set(ip, hits);
  next();
}

// ── Health Check ─────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: "openrouter-free" });
});

// ── Chat API (FREE) ──────────────────────────
app.post("/api/chat", rateLimit, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
    const reply = response.data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "API failed",
      details: error.response?.data || error.message,
    });
  }
});

// ── Chat Stream API ──────────────────────────
app.post("/api/chat/stream", rateLimit, async (req, res) => {
  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Build conversation history
    const messages = [
      { role: "system", content: "You are a helpful AI assistant." },
      ...(history || []).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: message },
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "No response";

    // Stream response token by token
    for (let i = 0; i < reply.length; i++) {
      res.write(`data: ${JSON.stringify({ token: reply[i] })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("❌ Streaming API Error:", error.response?.data || error.message);
    res.write(
      `data: ${JSON.stringify({ error: error.message || "Streaming failed" })}\n\n`
    );
    res.end();
  }
});

// ── 404 ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`----------------------------------\n`);
});