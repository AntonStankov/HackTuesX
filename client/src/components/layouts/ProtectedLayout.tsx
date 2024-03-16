import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/auth-handler";

export default function ProtectedLayout() {
	const token = useAppSelector(selectToken);

	return (
		<>
			{token ? (
				<>
					<Outlet />
				</>
			) : (
				<Navigate to="/login" />
			)}
		</>
	);
}
