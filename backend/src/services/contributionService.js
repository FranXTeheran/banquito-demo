const prisma = require('../config/db');

const createContribution = async ({ amount, paymentMethod, userId, registeredById }) => {
  const contribution = await prisma.contribution.create({
    data: {
      amount,
      paymentMethod,
      contributionDate: new Date(),
      userId,
      registeredById,
    },
  });

  return contribution;
};

const getAllContributions = async () => {
  return await prisma.contribution.findMany({
    include: {
      user: true,
      registeredBy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getContributionsByUser = async (userId) => {
  return await prisma.contribution.findMany({
    where: { userId: Number(userId) },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

module.exports = {
  createContribution,
  getAllContributions,
  getContributionsByUser,
};