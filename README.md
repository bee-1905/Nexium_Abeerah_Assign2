Here’s a complete `README.md` for your **Blog Summariser Project**, integrating **web scraping**, **MongoDB with Mongoose**, **PostgreSQL with Prisma**, and **local Urdu translation** without external APIs:

---

````markdown
# 📚 Blog Summariser (Node.js + MongoDB + PostgreSQL)

This is a full-stack backend project that scrapes blog content from a URL, generates a short summary, translates it to Urdu (using a simple dictionary), and saves the results to both **MongoDB** and **PostgreSQL** using **Mongoose** and **Prisma** respectively.

---

## 🛠 Tech Stack

- **Node.js** with Express
- **Cheerio** and **Got** for web scraping
- **MongoDB** with Mongoose (for storing full blog content)
- **PostgreSQL** with Prisma (for storing summaries)
- **Environment variables** via `.env`

---

## 📦 Installation

```bash
git clone https://github.com/your-username/blog-summariser
cd blog-summariser
npm install
````

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://your-db-user:your-db-password@your-db-host:5432/postgres
MONGODB_URI=mongodb://localhost:27017/blogSummariser
```

> Make sure MongoDB is running locally or provide an Atlas URI.

---

## 🧾 Prisma Setup (PostgreSQL)

Run the following after setting your `.env`:

```bash
npx prisma db push
```

This will sync the `schema.prisma` with your Supabase/PostgreSQL database.

---

## 🚀 Start the Server

```bash
node n8n-webhook-setup.js
```

---

## 📮 API Endpoints

### `POST /webhook/summarise`

Scrapes a blog, summarises it, translates to Urdu, and saves to both databases.

#### Request Body:

```json
{
  "blogUrl": "https://example.com/some-article"
}
```

#### Response:

```json
{
  "blogTextPreview": "...",
  "summary": "Short summary here.",
  "summaryUrdu": "مختصر خلاصہ یہاں۔",
  "savedToDb": "post_id_here"
}
```

---

### `GET /summaries`

Fetch all summaries from PostgreSQL/Supabase.

---

### `GET /fullblogs`

Fetch full blog content stored in MongoDB.

---

### `DELETE /fullblogs/:id`

Delete a blog entry from MongoDB.

---

## 🧠 Urdu Translation

A hardcoded dictionary is used to translate English words to Urdu. This is only a basic simulation for demonstration purposes.

Example dictionary:

```js
const urduDictionary = {
  "the": "یہ",
  "world": "دنیا",
  "as": "جیسے",
  "we": "ہم",
  "have": "رکھا ہے",
  "created": "بنائی",
  ...
};
```

> ⚠️ For production-grade translation, consider integrating the [Google Cloud Translate API](https://cloud.google.com/translate) or [DeepL API](https://www.deepl.com/pro-api).

---

## ✨ Future Improvements

* ✅ Replace dictionary with Google Translate API
* ✅ Frontend interface to accept URL and show translated summary
* ⏳ Language selection (not just Urdu)
* ⏳ Rate limiting and caching
* ⏳ Auto-delete stale blogs from DB

---

## 📁 Folder Structure

```
assignment-2/
│
├── models/
│   └── FullBlog.js         # Mongoose model for full blog content
│
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   └── client.js           # Prisma client
│
├── .env                    # Environment variables
├── package.json
├── prismaClient.js
├── n8n-webhook-setup.js    # Main server file
└── README.md
```

---

## 👩‍💻 Author

Made  by **Abeerah Aamir**

---

