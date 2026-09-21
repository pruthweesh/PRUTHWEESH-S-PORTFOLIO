const express = require('express');
const router = express.Router();
const {
  authUser,
  getUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/login', authUser);
router.get('/profile', protect, admin, getUserProfile);

// Password Management Routes
router.route('/change-password')
  .post(protect, admin, changePassword)
  .put(protect, admin, changePassword);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
