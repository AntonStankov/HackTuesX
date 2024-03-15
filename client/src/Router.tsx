import { createBrowserRouter } from "react-router-dom";

import { Applayout } from "./components/layouts/AppLayout";

import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Empty from "./pages/Empty";
import Sample from "./pages/Sample";
import Map from "./pages/Map";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateSimulation from "./pages/CreateSimulation";
import Chat from "./pages/Chat";
import ProtectedLayout from "./components/layouts/ProtectedLayout";
import AuthenticatedLayout from "./components/layouts/AuthenticatedLayout";

export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Applayout />,
			children: [
				{
					path: "",
					element: <ProtectedLayout />,
					children: [
						{
							path: "dashboard",
							element: <Dashboard />,
						},
						{
							path: "dashboard/new",
							element: <CreateSimulation />,
						},
					],
				},
				{
					path: "sample",
					element: <Sample />,
				},
				{
					path: "empty",
					element: <Empty />,
				},
				{
					path: "profile",
					element: <Profile />,
				},
				{
					path: "chat",
					element: <Chat />,
				},
			],
		},
		{
			path: "map",
			element: <Map />,
		},
		{
			path: "",
			element: <AuthenticatedLayout />,
			children: [
				{
					path: "login",
					element: <Login />,
				},
				{
					path: "register",
					element: <Register />,
				},
			],
		},
		{
			path: "*",
			element: <NoMatch />,
		},
	],
	{
		basename: global.basename,
	}
);
