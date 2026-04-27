const express = require('express');
const router = express.Router();
const {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification
} = require('../controllers/certification.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/')
  .get(getCertifications)
  .post(protect, admin, createCertification);

router.route('/:id')
  .get(getCertificationById)
  .put(protect, admin, updateCertification)
  .delete(protect, admin, deleteCertification);

module.exports = router;
