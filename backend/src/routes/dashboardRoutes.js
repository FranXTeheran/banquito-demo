const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/admin', authMiddleware, roleMiddleware('admin'), dashboardController.adminDashboard);
router.get('/user', authMiddleware, dashboardController.userDashboard);

module.exports = router;