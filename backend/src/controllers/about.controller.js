const About = require('../models/About');
const asyncHandler = require('../utils/asyncHandler');

const getAbouts = asyncHandler(async (req, res) => {
  const abouts = await About.find({});
  res.json({ success: true, data: abouts });
});

const getAboutById = asyncHandler(async (req, res) => {
  const about = await About.findById(req.params.id);
  if (about) {
    res.json({ success: true, data: about });
  } else {
    res.status(404);
    throw new Error('About not found');
  }
});

const createAbout = asyncHandler(async (req, res) => {
  const { name, role, location, degree, cgpa, status, github, linkedin, email, paragraphs, resumeLink } = req.body;

  // Optional: Ensure only one About document exists
  const existingCount = await About.countDocuments();
  if (existingCount >= 1) {
    res.status(400);
    throw new Error('About information already exists. Please update it instead.');
  }

  const about = new About({
    name, role, location, degree, cgpa, status, github, linkedin, email, paragraphs, resumeLink
  });

  const createdAbout = await about.save();
  res.status(201).json({ success: true, data: createdAbout });
});

const updateAbout = asyncHandler(async (req, res) => {
  const { name, role, location, degree, cgpa, status, github, linkedin, email, paragraphs, resumeLink } = req.body;

  const about = await About.findById(req.params.id);

  if (about) {
    about.name = name || about.name;
    about.role = role || about.role;
    about.location = location || about.location;
    about.degree = degree || about.degree;
    about.cgpa = cgpa || about.cgpa;
    about.status = status || about.status;
    about.github = github || about.github;
    about.linkedin = linkedin || about.linkedin;
    about.email = email || about.email;
    about.paragraphs = paragraphs || about.paragraphs;
    about.resumeLink = resumeLink || about.resumeLink;

    const updatedAbout = await about.save();
    res.json({ success: true, data: updatedAbout });
  } else {
    res.status(404);
    throw new Error('About not found');
  }
});

const deleteAbout = asyncHandler(async (req, res) => {
  const about = await About.findById(req.params.id);

  if (about) {
    await about.deleteOne();
    res.json({ success: true, message: 'About removed' });
  } else {
    res.status(404);
    throw new Error('About not found');
  }
});

module.exports = { getAbouts, getAboutById, createAbout, updateAbout, deleteAbout };
