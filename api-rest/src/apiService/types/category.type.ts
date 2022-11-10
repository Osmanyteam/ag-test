import type QuestionType from "./question.type";

export interface CategoryType {
    id?: number;
    name: string;
    questions?: QuestionType[];
    createdAt?: Date|string;
    updatedAt?: Date|string;
}