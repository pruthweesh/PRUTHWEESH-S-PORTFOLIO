const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  images: {
    type: [String], // Array of Cloudinary URLs
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
