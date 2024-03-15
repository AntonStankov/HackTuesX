import { apiSlice } from "@/redux/api/api-slice";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: ({ email, password }) => ({
				url: "api/auth/login",
				method: "POST",
				body: {
					email,
					password,
				},
			}),
		}),
		register: builder.mutation<LoginResponse, RegisterRequest>({
			query: ({ email, password, name }) => ({
				url: "api/auth/register",
				// add no cors
				method: "POST",
				body: {
					email,
					password,
					name,
				},
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: "api/auth/logout",
				method: "POST",
			}),
		}),
		refreshToken: builder.mutation({
			query: () => ({
				url: "api/auth/refresh",
				method: "POST",
				body: {
					refresh_token: localStorage.getItem("refreshToken"),
				},
			}),
		}),
		getUser: builder.query<void, void>({
			query: () => ({
				url: "media/user",
				method: "GET",
			}),
		}),
	}),
	overrideExisting: false,
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useRefreshTokenMutation,
	useGetUserQuery,
} = authApiSlice;
