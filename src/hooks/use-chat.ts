/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-chat.ts
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ChatResponse {
	message: string;
	shouldSaveEvidence: boolean;
	evidenceRef?: string;
	action?: {
		type: "collect_evidence" | "report_incident" | "provide_resources";
		data?: any;
	};
}

export function useChat() {
	const { data: session } = useSession();
	const [isLoading, setIsLoading] = useState(false);

	const sendMessage = async (
		message: string,
		context?: {
			isDistressed?: boolean;
			needsEvidence?: boolean;
			isEmergency?: boolean;
		},
	): Promise<ChatResponse> => {
		try {
			setIsLoading(true);

			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message,
					userId: session?.user?.id,
					context,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			return await response.json();
		} catch (error) {
			console.error("Chat error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		sendMessage,
		isLoading,
	};
}
