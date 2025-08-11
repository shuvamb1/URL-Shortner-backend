import express from "express";
import Url from "../models/Url.js";
import { nanoid } from "nanoid";

const router = express.Router();

// GET /api/shorten → API status page
router.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>URL Shortener API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          h1 { color: #2c3e50; }
          p { font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>✅ URL Shortener API is running</h1>
        <p>Use <b>POST /api/shorten</b> with JSON: { "originalUrl": "https://example.com" }</p>
      </body>
    </html>
  `);
});

// POST /api/shorten → Shorten a URL
router.post("/", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    const shortId = nanoid(8);
    const newUrl = new Url({ shortId, originalUrl });
    await newUrl.save();

    res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
      originalUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
