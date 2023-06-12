import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../features/appSlice";
import pagesReducer from "../features/pagesSlice";

const store = configureStore({
	reducer: {
		app: appReducer,
		page: pagesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
