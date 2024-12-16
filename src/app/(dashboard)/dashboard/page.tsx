// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionProps {
	icon: React.ElementType;
	title: string;
	description: string;
	href: string;
}

export default function DashboardPage() {
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect("/login");
		},
	});

	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-pulse text-blue-600">
					Loading your safe space...
				</div>
			</div>
		);
	}

	const stats = [
		{
			title: "Resources Available",
			value: "24/7",
			icon: Shield,
			color: "text-blue-600",
			description: "Immediate support and guidance",
		},
		{
			title: "Community Members",
			value: "10,000+",
			icon: Users,
			color: "text-green-600",
			description: "Supporting each other",
		},
		{
			title: "Support Sessions",
			value: "1,234",
			icon: MessageSquare,
			color: "text-purple-600",
			description: "Conversations with Billy",
		},
		{
			title: "Cases Resolved",
			value: "789",
			icon: FileText,
			color: "text-orange-600",
			description: "Successfully handled reports",
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back, {session?.user?.name?.split(" ")[0]}
				</h1>
				<p className="text-gray-500 dark:text-gray-400 mt-2">
					You&apos;re in a safe space. How can we help you today?
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title} className="hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-gray-500">
								{stat.title}
							</CardTitle>
							<stat.icon className={cn("h-5 w-5", stat.color)} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-gray-500 mt-1">{stat.description}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<QuickAction
							icon={MessageSquare}
							title="Talk to Billy"
							description="Get immediate support from our AI companion"
							href="/chat"
						/>
						<QuickAction
							icon={FileText}
							title="Report Incident"
							description="Document and report cyberbullying safely"
							href="/evidence"
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Safety Tips</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-4">
							<li className="flex items-start space-x-2">
								<Shield className="h-5 w-5 text-blue-600 mt-0.5" />
								<span className="text-sm">
									Keep screenshots of any harassment as evidence
								</span>
							</li>
							<li className="flex items-start space-x-2">
								<Shield className="h-5 w-5 text-blue-600 mt-0.5" />
								<span className="text-sm">
									Block and report abusive accounts immediately
								</span>
							</li>
							<li className="flex items-start space-x-2">
								<Shield className="h-5 w-5 text-blue-600 mt-0.5" />
								<span className="text-sm">
									Talk to someone you trust about what&apos;s happening
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

const QuickAction = ({
	icon: Icon,
	title,
	description,
	href,
}: QuickActionProps) => (
	<Link
		href={href}
		className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
	>
		<Icon className="h-6 w-6 text-blue-600" />
		<div>
			<h3 className="font-medium">{title}</h3>
			<p className="text-sm text-gray-500">{description}</p>
		</div>
	</Link>
);
