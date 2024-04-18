import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setToken } from "@/redux/features/auth/auth-handler";
import { authApiSlice } from "@/redux/features/auth/auth-api-slice";
import { RootState } from "@/redux/store";
import Profile from "@/pages/Profile";

const baseQuery = fetchBaseQuery({
	baseUrl: "https://api.kowen.tech/",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth._token;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error?.status === 401) {
		const refreshResult = await api.dispatch(
			authApiSlice.endpoints.refreshToken.initiate(undefined)
		);
		if (refreshResult.error) {
			api.dispatch(logOut());
			return result;
		}
		const { access_token } = refreshResult;
		api.dispatch(setToken(access_token));
		return baseQuery(args, api, extraOptions);
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Profile", "Maps"],
	endpoints: () => ({}),
});
