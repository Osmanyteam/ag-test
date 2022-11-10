import prisma from '../../config/prisma';
import type { PaginateOptions, PaginateType } from '../../utils/paginated';
import paginated from '../../utils/paginated';
import type AnswerType from './types/answer.type';
import type { CategoryType } from './types/category.type';
import type QuestionType from './types/question.type';

type QuestionAnswerType = QuestionType & { id: number, answersPaginated: PaginateType<AnswerType> };
export default class QuestionService {
  protected categoryDB = prisma.category;
  protected questionDB = prisma.question;
  protected answerDB = prisma.answer;

  async createCategory(category: CategoryType) {
    return this.categoryDB.create({
      data: category,
    });
  }

  async createQuestion(categoryId: number, question: Omit<QuestionType, 'category'>) {
    const category = await this.categoryDB.findFirst({ where: { id: { equals: categoryId } } });
    if (!category) {
      throw new Error('Category not found');
    }

    return await this.questionDB.create({
      data: {
        ...question,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async createAnswer(questionId: number, answer: Omit<AnswerType, 'question' | 'votes'>) {
    const question = await this.questionDB.findFirst({ where: { id: { equals: questionId } } });
    if (!question) {
      throw new Error('Question not found');
    }
    return await this.answerDB.create({
      data: {
        ...answer,
        question: {
          connect: {
            id: questionId,
          },
        },
      },
    });
  }

  async filterPaginateCategory(options: PaginateOptions, name?: string): Promise<PaginateType<CategoryType>> {
    let filter = {};
    if (name) {
      filter = {
        where: {
          name: { contains: name },
        },
      };
    }
    console.log(options);
    const categories = await this.categoryDB.findMany({
      ...filter,
      skip: options.skip,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      take: options.size,
    });
    return paginated<CategoryType>(categories, filter, this.categoryDB, options);
  }

  async getPaginateQuestionByCategory(
    categoryId: number,
    options: PaginateOptions,
  ): Promise<PaginateType<QuestionAnswerType>> {
    const filter = {
      where: {
        categoryId: { equals: categoryId },
      },
    };
    const questions = (await this.questionDB.findMany({
      ...filter,
      skip: options.skip,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      take: options.size,
    }) as unknown as QuestionAnswerType[]);
    // we add answer to first question
    // first question is show up in the app
    if (questions[0]) {
      questions[0].answersPaginated =
        await this.getPaginateAnswersByQuestion(questions[0].id, {
          page: 1,
          skip: 0,
          size: 5,
        });
    }
    return paginated<QuestionAnswerType>(questions, filter, this.questionDB, options);
  }

  async getPaginateAnswersByQuestion(questionId: number, options: PaginateOptions): Promise<PaginateType<AnswerType>> {
    const filter = {
      where: {
        questionId: { equals: questionId },
      },
    };
    const answers = await this.answerDB.findMany({
      ...filter,
      skip: options.skip,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      take: options.size,
    });
    return paginated<AnswerType>(answers, filter, this.answerDB, options);
  }
}
