import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const categories = ['politics', 'social', 'philosophical', 'history', 'random'].map((name) => ({ name }));
  await prisma.category.createMany({ data: categories });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
