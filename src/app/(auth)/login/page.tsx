// src/app/(auth)/login/page.tsx
import { AuthForm } from "@/components/auth/auth-form";
import { Shield } from "lucide-react";

export default function LoginPage() {
	return (
		<div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
				<div className="relative z-20 flex items-center text-lg font-medium mb-8">
					<Shield className="w-6 h-6 mr-2" />
					Cyberbullying Prevention Platform
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&quot;You are stronger than you know, and you don&apos;t have to
							face this alone. We&apos;re here to support you every step of the
							way.&quot;
						</p>
						<footer className="text-sm">Billy - Your Support Companion</footer>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
					<AuthForm />
				</div>
			</div>
		</div>
	);
}
