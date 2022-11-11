import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { QuestionType } from "../../interfaces/questions/question";
import Paginated from "../../interfaces/paginated";

export type QuestionState = Paginated<QuestionType> & { questions: number };
const initialState: QuestionState = {
  countResults: 0,
  nextPage: 0,
  page: 0,
  previousPage: 0,
  results: [],
  totalPages: 0,
  questions: 0,
};

export const questionsSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QuestionState>) => {
      console.log("here set question", action.payload);
      (state.countResults = action.payload.countResults),
        (state.page = action.payload.page),
        (state.nextPage = action.payload.nextPage),
        (state.previousPage = action.payload.previousPage),
        (state.results = action.payload.results),
        (state.totalPages = action.payload.totalPages);
      state.questions = action.payload.results.length;
    },
    setQuestion: (state, action: PayloadAction<QuestionType>) => {
        console.log("here set question", state.results, action.payload);
      state.results = [action.payload].concat(state.results);
      state.questions = state.results.length;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setQuestions, setQuestion } = questionsSlice.actions;

export default questionsSlice.reducer;
