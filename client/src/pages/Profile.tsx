import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	User,
	useFollowUserMutation,
	useRemoveFollowMutation,
	useGetPersonProfileQuery,
	useLazyGetFollowersQuery,
	useLazyGetFollowingQuery,
} from "@/redux/features/auth/auth-api-slice";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useParams } from "react-router-dom";

import { useAppSelector } from "@/redux/hooks";
import { selectUsername } from "@/redux/features/auth/auth-handler";

const ProfileCard = ({ user }: { user: User }) => {
	return (
		<div className="flex items-center space-x-2">
			<Avatar>
				<AvatarImage src={user.name} alt={user.name} sizes="40" />
				<AvatarFallback />
			</Avatar>
			<div>
				<h1 className="text-2xl font-medium">{user.name}</h1>
				<p className="text-sm text-zinc-300">
					@{user.email.split("@")[0]}
				</p>
			</div>
		</div>
	);
};

export default function Profile() {
	const { username } = useParams<{ username: string }>() as {
		username: string;
	};

	const usernameProfile = useAppSelector(selectUsername);
	const [followUser] = useFollowUserMutation();
	const [removeFollow] = useRemoveFollowMutation();

	const [
		triggerFollowers,
		{ data: resultFollowers, isLoading: isLoadingFollowers },
	] = useLazyGetFollowersQuery();
	const [
		triggerFollowing,
		{ data: resultFollowing, isLoading: isLoadingFollowing },
	] = useLazyGetFollowingQuery();

	const { data: profile, isLoading: isLoadingProfile } =
		useGetPersonProfileQuery({ username });

	if (isLoadingProfile)
		return (
			<div className="flex flex-col gap-4 max-w-3xl mx-auto p-4">
				<div className="flex flex-col justify-between items-center">
					<div className="flex justify-between items-center w-full">
						<div className="flex flex-col gap-2">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-4 w-24" />
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
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
			</div>
		);

	return (
		<div className="flex flex-col gap-4 max-w-3xl mx-auto p-4">
			<div className="flex flex-col justify-between items-center">
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col gap-2">
						<h1 className="text-2xl font-medium">
							{profile?.name}
						</h1>
						<p className="text-sm text-zinc-300">
							@{profile?.email.split("@")[0]}
						</p>
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
							<Button
								variant="link"
								onClick={() => {
									triggerFollowers();
								}}
							>
								{profile?.followers} followers
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Followers</DialogTitle>
							</DialogHeader>
							<div className="flex flex-col gap-4">
								<ScrollArea>
									{isLoadingFollowers ? (
										<div className="flex items-center space-x-4">
											<Skeleton className="h-12 w-12 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-[250px]" />
												<Skeleton className="h-4 w-[200px]" />
											</div>
										</div>
									) : (
										resultFollowers &&
										resultFollowers.map((user) => (
											<ProfileCard
												key={user.id}
												user={user}
											/>
										))
									)}
								</ScrollArea>
							</div>
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="link"
								onClick={() => {
									triggerFollowing();
								}}
							>
								{profile?.following} following
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Following</DialogTitle>
							</DialogHeader>
							<div className="flex flex-col gap-4">
								<ScrollArea className="h-72 w-48 rounded-md border">
									{isLoadingFollowing ? (
										<div className="flex items-center space-x-4">
											<Skeleton className="h-12 w-12 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-[250px]" />
												<Skeleton className="h-4 w-[200px]" />
											</div>
										</div>
									) : (
										resultFollowing &&
										resultFollowing.map((user) => (
											<ProfileCard
												key={user.id}
												user={user}
											/>
										))
									)}
								</ScrollArea>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				{profile?.username === usernameProfile ? (
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
				) : (
					<Button
						className="w-full"
						variant="outline"
						onClick={() =>
							followUser({ id: profile?.id } as { id: number })
						}
					>
						Follow
					</Button>
				)}
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
