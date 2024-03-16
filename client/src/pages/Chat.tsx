import { ChatLayout } from "@/components/layouts/ChatLayout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

function generateChat() {
	return {
		id: "1",
		name: "Chat",
		messages: [
			{
				id: "1",
				content: "Hello, world!",
				sender: "1",
				timestamp: "2021-09-01T12:00:00Z",
			},
			{
				id: "2",
				content: "Hi!",
				sender: "2",
				timestamp: "2021-09-01T12:00:01Z",
			},
		],
	};
}

export default function Chat() {
	const chat = generateChat();

	return (
		<main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
			<div className="flex justify-between max-w-5xl w-full items-center">
				<Link
					to="/profile"
					className="text-4xl font-bold text-gradient"
				>
					borislav borisov
				</Link>
				<Link
					to={"/neshto"}
					className={cn(
						buttonVariants({ variant: "ghost", size: "icon" }),
						"h-10 w-10"
					)}
				>
					<GitHubLogoIcon className="w-7 h-7 text-muted-foreground" />
				</Link>
			</div>

			<div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
				<ChatLayout defaultLayout={[320, 480]} navCollapsedSize={8} />
			</div>
		</main>
	);
}
