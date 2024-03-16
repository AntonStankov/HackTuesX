import { useState } from "react";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { useNavigate } from "react-router-dom";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGenerateMapMutation } from "@/redux/features/simulation/simulation-api-slice";

import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
	name: z.string().nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateSimulation() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	const navigate = useNavigate();
	const { toast } = useToast();

	const [generateMap, { data, error, isLoading }] = useGenerateMapMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		try {
			generateMap({ ocean_name: data.name }).unwrap();
			navigate("/dashboard");
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred while generating the map.",
			});
		}
	});

	// const worldOceans = [
	// 	{ value: "arctic", label: "Arctic Ocean" },
	// 	{ value: "atlantic", label: "Atlantic Ocean" },
	// 	{ value: "indian", label: "Indian Ocean" },
	// 	{ value: "pacific", label: "Pacific Ocean" },
	// 	{ value: "southern", label: "Southern Ocean" },
	// ] as const;

	return (
		<Card className="w-[350px] mx-auto my-auto">
			<CardHeader>
				<CardTitle>Let's create your simulation</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={handleSubmit}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Simulation Name *
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							{/* <div className="flex flex-col space-y-1.5">
							<Label htmlFor="ocean">Ocean</Label>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-[200px] justify-between"
									>
										{value
											? worldOceans.find(
													(ocean) =>
														ocean.value === value
											  )?.label
											: "Select ocean..."}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search ocean..." />
										<CommandEmpty>
											No ocean found.
										</CommandEmpty>
										<CommandGroup>
											{worldOceans.map((ocean) => (
												<CommandItem
													key={ocean.value}
													value={ocean.value}
													onSelect={(
														currentValue = ""
													) => {
														setValue(
															currentValue ===
																value
																? ""
																: currentValue
														);
														setOpen(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															value ===
																ocean.value
																? "opacity-100"
																: "opacity-0"
														)}
													/>
													{ocean.label}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
						</div> */}
						</div>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					variant="outline"
					onClick={() => navigate("/dashboard")}
				>
					Cancel
				</Button>
				<Button
					disabled={isLoading}
					onClick={handleSubmit}
					type="submit"
				>
					Generate
				</Button>
			</CardFooter>
		</Card>
	);
}
