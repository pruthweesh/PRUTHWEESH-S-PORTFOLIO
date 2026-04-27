const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.route('/')
  .get(getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

module.exports = router;
