import { createSlice } from "@reduxjs/toolkit";
import { MyOceans, Ocean, analyticsApiSlice } from "./simulation-api-slice";
import type { RootState } from "@/redux/store";

function generateStringWithLength(length: number) {
	const result = [];
	const characters = "AL";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result.push(
			characters.charAt(Math.floor(Math.random() * charactersLength))
		);
	}
	return result.join("");
}

export enum Color {
	Water = "A",
	Shark = "K",
	PredatorFish = "X",
	WeakFish = "C",
	PassiveFish = "F",
	OilRig = "O",
	SmallShip = "S",
	LargeShip = "B",
}

interface TileConstruction {
	tilesIdxs: number[];
	color: Color;
}
interface MapState {
	all_maps: Ocean[];
	map: string; // 20000 characters of A, B, C
	showGrid: boolean;
	history: string[];
	index: number;
	pickedColor: Color;
}

const initialState: MapState = {
	all_maps: [],
	map: localStorage.getItem("map") || generateStringWithLength(20000),
	showGrid: localStorage.getItem("showGrid") === "true",
	history: [],
	index: 0,
	pickedColor: Color.Water,
};

// Oil rigs are gonna be 4x4 squares
// Sharks are gonna be 1x2 squares
// Fish are gonna be 1x1 squares
// Water is gonna be 1x1 squares
// Small Ships are gonna be 1x3 squares
// Big Ships are gonna be 1x4 squares

const simulationSlice = createSlice({
	name: "simulation",
	initialState,
	reducers: {
		generateMap: (state, action: { payload: string }) => {
			state.map = action.payload;
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

			let tileConstruction: TileConstruction;

			switch (action.payload.value) {
				case Color.OilRig:
					tileConstruction = {
						tilesIdxs: [
							action.payload.idx,
							action.payload.idx + 1,
							action.payload.idx + 200,
							action.payload.idx + 201,
						],
						color: Color.OilRig,
					};
					break;
				case Color.Shark:
					tileConstruction = {
						tilesIdxs: [
							action.payload.idx,
							action.payload.idx + 200,
						],
						color: Color.Shark,
					};
					break;
				case Color.PredatorFish:
					tileConstruction = {
						tilesIdxs: [action.payload.idx],
						color: Color.PredatorFish,
					};
					break;
				case Color.WeakFish:
					tileConstruction = {
						tilesIdxs: [action.payload.idx],
						color: Color.WeakFish,
					};
					break;
				case Color.PassiveFish:
					tileConstruction = {
						tilesIdxs: [action.payload.idx],
						color: Color.PassiveFish,
					};
					break;
				case Color.SmallShip:
					tileConstruction = {
						tilesIdxs: [
							action.payload.idx,
							action.payload.idx + 1,
							action.payload.idx + 2,
						],
						color: Color.SmallShip,
					};
					break;
				case Color.LargeShip:
					tileConstruction = {
						tilesIdxs: [
							action.payload.idx,
							action.payload.idx + 1,
							action.payload.idx + 2,
							action.payload.idx + 3,
						],
						color: Color.LargeShip,
					};
					break;
				default:
					tileConstruction = {
						tilesIdxs: [],
						color: Color.Water,
					};
					break;
			}

			tileConstruction.tilesIdxs.forEach((idx) => {
				state.map =
					state.map.slice(0, idx) +
					tileConstruction.color +
					state.map.slice(idx + 1);
			});
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
		changeColor: (state, action: { payload: Color }) => {
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
	extraReducers: (builder) => {
		builder.addMatcher(
			analyticsApiSlice.endpoints.getMySimulations.matchFulfilled,
			(state, action) => {
				state.all_maps = action.payload.oceans;
			}
		);
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
export const selectMaps = (state: RootState) => state.simulation.all_maps;
export const selectShowGrid = (state: RootState) => state.simulation.showGrid;
export const selectPickedColor = (state: RootState) =>
	state.simulation.pickedColor;
export const selectHistory = (state: RootState) => state.simulation.history;
export const selectIndex = (state: RootState) => state.simulation.index;

export default simulationSlice;
