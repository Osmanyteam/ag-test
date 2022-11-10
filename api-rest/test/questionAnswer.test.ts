import Server from '../src/sever';
import tap from 'tap';
import QuestionService from '../src/apiService/service';

tap.test('POST /v1/question', async (t) => {
  const app = new Server();
  const name = 'Technology';

  t.teardown(async () => {
    await app.server.close();
  });

  const category = await new QuestionService().createCategory({ name });
  const payload = {
    statement: 'Who is was best CEO Jobs or Bill?',
    categoryId: category.id,
  };
  const response = await app.server.inject({
    url: '/v1/question',
    method: 'POST',
    payload,
  });
  const questionResponse = await response.json();
  t.equal(questionResponse.categoryId, category.id);
  t.equal(questionResponse.statement, payload.statement);

  t.test('POST /v1/answer', async (t) => {
    const payload = {
      content: 'Jobs Bro!',
      questionId: questionResponse.id,
    };
    const response = await app.server.inject({
      url: '/v1/answer',
      method: 'POST',
      payload,
    });
    const answerResponse = await response.json();
    t.equal(answerResponse.questionId, payload.questionId);
    t.equal(answerResponse.content, payload.content);
  });
});

tap.test('GET /v1/question?categoryId=id&page=1&size=2', async (t) => {
  const app = new Server();
  t.teardown(async () => {
    await app.server.close();
  });

  const questionService = new QuestionService();
  const category = await questionService.createCategory({ name: 'Category' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [question] = await Promise.all([
    questionService.createQuestion(category.id, { statement: 'A' }),
    questionService.createQuestion(category.id, { statement: 'B' }),
    questionService.createQuestion(category.id, { statement: 'C' }),
  ]);

  const response = await app.server.inject({
    url: `/v1/question?categoryId=${category.id}&page=1&size=2`,
    method: 'GET',
  });
  const questionResponse = await response.json();
  t.same(questionResponse.countResults, 3);
  t.equal(questionResponse.totalPages, 2)

  t.test('GET /v1/answer?questionId=id&page=1&size=2', async (t) => {
    await Promise.all([
      questionService.createAnswer(question.id, { content: 'G' }),
      questionService.createAnswer(question.id, { content: 'H' }),
      questionService.createAnswer(question.id, { content: 'I' }),
      questionService.createAnswer(question.id, { content: 'J' }),
      questionService.createAnswer(question.id, { content: 'K' }),
      questionService.createAnswer(question.id, { content: 'L' }),
      questionService.createAnswer(question.id, { content: 'M' }),
      questionService.createAnswer(question.id, { content: 'N' }),
    ]);

    const response = await app.server.inject({
      url: `/v1/answer?questionId=${question.id}&page=1&size=2`,
      method: 'GET',
    });
    const questionResponse = await response.json();
    t.same(questionResponse.countResults, 8);
    t.same(questionResponse.totalPages, 4);
  });
});
