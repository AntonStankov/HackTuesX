import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authHandlerSlice from "./features/auth/auth-handler";

import { apiSlice } from "./api/api-slice";

const AppReducer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	auth: authHandlerSlice.reducer,
});

export const rootReducer = (state: any, action: any) => {
	return AppReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
