const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required'],
  },
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  image: {
    type: String, // Cloudinary URL
    required: [true, 'Project image is required'],
  },
  features: {
    type: [String],
    default: [],
  },
  badge: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
