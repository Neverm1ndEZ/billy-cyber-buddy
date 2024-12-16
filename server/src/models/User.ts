// server/src/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		image: String,
		role: {
			type: String,
			enum: ["user", "admin", "counselor"],
			default: "user",
		},
		emailVerified: Date,
		anonymousId: String, // For community features
		metadata: {
			lastLogin: Date,
			registrationDate: Date,
		},
	},
	{
		timestamps: true,
	},
);

export const User = mongoose.model("User", userSchema);
