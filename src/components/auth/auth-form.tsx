// src/components/auth/auth-form.tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Shield } from "lucide-react";

export function AuthForm() {
	const searchParams = useSearchParams();
	const from = searchParams.get("from") || "/dashboard";
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			await signIn("google", {
				callbackUrl: from,
				redirect: true,
			});
		} catch (error) {
			console.error("Authentication error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-[380px] border-2 border-blue-100 dark:border-gray-700">
			<CardHeader className="space-y-4">
				<div className="flex items-center justify-center">
					<Shield className="w-12 h-12 text-blue-600" />
				</div>
				<CardTitle className="text-2xl text-center">
					Welcome to Safety
				</CardTitle>
				<CardDescription className="text-center">
					Your identity remains protected. Sign in to access support and
					resources.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Button
					variant="outline"
					onClick={handleGoogleSignIn}
					disabled={isLoading}
					className="w-full py-6 text-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
				>
					{isLoading ? (
						"Connecting..."
					) : (
						<span className="flex items-center justify-center gap-2">
							Continue with Google
						</span>
					)}
				</Button>
				<p className="text-sm text-center text-gray-500 dark:text-gray-400">
					By signing in, you&apos;re taking the first step towards a safer
					online experience. We&apos;re here to help.
				</p>
			</CardContent>
		</Card>
	);
}
