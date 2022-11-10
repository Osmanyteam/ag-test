import Server from '../src/sever';
import tap from 'tap';
import prisma from '../src/config/prisma';

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

tap.test('GET /v1/category?size=2&page=1', async (t) => {
  const app = new Server();
  t.teardown(async () => {
    await app.server.close();
  });
  const categories = ['politics', 'social', 'philosophical', 'history', 'random'].map((name) => ({ name }));
  await prisma.category.createMany({ data: categories });
  const response = await app.server.inject({
    url: '/v1/category?size=2&page=1',
    method: 'GET',
  });
  const countTotal = await prisma.category.count();
  const responsePaginated = await response.json();
  
  t.same(2, responsePaginated.nextPage);
  t.equal(responsePaginated.page, 1);
  t.equal(responsePaginated.countResults, countTotal);

  t.test('GET /v1/category?name=p&size=2&page=1', async (t) => {
    const response = await app.server.inject({
      url: '/v1/category?name=p&size=2&page=1',
      method: 'GET',
    });
    const countTotal = await prisma.category.count({ where: {
      name: { contains: 'p' },
    } });
    const responsePaginated = await response.json();
    
    t.same(null, responsePaginated.nextPage);
    t.equal(responsePaginated.page, 1);
    t.equal(responsePaginated.countResults, countTotal);
  });
});
