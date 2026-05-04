import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    // Go STRAIGHT to the free LLM API
    console.log("🚀 Generating with free AI API...");
    const encodedPrompt = encodeURIComponent(prompt);
    
    // We use native fetch (available in Node 18+)
    const fetchResponse = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);
    
    if (!fetchResponse.ok) {
      throw new Error("Free API failed");
    }
    
    const text = await fetchResponse.text();
    res.json({ text });

  } catch (error) {
    console.error("🔥 ERROR:", error); 
    res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});