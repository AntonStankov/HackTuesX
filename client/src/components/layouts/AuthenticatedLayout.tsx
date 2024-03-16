import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/auth-handler";

export default function AuthenticatedLayout() {
	const token = useAppSelector(selectToken);
	const location = useLocation();
	return (
		<>
			{token ? (
				<Navigate to="/dashboard" state={{ from: location.pathname }} />
			) : (
				<Outlet />
			)}
		</>
	);
}
