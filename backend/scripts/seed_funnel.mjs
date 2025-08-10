import { config as loadenv } from 'dotenv';
import { PrismaClient } from '@prisma/client';

loadenv();

const prisma = new PrismaClient();

async function main() {
  // Create or find a user
  let user = await prisma.user.findFirst({ where: { email: 'owner@example.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'owner@example.com',
        password: 'dummy',
        name: 'Owner',
      },
    });
  }

  // Create a published funnel
  const funnel = await prisma.funnel.create({
    data: {
      title: 'Test Funnel',
      description: 'Seeded test funnel',
      config: {},
      isPublished: true,
      userId: user.id,
    },
  });

  console.log(JSON.stringify({ funnelId: funnel.id, isPublished: funnel.isPublished }));
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
