import { Type } from "@sinclair/typebox";

const createCategoryBody = Type.Object({
  name: Type.String(),
});

const createQuestionBody = Type.Object({
  statement: Type.String(),
  categoryId: Type.Number(),
});

const createAnswerBody = Type.Object({
  content: Type.String(),
  questionId: Type.Number(),
});

const getCategoriesPaginatedQuery = Type.Object({
  name: Type.Optional(Type.String()),
  page: Type.Number({ minimum: 1 }),
  size: Type.Number({ minimum: 2 }),
  skip: Type.Number({ minimum: 2 })
});

export default { 
    createCategoryBody,
    createQuestionBody,
    createAnswerBody,
    getCategoriesPaginatedQuery,
}