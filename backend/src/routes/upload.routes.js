const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { protect, admin } = require('../middleware/auth.middleware');

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path, // Cloudinary URL
  });
});

module.exports = router;
