/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, AppWindowIcon as Window, Smartphone } from "lucide-react";

interface ScreenshotCaptureProps {
	onCapture: (blob: Blob) => void;
	onClose: () => void;
}

export function ScreenshotCapture({
	onCapture,
	onClose,
}: ScreenshotCaptureProps) {
	const [captureType, setCaptureType] = useState<
		"fullscreen" | "window" | "element"
	>("fullscreen");
	const [isCapturing, setIsCapturing] = useState(false);

	const handleCapture = async () => {
		try {
			setIsCapturing(true);

			if (!navigator.mediaDevices?.getDisplayMedia) {
				throw new Error("Screen capture is not supported in your browser");
			}

			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					cursor: "always",
					displaySurface:
						captureType === "window"
							? "window"
							: captureType === "element"
							? "browser"
							: "monitor",
				},
				audio: false,
			});

			const video = document.createElement("video");
			video.srcObject = stream;

			await new Promise((resolve) => {
				video.onloadedmetadata = () => {
					video.play().then(resolve);
				};
			});

			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Failed to create canvas context");

			ctx.drawImage(video, 0, 0);
			stream.getTracks().forEach((track) => track.stop());

			canvas.toBlob((blob) => {
				if (blob) {
					onCapture(blob);
					onClose();
				} else {
					throw new Error("Failed to create image");
				}
			}, "image/png");
		} catch (error: any) {
			console.error("Screenshot error:", error);
			throw error;
		} finally {
			setIsCapturing(false);
		}
	};

	return (
		<div className="grid grid-cols-3 gap-4">
			{[
				{ type: "fullscreen", icon: Monitor, label: "Full Screen" },
				{ type: "window", icon: Window, label: "Window" },
				{ type: "element", icon: Smartphone, label: "Element" },
			].map(({ type, icon: Icon, label }) => (
				<Button
					key={type}
					variant="outline"
					className={`flex justify-center items-center p-6 hover:bg-purple-50 transition-colors
						${isCapturing ? "opacity-50 cursor-not-allowed" : ""}`}
					onClick={() => {
						setCaptureType(type as any);
						handleCapture();
					}}
					disabled={isCapturing}
				>
					<Icon className="mt-2 h-8 w-8 mb-2 text-purple-600" />
					<span>{isCapturing ? "Capturing..." : label}</span>
				</Button>
			))}
		</div>
	);
}
