import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	selectMap,
	selectShowGrid,
	toggleGrid,
	bucketFill,
} from "@/redux/features/simulation/simulation-handler";
import { useEffect } from "react";

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

export default function Map() {
	let singleClickTimer: NodeJS.Timeout | null = null;

	const map = useAppSelector(selectMap);
	const showGrid = useAppSelector(selectShowGrid);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch({ type: "simulation/generateMap" });
	}, []);

	function handleSquareClick(idx: number) {
		if (singleClickTimer === null) {
			singleClickTimer = setTimeout(() => {
				dispatch({
					type: "simulation/updateSquare",
					payload: {
						idx,
						value: map[idx] === "A" ? "B" : "A",
					},
				});
				singleClickTimer = null;
			}, 200);
		} else {
			clearTimeout(singleClickTimer);
			singleClickTimer = null;
			dispatch({
				type: "simulation/bucketFill",
				payload: {
					idx,
					value: map[idx] === "A" ? "B" : "A",
				},
			});
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
								{map.split("").map((item, idx) => (
									<div
										key={idx}
										className={`h-2 w-2 
										${showGrid ? "outline outline-gray-300 dark:outline-gray-700" : ""}
										${
											item === "A"
												? "bg-blue-500"
												: item === "B"
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
		</div>
	);
}
