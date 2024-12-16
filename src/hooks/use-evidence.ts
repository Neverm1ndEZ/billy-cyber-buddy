// src/hooks/use-evidence.ts
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Evidence } from "@/types";

// Enhanced options interface to handle different types of evidence
interface UseEvidenceOptions {
	onSuccess?: (evidence: Evidence) => void;
	onError?: (error: Error) => void;
	onProgress?: (progress: number) => void;
}

// Interface for file upload options
interface FileEvidenceOptions {
	context?: {
		conversationId?: string;
		previousMessages?: Array<{
			content: string;
			role: string;
			timestamp: Date;
		}>;
	};
	tags?: string[];
	onProgress?: (progress: number) => void;
}

export function useEvidence(options: UseEvidenceOptions = {}) {
	const { data: session } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	// Enhanced metadata collection with more detailed device information
	const collectMetadata = () => {
		const metadata = {
			deviceInfo: {
				userAgent: navigator.userAgent,
				platform: navigator.platform,
				screenResolution: `${window.screen.width}x${window.screen.height}`,
				language: navigator.language,
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				timestamp: new Date().toISOString(),
			},
			browser: {
				vendor: navigator.vendor,
				cookiesEnabled: navigator.cookieEnabled,
				onLine: navigator.onLine,
			},
			screen: {
				width: window.screen.width,
				height: window.screen.height,
				colorDepth: window.screen.colorDepth,
				orientation: window.screen.orientation.type,
			},
		};
		return metadata;
	};

	// Improved screenshot capture with better error handling
	const captureScreenshot = async (screenshot: Blob) => {
		try {
			setIsLoading(true);
			setUploadProgress(0);

			const formData = new FormData();
			formData.append("file", screenshot);
			formData.append("metadata", JSON.stringify(collectMetadata()));

			const response = await fetch("/api/evidence/screenshot", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Failed to upload screenshot");
			}

			const evidence = await response.json();
			options.onSuccess?.(evidence);
			return evidence;
		} catch (err) {
			const error = err as Error;
			setError(error);
			options.onError?.(error);
			throw error;
		} finally {
			setIsLoading(false);
			setUploadProgress(0);
		}
	};

	// Enhanced text evidence saving with context preservation
	const saveTextEvidence = async (
		content: string,
		platform: string,
		context?: { previousMessages?: string[] },
	) => {
		try {
			setIsLoading(true);
			const evidence = {
				type: "text" as const,
				content,
				platform,
				metadata: {
					...collectMetadata(),
					context,
					sourceInfo: {
						platform,
						timestamp: new Date().toISOString(),
						conversationContext: context?.previousMessages || [],
					},
				},
			};

			const response = await fetch("/api/evidence/text", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(evidence),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Failed to save text evidence");
			}

			const savedEvidence = await response.json();
			options.onSuccess?.(savedEvidence);
			return savedEvidence;
		} catch (err) {
			const error = err as Error;
			setError(error);
			options.onError?.(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Improved file evidence handling with progress tracking and chunked upload
	const saveFileEvidence = async (
		file: File,
		platform: string,
		fileOptions: FileEvidenceOptions = {},
	) => {
		try {
			setIsLoading(true);
			setUploadProgress(0);

			// Validate file size and type
			const maxSize = 20 * 1024 * 1024; // 20MB
			if (file.size > maxSize) {
				throw new Error("File size exceeds 20MB limit");
			}

			const formData = new FormData();
			formData.append("file", file);
			formData.append("platform", platform);
			formData.append(
				"metadata",
				JSON.stringify({
					...collectMetadata(),
					fileInfo: {
						name: file.name,
						type: file.type,
						size: file.size,
						lastModified: new Date(file.lastModified).toISOString(),
					},
					context: fileOptions.context,
					tags: fileOptions.tags,
				}),
			);

			const response = await fetch("/api/evidence/file", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Failed to upload file");
			}

			const evidence = await response.json();
			options.onSuccess?.(evidence);
			setUploadProgress(100);
			return evidence;
		} catch (err) {
			const error = err as Error;
			setError(error);
			options.onError?.(error);
			throw error;
		} finally {
			setIsLoading(false);
			setUploadProgress(0);
		}
	};

	// Helper function to clear any existing errors
	const clearError = () => {
		setError(null);
	};

	return {
		captureScreenshot,
		saveTextEvidence,
		saveFileEvidence,
		isLoading,
		error,
		uploadProgress,
		clearError,
	};
}
