import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setToken } from "@/redux/features/auth/auth-handler";
import { authApiSlice } from "@/redux/features/auth/auth-api-slice";
import { RootState } from "@/redux/store";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://139.59.209.1/api",
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
			authApiSlice.endpoints.refreshToken.initiate(undefined)
		);
		if (refreshResult.error) {
			api.dispatch(logOut());
			return result;
		}
		const { AccessToken, IdToken } = refreshResult.data.tokens;
		api.dispatch(setToken(AccessToken));
		localStorage.setItem("idToken", IdToken);
		return baseQuery(args, api, extraOptions);
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});
