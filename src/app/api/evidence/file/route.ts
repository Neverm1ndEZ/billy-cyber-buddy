// src/app/api/evidence/file/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

export async function POST(request: Request) {
	try {
		const session = await getServerSession();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Ensure uploads directory exists
		const uploadsDir = path.join(process.cwd(), "public", "uploads");
		try {
			await fs.access(uploadsDir);
		} catch {
			await fs.mkdir(uploadsDir, { recursive: true });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;
		const platform = formData.get("platform") as string;
		const metadata = JSON.parse(formData.get("metadata") as string);

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Generate unique filename with original extension
		const fileExtension = file.name.split(".").pop() || "unknown";
		const filename = `${uuidv4()}.${fileExtension}`;
		const filepath = path.join(uploadsDir, filename);

		// Save file
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await writeFile(filepath, buffer);

		// Create evidence record
		const evidence = {
			id: uuidv4(),
			userId: session.user.id,
			type: "file",
			content: `/uploads/${filename}`,
			platform: platform || "unknown",
			timestamp: new Date(),
			metadata: {
				...metadata,
				originalName: file.name,
				mimeType: file.type,
				size: file.size,
			},
		};

		return NextResponse.json(evidence);
	} catch (error) {
		console.error("Error handling file upload:", error);
		return NextResponse.json(
			{ error: "Failed to process file upload" },
			{ status: 500 },
		);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
