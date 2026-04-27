const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: ['frontend', 'backend', 'database', 'tools', 'programming languages'],
  },
  level: {
    type: Number, // 1 to 100 optional
    min: 1,
    max: 100,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
