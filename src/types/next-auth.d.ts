import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			role: string;
			anonymousId: string;
		};
	}

	interface User {
		id: string;
		role?: string;
		anonymousId?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
		anonymousId: string;
	}
}
