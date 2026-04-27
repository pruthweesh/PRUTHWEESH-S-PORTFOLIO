const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  field: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  period: { type: String, required: true },
  score: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Education', educationSchema);
