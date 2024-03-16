import { Link } from "react-router-dom";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Message } from "@/components/chat/data";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface SidebarProps {
	isCollapsed: boolean;
	links: {
		name: string;
		messages: Message[];
		variant: "grey" | "ghost";
	}[];
	onClick?: () => void;
	isMobile: boolean;
}

export function Sidebar({ links, isCollapsed, isMobile }: SidebarProps) {
	return (
		<div
			data-collapsed={isCollapsed}
			className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
		>
			{!isCollapsed && (
				<div className="flex justify-between p-2 items-center">
					<div className="flex gap-2 items-center text-2xl">
						<p className="font-medium">Chats</p>
						<span className="text-zinc-300">({links.length})</span>
					</div>

					<div>
						<Link
							to="#"
							className={cn(
								buttonVariants({
									variant: "ghost",
									size: "icon",
								}),
								"h-9 w-9"
							)}
						>
							<MoreHorizontal size={20} />
						</Link>

						<Link
							to="#"
							className={cn(
								buttonVariants({
									variant: "ghost",
									size: "icon",
								}),
								"h-9 w-9"
							)}
						>
							<SquarePen size={20} />
						</Link>
					</div>
				</div>
			)}
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link, index) =>
					isCollapsed ? (
						<TooltipProvider key={index}>
							<Tooltip key={index} delayDuration={0}>
								<TooltipTrigger asChild>
									<Link
										to="#"
										className={cn(
											buttonVariants({
												variant:
													link.variant as "ghost",
												size: "lg",
											}),
											"h-11 w-11 md:h-16 md:w-16",
											link.variant === "grey" &&
												"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
										)}
									>
										<Avatar className="flex justify-center items-center">
											<AvatarFallback className="w-10 h-10 ">
												{link.name[0] + link.name[1]}
											</AvatarFallback>
										</Avatar>{" "}
										<span className="sr-only">
											{link.name}
										</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent
									side="right"
									className="flex items-center gap-4"
								>
									{link.name}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<Link
							key={index}
							to="#"
							className={cn(
								buttonVariants({
									variant: link.variant as "ghost",
									size: "lg",
								}),
								link.variant === "grey" &&
									"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
								"justify-start gap-4"
							)}
						>
							<Avatar className="flex justify-center items-center">
								<AvatarImage className="w-10 h-10 color-gray-100 dark:color-gray-100">
									{link.name[0] + link.name[1]}
								</AvatarImage>
							</Avatar>
							<div className="flex flex-col max-w-28">
								<span>{link.name}</span>
								{link.messages.length > 0 && (
									<span className="text-zinc-300 text-xs truncate ">
										{
											link.messages[
												link.messages.length - 1
											].name.split(" ")[0]
										}
										:{" "}
										{
											link.messages[
												link.messages.length - 1
											].message
										}
									</span>
								)}
							</div>
						</Link>
					)
				)}
			</nav>
		</div>
	);
}
