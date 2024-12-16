import { User } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				setUser: (user) => set({ user }),
			}),
			{
				name: "auth-storage",
			},
		),
	),
);
