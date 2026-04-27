const express = require('express');
const router = express.Router();
const { getEducations, getEducationById, createEducation, updateEducation, deleteEducation } = require('../controllers/education.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
  .get(getEducations)
  .post(protect, createEducation);

router.route('/:id')
  .get(getEducationById)
  .put(protect, updateEducation)
  .delete(protect, deleteEducation);

module.exports = router;
