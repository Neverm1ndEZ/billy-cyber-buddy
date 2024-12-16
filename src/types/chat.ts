// src/lib/chat/types.ts
export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	sentiment?: "positive" | "negative" | "neutral";
	evidenceRef?: string;
	metadata?: {
		intent?: string;
		confidence?: number;
		entities?: Array<{
			entity: string;
			value: string;
		}>;
		actionRequired?: boolean;
		actionType?: "collect_evidence" | "report" | "resource" | "emergency";
	};
}
