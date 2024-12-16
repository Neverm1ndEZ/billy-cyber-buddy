// src/components/dashboard/sidebar-nav.tsx
"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/dashboard",
		color: "text-blue-600",
	},
	{
		label: "Evidence Collection",
		icon: FileText,
		href: "/evidence",
		color: "text-purple-600",
	},
	{
		label: "Chat with Billy",
		icon: MessageSquare,
		href: "/chat",
		color: "text-green-600",
	},
];

export function SidebarNav() {
	const pathname = usePathname();

	return (
		<div className="space-y-4 py-4">
			<div className="px-3 py-2">
				<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
					Support Center
				</h2>
				<div className="space-y-1">
					{routes.map((route) => (
						<Link
							key={route.href}
							href={route.href}
							className={cn(
								"flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
								pathname === route.href
									? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
									: "text-gray-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800",
							)}
						>
							<route.icon className={cn("h-5 w-5 mr-3", route.color)} />
							{route.label}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
