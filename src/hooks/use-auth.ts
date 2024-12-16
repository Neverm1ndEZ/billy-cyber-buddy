// src/hooks/use-auth.ts
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: "user" | "admin" | "counselor") {
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (status === "loading") return;

		if (!session) {
			router.push(`/login?from=${encodeURIComponent(pathname)}`);
			return;
		}

		if (requiredRole && session?.user?.role !== requiredRole) {
			router.push("/unauthorized");
		}
	}, [session, status, requiredRole, router, pathname]);

	return {
		session,
		isLoading: status === "loading",
		isAuthenticated: !!session,
		user: session?.user,
	};
}
