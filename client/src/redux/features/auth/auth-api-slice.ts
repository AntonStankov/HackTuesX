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
	username: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
	username: string;
}

export interface User {
	id: number;
	email: string;
	name: string;
	username: string;
	created_at: string;
	updated_at: string;
	followers: number;
	following: number;
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
			query: ({ email, password, name, username }) => ({
				url: "api/auth/register",
				method: "POST",
				body: {
					email,
					password,
					name,
					username,
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
		getUser: builder.query<User, void>({
			query: () => ({
				url: "media/user",
				method: "GET",
			}),
		}),
		getPersonProfile: builder.query<User, { username: string }>({
			query: ({ username }) => ({
				url: `media/getProfile/${username}`,
				method: "GET",
			}),
		}),
		followUser: builder.mutation<void, { id: number }>({
			query: ({ id }) => ({
				url: `media/user/follow/${id}`,
				method: "POST",
			}),
		}),
		getFollowers: builder.query<User[], void>({
			query: () => ({
				url: "media/user/followers",
				method: "GET",
			}),
		}),
		getFollowing: builder.query<User[], void>({
			query: () => ({
				url: "media/user/following",
				method: "GET",
			}),
		}),
		removeFollow: builder.mutation<void, { id: number }>({
			query: ({ id }) => ({
				url: `media/user/remove_following/${id}`,
				method: "DELETE",
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
	useGetPersonProfileQuery,
	useFollowUserMutation,
	useLazyGetFollowersQuery,
	useLazyGetFollowingQuery,
	useRemoveFollowMutation,
} = authApiSlice;
