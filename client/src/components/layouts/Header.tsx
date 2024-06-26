import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { appConfig } from "@/config/app";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mainMenu } from "@/config/menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Logo } from "../logo";

import {
	useGetPersonProfileQuery,
	useGetUserQuery,
	useLogoutMutation,
} from "@/redux/features/auth/auth-api-slice";

import { useNavigate } from "react-router-dom";

import { Skeleton } from "../ui/skeleton";

import { useAppSelector } from "@/redux/hooks";
import { selectUsername } from "@/redux/features/auth/auth-handler";

export function Header() {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const username = useAppSelector(selectUsername);
	const [logout] = useLogoutMutation();
	const { data, isLoading } = useGetUserQuery();

	return (
		<header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
			<div className="container px-4 md:px-8 flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<NavLink
						to="/"
						className="mr-6 flex items-center space-x-2"
					>
						<Logo />
					</NavLink>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{mainMenu.map((menu, index) =>
							menu.items !== undefined ? (
								<DropdownMenu key={index}>
									<DropdownMenuTrigger
										className={cn(
											"flex items-center py-1 focus:outline-none text-sm font-medium transition-colors hover:text-primary",
											menu.items
												.filter(
													(subitem) =>
														subitem.to !== undefined
												)
												.map((subitem) => subitem.to)
												.includes(location.pathname)
												? "text-foreground"
												: "text-foreground/60"
										)}
									>
										{menu.title}
										<ChevronDownIcon className="ml-1 -mr-1 h-3 w-3 text-muted-foreground" />
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-48"
										align="start"
										forceMount
									>
										{menu.items.map((subitem, subindex) =>
											subitem.to !== undefined ? (
												<NavLink
													key={subindex}
													to={subitem.to}
												>
													<DropdownMenuItem
														className={cn(
															"hover:cursor-pointer",
															{
																"bg-muted":
																	subitem.to ===
																	location.pathname,
															}
														)}
													>
														{subitem.title}
													</DropdownMenuItem>
												</NavLink>
											) : subitem.label ? (
												<DropdownMenuLabel
													key={subindex}
												>
													{subitem.title}
												</DropdownMenuLabel>
											) : (
												<DropdownMenuSeparator
													key={subindex}
												/>
											)
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<NavLink
									key={index}
									to={menu.to ?? ""}
									className={({ isActive }) =>
										cn(
											"text-sm font-medium transition-colors hover:text-primary",
											isActive
												? "text-foreground"
												: "text-foreground/60"
										)
									}
								>
									{menu.title}
								</NavLink>
							)
						)}
					</nav>
				</div>
				{/* right */}
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						{/* <CommandMenu /> */}
					</div>
					<nav className="flex items-center space-x-2">
						<a
							href={appConfig.github.url}
							title={appConfig.github.title}
							target="_blank"
							rel="noreferrer"
						>
							<div
								className={cn(
									buttonVariants({
										variant: "ghost",
									}),
									"w-9 px-0"
								)}
							>
								<Icons.gitHub className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</div>
						</a>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<Avatar className="h-8 w-8">
										<AvatarFallback>
											{isLoading ? "..." : data?.name[0]}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56"
								align="end"
								forceMount
							>
								<DropdownMenuLabel className="font-normal">
									{isLoading ? (
										<Skeleton className="h-4 w-16" />
									) : (
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{data?.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												@{data?.name}
											</p>
										</div>
									)}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => {
										navigate(`/${data?.name}`);
									}}
								>
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										logout("logout");
									}}
								>
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>
			</div>
		</header>
	);
}
