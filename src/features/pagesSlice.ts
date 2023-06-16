import { StringContentBlockTypes, textBlockTypes } from "./../config/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dummyPages } from "../config/constants";

interface PagesState {
	pages: ChiselStoneNotebookPage[];
	currentPageId: string | null;
	newBlock: string | null;
}

const initialState: PagesState = {
	pages: [...dummyPages],
	// pages: [],
	currentPageId: null,
	newBlock: null,
};

const pageSlice = createSlice({
	name: "page",
	initialState,
	reducers: {
		// Add a new page
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

		// Update the page title
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

		// Add new Block
		addNewBlock: (
			state,
			action: PayloadAction<{
				blockId?: string;
				insertMode?: "before" | "after";
			}>
		) => {
			if (state.currentPageId) {
				const currentPage = state.pages.find(
					(page) => page._id === state.currentPageId
				);
				if (!currentPage) return;
				const { blockId } = action.payload;

				const newEmptyBlock: TextBlock = {
					id: Date.now().toString(),
					type: "text",
					content: "",
				};

				if (blockId === undefined) {
					currentPage.content.unshift(newEmptyBlock);
					return;
				}
				const foundBlockIndex = currentPage.content.findIndex(
					(eachBlock) => eachBlock.id === blockId
				);

				if (foundBlockIndex === -1) return;

				// Insert Before or after
				const insertMode: "before" | "after" =
					action.payload.insertMode === undefined
						? "after"
						: action.payload.insertMode;
				if (insertMode === "after") {
					currentPage.content.splice(foundBlockIndex + 1, 0, newEmptyBlock);
				} else {
					currentPage.content.splice(foundBlockIndex, 0, newEmptyBlock);
				}
				state.newBlock = newEmptyBlock.id;
			}
		},

		// Update the new block value

		updateBlock: (
			state,
			action: PayloadAction<{ block: Block; content: string }>
		) => {
			if (state.currentPageId) {
				const currentPage = state.pages.find(
					(page) => page._id === state.currentPageId
				);
				if (!currentPage) return;

				if (
					textBlockTypes.includes(
						action.payload.block.type as StringContentBlockTypes
					)
				) {
					const { block, content } = action.payload;
					const updatedBlock = currentPage.content.find(
						(eachBlock) => eachBlock.id === block.id
					);
					if (updatedBlock) {
						updatedBlock.content = content;
					}
				}
			}
		},
		removeBlock: (state, action: PayloadAction<Block>) => {
			if (state.currentPageId) {
				const currentPage = state.pages.find(
					(page) => page._id === state.currentPageId
				);
				if (!currentPage) return;

				currentPage.content = currentPage.content.filter(
					(eachBlock) => eachBlock.id !== action.payload.id
				);
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
export const {
	addPage,
	setCurrentPage,
	updatePageTitle,
	addNewBlock,
	updateBlock,
	removeBlock,
} = pageSlice.actions;

export default pageSlice.reducer;
