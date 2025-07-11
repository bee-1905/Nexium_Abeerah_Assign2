// ✅ Day 11 - Blog Scraper with MongoDB (Mongoose) + PostgreSQL (Prisma)

const express = require('express');
const got = require('got'); // ✅ got@11
const cheerio = require('cheerio');
const cors = require('cors');
const prisma = require('./prismaClient'); // ✅ Prisma client
const mongoose = require('mongoose');
require('dotenv').config();

const FullBlog = require('./models/FullBlog'); // ✅ Mongoose model

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ POST Webhook: Scrape, summarise, translate, save to both databases
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

    let blogText =
      $('article').text().trim() ||
      $('div.post-content').text().trim() ||
      $('main').text().trim() ||
      $('body').text().trim();

    if (!blogText || blogText.length < 100) {
      throw new Error('No readable content found on page.');
    }

    // ✅ Summary logic
    const sentences = blogText.split(/(?<=[.?!])\s+/);
    const summary = sentences.slice(0, 2).join(' ');

    const urduDictionary = {
      "the": "یہ", "world": "دنیا", "as": "جیسے", "we": "ہم", "have": "رکھا ہے",
      "created": "بنائی", "it": "یہ", "is": "ہے", "a": "ایک", "process": "عمل",
      "of": "کا", "our": "ہماری", "thinking": "سوچ", "cannot": "نہیں سکتا",
      "be": "ہونا", "changed": "بدلا", "without": "کے بغیر", "changing": "بدلنا"
    };

    const summaryUrdu = summary
      .split(/\s+/)
      .map(word => {
        const cleaned = word.toLowerCase().replace(/[^a-z]/gi, '');
        return urduDictionary[cleaned] || word;
      })
      .join(' ');

    // ✅ Save full content to MongoDB
    const fullBlog = new FullBlog({ blogUrl, fullContent: blogText });
    await fullBlog.save();

    // ✅ Save summary to PostgreSQL (Supabase) using Prisma
    const saved = await prisma.summary.create({
      data: { blogUrl, summary, summaryUrdu }
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

// ✅ GET all summaries from PostgreSQL
app.get('/summaries', async (req, res) => {
  const all = await prisma.summary.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(all);
});

// ✅ Optional: GET all full blogs from MongoDB
app.get('/fullblogs', async (req, res) => {
  const blogs = await FullBlog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// ✅ Optional: DELETE blog from MongoDB
app.delete('/fullblogs/:id', async (req, res) => {
  await FullBlog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
