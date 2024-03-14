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
	const map = useAppSelector(selectMap);
	const showGrid = useAppSelector(selectShowGrid);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch({ type: "simulation/generateMap" });
	}, []);

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
										onClick={() => {
											dispatch(
												bucketFill({
													idx,
													value:
														item === "A"
															? "B"
															: item === "B"
															? "C"
															: "A",
												})
											);
											// dispatch({
											// 	type: "simulation/updateSquare",
											// 	payload: {
											// 		idx,
											// 		value:
											// 			item === "A"
											// 				? "B"
											// 				: item === "B"
											// 				? "C"
											// 				: "A",
											// 	},
											// });
										}}
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
