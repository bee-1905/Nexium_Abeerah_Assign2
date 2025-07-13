// models/FullBlog.js

const mongoose = require('mongoose');

const fullBlogSchema = new mongoose.Schema({
  blogUrl: { type: String, required: true },
  fullContent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FullBlog', fullBlogSchema);
