const Experience = require('../models/Experience');
const asyncHandler = require('../utils/asyncHandler');

const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: experiences });
});

const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (experience) {
    res.json({ success: true, data: experience });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

const createExperience = asyncHandler(async (req, res) => {
  const { title, company, period, roleTypes, responsibilities, tags, images } = req.body;

  const experience = new Experience({
    title,
    company,
    period,
    roleTypes,
    responsibilities,
    tags,
    images
  });

  const createdExperience = await experience.save();
  res.status(201).json({ success: true, data: createdExperience });
});

const updateExperience = asyncHandler(async (req, res) => {
  const { title, company, period, roleTypes, responsibilities, tags, images } = req.body;

  const experience = await Experience.findById(req.params.id);

  if (experience) {
    experience.title = title || experience.title;
    experience.company = company || experience.company;
    experience.period = period || experience.period;
    experience.roleTypes = roleTypes || experience.roleTypes;
    experience.responsibilities = responsibilities || experience.responsibilities;
    experience.tags = tags || experience.tags;
    experience.images = images || experience.images;

    const updatedExperience = await experience.save();
    res.json({ success: true, data: updatedExperience });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (experience) {
    await experience.deleteOne();
    res.json({ success: true, message: 'Experience removed' });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

module.exports = { getExperiences, getExperienceById, createExperience, updateExperience, deleteExperience };
