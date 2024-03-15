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
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";

import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Button } from "@/components/ui/button";

export default function Map() {
	const [singleClickTimer, setSingleClickTimer] =
		useState<NodeJS.Timeout | null>(null);

	const map = useAppSelector(selectMap);
	const history = useAppSelector(selectHistory);
	const index = useAppSelector(selectIndex);
	const tileColor = useAppSelector(selectPickedColor);

	const showGrid = useAppSelector(selectShowGrid);

	const dispatch = useAppDispatch();

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

	return (
		<div>
			<Menubar className="mx-auto h-10 bg-gray-100 dark:bg-gray-800">
				<MenubarMenu>
					<MenubarTrigger>File</MenubarTrigger>
					<MenubarContent>
						<MenubarItem>
							New Tab <MenubarShortcut>⌘T</MenubarShortcut>
						</MenubarItem>
						<MenubarItem>New Window</MenubarItem>
						<MenubarSeparator />
						<MenubarItem>Share</MenubarItem>
						<MenubarSeparator />
						<MenubarItem>Print</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<TransformWrapper>
				<TransformComponent>
					<ContextMenu>
						<ContextMenuTrigger>
							<div className="grid grid-cols-200 w-[1600px] h-[800px]">
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
										onClick={() => handleSquareClick(idx)}
									></div>
								))}
							</div>
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuCheckboxItem
								checked={showGrid}
								onCheckedChange={() => dispatch(toggleGrid())}
							>
								Show Grid
							</ContextMenuCheckboxItem>
							<ContextMenuItem>Item 2</ContextMenuItem>
							<ContextMenuItem>Item 3</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				</TransformComponent>
			</TransformWrapper>
			<div className="absolute bottom-5 right-5 p-4 space-x-4">
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
					onClick={() => dispatch(redoAction())}
					disabled={index === history.length - 1}
				>
					Redo
				</Button>
				<Button
					onClick={() => dispatch(undoAction())}
					disabled={index === 0}
				>
					Undo
				</Button>
			</div>
		</div>
	);
}
