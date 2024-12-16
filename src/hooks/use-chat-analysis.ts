// src/hooks/use-chat-analysis.ts
export function useChatAnalysis() {
	const analyzeMessage = (message: string) => {
		// Keywords that indicate potential evidence
		const evidenceKeywords = [
			"screenshot",
			"message",
			"photo",
			"video",
			"proof",
			"sent",
			"posted",
			"shared",
			"wrote",
			"said",
		];

		// Keywords indicating emotional distress
		const distressKeywords = [
			"scared",
			"afraid",
			"worried",
			"anxious",
			"depressed",
			"hurt",
			"sad",
			"angry",
			"threatened",
			"helpless",
		];

		// Emergency keywords that require immediate attention
		const emergencyKeywords = [
			"suicide",
			"kill",
			"hurt myself",
			"die",
			"end it all",
			"can't take it",
			"give up",
			"harm",
			"emergency",
		];

		return {
			needsEvidence: evidenceKeywords.some((keyword) =>
				message.toLowerCase().includes(keyword),
			),
			isDistressed: distressKeywords.some((keyword) =>
				message.toLowerCase().includes(keyword),
			),
			isEmergency: emergencyKeywords.some((keyword) =>
				message.toLowerCase().includes(keyword),
			),
		};
	};

	return { analyzeMessage };
}
