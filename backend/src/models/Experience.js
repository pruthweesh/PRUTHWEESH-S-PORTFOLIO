const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, required: true },
  roleTypes: { type: String },
  responsibilities: { type: [String], required: true },
  tags: { type: [String], required: true },
  images: { type: [String], default: [] },
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
