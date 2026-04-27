const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({}).sort({ category: 1, name: 1 });
  res.json({ success: true, data: skills });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (skill) {
    res.json({ success: true, data: skill });
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = asyncHandler(async (req, res) => {
  const { name, category, level } = req.body;

  const skill = new Skill({
    name,
    category,
    level,
  });

  const createdSkill = await skill.save();
  res.status(201).json({ success: true, data: createdSkill });
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
const updateSkill = asyncHandler(async (req, res) => {
  const { name, category, level } = req.body;

  const skill = await Skill.findById(req.params.id);

  if (skill) {
    skill.name = name || skill.name;
    skill.category = category || skill.category;
    skill.level = level !== undefined ? level : skill.level;

    const updatedSkill = await skill.save();
    res.json({ success: true, data: updatedSkill });
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (skill) {
    await skill.deleteOne();
    res.json({ success: true, message: 'Skill removed' });
  } else {
    res.status(404);
    throw new Error('Skill not found');
  }
});

module.exports = { getSkills, getSkillById, createSkill, updateSkill, deleteSkill };
