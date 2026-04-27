const Certification = require('../models/Certification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find({}).sort({ date: -1 });
  res.json({ success: true, data: certifications });
});

const getCertificationById = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);
  if (certification) {
    res.json({ success: true, data: certification });
  } else {
    res.status(404);
    throw new Error('Certification not found');
  }
});

const createCertification = asyncHandler(async (req, res) => {
  const { title, issuer, image, date } = req.body;
  const certification = new Certification({ title, issuer, image, date });
  const createdCertification = await certification.save();
  res.status(201).json({ success: true, data: createdCertification });
});

const updateCertification = asyncHandler(async (req, res) => {
  const { title, issuer, image, date } = req.body;
  const certification = await Certification.findById(req.params.id);
  if (certification) {
    certification.title = title || certification.title;
    certification.issuer = issuer || certification.issuer;
    certification.image = image || certification.image;
    certification.date = date || certification.date;
    const updatedCertification = await certification.save();
    res.json({ success: true, data: updatedCertification });
  } else {
    res.status(404);
    throw new Error('Certification not found');
  }
});

const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);
  if (certification) {
    await certification.deleteOne();
    res.json({ success: true, message: 'Certification removed' });
  } else {
    res.status(404);
    throw new Error('Certification not found');
  }
});

module.exports = {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification
};
