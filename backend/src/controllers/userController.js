const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
    });
  }
};

module.exports = {
  getAllUsers,
};