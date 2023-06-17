import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
	darkMode: boolean;
	fontSize: number;
	showSidebar: boolean;
	appStatus: string;
	showPages: boolean;
	sidebarWidth: number;
	currentFocusPageIdx: number;
	currentFocusBlockIdx: number;
	cursorPosition: number;
}

const initialState: AppState = {
	darkMode: true,
	fontSize: 14,
	showSidebar: true,
	appStatus: "Up to Date",
	showPages: true,
	sidebarWidth: 300,
	currentFocusPageIdx: 0,
	currentFocusBlockIdx: 0,
	cursorPosition: 0,
};

const appSlice = createSlice({
	name: "app",
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
		toggleShowPages: (state, action: PayloadAction<boolean | undefined>) => {
			if (action.payload === undefined) {
				state.showPages = !state.showPages;
				return;
			}
			state.showPages = action.payload;
		},
		setSidebarWidth: (state, action: PayloadAction<number>) => {
			state.sidebarWidth = action.payload;
		},
		setCurrentFocusPageIdx: (state, action: PayloadAction<number>) => {
			state.currentFocusPageIdx = action.payload;
		},
		setCurrentFocusBlockIdx: (state, action: PayloadAction<number>) => {
			state.currentFocusBlockIdx = action.payload;
		},

		setCursorPosition: (state, action: PayloadAction<number>) => {
			state.cursorPosition = action.payload;
		},
	},
});

export const {
	toggleShowPages,
	toggleDarkMode,
	setFontSize,
	toggleSidebar,
	setSidebarWidth,
	setCurrentFocusPageIdx,
	setCurrentFocusBlockIdx,
	setCursorPosition,
} = appSlice.actions;
export default appSlice.reducer;
