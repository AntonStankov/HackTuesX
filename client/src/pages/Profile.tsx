import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";

export default function Profile() {
	// profile page like threads.net
	return (
		<div className="flex flex-col gap-4 max-w-3xl mx-auto p-4">
			<div className="flex flex-col justify-between items-center">
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col gap-2">
						<h1 className="text-2xl font-medium">Jakob Hoeg</h1>
						<p className="text-sm text-zinc-300">@jakobhoeg</p>
					</div>
					<Avatar>
						<AvatarImage
							src="/LoggedInUser.jpg"
							alt="Jakob Hoeg"
							sizes="40"
						/>
						<AvatarFallback />
					</Avatar>
				</div>
				<div className="flex items-center space-x-2 py-6">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						0 simulations
					</p>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="link">28 followers</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Followers</DialogTitle>
							</DialogHeader>
							<div className="flex items-center space-x-2">
								<Avatar>
									<AvatarImage
										src="/User1.png"
										alt="Jane Doe"
									/>
									<AvatarFallback />
								</Avatar>
								<div>
									<h1 className="text-2xl font-medium">
										Jane Doe
									</h1>
									<p className="text-sm text-zinc-300">
										@janedoe
									</p>
								</div>
							</div>
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="link">38 following</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Following</DialogTitle>
							</DialogHeader>
							<div className="flex items-center space-x-2">
								<Avatar>
									<AvatarImage
										src="/User1.png"
										alt="Jane Doe"
									/>
									<AvatarFallback />
								</Avatar>
								<div>
									<h1 className="text-2xl font-medium">
										Jane Doe
									</h1>
									<p className="text-sm text-zinc-300">
										@janedoe
									</p>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<Dialog>
					<DialogTrigger className="w-full">
						<Button className="w-full" variant="outline">
							Edit Profile
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Profile</DialogTitle>
						</DialogHeader>
						<Label htmlFor="name">Name</Label>
						<Input id="name" type="text" />
					</DialogContent>
				</Dialog>
			</div>
			<Tabs>
				<TabsList className="flex gap-8">
					<TabsTrigger value="simulations">Simulations</TabsTrigger>
					<TabsTrigger value="replies">Replies</TabsTrigger>
					<TabsTrigger value="likes">Likes</TabsTrigger>
					<TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
				</TabsList>
				<TabsContent value="simulations"></TabsContent>
				<TabsContent value="Security">
					<div>
						<Label htmlFor="2fa">2FA</Label>
						<Input id="2fa" type="text" />
					</div>
				</TabsContent>
				<TabsContent value="Notifications">
					<div>
						<Label htmlFor="notifications">Notifications</Label>
						<Input id="notifications" type="text" />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
