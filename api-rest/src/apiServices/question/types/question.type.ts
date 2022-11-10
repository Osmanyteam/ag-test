import type AnswerType from "./answer.type";
import type { CategoryType } from "./category.type";

export default interface QuestionType {
  statement: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  answers?: AnswerType[];
  category: CategoryType;
}
