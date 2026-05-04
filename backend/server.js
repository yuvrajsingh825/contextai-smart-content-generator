import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://contextai-smart-content-generator.vercel.app",
  // Allow any vercel preview URLs too
  /\.vercel\.app$/
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, can restrict later
    }
  },
  credentials: true
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    console.log("🚀 Generating with free AI API...");
    const encodedPrompt = encodeURIComponent(prompt);

    // Add a 60-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const fetchResponse = await fetch(
      `https://text.pollinations.ai/${encodedPrompt}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!fetchResponse.ok) {
      throw new Error(`AI API error: ${fetchResponse.status}`);
    }

    const text = await fetchResponse.text();
    res.json({ text });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    if (error.name === "AbortError") {
      res.status(504).json({ error: "AI request timed out. Please try again." });
    } else {
      res.status(500).json({ error: error.message || "Something went wrong" });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});