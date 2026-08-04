const express = require('express');
const router = express.Router();
const { getPortfolioData } = require('../controllers/portfolio.controller');

router.route('/')
  .get(getPortfolioData);

module.exports = router;
