import { apiSlice } from "@/redux/api/api-slice";
import type { RootState } from "@/redux/store";

interface AnalyticsRequest {
	inputMap: string;
}

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

export interface MyOceans {
	ocean_string: string[][];
}
export const analyticsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAnalytics: builder.query<AnalyticsResponse, AnalyticsRequest>({
			query: ({ inputMap }) => ({
				url: "api/analyze-map",
				method: "POST",
				body: {
					inputMap,
				},
			}),
		}),
		generateMap: builder.mutation<void, void>({
			query: () => ({
				url: "server2/generate",
				method: "POST",
			}),
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
			query: () => "server2/get_my_ocean_maps",
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
	useGetAnalyticsQuery,
	useGenerateMapMutation,
	useSaveMapMutation,
	useGetMySimulationsQuery,
	useDeleteMapMutation,
} = analyticsApiSlice;
