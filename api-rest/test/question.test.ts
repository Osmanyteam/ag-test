import Server from '../src/sever';
import tap from 'tap';
// import prisma from '../src/config/prisma';
import QuestionService from '../src/apiServices/question/question.service';

tap.test('POST /v1/question', async (t) => {
  const app = new Server();
  const name = 'Technology';

  t.teardown(async () => {
    await app.server.close();
  });

  const category = await new QuestionService().createCategory({ name });
  const payload = {
    statement: 'Who is was best CEO Job or Bill?',
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
      content: 'Job Bro!',
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
