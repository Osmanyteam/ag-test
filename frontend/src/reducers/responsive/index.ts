import { createSlice } from '@reduxjs/toolkit'
import { responsiveInterface } from '../../interfaces/reducers/responsiveSlice'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: responsiveInterface = {
  sidebar: false
}

export const responsiveSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    handleDrawerToggle: (state, action: PayloadAction<boolean>) => {
      state.sidebar = action.payload;
    },
    mobileOpen: (state) => {
      state.sidebar = true;
    },
    mobileClose: (state) => {
      state.sidebar = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const { mobileOpen, mobileClose, handleDrawerToggle } = responsiveSlice.actions

export default responsiveSlice.reducer