const prisma = require('../config/db');

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return users;
};

module.exports = {
  getAllUsers,
};