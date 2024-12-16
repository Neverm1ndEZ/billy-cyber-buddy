// src/app/(dashboard)/layout.tsx
import { SidebarNav } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { Shield } from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="border-b bg-white dark:bg-gray-800">
				<div className="flex h-16 items-center px-4">
					<div className="flex items-center space-x-2">
						<Shield className="h-6 w-6 text-blue-600" />
						<span className="font-semibold">Cyberbullying Prevention</span>
					</div>
					<div className="ml-auto flex items-center space-x-4">
						<UserNav />
					</div>
				</div>
			</div>
			<div className="flex">
				<aside className="w-64 border-r bg-white dark:bg-gray-800 h-[calc(100vh-4rem)]">
					<SidebarNav />
				</aside>
				<main className="flex-1 p-8 overflow-y-auto">
					<div className="mx-auto max-w-6xl">{children}</div>
				</main>
			</div>
		</div>
	);
}
