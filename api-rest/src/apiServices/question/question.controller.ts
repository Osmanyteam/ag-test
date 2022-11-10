import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Static } from '@sinclair/typebox';
import QuestionService from './question.service';
import type validation from './question.validation';

const questionService = new QuestionService();

const createCategory = async function (request: FastifyRequest<{ Body: Static<typeof validation.createCategoryBody> }>, reply: FastifyReply) {
  const category = await questionService.createCategory(request.body);
  reply.send(category);
};

const createQuestion = async function (request: FastifyRequest<{ Body: Static<typeof validation.createQuestionBody> }>, reply: FastifyReply) {
  const { categoryId, statement } = request.body;
  const category = await questionService.createQuestion(categoryId, { statement });
  reply.send(category);
};

const createAnswer = async function (request: FastifyRequest<{ Body: Static<typeof validation.createAnswerBody> }>, reply: FastifyReply) {
  const { questionId, content } = request.body;
  const category = await questionService.createAnswer(questionId, { content });
  reply.send(category);
};

const getCategoriesPaginated = async (request: FastifyRequest<{ Querystring: Static<typeof validation.getCategoriesPaginatedQuery> }>, reply: FastifyReply) =>  {
  const { name } = request.query;
  const category = await questionService.filterPaginateCategory(request.query, name);
  reply.send(category);
}

export default {
  createCategory,
  createQuestion,
  createAnswer,
  getCategoriesPaginated,
}