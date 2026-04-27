const Achievement = require('../models/Achievement');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({}).sort({ date: -1 });
  res.json({ success: true, data: achievements });
});

const getAchievementById = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (achievement) {
    res.json({ success: true, data: achievement });
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});

const createAchievement = asyncHandler(async (req, res) => {
  const { title, description, images, date } = req.body;
  const achievement = new Achievement({ title, description, images, date });
  const createdAchievement = await achievement.save();
  res.status(201).json({ success: true, data: createdAchievement });
});

const updateAchievement = asyncHandler(async (req, res) => {
  const { title, description, images, date } = req.body;
  const achievement = await Achievement.findById(req.params.id);
  if (achievement) {
    achievement.title = title || achievement.title;
    achievement.description = description || achievement.description;
    achievement.images = images || achievement.images;
    achievement.date = date || achievement.date;
    const updatedAchievement = await achievement.save();
    res.json({ success: true, data: updatedAchievement });
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});

const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (achievement) {
    await achievement.deleteOne();
    res.json({ success: true, message: 'Achievement removed' });
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});

module.exports = {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
