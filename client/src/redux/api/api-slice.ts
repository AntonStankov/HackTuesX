import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setToken } from "../features/auth/auth-handler";

import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth._token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error?.status === 401) {
		const refreshResult = await api.dispatch(
			api.endpoints.refreshToken.initiate(undefined)
		);
		if (refreshResult.error) {
			api.dispatch(logOut());
			return result;
		}
		const { access_token } = refreshResult.data;
		api.dispatch(setToken(access_token));
		return baseQuery(args, api, extraOptions);
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});
