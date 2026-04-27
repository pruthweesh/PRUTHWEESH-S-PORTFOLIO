const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skill.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/')
  .get(getSkills)
  .post(protect, admin, createSkill);

router.route('/:id')
  .get(getSkillById)
  .put(protect, admin, updateSkill)
  .delete(protect, admin, deleteSkill);

module.exports = router;
