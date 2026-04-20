const prisma = require('../config/db');

const getAdminDashboard = async () => {
  const totalAmount = await prisma.contribution.aggregate({
    _sum: {
      amount: true,
    },
  });

  const totalContributions = await prisma.contribution.count();

  const lastContributions = await prisma.contribution.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
    },
  });

  return {
    totalAmount: totalAmount._sum.amount || 0,
    totalContributions,
    lastContributions,
  };
};

const getUserDashboard = async (userId) => {
  const totalSaved = await prisma.contribution.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId: Number(userId),
    },
  });

  const contributions = await prisma.contribution.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    totalSaved: totalSaved._sum.amount || 0,
    contributions,
  };
};

module.exports = {
  getAdminDashboard,
  getUserDashboard,
};