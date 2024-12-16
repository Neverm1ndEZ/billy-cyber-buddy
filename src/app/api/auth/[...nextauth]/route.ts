import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
	adapter: MongoDBAdapter(clientPromise),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				token.id = user.id;
				token.role = user.role || "user";
				token.anonymousId =
					user.anonymousId || `anon_${Math.random().toString(36).substr(2, 9)}`;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.anonymousId = token.anonymousId as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/error",
	},
	session: {
		strategy: "jwt",
	},
});

export { handler as GET, handler as POST };
