// ✅ Day 10 - Blog Scraper with Webhook + got + Prisma
// Install with: npm install got@11 cheerio express cors @prisma/client

const express = require('express');
const got = require('got'); // ✅ correct got v11 import
const cheerio = require('cheerio');
const cors = require('cors');
const prisma = require('./prismaClient'); // ✅ Import Prisma

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Webhook endpoint to receive POST request with blogUrl
app.post('/webhook/summarise', async (req, res) => {
  const { blogUrl } = req.body;

  if (!blogUrl) {
    return res.status(400).json({ error: 'Missing blogUrl in request body.' });
  }

  try {
    const response = await got(blogUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html'
      }
    });

    const $ = cheerio.load(response.body);

    // Extract main content
    let blogText =
      $('article').text().trim() ||
      $('div.post-content').text().trim() ||
      $('main').text().trim() ||
      $('body').text().trim();

    if (!blogText || blogText.length < 100) {
      throw new Error('No readable content found on page.');
    }

    // ✅ Simulate summary: grab first 2 sentences
    const sentences = blogText.split(/(?<=[.?!])\s+/);
    const summary = sentences.slice(0, 2).join(' ');

    // ✅ Urdu dictionary for translation
    const urduDictionary = {
      "the": "یہ",
      "world": "دنیا",
      "as": "جیسے",
      "we": "ہم",
      "have": "رکھا ہے",
      "created": "بنائی",
      "it": "یہ",
      "is": "ہے",
      "a": "ایک",
      "process": "عمل",
      "of": "کا",
      "our": "ہماری",
      "thinking": "سوچ",
      "cannot": "نہیں سکتا",
      "be": "ہونا",
      "changed": "بدلا",
      "without": "کے بغیر",
      "changing": "بدلنا"
    };

    // ✅ Translate summary word by word
    const summaryUrdu = summary
      .split(/\s+/)
      .map(word => {
        const cleaned = word.toLowerCase().replace(/[^a-z]/gi, '');
        return urduDictionary[cleaned] || word;
      })
      .join(' ');

    // ✅ Save to PostgreSQL (Supabase) via Prisma
    const saved = await prisma.summary.create({
      data: {
        blogUrl,
        summary,
        summaryUrdu
      }
    });

    res.json({
      blogTextPreview: blogText.slice(0, 300) + "...",
      summary,
      summaryUrdu,
      savedToDb: saved.id
    });

  } catch (err) {
    console.error('❌ Scraping failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch blog content.' });
  }
});

app.get('/summaries', async (req, res) => {
  const all = await prisma.summary.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(all);
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
