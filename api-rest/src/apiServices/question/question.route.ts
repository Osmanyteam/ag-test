import type { Static } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import validation from './question.validation';
import controller from './question.controller';

export default (fastify: FastifyInstance, _: any, done: () => void) => {

  
  fastify.post<{ Body: Static<typeof validation.createCategoryBody> }>(
    '/category',
    {
      schema: {
        body: validation.createCategoryBody,
      },
    },
    controller.createCategory
  );

  fastify.post<{ Body: Static<typeof validation.createQuestionBody> }>(
    '/question',
    {
      schema: {
        body: validation.createQuestionBody,
      },
    },
    controller.createQuestion
  );

  fastify.post<{ Body: Static<typeof validation.createAnswerBody> }>(
    '/answer',
    {
      schema: {
        body: validation.createAnswerBody,
      },
    },
    controller.createAnswer
  );

  fastify.get<{ Querystring: Static<typeof validation.getCategoriesPaginatedQuery> }>(
    '/category',
    {
      schema: {
        querystring: validation.getCategoriesPaginatedQuery,
      },
    },
    controller.getCategoriesPaginated
  );

  fastify.get<{ Querystring: Static<typeof validation.getQuestionsPaginatedQuery> }>(
    '/question',
    {
      schema: {
        querystring: validation.getQuestionsPaginatedQuery,
      },
    },
    controller.getQuestionsPaginated
  );

  fastify.get<{ Querystring: Static<typeof validation.getAnswersPaginatedQuery> }>(
    '/answer',
    {
      schema: {
        querystring: validation.getAnswersPaginatedQuery,
      },
    },
    controller.getAnswersPaginated
  );
  done();
};
