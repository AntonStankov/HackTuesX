import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
	return (
		<>
			<PageHeader className="flex flex-col md:flex-row justify-between">
				<PageHeaderHeading>Dashboard</PageHeaderHeading>
				<Button>
					+
					<span
						className="
                    block
                    md:hidden
                    lg:block
                    "
					>
						Create New Simulation
					</span>
				</Button>
			</PageHeader>
			<Card>
				<CardHeader>
					<CardTitle>Your Simulations</CardTitle>
					<CardDescription>
						React + Vite + TypeScript template for building apps
						with shadcn/ui.
					</CardDescription>
				</CardHeader>
			</Card>
		</>
	);
}
