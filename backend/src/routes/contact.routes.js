const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/contact.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/')
  .post(sendMessage)
  .get(protect, admin, getMessages);

module.exports = router;
