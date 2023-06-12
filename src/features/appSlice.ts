import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AppState {
  darkMode: boolean;
  fontSize: number;
  showSidebar: boolean;
}


const initialState: AppState = {
  darkMode: true,
  fontSize: 14,
  showSidebar: true,
};


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
  },
});


export const { toggleDarkMode, setFontSize, toggleSidebar } = appSlice.actions;
export default appSlice.reducer;