const contributionService = require('../services/contributionService');

const createContribution = async (req, res) => {
  try {
    const { amount, paymentMethod, userId } = req.body;

    const contribution = await contributionService.createContribution({
      amount,
      paymentMethod,
      userId,
      registeredById: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Aporte registrado correctamente',
      data: contribution,
    });
  } catch (error) {
    console.error('Error al registrar aporte:', error);

    return res.status(500).json({
      success: false,
      message: 'Error al registrar aporte',
      error: error.message,
    });
  }
};

const getAllContributions = async (req, res) => {
  try {
    const data = await contributionService.getAllContributions();

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener aportes',
    });
  }
};

const getUserContributions = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await contributionService.getContributionsByUser(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener aportes del usuario',
    });
  }
};

module.exports = {
  createContribution,
  getAllContributions,
  getUserContributions,
};