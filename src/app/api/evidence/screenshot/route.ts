// src/app/api/evidence/screenshot/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
	try {
		const session = await getServerSession();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as Blob;
		const metadata = JSON.parse(formData.get("metadata") as string);

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Generate unique filename
		const buffer = Buffer.from(await file.arrayBuffer());
		const filename = `${uuidv4()}.png`;
		const filepath = path.join(process.cwd(), "public", "uploads", filename);

		// Save file
		await writeFile(filepath, buffer);

		// Create evidence record
		const evidence = {
			userId: session.user.id,
			type: "screenshot",
			content: `/uploads/${filename}`,
			platform: metadata.deviceInfo.platform,
			metadata,
		};

		// Save to database
		// const savedEvidence = await Evidence.create(evidence);

		return NextResponse.json(evidence);
	} catch (error) {
		console.error("Error handling screenshot:", error);
		return NextResponse.json(
			{ error: "Failed to process screenshot" },
			{ status: 500 },
		);
	}
}
