const dashboardService = require('../services/dashboardService');

const adminDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getAdminDashboard();

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en dashboard admin',
    });
  }
};

const userDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await dashboardService.getUserDashboard(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en dashboard usuario',
    });
  }
};

module.exports = {
  adminDashboard,
  userDashboard,
};