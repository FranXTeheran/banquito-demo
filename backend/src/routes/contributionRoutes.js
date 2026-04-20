const express = require('express');
const contributionController = require('../controllers/contributionController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Solo admin registra aportes
router.post('/', authMiddleware, roleMiddleware('admin'), contributionController.createContribution);

// Solo admin ve todos
router.get('/', authMiddleware, roleMiddleware('admin'), contributionController.getAllContributions);

// Usuario o admin pueden ver aportes de usuario
router.get('/user/:userId', authMiddleware, contributionController.getUserContributions);

module.exports = router;