import Server from '../src/sever';
import tap from 'tap';
import prisma from '../src/config/prisma';
// import prisma from '../src/config/prisma';

tap.test('POST /v1/category', async (t) => {
  const app = new Server();
  const name = 'New Category';
  t.teardown(async () => {
    await app.server.close();
  });
  const response = await app.server.inject({
    url: '/v1/category',
    method: 'POST',
    payload: { name },
  });
  t.equal((await response.json()).name, name);
});

tap.test('GET /v1/category?skip=2&size=2&page=1', async (t) => {
  const app = new Server();
  const name = 'New Category';
  t.teardown(async () => {
    await app.server.close();
  });
  const categories = ['politics', 'social', 'philosophical', 'history', 'random'].map((name) => ({ name }));
  await prisma.category.createMany({ data: categories });
  const response = await app.server.inject({
    url: '/v1/category?skip=2&size=2&page=1',
    method: 'GET',
    payload: { name },
  });
  const responsePaginated = await response.json();
  t.equal(responsePaginated.page, 1);
});
