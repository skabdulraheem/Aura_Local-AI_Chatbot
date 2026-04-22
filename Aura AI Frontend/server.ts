import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3.1-flash-lite-preview";

      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: "You are Aura, a sophisticated and helpful AI assistant with a focus on clear, concise, and elegant communication. You are embedded in a stunning web interface.",
        },
        history: history || [],
      });

      const result = await chat.sendMessage({ message: prompt });
      res.json({ text: result.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Mock Auth Endpoints
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    // In a real app, you'd save to a database here
    res.json({ user: { name, email }, message: "Signup successful" });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // In a real app, you'd verify credentials here
    const name = email.split("@")[0];
    res.json({ user: { name, email }, message: "Login successful" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
