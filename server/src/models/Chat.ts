import mongoose from "mongoose";
const chatSessionSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	status: { type: String, enum: ["active", "waiting", "emergency", "closed"] },
	risk: { type: String, enum: ["low", "medium", "high"] },
	messages: [
		{
			content: String,
			role: String,
			timestamp: Date,
			sentiment: String,
			evidenceRef: { type: mongoose.Schema.Types.ObjectId, ref: "Evidence" },
		},
	],
});

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
