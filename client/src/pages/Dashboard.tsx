import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Plus } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const navigate = useNavigate();

	return (
		<>
			<PageHeader className="flex flex-col md:flex-row justify-between">
				<PageHeaderHeading>Dashboard</PageHeaderHeading>
				<Button onClick={() => navigate("/new")}>
					<Plus />
					<span
						className="
                    block
                    md:hidden
                    lg:block

                    ml-2
                    "
					>
						Create New Simulation
					</span>
				</Button>
			</PageHeader>
			<Card className="w-[368px] h-[256px]">
				<CardHeader>
					<CardTitle>
						<Avatar about="First Simulation" />
					</CardTitle>
					<CardDescription>
						{/* light and dark mode accomodations */}
						<p className="text-sm text-gray-500 dark:text-gray-400">
							First Simulation
						</p>

						<p className="text-md text-gray-600 dark:text-gray-300">
							54 / 100 index score
						</p>
					</CardDescription>
				</CardHeader>
			</Card>
		</>
	);
}
