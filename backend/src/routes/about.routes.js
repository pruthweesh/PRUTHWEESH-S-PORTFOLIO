const express = require('express');
const router = express.Router();
const { getAbouts, getAboutById, createAbout, updateAbout, deleteAbout } = require('../controllers/about.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(getAbouts)
  .post(protect, createAbout);

router.route('/:id')
  .get(getAboutById)
  .put(protect, updateAbout)
  .delete(protect, deleteAbout);

module.exports = router;
