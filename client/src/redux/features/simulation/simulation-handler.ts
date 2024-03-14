import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

function generateStringWithLength(length: number) {
	const result = [];
	const characters = "ABC";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength))
		);
	}
	return result.join("");
}

interface MapState {
	map: string; // 20000 characters of A, B, C
	showGrid: boolean;
}

const initialState: MapState = {
	map: localStorage.getItem("map") || generateStringWithLength(20000),
	showGrid: localStorage.getItem("showGrid") === "true",
};

const simulationSlice = createSlice({
	name: "simulation",
	initialState,
	reducers: {
		generateMap: (state) => {
			state.map = generateStringWithLength(20000);
			localStorage.setItem("map", state.map);
		},
		updateSquare: (
			state,
			action: { payload: { idx: number; value: string } }
		) => {
			// y*200+x
			state.map =
				state.map.slice(0, action.payload.idx) +
				action.payload.value +
				state.map.slice(action.payload.idx + 1);
		},
		toggleGrid: (state) => {
			state.showGrid = !state.showGrid;
			localStorage.setItem("showGrid", state.showGrid.toString());
		},
	},
});

export const { generateMap, updateSquare, toggleGrid } =
	simulationSlice.actions;

export const selectMap = (state: RootState) => state.simulation.map;
export const selectShowGrid = (state: RootState) => state.simulation.showGrid;

export default simulationSlice;
