import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["screenshot", "text", "link", "metadata"],
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
		platform: {
			type: String,
			required: true,
		},
		metadata: {
			deviceInfo: {
				userAgent: String,
				platform: String,
				screenResolution: String,
			},
			location: {
				platform: String,
				url: String,
				appName: String,
			},
			context: {
				previousMessages: [String],
				relatedUsers: [String],
			},
		},
		status: {
			type: String,
			enum: ["draft", "submitted", "reviewing", "archived"],
			default: "draft",
		},
		reportId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Report",
		},
		tags: [String],
	},
	{
		timestamps: true,
	},
);

export const Evidence = mongoose.model("Evidence", evidenceSchema);
