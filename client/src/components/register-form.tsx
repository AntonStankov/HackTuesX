"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import {
	Form,
	FormControl,
	FormMessage,
	FormLabel,
	FormField,
	FormItem,
} from "./ui/form";

import { useRegisterMutation } from "@/redux/features/auth/auth-api-slice";

import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";

const schema = z
	.object({
		name: z.string().nonempty(),
		email: z.string().email(),
		password: z
			.string()
			.regex(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/, {
				message:
					"Password must contain at least 6 characters, including at least one uppercase letter, one lowercase letter, and one number",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormValues = z.infer<typeof schema>;

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: UserRegisterFormProps) {
	const { toast } = useToast();

	const [signUp, { isLoading }] = useRegisterMutation();

	const searchParams = useSearchParams();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),

		defaultValues: {
			email: searchParams[0]?.get("email") ?? "",
			password: searchParams[0]?.get("password") ?? "",
			confirmPassword: searchParams[0]?.get("confirmPassword") ?? "",
		},
	});

	const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
		try {
			await signUp({
				email: data.email,
				password: data.password,
				name: data.name,
			}).unwrap();

			toast({
				title: "Account created.",
				description: "We've created your account for you.",
			});
		} catch (error) {
			console.log(error);
			toast({
				title: "An error occurred.",
				description: "Unable to create your account.",
			});
		}
	};

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="name"
								render={({ field, formState }) => (
									<FormItem>
										<FormLabel className="sr-only">
											Name
										</FormLabel>
										<FormControl>
											<Input
												id="name"
												placeholder="Name"
												type="text"
												autoCapitalize="none"
												autoComplete="name"
												autoCorrect="off"
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{formState.errors.name?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field, formState }) => (
									<FormItem>
										<FormLabel className="sr-only">
											Email
										</FormLabel>
										<FormControl>
											<Input
												id="email"
												placeholder="name@example.com"
												type="email"
												autoCapitalize="none"
												autoComplete="email"
												autoCorrect="off"
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{formState.errors.email?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field, formState }) => (
									<FormItem>
										<FormLabel className="sr-only">
											Password
										</FormLabel>
										<FormControl>
											<Input
												id="password"
												placeholder="Password"
												type="password"
												autoCapitalize="none"
												autoComplete="current-password"
												autoCorrect="off"
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{formState.errors.password?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field, formState }) => (
									<FormItem>
										<FormLabel className="sr-only">
											Confirm Password
										</FormLabel>
										<FormControl>
											<Input
												id="confirm-password"
												placeholder="Confirm Password"
												type="password"
												autoCapitalize="none"
												autoComplete="current-password"
												autoCorrect="off"
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button disabled={isLoading}>
							{isLoading && (
								<Icons.gitHub className="mr-2 h-4 w-4 animate-spin" />
							)}
							Create Account
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
