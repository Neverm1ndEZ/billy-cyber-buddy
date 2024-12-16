// src/hooks/use-role.ts
import { useSession } from "next-auth/react";

export function useRole() {
	const { data: session } = useSession();

	return {
		isAdmin: session?.user?.role === "admin",
		isCounselor: session?.user?.role === "counselor",
		isUser: session?.user?.role === "user",
		role: session?.user?.role,
	};
}
