// src/app/(dashboard)/chat/page.tsx
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
	return (
		<div className="container max-w-6xl p-6 mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground">Chat with Billy</h1>
				<p className="text-muted-foreground mt-2">
					Talk to Billy about any cyberbullying issues you&apos;re experiencing.
					Everything you share is confidential.
				</p>
			</div>
			<ChatInterface />
		</div>
	);
}
