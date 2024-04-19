import {
	LineChart,
	BarChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Bar,
} from "recharts";

import {
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from "recharts";

import { ScatterChart, Scatter, ZAxis } from "recharts";

import type { AnalyticsResponse } from "@/redux/features/simulation/simulation-api-slice";
import { useLazyGetAnalyticsQuery } from "@/redux/features/simulation/simulation-api-slice";

import { useAppSelector } from "@/redux/hooks";
import { selectMap } from "@/redux/features/simulation/simulation-handler";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const generateScatterData = ({
	fishLife,
	sharkLife,
	numPoints,
}: {
	fishLife: number;
	sharkLife: number;
	numPoints: number;
}) => {
	const scatterData = [];
	for (let i = 0; i < numPoints; i++) {
		// Generate random offsets within a certain range (adjust these ranges as needed)
		const fishLifeOffset = Math.random() * 20 - 10; // Range: -10 to 10
		const sharkLifeOffset = Math.random() * 30 - 15; // Range: -15 to 15

		// Calculate new fishLife and sharkLife values
		const newFishLife = fishLife + fishLifeOffset;
		const newSharkLife = sharkLife + sharkLifeOffset;

		// Calculate likelihood of fish being eaten by a shark (you can use any formula here)
		const likelihood = ((100 - newFishLife) * newSharkLife) / 100;

		// Add data point to scatterData array
		scatterData.push({ x: newFishLife, y: newSharkLife, likelihood });
	}
	return scatterData;
};

export default function Analytics() {
	// const [analytics, setAnalytics] = useState<AnalyticsResponse>({
	// 	budget: 3,
	// 	ecology: 9.4,
	// 	efficiency: 5,
	// 	fishLife: 10,
	// 	index: 3.56,
	// 	oceanCleanliness: 10,
	// 	sharkLife: 4,
	// 	shipProductivity: 2,
	// 	rigProductivity: 1,
	// });
	const map = useAppSelector(selectMap);

	const [getAnalytics, { data: analytics, isLoading: isAnalyzing }] =
		useLazyGetAnalyticsQuery();

	const { toast } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		if (map) {
			try {
				getAnalytics({ inputMap: map }).then((res) => {
					toast({
						title: "Analysis Complete",
						description:
							"Map has been analyzed. The data will now be visualized",
					});
				});
			} catch (e: any) {
				toast({
					title: "Analysis Failed",
					description: e.message,
				});
			}
		}
	}, [map]);

	if (isAnalyzing) {
		<div className="container mx-auto px-4 py-8">
			<Icons.spinner className="w-15 h-15 animate-spin" />
			<p className="text-center">Analyzing...</p>
		</div>;
	}

	if (!analytics) {
		<div className="container mx-auto px-4 py-8">
			<p className="text-center">No data to display</p>
			<Button onClick={() => navigate("/dashboard")}>
				Go to dashboard
			</Button>
		</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">Analytics Line Chart</h2>
				<div className="w-full h-64">
					<ResponsiveContainer>
						<BarChart
							data={[
								...Object.entries(analytics || {}).map(
									(analytic) => {
										return {
											name: analytic[0],
											value: analytic[1],
										};
									}
								),
							]}
							width={500}
							height={300}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="ecology"
								stroke="#8884d8"
							/>
							<Bar dataKey="value" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">
					Analytics Radar Chart
				</h2>
				<div className="w-full h-64">
					<ResponsiveContainer>
						<RadarChart
							cx="50%"
							cy="50%"
							outerRadius="80%"
							data={[
								...Object.entries(analytics || {}).map(
									(analytic) => {
										return {
											name: analytic[0],
											value: analytic[1],
										};
									}
								),
							]}
						>
							<PolarGrid />
							<PolarAngleAxis dataKey="name" />
							<PolarRadiusAxis angle={30} domain={[0, 10]} />
							<Radar
								name="Analytics"
								dataKey="value"
								stroke="#8884d8"
								fill="#8884d8"
								fillOpacity={0.6}
							/>
							// add on hover like Bar above
						</RadarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">
					Analytics Scatter Chart
				</h2>
				<div className="w-full h-64">
					<ResponsiveContainer width="100%" height={400}>
						<ScatterChart
							margin={{
								top: 20,
								right: 20,
								bottom: 20,
								left: 20,
							}}
						>
							<CartesianGrid />
							<XAxis type="number" dataKey="x" name="Fish Life" />
							<YAxis
								type="number"
								dataKey="y"
								name="Shark Life"
							/>
							<ZAxis
								type="number"
								dataKey="likelihood"
								range={[5, 100]}
								name="Likelihood"
							/>
							<Tooltip cursor={{ strokeDasharray: "3 3" }} />
							<Legend />
							<Scatter
								name="Scatter Data"
								data={generateScatterData({
									fishLife: analytics?.fishLife || 0,
									sharkLife: analytics?.sharkLife || 0,
									numPoints: 100,
								})}
								fill="#8884d8"
							/>
						</ScatterChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
