const { generateToken } = require('../utils/jwt');

const demoUsers = [
  {
    id: 1,
    name: 'Admin Demo',
    email: 'admin@demo.com',
    password: '123456',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Usuario Demo',
    email: 'user@demo.com',
    password: '123456',
    role: 'user',
  },
];

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email y contraseña son obligatorios');
  }

  const user = demoUsers.find((item) => item.email === email);

  if (!user || user.password !== password) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = {
  login,
};