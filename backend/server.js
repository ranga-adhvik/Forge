import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); // Fix: Added JSON parser so req.body.prompt works!

// Safely serve frontend static files from the parent directory
const frontendDist = path.join(__dirname, "../");
app.use('/css', express.static(path.join(frontendDist, 'css')));
app.use('/js', express.static(path.join(frontendDist, 'js')));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.post("/api/llm", async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).json({ error: "Missing 'prompt' in request body." });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
      {
        inputs: `[INST] ${req.body.prompt} [/INST]`, // Fix: formatting prompt correctly
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("HF Inference Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error || err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});