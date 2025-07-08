// ✅ Day 8 - Blog Scraper with Webhook + got
// Install with: npm install got@11 cheerio express cors

const express = require('express');
const got = require('got'); // ✅ correct got v11 import
const cheerio = require('cheerio');
const cors = require('cors');

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
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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

  console.log('✅ Blog scraped preview:\n', blogText.slice(0, 300));
  res.json({ blogText });

} catch (err) {
  console.error('❌ Scraping failed:', err.message);
  res.status(500).json({ error: 'Failed to fetch blog content.' });
}
});
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
