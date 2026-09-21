const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
  degree: { type: String, required: true },
  cgpa: { type: String, required: true },
  status: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String },
  email: { type: String },
  paragraphs: { type: [String], required: true },
  resumeLink: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
