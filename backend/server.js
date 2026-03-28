import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables immediately
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Secure configuration
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const FEATHERLESS_API_KEY = process.env.FEATHERLESS_API_KEY;

// Throw early warning if backend is misconfigured
if (!FEATHERLESS_API_KEY) {
  console.warn("⚠️ WARNING: FEATHERLESS_API_KEY is missing from backend/.env!");
}

// -------------------------------------------------------------
// Safely serve Life OS frontend static files
// -------------------------------------------------------------
const frontendDist = path.join(__dirname, "../");
app.use('/css', express.static(path.join(frontendDist, 'css')));
app.use('/js', express.static(path.join(frontendDist, 'js')));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// -------------------------------------------------------------
// Secure LLM API Route (Proxies to Featherless AI)
// -------------------------------------------------------------
app.post("/api/llm", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' in request body." });
    }

    if (!FEATHERLESS_API_KEY) {
      return res.status(500).json({ error: "Server misconfiguration: API Key missing." });
    }

    // Call Featherless AI using OpenAI-compatible structures
    const response = await axios.post(
      "https://api.featherless.ai/v1/chat/completions",
      {
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant that only responds in raw, valid JSON. Do not return code blocks or markdown backticks." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      },
      {
        headers: {
          "Authorization": `Bearer ${FEATHERLESS_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000 // Ensure we don't hang infinitely
      }
    );

    res.json(response.data);

  } catch (err) {
    const status = err.response?.status || 500;
    const errorMessage = err.response?.data?.error?.message || err.message;
    console.error(`❌ Featherless API Error (${status}):`, errorMessage);
    res.status(status).json({ error: errorMessage });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Featherless Backend Server running on http://localhost:${PORT}`);
  console.log(`🔒 API Key loaded securely from environment variables.`);
});