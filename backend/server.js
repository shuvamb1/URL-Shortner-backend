import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import shortid from "shortid";

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// ===== MongoDB Connection =====
mongoose.connect("mongodb+srv://urlshortner:shuv1234@cluster0.jt8bcxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ MongoDB connected"));

// ===== Schema =====
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
});

const Url = mongoose.model("Url", urlSchema);

// ===== API =====
app.post("/api/shorten", async (req, res) => {
  try {
    const { original_url } = req.body;

    if (!original_url || typeof original_url !== "string") {
      return res.status(400).json({ error: "Missing or invalid original_url" });
    }

    // Generate a unique short code
    const short_code = shortid.generate();

    const newUrl = new Url({ original_url, short_code });
    await newUrl.save();

    res.json({ short_url: `http://localhost:5000/${short_code}` });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Short code already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:short_code", async (req, res) => {
  try {
    const { short_code } = req.params;
    const found = await Url.findOne({ short_code });
    if (!found) return res.status(404).json({ error: "Short URL not found" });

    res.redirect(found.original_url);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





