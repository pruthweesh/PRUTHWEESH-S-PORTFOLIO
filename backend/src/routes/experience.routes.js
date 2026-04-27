const express = require('express');
const router = express.Router();
const { getExperiences, getExperienceById, createExperience, updateExperience, deleteExperience } = require('../controllers/experience.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(getExperiences)
  .post(protect, createExperience);

router.route('/:id')
  .get(getExperienceById)
  .put(protect, updateExperience)
  .delete(protect, deleteExperience);

module.exports = router;
