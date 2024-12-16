// src/app/api/evidence/text/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
	try {
		const session = await getServerSession();
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const data = await request.json();

		// Create evidence record
		const evidence = {
			userId: session.user.id,
			...data,
			timestamp: new Date(),
		};

		// Save to database
		// const savedEvidence = await Evidence.create(evidence);

		return NextResponse.json(evidence);
	} catch (error) {
		console.error("Error handling text evidence:", error);
		return NextResponse.json(
			{ error: "Failed to save text evidence" },
			{ status: 500 },
		);
	}
}
