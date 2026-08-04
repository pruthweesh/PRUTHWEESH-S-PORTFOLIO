const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get aggregated portfolio data
// @route   GET /api/portfolio
// @access  Public
const getPortfolioData = asyncHandler(async (req, res) => {
  const [
    about,
    projects,
    skills,
    experiences,
    educations,
    certifications,
    achievements
  ] = await Promise.all([
    About.find({}).lean(),
    Project.find({}).sort({ createdAt: -1 }).lean(),
    Skill.find({}).sort({ category: 1, name: 1 }).lean(),
    Experience.find({}).sort({ createdAt: -1 }).lean(),
    Education.find({}).sort({ createdAt: -1 }).lean(),
    Certification.find({}).sort({ date: -1 }).lean(),
    Achievement.find({}).sort({ date: -1 }).lean()
  ]);

  res.json({
    success: true,
    data: {
      about,
      skills,
      projects,
      experiences,
      educations,
      certifications,
      achievements
    }
  });
});

module.exports = { getPortfolioData };
