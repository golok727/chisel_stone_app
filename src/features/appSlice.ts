import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
	darkMode: boolean;
	fontSize: number;
	showSidebar: boolean;
	appStatus: string;
	showPages: boolean;
	sidebarWidth: number;
	currentFocusPageIdx: number | null;
}

const initialState: AppState = {
	darkMode: true,
	fontSize: 14,
	showSidebar: true,
	appStatus: "Up to Date",
	showPages: true,
	sidebarWidth: 300,
	currentFocusPageIdx: null,
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
		setCurrentFocusPageIdx: (state, action: PayloadAction<number | null>) => {
			state.currentFocusPageIdx = action.payload;
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
} = appSlice.actions;
export default appSlice.reducer;
