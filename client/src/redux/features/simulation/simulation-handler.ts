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
	history: string[];
	index: number;
	pickedColor: "A" | "B" | "C";
}

const initialState: MapState = {
	map: localStorage.getItem("map") || generateStringWithLength(20000),
	showGrid: localStorage.getItem("showGrid") === "true",
	history: [],
	index: 0,
	pickedColor: "A",
};

const simulationSlice = createSlice({
	name: "simulation",
	initialState,
	reducers: {
		generateMap: (state) => {
			state.map = generateStringWithLength(20000);
			state.history = [];
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
		bucketFill: (
			state,
			action: { payload: { idx: number; value: string } }
		) => {
			// y*200+x
			const map = new Array(20000);
			const mapArray = state.map.split("");

			mapArray.forEach((value, index) => {
				map[index] = value;
			});

			const stack = [action.payload.idx];
			const target = map[action.payload.idx];
			while (stack.length) {
				const idx = stack.pop();
				if (idx === undefined) break;
				if (map[idx] === target) {
					map[idx] = action.payload.value;
					if (idx % 200 !== 0) stack.push(idx - 1);
					if (idx % 200 !== 199) stack.push(idx + 1);
					if (idx >= 200) stack.push(idx - 200);
					if (idx < 19800) stack.push(idx + 200);
				}
			}
			state.map = map.join("");
		},
		changeColor: (state, action: { payload: "A" | "B" | "C" }) => {
			state.pickedColor = action.payload;
		},
		toggleGrid: (state) => {
			state.showGrid = !state.showGrid;
			localStorage.setItem("showGrid", state.showGrid.toString());
		},
		setHistory: (state) => {
			state.history.push(state.map);
			state.index = state.history.length - 1;
		},
		undoAction: (state) => {
			if (state.index > 0) {
				state.index -= 1;
				state.map = state.history[state.index];
			}
		},
		redoAction: (state) => {
			if (state.index < state.history.length - 1) {
				state.index += 1;
				state.map = state.history[state.index];
			}
		},
	},
});

export const {
	generateMap,
	updateSquare,
	bucketFill,
	changeColor,
	toggleGrid,
	undoAction,
	redoAction,
	setHistory,
} = simulationSlice.actions;

export const selectMap = (state: RootState) => state.simulation.map;
export const selectShowGrid = (state: RootState) => state.simulation.showGrid;
export const selectPickedColor = (state: RootState) =>
	state.simulation.pickedColor;
export const selectHistory = (state: RootState) => state.simulation.history;
export const selectIndex = (state: RootState) => state.simulation.index;

export default simulationSlice;
