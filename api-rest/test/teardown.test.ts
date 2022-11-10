import prisma from '../src/config/prisma';
import tap from 'tap';

tap.test('Clear DB', async (t) => {
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  t.endAll();
})
