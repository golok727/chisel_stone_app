import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

interface PagesState {
	pages: ChiselStoneNotebookPage[];
	currentPageId: string | null;
}

const initialState: PagesState = {
	pages: [
		{
			id: "1234",
			title: "Radha rani",
			content: [
				{
					id: "122",
					type: "text",
					content: "Radhey Shyam",
				},
			],
		},
	],
	currentPageId: null,
};

const pageSlice = createSlice({
	name: "page",
	initialState,
	reducers: {},
});

export const {} = pageSlice.actions;

export default pageSlice.reducer;
