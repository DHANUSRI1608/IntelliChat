import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MODEL = process.env.MODEL || "gpt-4.1-mini";
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "You are Intellichat, a helpful, accurate, and friendly AI assistant. You provide clear, well-structured answers. When showing code, always use markdown code blocks with the language specified.";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Simple in-memory rate limiter (20 req/min per IP) ──────────────────
const rateMap = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60_000;
  const maxReqs = 20;

  if (!rateMap.has(ip)) rateMap.set(ip, []);
  const hits = rateMap.get(ip).filter((t) => now - t < windowMs);
  if (hits.length >= maxReqs) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }
  hits.push(now);
  rateMap.set(ip, hits);
  next();
}

// ── Health check ───────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: MODEL });
});

// ── Streaming chat endpoint (SSE) ─────────────────────────────────────
app.post("/api/chat/stream", rateLimit, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (message.length > 4000) {
    return res.status(400).json({ error: "Message too long (max 4000 chars)." });
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await client.chat.completions.create({
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })),
        { role: "user", content: message.trim() },
      ],
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("Stream error:", error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// ── Non-streaming fallback ────────────────────────────────────────────
app.post("/api/chat", rateLimit, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })),
        { role: "user", content: message.trim() },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// ── Generate conversation title ───────────────────────────────────────
app.post("/api/title", rateLimit, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required." });

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 20,
      messages: [
        {
          role: "system",
          content: "Generate a very short title (3-5 words max) for a conversation that starts with the following message. Reply with ONLY the title, no quotes, no punctuation at the end.",
        },
        { role: "user", content: message },
      ],
    });
    res.json({ title: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.json({ title: "New Chat" });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Intellichat server running on http://localhost:${PORT}`);
  console.log(`  Model: ${MODEL}`);
});