const express = require('express');
const router = express.Router();
const { authUser, getUserProfile } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/login', authUser);
router.get('/profile', protect, admin, getUserProfile);

module.exports = router;
