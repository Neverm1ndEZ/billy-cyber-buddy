// src/types/index.ts
export interface User {
	id: string;
	name?: string;
	email?: string;
	image?: string;
	role: "user" | "admin" | "counselor";
}

export interface Evidence {
	id: string;
	type: "screenshot" | "text" | "metadata";
	content: string;
	timestamp: Date;
	metadata: {
		platform: string;
		deviceInfo: string;
		location?: string;
	};
	reportId: string;
}
