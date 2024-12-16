"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEvidence } from "@/hooks/use-evidence";
import { AlertCircle, Camera, MessageSquare, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { FileList } from "./file-list";
import { ScreenshotCapture } from "./screenshot-capture";

export default function EvidenceCollector() {
	const [textContent, setTextContent] = useState("");
	const [platform, setPlatform] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);

	const {
		captureScreenshot,
		saveTextEvidence,
		saveFileEvidence,
		isLoading,
		error,
	} = useEvidence({
		onSuccess: () => {
			setTextContent("");
			setPlatform("");
			setFiles([]);
		},
	});

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
		}
	};

	const handleRemoveFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const handleScreenshotCapture = async (blob: Blob) => {
		try {
			if (!platform) {
				throw new Error(
					"Please specify the platform where the incident occurred",
				);
			}
			await captureScreenshot(blob);
		} catch (error) {
			console.error("Screenshot error:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!textContent && files.length === 0) return;

		try {
			if (!platform) {
				throw new Error("Please select a platform");
			}

			if (!textContent && files.length === 0) {
				throw new Error("Please provide either text content or files");
			}

			if (textContent) {
				await saveTextEvidence(textContent, platform);
			}

			if (files.length > 0) {
				await Promise.all(
					files.map((file) => saveFileEvidence(file, platform)),
				);
			}
		} catch (error) {
			console.error("Submission error:", error);
		}
	};

	return (
		<Card className="p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
			<h2 className="text-2xl font-bold mb-6 flex items-center">
				<MessageSquare className="mr-2 h-6 w-6 text-purple-600" />
				Report Evidence
			</h2>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Platform Selection */}
				<div className="space-y-2">
					<Label htmlFor="platform" className="text-base">
						Platform <span className="text-red-500">*</span>
					</Label>
					<Select value={platform} onValueChange={setPlatform} required>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select the platform" />
						</SelectTrigger>
						<SelectContent>
							{[
								"Instagram",
								"Facebook",
								"Twitter",
								"WhatsApp",
								"TikTok",
								"LinkedIn",
								"Other",
							].map((platform) => (
								<SelectItem
									key={platform.toLowerCase()}
									value={platform.toLowerCase()}
								>
									{platform}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Evidence Details */}
				<div className="space-y-2">
					<Label htmlFor="evidence" className="text-base">
						Evidence Details
					</Label>
					<Textarea
						id="evidence"
						value={textContent}
						onChange={(e) => setTextContent(e.target.value)}
						placeholder="Describe the incident or paste the relevant text..."
						className="min-h-[200px] resize-y"
					/>
				</div>

				{/* File Upload Section */}
				<div className="space-y-4">
					<Label className="text-base">Upload Evidence</Label>
					<div className="flex flex-wrap gap-4">
						<Dialog
							open={isScreenshotDialogOpen}
							onOpenChange={setIsScreenshotDialogOpen}
						>
							<DialogTrigger asChild>
								<Button
									type="button"
									variant="outline"
									className="hover:bg-purple-50 transition-colors"
								>
									<Camera className="mr-2 h-4 w-4 text-purple-600" />
									Capture Screenshot
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[525px]">
								<DialogHeader>
									<DialogTitle>Capture Screenshot</DialogTitle>
									<DialogDescription>
										Choose your preferred capture method
									</DialogDescription>
								</DialogHeader>
								<ScreenshotCapture
									onCapture={handleScreenshotCapture}
									onClose={() => setIsScreenshotDialogOpen(false)}
								/>
							</DialogContent>
						</Dialog>

						<Button
							type="button"
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							className="hover:bg-purple-50 transition-colors"
						>
							<Upload className="mr-2 h-4 w-4 text-purple-600" />
							Upload Files
						</Button>
					</div>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileUpload}
						className="hidden"
						multiple
						accept="image/*,video/*,.pdf,.doc,.docx,.txt"
					/>
					<FileList files={files} onRemove={handleRemoveFile} />
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
				>
					{isLoading ? (
						<span className="flex items-center">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Submitting...
						</span>
					) : (
						<>
							<MessageSquare className="mr-2 h-4 w-4" />
							Submit Evidence
						</>
					)}
				</Button>
			</form>
		</Card>
	);
}
