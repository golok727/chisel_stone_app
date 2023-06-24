import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface AppState {
	darkMode: boolean;
	fontSize: number;
	showSidebar: boolean;
	appStatus: string;
	showPages: boolean;
	sidebarWidth: number;
	currentFocusPageIdx: number;
	pagesState: Record<string, PagesState>;
}

interface PagesState {
	cursorPosition: number;
	currentFocusBlockIdx: number;
}
const initialState: AppState = {
	darkMode: true,
	fontSize: 14,
	showSidebar: true,
	appStatus: "Up to Date",
	showPages: true,
	sidebarWidth: 300,
	currentFocusPageIdx: 0,

	pagesState: {},
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

		setPagesState: (
			state,
			action: PayloadAction<{
				pageId: string;
				cursorPosition?: number;
				currentFocusBlockIdx?: number;
			}>
		) => {
			const { pageId, cursorPosition, currentFocusBlockIdx } = action.payload;

			state.pagesState[pageId] = {
				cursorPosition:
					(cursorPosition ?? state.pagesState[pageId]?.cursorPosition) || 0,
				currentFocusBlockIdx:
					(currentFocusBlockIdx ??
						state.pagesState[pageId]?.currentFocusBlockIdx) ||
					0,
			};
		},
	},
});

export const getPagesState = (state: RootState) => {
	const { pagesState } = state.app;

	if (
		!state.page.currentPageId ||
		pagesState[state.page.currentPageId] === undefined
	) {
		return {
			currentFocusBlockIdx: 0,
			cursorPosition: 0,
		};
	}

	const { currentFocusBlockIdx, cursorPosition } =
		pagesState[state.page.currentPageId];

	return { currentFocusBlockIdx, cursorPosition };
};

export const {
	toggleShowPages,
	toggleDarkMode,
	setFontSize,
	toggleSidebar,
	setSidebarWidth,
	setCurrentFocusPageIdx,

	setPagesState,
} = appSlice.actions;
export default appSlice.reducer;
