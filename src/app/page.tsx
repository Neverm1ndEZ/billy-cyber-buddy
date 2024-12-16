// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, MessageSquareWarning } from "lucide-react";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export default function HomePage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-16">
				<div className="flex flex-col items-center justify-center text-center space-y-8">
					<div className="animate-fade-in space-y-4">
						<h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
							Stand Against Cyberbullying
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
							You&apos;re not alone. Our platform provides anonymous support,
							resources, and a community that understands what you&apos;re going
							through. Meet Billy, your supportive companion in this journey.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mt-12">
						<FeatureCard
							icon={<Shield className="w-8 h-8 text-blue-500" />}
							title="Anonymous Reporting"
							description="Report incidents safely while keeping your identity protected"
						/>
						<FeatureCard
							icon={<Heart className="w-8 h-8 text-red-500" />}
							title="24/7 Support"
							description="Connect with Billy, our supportive chatbot, anytime you need help"
						/>
						<FeatureCard
							icon={<Users className="w-8 h-8 text-green-500" />}
							title="Supportive Community"
							description="Join others who understand your experience and share stories"
						/>
						<FeatureCard
							icon={
								<MessageSquareWarning className="w-8 h-8 text-purple-500" />
							}
							title="Resource Center"
							description="Access defense tactics and tips to stay safe online"
						/>
					</div>

					<div className="mt-12">
						<a href="/login">
							<Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full transition-transform hover:scale-105">
								Get Support Now
							</Button>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
	<div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
		<div className="flex flex-col items-center text-center space-y-4">
			{icon}
			<h3 className="text-xl font-semibold">{title}</h3>
			<p className="text-gray-600 dark:text-gray-300">{description}</p>
		</div>
	</div>
);
