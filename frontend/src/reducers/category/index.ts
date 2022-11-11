import { createSlice } from '@reduxjs/toolkit'
import { CategoryType } from '../../interfaces/categories/category'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: CategoryType = {
    name: '',
    id: 0
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<CategoryType>) => {
            state.id = action.payload.id,
            state.name = action.payload.name
        }
    }
});

// Action creators are generated for each case reducer function
export const { setCategory } = categorySlice.actions

export default categorySlice.reducer
