import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SidebarNav } from "@/components/SidebarNav";

const sidebarNavItems = [
	{
		title: "Profile",
		href: "/examples/forms",
	},
	{
		title: "Account",
		href: "/examples/forms/account",
	},
	{
		title: "Appearance",
		href: "/examples/forms/appearance",
	},
	{
		title: "Notifications",
		href: "/examples/forms/notifications",
	},
	{
		title: "Display",
		href: "/examples/forms/display",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export function Applayout() {
	return (
		<>
			<Header />
			<div className="flex-grow flex flex-col">
				<div className="container px-4 md:px-8 flex-grow flex flex-col">
					<Outlet />
				</div>
			</div>
			<div className="container px-4 md:px-8">
				<Footer />
			</div>
		</>
	);
}
