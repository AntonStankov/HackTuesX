import { apiSlice } from "@/redux/api/api-slice";

export interface AnalyticsResponse {
	index: number;
	ecology: number;
	budget: number;
	efficiency: number;
	sharkLife: number;
	fishLife: number;
	oceanCleanliness: number;
	shipProductivity: number;
	rigProductivity: number;
}

export interface Ocean {
	ocean_name: string;
	ocean_map: string;
}

export interface MyOceans {
	oceans: Ocean[];
}

export const analyticsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAnalytics: builder.query<AnalyticsResponse, { inputMap: string }>({
			query: ({ inputMap }) => ({
				url: "laravel2/analyze-map",
				method: "POST",
				body: {
					inputMap,
				},
			}),
		}),
		generateMap: builder.mutation<void, { ocean_name: string }>({
			query: ({ ocean_name }) => ({
				url: "server2/generate",
				method: "POST",
				body: {
					ocean_name,
				},
			}),
			invalidatesTags: ["Maps"],
		}),
		saveMap: builder.mutation<void, string>({
			query: (map_string) => ({
				url: "server2/save_map",
				method: "POST",
				body: {
					map_string,
				},
			}),
		}),
		getMySimulations: builder.query<MyOceans, void>({
			query: () => "server2/get_my_ocean",
			providesTags: ["Maps"],
		}),

		deleteMap: builder.mutation<void, string>({
			query: (mapId) => ({
				url: `server2/delete_map/${mapId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useLazyGetAnalyticsQuery,
	useGenerateMapMutation,
	useSaveMapMutation,
	useGetMySimulationsQuery,
	useDeleteMapMutation,
} = analyticsApiSlice;
