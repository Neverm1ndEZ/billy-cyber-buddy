// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const RASA_URL = "http://localhost:5005";

// Keep track of last responses to avoid repetition
const conversationHistory = new Map<string, string[]>();

function checkForEvidenceKeywords(message: string): boolean {
	const evidenceKeywords = [
		"harass",
		"bully",
		"threat",
		"message",
		"post",
		"screenshot",
		"evidence",
		"proof",
		"sent",
		"shared",
		"wrote",
		"photo",
		"video",
		"said",
	];
	return evidenceKeywords.some((keyword) =>
		message.toLowerCase().includes(keyword),
	);
}

function processRasaResponses(
	userId: string,
	responses: Array<{ text: string }>,
): { message: string; additionalMessages?: string[] } {
	// Get previous responses for this user
	const userHistory = conversationHistory.get(userId) || [];

	// Filter out responses that were recently used
	let availableResponses = responses.filter(
		(response) => !userHistory.includes(response.text),
	);

	// If all responses have been used, reset history
	if (availableResponses.length === 0) {
		availableResponses = responses;
		conversationHistory.set(userId, []);
	}

	// Select primary response and any additional responses
	const primaryResponse = availableResponses[0];
	const additionalResponses = availableResponses.slice(1);

	// Update conversation history
	conversationHistory.set(userId, [
		...userHistory.slice(-5), // Keep last 5 responses
		primaryResponse.text,
	]);

	return {
		message: primaryResponse.text,
		additionalMessages: additionalResponses.map((r) => r.text),
	};
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { message, userId } = await request.json();
		const actualUserId = userId || session.user.id;

		const rasaResponse = await fetch(`${RASA_URL}/webhooks/rest/webhook`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sender: actualUserId, message }),
		});

		if (!rasaResponse.ok) {
			throw new Error("Failed to communicate with chatbot");
		}

		const botResponses = await rasaResponse.json();
		console.log("Rasa response:", botResponses);

		if (!botResponses || botResponses.length === 0) {
			return NextResponse.json({
				message: "I'm still learning. Could you please rephrase that?",
				shouldSaveEvidence: false,
			});
		}

		// Process responses to avoid repetition
		const { message: primaryMessage, additionalMessages } =
			processRasaResponses(actualUserId, botResponses);

		const shouldSaveEvidence = checkForEvidenceKeywords(message);

		return NextResponse.json({
			message: primaryMessage,
			additionalMessages,
			shouldSaveEvidence,
			metadata: {
				intent: botResponses[0].intent || "unknown",
				confidence: botResponses[0].confidence || 1.0,
				actionRequired: shouldSaveEvidence,
				actionType: shouldSaveEvidence ? "collect_evidence" : undefined,
			},
		});
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json(
			{ error: "Failed to process message" },
			{ status: 500 },
		);
	}
}
