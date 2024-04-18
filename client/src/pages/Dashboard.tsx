import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Plus } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";

import { useNavigate } from "react-router-dom";

import { useGetMySimulationsQuery } from "@/redux/features/simulation/simulation-api-slice";

export default function Dashboard() {
	const navigate = useNavigate();

	const { data: simulations, isLoading } = useGetMySimulationsQuery();

	return (
		<>
			<PageHeader className="flex flex-col md:flex-row justify-between">
				<PageHeaderHeading>Dashboard</PageHeaderHeading>
				<Button onClick={() => navigate("/dashboard/new")}>
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{isLoading ? (
					<>
						<Skeleton className="w-[368px] h-[256px]" />
						<Skeleton className="w-[368px] h-[256px]" />
						<Skeleton className="w-[368px] h-[256px]" />
					</>
				) : (
					simulations?.oceans.map((simulation) => (
						<Card
							onClick={() =>
								navigate(`/map/${simulation.ocean_name}`)
							}
							key={simulation.ocean_name}
							className="w-[368px] h-[256px] cursor-pointer"
						>
							<CardHeader>
								<CardTitle>
									<Avatar about={simulation.ocean_name} />
								</CardTitle>
								<CardDescription>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{simulation.ocean_name}
									</p>
									<p className="text-md text-gray-600 dark:text-gray-300">
										24/ 100 score
									</p>
								</CardDescription>
							</CardHeader>
						</Card>
					))
				)}
			</div>
		</>
	);
}
