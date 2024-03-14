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

export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Applayout />,
			children: [
				{
					path: "dashboard",
					element: <Dashboard />,
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
					path: "new",
					element: <CreateSimulation />,
				},
			],
		},
		{
			path: "map",
			element: <Map />,
		},
		{
			path: "login",
			element: <Login />,
		},
		{
			path: "register",
			element: <Register />,
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
