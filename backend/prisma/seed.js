const bcrypt = require('bcryptjs');
const prisma = require('../src/config/db');

async function main() {
  const adminPassword = await bcrypt.hash('123456', 10);
  const userPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      name: 'Usuario Demo',
      email: 'user@demo.com',
      password: userPassword,
      role: 'user',
    },
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });