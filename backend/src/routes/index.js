const express = require('express');


const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const contributionRoutes = require('./contributionRoutes');

const router = express.Router(); // 👈 PRIMERO se define

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contributions', contributionRoutes); // 👈 DESPUÉS se usa

module.exports = router;

const dashboardRoutes = require('./dashboardRoutes');
router.use('/dashboard', dashboardRoutes);