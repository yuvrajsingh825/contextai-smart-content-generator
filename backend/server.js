import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://contextai-smart-content-generator.vercel.app",
  /\.vercel\.app$/
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(allowed =>
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    );
    callback(null, true); // Allow all for now
  },
  credentials: true
}));
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Content Generation endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    console.log("🚀 Generating with Groq AI...");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are ContextAI, an expert content writer and marketing strategist. You create high-quality, engaging, and professional content. Always provide well-structured, detailed responses tailored to the user's request. Do not include meta-commentary about the task — just write the content directly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    if (!text) {
      throw new Error("Empty response from Groq");
    }

    console.log("✅ Content generated successfully");
    res.json({ text });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`✅ ContextAI Backend running on port ${PORT}`);

  // 💓 Keep-alive ping every 14 min to prevent Render free tier sleep
  setInterval(async () => {
    try {
      await fetch(`${SERVER_URL}/health`);
      console.log("💓 Keep-alive ping sent");
    } catch (err) {
      console.log("⚠️ Keep-alive ping failed:", err.message);
    }
  }, 14 * 60 * 1000);
});