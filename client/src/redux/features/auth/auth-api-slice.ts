import { apiSlice } from "@/redux/api/api-slice";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
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
				url: "auth/login",
				method: "POST",
				body: {
					email,
					password,
				},
				credentials: "include",
				withCredentials: true,
			}),
		}),
		register: builder.mutation<LoginResponse, RegisterRequest>({
			query: ({ email, password, name }) => ({
				url: "auth/register",
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
				url: "auth/logout",
				method: "POST",
			}),
		}),
		refreshToken: builder.mutation({
			query: () => ({
				url: "auth/refresh",
				method: "POST",
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
} = authApiSlice;
