import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "./auth-api-slice";

interface InitialState {
	_token: string;
	_refreshToken: string;
	_expires: number;
	email: string;
	name: string;
}

const authState: InitialState = {
	_token: "",
	_refreshToken: "",
	_expires: 0,
	email: "",
	name: "",
};

export const authHandlerSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {
		setToken: (state, action) => {
			state._token = action.payload;
			localStorage.setItem("token", action.payload);
		},
		logOut: (state) => {
			state = authState;
			localStorage.clear();
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			authApiSlice.endpoints.login.matchFulfilled,
			(state, action) => {
				state._refreshToken = action.payload.refresh_token;
				state._token = action.payload.access_token;
				state._expires = action.payload.expires_in;
				localStorage.setItem("token", action.payload.access_token);
				localStorage.setItem(
					"refreshToken",
					action.payload.refresh_token
				);
			}
		);
		builder.addMatcher(
			authApiSlice.endpoints.register.matchFulfilled,
			(state, action) => {
				state._token = action.payload.access_token;
				state._expires = action.payload.expires_in;
				localStorage.setItem("token", action.payload.access_token);
				localStorage.setItem(
					"refreshToken",
					action.payload.refresh_token
				);
			}
		);
	},
});

export const { setToken, logOut } = authHandlerSlice.actions;

export default authHandlerSlice;