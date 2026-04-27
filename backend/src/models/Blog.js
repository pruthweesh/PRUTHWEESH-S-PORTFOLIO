const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  image: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
