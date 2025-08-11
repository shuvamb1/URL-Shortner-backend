import express from "express";
import Url from "../models/Url.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/urls", adminAuth, async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
