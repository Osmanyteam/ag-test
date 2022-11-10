import type QuestionType from "./question.type";

export default interface AnswerType {
    question?: QuestionType,
    content: string;
    votes: number;
    createdAt?: Date|string;
    updatedAt?: Date|string;
}