const Education = require('../models/Education');
const asyncHandler = require('../utils/asyncHandler');

const getEducations = asyncHandler(async (req, res) => {
  const educations = await Education.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: educations });
});

const getEducationById = asyncHandler(async (req, res) => {
  const education = await Education.findById(req.params.id);
  if (education) {
    res.json({ success: true, data: education });
  } else {
    res.status(404);
    throw new Error('Education not found');
  }
});

const createEducation = asyncHandler(async (req, res) => {
  const { degree, field, institution, location, period, score } = req.body;

  const education = new Education({
    degree,
    field,
    institution,
    location,
    period,
    score
  });

  const createdEducation = await education.save();
  res.status(201).json({ success: true, data: createdEducation });
});

const updateEducation = asyncHandler(async (req, res) => {
  const { degree, field, institution, location, period, score } = req.body;

  const education = await Education.findById(req.params.id);

  if (education) {
    education.degree = degree || education.degree;
    education.field = field || education.field;
    education.institution = institution || education.institution;
    education.location = location || education.location;
    education.period = period || education.period;
    education.score = score || education.score;

    const updatedEducation = await education.save();
    res.json({ success: true, data: updatedEducation });
  } else {
    res.status(404);
    throw new Error('Education not found');
  }
});

const deleteEducation = asyncHandler(async (req, res) => {
  const education = await Education.findById(req.params.id);

  if (education) {
    await education.deleteOne();
    res.json({ success: true, message: 'Education removed' });
  } else {
    res.status(404);
    throw new Error('Education not found');
  }
});

module.exports = { getEducations, getEducationById, createEducation, updateEducation, deleteEducation };
