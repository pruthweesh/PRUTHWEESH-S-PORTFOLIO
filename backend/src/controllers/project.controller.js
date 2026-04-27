const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    res.json({ success: true, data: project });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

const createProject = asyncHandler(async (req, res) => {
  const { title, description, techStack, githubLink, liveLink, image, features, badge } = req.body;

  const project = new Project({
    title,
    description,
    techStack,
    githubLink,
    liveLink,
    image,
    features,
    badge
  });

  const createdProject = await project.save();
  res.status(201).json({ success: true, data: createdProject });
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { title, description, techStack, githubLink, liveLink, image, features, badge } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.techStack = techStack || project.techStack;
    project.githubLink = githubLink || project.githubLink;
    project.liveLink = liveLink || project.liveLink;
    project.image = image || project.image;
    project.features = features || project.features;
    project.badge = badge || project.badge;

    const updatedProject = await project.save();
    res.json({ success: true, data: updatedProject });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    await project.deleteOne();
    res.json({ success: true, message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
