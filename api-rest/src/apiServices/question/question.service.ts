import prisma from '../../config/prisma';
import type AnswerType from './types/answer.type';
import type { CategoryType } from './types/category.type';
import type QuestionType from './types/question.type';

export interface PaginateType<T> {
  page: number;
  next: number | null;
  previous: number | null;
  results: T;
  totalPages: number;
  countResults: number;
}

export interface PaginateOptions {
  page: number;
  size: number;
  skip: number;
}

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
          }
        }
      }
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
          }
        }
      }
    });
  }

  async filterPaginateCategory(options: PaginateOptions, name?: string): Promise<PaginateType<CategoryType[]>> {
    let filter = {};
    if (name) {
      filter = {
        where: {
          name: { contains: name },
        },
      };
    }

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
    const countResults = await this.categoryDB.count(filter);
    const totalPages = Math.ceil(countResults / options.size);
    return {
      page: options.page,
      next: options.page < totalPages ? options.page + 1 : null,
      previous: options.page > 0 ? options.page - 1 : null,
      totalPages,
      countResults,
      results: categories,
    };
  }
  // getPaginateQuestionByCategory(categoryId: Pick<CategoryEntity, 'id'>, options: PaginateOptions): Promise<PaginateType<QuestionEntity[]>>;
  // getPaginateAnswersByQuestion(questionId: Pick<CategoryEntity, 'id'>, options: PaginateOptions): Promise<PaginateType<AnswerEntity[]>>
}
