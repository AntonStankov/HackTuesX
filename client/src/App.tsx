import { RouterProvider } from "react-router-dom";
import { ReduxProvider } from "./redux/provider";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";
import { router } from "./Router";

export default function App() {
	return (
		<ThemeProvider>
			<ReduxProvider>
				<RouterProvider router={router} />
				<Toaster />
			</ReduxProvider>
		</ThemeProvider>
	);
}
