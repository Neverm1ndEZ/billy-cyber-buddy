// src/components/chat/file-upload.tsx
import { useState, useRef } from "react";
import {
	Upload,
	Image as ImageIcon,
	FileText,
	File as FileIcon,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	onFileSelect: (files: File[]) => void;
	onCancel: () => void;
	allowedTypes?: string[];
	maxSize?: number; // in MB
}

export function FileUpload({
	onFileSelect,
	onCancel,
	allowedTypes = ["image/*", "application/pdf", ".doc,.docx,.txt"],
	maxSize = 10,
}: FileUploadProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Helper function to get file icon based on type
	const getFileIcon = (type: string) => {
		if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
		if (type.includes("pdf") || type.includes("doc"))
			return <FileText className="w-4 h-4" />;
		return <FileIcon className="w-4 h-4" />;
	};

	// Handle file selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;

		const files = Array.from(e.target.files);
		const validFiles = files.filter((file) => {
			const isValidType = allowedTypes.some((type) => {
				if (type.includes("*")) {
					return file.type.startsWith(type.split("/")[0]);
				}
				return type.includes(file.type);
			});
			const isValidSize = file.size <= maxSize * 1024 * 1024;
			return isValidType && isValidSize;
		});

		setSelectedFiles(validFiles);
	};

	// Handle file upload
	const handleUpload = () => {
		if (!selectedFiles.length) return;

		// Simulate upload progress
		let progress = 0;
		const interval = setInterval(() => {
			progress += 10;
			setUploadProgress(progress);
			if (progress >= 100) {
				clearInterval(interval);
				onFileSelect(selectedFiles);
			}
		}, 200);
	};

	return (
		<div
			className={cn(
				"bg-muted/50 backdrop-blur p-4 rounded-lg space-y-4",
				"animate-in slide-in-from-bottom duration-300",
			)}
		>
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h4 className="font-semibold">Upload Evidence</h4>
					<p className="text-sm text-muted-foreground">
						Select files to upload as evidence
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={onCancel}
					className="hover:bg-destructive/10 hover:text-destructive"
				>
					<X className="w-4 h-4" />
				</Button>
			</div>

			<div className="space-y-4">
				<div
					className={cn(
						"border-2 border-dashed rounded-lg p-6",
						"flex flex-col items-center justify-center gap-2",
						"cursor-pointer hover:border-primary transition-colors",
						selectedFiles.length > 0
							? "border-primary"
							: "border-muted-foreground",
					)}
					onClick={() => fileInputRef.current?.click()}
				>
					<Upload className="w-8 h-8 text-muted-foreground" />
					<p className="text-sm text-center text-muted-foreground">
						Click to select or drag and drop files here
					</p>
					<p className="text-xs text-muted-foreground">Max size: {maxSize}MB</p>
				</div>

				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					onChange={handleFileChange}
					multiple
					accept={allowedTypes.join(",")}
				/>

				{selectedFiles.length > 0 && (
					<div className="space-y-2">
						{selectedFiles.map((file, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-2 bg-background rounded"
							>
								<div className="flex items-center gap-2">
									{getFileIcon(file.type)}
									<span className="text-sm truncate">{file.name}</span>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										setSelectedFiles((files) =>
											files.filter((_, i) => i !== index),
										)
									}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						))}

						{uploadProgress > 0 && uploadProgress < 100 && (
							<Progress value={uploadProgress} />
						)}

						<Button
							className="w-full"
							onClick={handleUpload}
							disabled={uploadProgress > 0}
						>
							Upload {selectedFiles.length} file
							{selectedFiles.length > 1 ? "s" : ""}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
