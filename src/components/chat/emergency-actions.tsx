// src/components/chat/emergency-actions.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhoneCall, MessageSquare, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyActionsProps {
	severity: "high" | "medium" | "low";
	onConnect: () => void;
	onDismiss: () => void;
}

// interface EmergencyResource {
// 	name: string;
// 	contact: string;
// 	description: string;
// 	icon: JSX.Element;
// }

export function EmergencyActions({
	severity,
	onConnect,
	onDismiss,
}: EmergencyActionsProps) {
	// Configure resources based on severity level
	const emergencyContent = {
		high: {
			title: "Immediate Help Available",
			description:
				"Your safety is our top priority. Help is available right now.",
			resources: [
				{
					name: "Emergency Services",
					contact: "911",
					description: "For immediate emergency assistance",
					icon: <PhoneCall className="h-4 w-4" />,
				},
				{
					name: "Crisis Text Line",
					contact: "Text HOME to 741741",
					description: "24/7 crisis counseling via text",
					icon: <MessageSquare className="h-4 w-4" />,
				},
				{
					name: "National Suicide Prevention Lifeline",
					contact: "1-800-273-8255",
					description: "24/7 confidential support",
					icon: <PhoneCall className="h-4 w-4" />,
				},
			],
		},
		medium: {
			title: "Support Available",
			description: "Let's connect you with someone who can help.",
			resources: [
				{
					name: "Crisis Text Line",
					contact: "Text HOME to 741741",
					description: "24/7 crisis counseling via text",
					icon: <MessageSquare className="h-4 w-4" />,
				},
				{
					name: "Teen Line",
					contact: "310-855-HOPE",
					description: "Teen-to-teen support available",
					icon: <PhoneCall className="h-4 w-4" />,
				},
			],
		},
		low: {
			title: "Support Resources",
			description: "These resources are here to help you.",
			resources: [
				{
					name: "Teen Line",
					contact: "310-855-HOPE",
					description: "Talk with other teens who understand",
					icon: <PhoneCall className="h-4 w-4" />,
				},
			],
		},
	};

	const { title, description, resources } = emergencyContent[severity];

	return (
		<Card
			className={cn(
				"p-4 mt-4 space-y-4 transition-all duration-300",
				severity === "high"
					? "bg-destructive/10 border-destructive"
					: severity === "medium"
					? "bg-orange-100 border-orange-300"
					: "bg-yellow-50 border-yellow-200",
			)}
		>
			<Alert
				variant={severity === "high" ? "destructive" : "default"}
				className="animate-in slide-in-from-top duration-300"
			>
				<Info
					className={cn(
						"h-4 w-4",
						severity === "high"
							? "text-destructive-foreground"
							: "text-foreground",
					)}
				/>
				<AlertTitle className="font-bold">{title}</AlertTitle>
				<AlertDescription>{description}</AlertDescription>
			</Alert>

			<div className="space-y-3">
				{resources.map((resource, index) => (
					<div
						key={resource.contact}
						className={cn(
							"flex items-center justify-between p-3 bg-background/95 backdrop-blur",
							"rounded-lg border shadow-sm hover:shadow-md transition-all duration-200",
							"animate-in slide-in-from-right",
						)}
						style={{ animationDelay: `${index * 100}ms` }}
					>
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-full",
									severity === "high" ? "bg-destructive/10" : "bg-muted",
								)}
							>
								{resource.icon}
							</div>
							<div>
								<p className="font-semibold">{resource.name}</p>
								<p className="text-sm text-muted-foreground">
									{resource.description}
								</p>
							</div>
						</div>
						<code className="px-3 py-1.5 bg-muted rounded-md text-sm font-mono">
							{resource.contact}
						</code>
					</div>
				))}
			</div>

			<div className="flex gap-3 pt-2">
				<Button
					variant={severity === "high" ? "destructive" : "default"}
					className="flex-1 font-semibold"
					onClick={onConnect}
				>
					Connect Now
				</Button>
				<Button variant="outline" className="flex-1" onClick={onDismiss}>
					Not Right Now
				</Button>
			</div>
		</Card>
	);
}
