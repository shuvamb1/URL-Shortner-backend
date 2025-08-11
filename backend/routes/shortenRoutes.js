import express from 'express';
import shortid from 'shortid';
import Url from '../models/Url.js';

const router = express.Router();

router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const shortUrlId = shortid.generate();

  try {
    const shortUrl = `${baseUrl}/${shortUrlId}`;
    const newUrl = new Url({
      longUrl,
      shortUrl,
      urlCode: shortUrlId,
      date: new Date()
    });

    await newUrl.save();
    res.json(newUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

export default router;
