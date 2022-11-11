import { createSlice } from '@reduxjs/toolkit'
import { CategoryType } from '../../interfaces/categories/category'
import type { PayloadAction } from '@reduxjs/toolkit'
import Paginated from '../../interfaces/paginated'

const initialState: Paginated<CategoryType> = {
    countResults: 0,
    nextPage: 0,
    page: 0,
    previousPage: 0,
    results: [],
    totalPages: 0
}

export const categoriesSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        setCategories: (state: Paginated<CategoryType>, action: PayloadAction<Paginated<CategoryType>>) => {
            state.countResults = action.payload.countResults,
            state.page = action.payload.page,
            state.nextPage = action.payload.nextPage,
            state.previousPage = action.payload.previousPage,
            state.results = action.payload.results,
            state.totalPages = action.payload.totalPages
        }
    }
})

// Action creators are generated for each case reducer function
export const { setCategories } = categoriesSlice.actions

export default categoriesSlice.reducer