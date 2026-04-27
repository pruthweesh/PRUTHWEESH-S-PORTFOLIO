const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Certification title is required'],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, 'Issuer is required'],
  },
  image: {
    type: String, // Cloudinary URL
    required: [true, 'Image is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certification', certificationSchema);
