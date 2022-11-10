import tap from 'tap';
import prisma from '../src/config/prisma';

tap.test('remove all records', async (t) => {
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  t.endAll();
});
