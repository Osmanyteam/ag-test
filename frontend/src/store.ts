import { configureStore } from '@reduxjs/toolkit';
import responsiveReducer from './reducers/responsive';
import questionReducers from './reducers/question';
import categoryReducers from './reducers/category';
import categoriesReducer from './reducers/categories';

export const store = configureStore({
  reducer: {
    responsive: responsiveReducer,
    questions: questionReducers,
    category: categoryReducers,
    categories: categoriesReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch