export interface Evidence {
	id: string;
	userId: string;
	type: "screenshot" | "text" | "link" | "metadata";
	content: string;
	timestamp: Date;
	platform: string;
	metadata: {
		deviceInfo: {
			userAgent: string;
			platform: string;
			screenResolution?: string;
		};
		location?: {
			platform: string;
			url?: string;
			appName?: string;
		};
		context?: {
			previousMessages?: string[];
			relatedUsers?: string[];
		};
	};
	status: "draft" | "submitted" | "reviewing" | "archived";
	reportId?: string;
	tags: string[];
}

export interface EvidenceValidationResult {
	isValid: boolean;
	issues: string[];
	metadata: {
		contentType?: string;
		fileSize?: number;
		timestamp: Date;
		checksums?: string[];
	};
}

export interface EvidenceProcessingOptions {
	automaticVerification: boolean;
	preserveMetadata: boolean;
	compressionLevel?: number;
	encryptionKey?: string;
	retentionPeriod: number;
}
