import { FileIcon, ImageIcon, VideoIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FileListProps {
	files: File[];
	onRemove: (index: number) => void;
}

const getFileIcon = (type: string) => {
	if (type.startsWith("image/")) return ImageIcon;
	if (type.startsWith("video/")) return VideoIcon;
	if (type.startsWith("application/pdf") || type.startsWith("text/"))
		return FileTextIcon;
	return FileIcon;
};

export function FileList({ files, onRemove }: FileListProps) {
	if (files.length === 0) return null;

	return (
		<div className="mt-4">
			<h3 className="text-sm font-medium mb-3">Uploaded Files</h3>
			<ul className="space-y-2 bg-gray-50 rounded-lg p-3">
				{files.map((file, index) => {
					const FileTypeIcon = getFileIcon(file.type);
					return (
						<li
							key={index}
							className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm transition-all hover:shadow-md"
						>
							<div className="flex items-center space-x-3">
								<FileTypeIcon className="h-5 w-5 text-gray-500" />
								<span className="text-sm text-gray-600 truncate max-w-[calc(100%-3rem)]">
									{file.name}
								</span>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onRemove(index)}
								className="hover:bg-red-50 hover:text-red-500 transition-colors"
								aria-label={`Remove ${file.name}`}
							>
								<X className="h-4 w-4" />
							</Button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
