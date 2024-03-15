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

export default function Map() {
	const [singleClickTimer, setSingleClickTimer] =
		useState<NodeJS.Timeout | null>(null);

	const map = useAppSelector(selectMap);
	const history = useAppSelector(selectHistory);
	const index = useAppSelector(selectIndex);
	const tileColor = useAppSelector(selectPickedColor);

	const showGrid = useAppSelector(selectShowGrid);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

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
										${
											map[idx] === "A"
												? "bg-blue-500"
												: map[idx] === "B"
												? "bg-green-500"
												: "bg-yellow-500"
										}`}
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
					<Button
						onClick={() => dispatch(changeColor("A"))}
						className={`h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600`}
					></Button>
					<Button
						onClick={() => dispatch(changeColor("B"))}
						className={`h-8 w-8 rounded-full bg-green-500 hover:bg-green-600`}
					></Button>
					<Button
						onClick={() => dispatch(changeColor("C"))}
						className={`h-8 w-8 rounded-full bg-yellow-500 hover:bg-yellow-600`}
					></Button>
				</div>
				<Button
					onClick={() => dispatch({ type: "simulation/generateMap" })}
				>
					Generate
				</Button>
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
