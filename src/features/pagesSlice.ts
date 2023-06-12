import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dummyPages } from "../config/constants";

interface PagesState {
	pages: ChiselStoneNotebookPage[];
	currentPageId: string | null;
}

const initialState: PagesState = {
	pages: [...dummyPages],
	// pages: [],
	currentPageId: null,
};

const pageSlice = createSlice({
	name: "page",
	initialState,
	reducers: {
		addPage: (state) => {
			const newPage = {
				_id: `${Math.floor(Math.random() * 1000)}${Date.now()}`,
				title: "Untitled",
				color: "#555",
				content: [],
			};
			state.pages.unshift(newPage);
			state.currentPageId = newPage._id;
		},

		setCurrentPage: (state, action: PayloadAction<string | null>) => {
			state.currentPageId = action.payload;
		},

		updatePageTitle: (
			state,
			action: PayloadAction<{ pageId: string; newTitle: string }>
		) => {
			const { pageId, newTitle } = action.payload;
			const page = state.pages.find((p) => p._id === pageId);
			if (page) {
				page.title = newTitle;
			}
		},
	},
});

export const getCurrentPage = (state: { page: PagesState }) => {
	if (state.page.currentPageId !== null) {
		const currPage = state.page.pages.find(
			(page) => page._id === state.page.currentPageId
		);
		return currPage;
	}
	return null;
};
export const { addPage, setCurrentPage, updatePageTitle } = pageSlice.actions;

export default pageSlice.reducer;
