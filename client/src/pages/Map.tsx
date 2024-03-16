import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	selectMap,
	selectShowGrid,
	toggleGrid,
	bucketFill,
	selectHistory,
	selectIndex,
	updateSquare,
	redoAction,
	undoAction,
	setHistory,
	selectPickedColor,
	changeColor,
} from "@/redux/features/simulation/simulation-handler";

import { useEffect, useState } from "react";

import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Button } from "@/components/ui/button";

import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

import { Redo, Undo } from "lucide-react";

import { useDroppable } from "@dnd-kit/core";

import { Color } from "@/redux/features/simulation/simulation-handler";
import {
	AnalyticsResponse,
	useLazyGetAnalyticsQuery,
} from "@/redux/features/simulation/simulation-api-slice";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
interface Tile {
	color: string;
	label: string;
	colorLetter: Color;
}

const tileTypes: Tile[] = [
	{ color: "bg-blue-900", label: "Shark", colorLetter: Color.Shark },
	{
		color: "bg-blue-800",
		label: "Predator Fish",
		colorLetter: Color.PredatorFish,
	},
	{ color: "bg-yellow-600", label: "Weak Fish", colorLetter: Color.WeakFish },
	{
		color: "bg-orange-500",
		label: "Passive Fish",
		colorLetter: Color.PassiveFish,
	},
	{ color: "bg-primary", label: "Oil Rig", colorLetter: Color.OilRig },
	{ color: "bg-blue-500", label: "Water", colorLetter: Color.Water },
	{
		color: "bg-slate-500",
		label: "Small Ship",
		colorLetter: Color.SmallShip,
	},
	{
		color: "bg-slate-700",
		label: "Large Ship",
		colorLetter: Color.LargeShip,
	},
];

export default function Map() {
	const [singleClickTimer, setSingleClickTimer] =
		useState<NodeJS.Timeout | null>(null);

	const map = useAppSelector(selectMap);
	const history = useAppSelector(selectHistory);
	const index = useAppSelector(selectIndex);
	const tileColor = useAppSelector(selectPickedColor);
	const [trigger, getAnalytics] = useLazyGetAnalyticsQuery();

	const showGrid = useAppSelector(selectShowGrid);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { isOver, setNodeRef } = useDroppable({
		id: "all",
	});

	useEffect(() => {
		dispatch({ type: "simulation/generateMap" });
	}, []);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				dispatch(undoAction());
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "y" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				dispatch(redoAction());
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "t" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				window.location.href = "/new";
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [navigate]);

	function handleSquareClick(idx: number) {
		if (singleClickTimer === null) {
			setSingleClickTimer(
				setTimeout(() => {
					dispatch(updateSquare({ idx, value: tileColor }));
					setSingleClickTimer(null);
				}, 200)
			);

			dispatch(setHistory());
		} else {
			clearTimeout(singleClickTimer);
			setSingleClickTimer(null);
			dispatch(bucketFill({ idx, value: tileColor }));

			dispatch(setHistory());
		}
	}

	function updateXarrow() {
		// @ts-ignore
		window.xarrow.updateAll();
	}

	function colorTile(letter: string) {
		switch (letter) {
			case "L":
				return "bg-green-500";
			case Color.Shark:
				return "bg-blue-900";
			case Color.PredatorFish:
				return "bg-blue-800";
			case Color.WeakFish:
				return "bg-yellow-600";
			case Color.PassiveFish:
				return "bg-yellow-700";
			case Color.OilRig:
				return "bg-black-500";
			case Color.Water:
				return "bg-blue-500";
			case Color.SmallShip:
				return "bg-slate-500";
			case Color.LargeShip:
				return "bg-slate-700";
			default:
				return "bg-blue-500";
		}
	}

	function numbersToAnalytics(data: AnalyticsResponse) {
		return [
			{
				name: "Shark",
				total: data.sharkLife,
			},
			{
				name: "Predator Fish",
				total: data.fishLife,
			},
			{
				name: "Weak Fish",
				total: data.oceanCleanliness,
			},
			{
				name: "Passive Fish",
				total: data.shipProductivity,
			},
			{
				name: "Oil Rig",
				total: data.rigProductivity,
			},
		];
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<Draggable
				bounds="parent"
				axis="both"
				handle=".handle"
				defaultPosition={{ x: 0, y: 0 }}
				grid={[1, 1]}
				scale={1}
			>
				<TransformWrapper
					doubleClick={{ disabled: true }}
					initialScale={1.5}
					minScale={1}
					maxScale={5}
					limitToBounds
					maxPositionX={0}
					maxPositionY={0}
					minPositionX={0}
					minPositionY={0}
					onPanning={updateXarrow}
					onZoom={updateXarrow}
					pinch={{ step: 5 }}
				>
					<TransformComponent>
						<ContextMenu>
							<ContextMenuTrigger>
								<div className="grid grid-cols-200 relative overflow-hidden h-[800px] w-[1600px]">
									{map.split("").map((_, idx) => (
										<div
											key={idx}
											className={`h-2 w-2 
										${showGrid ? "outline outline-gray-300 dark:outline-gray-700" : ""}
										${colorTile(map[idx])} 
										`}
											style={{
												top: `${
													Math.floor(idx / 200) * 2
												}rem`,
												left: `${(idx % 200) * 2}rem`,
											}}
											onContextMenu={(e) => {
												e.preventDefault();
												dispatch(
													updateSquare({
														idx,
														value: tileColor,
													})
												);
												dispatch(setHistory());
											}}
											onClick={() =>
												handleSquareClick(idx)
											}
										></div>
									))}
								</div>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuCheckboxItem
									checked={showGrid}
									onCheckedChange={() =>
										dispatch(toggleGrid())
									}
								>
									Show Grid
								</ContextMenuCheckboxItem>
								<ContextMenuItem>Item 2</ContextMenuItem>
								<ContextMenuItem>Item 3</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					</TransformComponent>
				</TransformWrapper>
			</Draggable>
			<div className="absolute bottom-10 right-5 p-4 space-x-4 inline-flex border border-gray-300 dark:border-gray-700 rounded-lg">
				<div className="flex space-x-2">
					{tileTypes.map((tile, idx) => (
						<button
							key={idx}
							onClick={() =>
								dispatch(changeColor(tile.colorLetter))
							}
							className={`h-8 w-8 ${tile.color}`}
						></button>
					))}
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant="link"
							onClick={() => {
								trigger({ inputMap: map });
							}}
						>
							Analytics
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Following</DialogTitle>
						</DialogHeader>
						<ResponsiveContainer width="100%" height={350}>
							<BarChart
								data={
									getAnalytics.data &&
									numbersToAnalytics(
										getAnalytics.data as AnalyticsResponse
									)
								}
							>
								<XAxis
									dataKey="name"
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={(value) => `$${value}`}
								/>
								<Bar
									dataKey="total"
									fill="currentColor"
									radius={[4, 4, 0, 0]}
									className="fill-primary"
								/>
							</BarChart>
						</ResponsiveContainer>
					</DialogContent>
				</Dialog>
				<Button
					onClick={() => dispatch(undoAction())}
					disabled={index === 0}
				>
					<Undo />
				</Button>
				<Button
					onClick={() => dispatch(redoAction())}
					disabled={index === history.length - 1}
				>
					<Redo />
				</Button>
			</div>
		</div>
	);
}
