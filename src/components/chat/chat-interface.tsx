/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/chat/chat-interface.tsx
"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@/hooks/use-chat";
import { useEvidence } from "@/hooks/use-evidence";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	CheckIcon,
	LoaderCircleIcon,
	PaperclipIcon,
	Send,
	XIcon,
	MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmergencyActions } from "./emergency-actions";
import { FileUpload } from "./file-upload";

// Define comprehensive type interfaces for better type safety
interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	sentiment?: "positive" | "negative" | "neutral";
	evidenceRef?: string;
	metadata?: {
		intent?: string;
		confidence?: number;
		actionRequired?: boolean;
		actionType?: "collect_evidence" | "report" | "resource" | "emergency";
		context?: {
			previousMessages: Message[];
			userState: UserState;
		};
	};
}

interface MessageAnalysis {
	needsEvidence: boolean;
	isDistressed: boolean;
	isEmergency: boolean;
	severity: "high" | "medium" | "low";
}

interface UserState {
	isDistressed: boolean;
	hasProvidedEvidence: boolean;
	conversationLength: number;
}

export function ChatInterface() {
	// State management
	const { data: session } = useSession();
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [emergencyMode, setEmergencyMode] = useState(false);
	const [emergencySeverity, setEmergencySeverity] = useState<
		"high" | "medium" | "low"
	>("low");
	const [showEmergencyActions, setShowEmergencyActions] = useState(false);
	const [showFileUpload, setShowFileUpload] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	// Message queue management
	const messageQueue = useRef<Message[]>([]);
	const [isProcessingQueue, setIsProcessingQueue] = useState(false);

	// Custom hooks
	const { sendMessage, isLoading } = useChat();
	const { saveTextEvidence, saveFileEvidence } = useEvidence();

	const [evidenceQueue, setEvidenceQueue] = useState<{
		type: "file" | "text";
		content: File[] | string;
		status: "pending" | "uploading" | "success" | "error";
		progress?: number;
	}>({ type: "text", content: "", status: "pending" });

	// Function to simulate natural typing behavior with realistic delays
	const simulateTyping = useCallback(
		(message: string, callback: (text: string) => void) => {
			const avgTypingSpeed = 30; // milliseconds per character
			const minDelay = 500;
			const maxDelay = 1500;

			const startDelay = Math.random() * (maxDelay - minDelay) + minDelay;
			const typingDuration = Math.min(message.length * avgTypingSpeed, 3000);

			setTimeout(() => {
				setIsTyping(true);
				setTimeout(() => {
					setIsTyping(false);
					callback(message);
				}, typingDuration);
			}, startDelay);
		},
		[],
	);

	// Process message queue with typing simulation and deduplication
	const processMessageQueue = useCallback(async () => {
		if (messageQueue.current.length === 0 || isProcessingQueue) {
			setIsProcessingQueue(false);
			return;
		}

		setIsProcessingQueue(true);
		const message = messageQueue.current[0];
		let retryCount = 0;
		const maxRetries = 3;

		const processMessage = async () => {
			try {
				await new Promise((resolve) => {
					simulateTyping(message.content, (text) => {
						setMessages((prev) => {
							if (prev.some((m) => m.id === message.id)) {
								return prev;
							}
							return [...prev, { ...message, content: text }];
						});
						resolve(true);
					});
				});

				messageQueue.current = messageQueue.current.slice(1);
				setIsProcessingQueue(false);
				processMessageQueue();
			} catch (error) {
				console.error("Error processing message:", error);
				if (retryCount < maxRetries) {
					retryCount++;
					await processMessage();
				} else {
					setIsProcessingQueue(false);
				}
			}
		};

		await processMessage();
	}, [simulateTyping, isProcessingQueue]);

	// Watch queue for new messages
	useEffect(() => {
		if (messageQueue.current.length > 0 && !isProcessingQueue) {
			processMessageQueue();
		}
	}, [messageQueue.current.length, isProcessingQueue, processMessageQueue]);

	// Message analysis with enhanced categorization
	const analyzeMessage = useCallback((content: string): MessageAnalysis => {
		const evidenceKeywords = [
			"screenshot",
			"message",
			"photo",
			"video",
			"proof",
			"sent",
			"posted",
			"shared",
			"wrote",
			"said",
			"upload evidence", // Add explicit upload keyword
			"want to upload", // Add variation
			"upload", // Add base keyword
		];
		const distressKeywords = {
			high: ["suicide", "kill", "hurt myself", "die", "end it all"],
			medium: ["scared", "afraid", "anxious", "depressed", "threatened"],
			low: ["worried", "sad", "angry", "helpless", "upset"],
		};

		const hasEvidence = evidenceKeywords.some((keyword) =>
			content.toLowerCase().includes(keyword),
		);

		let severity: "high" | "medium" | "low" = "low";
		let isDistressed = false;
		let isEmergency = false;

		if (
			distressKeywords.high.some((keyword) =>
				content.toLowerCase().includes(keyword),
			)
		) {
			severity = "high";
			isDistressed = true;
			isEmergency = true;
		} else if (
			distressKeywords.medium.some((keyword) =>
				content.toLowerCase().includes(keyword),
			)
		) {
			severity = "medium";
			isDistressed = true;
		} else if (
			distressKeywords.low.some((keyword) =>
				content.toLowerCase().includes(keyword),
			)
		) {
			severity = "low";
			isDistressed = true;
		}

		return { needsEvidence: hasEvidence, isDistressed, isEmergency, severity };
	}, []);

	// Handle emergency responses with counselor connection
	const handleEmergencyConnect = useCallback(async () => {
		try {
			messageQueue.current.push({
				id: crypto.randomUUID(),
				role: "assistant",
				content: "I'm connecting you with a counselor. Please stay with me...",
				timestamp: new Date(),
				metadata: {
					intent: "emergency_connect",
					actionRequired: true,
					actionType: "emergency",
				},
			});

			setTimeout(() => {
				messageQueue.current.push({
					id: crypto.randomUUID(),
					role: "assistant",
					content:
						"A counselor has been notified and will join this chat shortly. I'm here to support you while we wait.",
					timestamp: new Date(),
				});
				processMessageQueue();
			}, 2000);
		} catch (error) {
			console.error("Failed to connect to counselor:", error);
		}
	}, [processMessageQueue]);

	// Handle emergency mode dismissal
	const handleEmergencyDismiss = useCallback(() => {
		setShowEmergencyActions(false);
		messageQueue.current.push({
			id: crypto.randomUUID(),
			role: "assistant",
			content:
				"I understand you might not want to talk to someone else right now. I'm here to listen and help in any way I can. You can ask to speak with a counselor anytime.",
			timestamp: new Date(),
		});
		processMessageQueue();
	}, [processMessageQueue]);

	// Add this new function to handle evidence collection state
	const handleEvidenceCollection = useCallback(
		async (type: "text" | "file", content: string | File[], context?: any) => {
			try {
				setEvidenceQueue({
					type,
					content,
					status: "uploading",
					progress: 0,
				});

				// Show collecting evidence message
				const collectionMessage: Message = {
					id: crypto.randomUUID(),
					role: "assistant",
					content:
						type === "file"
							? "I'm securely saving the files you've shared..."
							: "I'm recording this information as evidence...",
					timestamp: new Date(),
					metadata: {
						intent: "evidence_collection",
						actionType: "collect_evidence",
					},
				};

				messageQueue.current.push(collectionMessage);
				await processMessageQueue();

				// Handle the evidence based on type
				if (type === "file") {
					const files = content as File[];
					const totalSize = files.reduce((acc, file) => acc + file.size, 0);
					let uploadedSize = 0;

					const uploadPromises = files.map(async (file) => {
						const result = await saveFileEvidence(file, "chat", {
							context: {
								conversationId: session?.user?.id,
								previousMessages: messages.slice(-5).map((m) => ({
									content: m.content,
									role: m.role,
									timestamp: m.timestamp,
								})),
							},
							onProgress: (progress: number) => {
								uploadedSize += (file.size * progress) / 100;
								const totalProgress = Math.round(
									(uploadedSize / totalSize) * 100,
								);
								setEvidenceQueue((prev) => ({
									...prev,
									progress: totalProgress,
								}));
							},
						});
						return result;
					});

					await Promise.all(uploadPromises);

					// Update evidence queue state
					setEvidenceQueue((prev) => ({
						...prev,
						status: "success",
						progress: 100,
					}));

					// Add confirmation message
					messageQueue.current.push({
						id: crypto.randomUUID(),
						role: "assistant",
						content: `I've securely saved ${files.length} file${
							files.length > 1 ? "s" : ""
						} as evidence. Would you like to add any additional context about what ${
							files.length > 1 ? "these files show" : "this file shows"
						}?`,
						timestamp: new Date(),
						metadata: {
							intent: "evidence_collection",
							actionRequired: true,
							actionType: "collect_evidence",
						},
					});
				} else {
					// Handle text evidence
					const textContent = content as string;
					const evidence = await saveTextEvidence(textContent, "chat", {
						context: messages.slice(-5).map((m) => ({
							content: m.content,
							role: m.role,
							timestamp: m.timestamp,
						})),
					});

					// Update evidence queue state
					setEvidenceQueue((prev) => ({
						...prev,
						status: "success",
						progress: 100,
					}));

					// Add confirmation message
					messageQueue.current.push({
						id: crypto.randomUUID(),
						role: "assistant",
						content:
							"I've saved this information as evidence. Is there anything else you'd like to share?",
						timestamp: new Date(),
						metadata: {
							intent: "evidence_collection",
							actionRequired: true,
							actionType: "collect_evidence",
						},
					});

					return evidence;
				}
			} catch (error) {
				console.error("Evidence collection error:", error);

				// Update evidence queue state
				setEvidenceQueue((prev) => ({
					...prev,
					status: "error",
				}));

				// Add error message
				messageQueue.current.push({
					id: crypto.randomUUID(),
					role: "assistant",
					content:
						"I encountered an issue while saving the evidence. Would you like to try again or try a different way to share this information?",
					timestamp: new Date(),
					metadata: {
						intent: "evidence_collection_error",
						actionRequired: true,
						actionType: "collect_evidence",
					},
				});
			} finally {
				processMessageQueue();
			}
		},
		[
			messages,
			session?.user?.id,
			saveFileEvidence,
			saveTextEvidence,
			processMessageQueue,
		],
	);

	const handleFileUpload = useCallback(
		async (files: File[]) => {
			setShowFileUpload(false);
			await handleEvidenceCollection("file", files);
		},
		[handleEvidenceCollection],
	);

	// Modify the handleResponse function to better handle evidence collection
	const handleResponse = useCallback(
		async (response: any, context: any) => {
			// First, check if this is an evidence-related message
			const isEvidenceRelated =
				response.metadata?.intent === "request_evidence" ||
				response.metadata?.actionType === "collect_evidence";

			// If evidence-related, show appropriate UI
			if (isEvidenceRelated) {
				// Show file upload option if message mentions screenshots or files
				if (
					context.messageContent?.toLowerCase().includes("screenshot") ||
					context.messageContent?.toLowerCase().includes("photo")
				) {
					setShowFileUpload(true);
				}

				// Update evidence queue state
				setEvidenceQueue((prev) => ({
					...prev,
					status: "pending",
				}));
			}

			// Add the response to message queue
			messageQueue.current.push({
				id: crypto.randomUUID(),
				role: "assistant",
				content: response.message,
				timestamp: new Date(),
				metadata: {
					...response.metadata,
					context,
					actionType: isEvidenceRelated
						? "collect_evidence"
						: response.metadata?.actionType,
				},
			});

			// Handle any additional messages
			if (response.additionalMessages?.length) {
				response.additionalMessages.forEach((message: string) => {
					messageQueue.current.push({
						id: crypto.randomUUID(),
						role: "assistant",
						content: message,
						timestamp: new Date(),
						metadata: response.metadata,
					});
				});
			}

			if (!isProcessingQueue) {
				processMessageQueue();
			}
		},
		[isProcessingQueue, processMessageQueue],
	);

	// Handle message submission
	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const analysis = analyzeMessage(input);
		const userMessageId = crypto.randomUUID();

		// Check specifically for upload intent
		const isUploadIntent = input.toLowerCase().includes("upload");

		if (isUploadIntent) {
			setShowFileUpload(true);
		}

		setMessages((prev) => [
			...prev,
			{
				id: userMessageId,
				role: "user",
				content: input,
				timestamp: new Date(),
				sentiment: analysis.isDistressed ? "negative" : "neutral",
				metadata: analysis.needsEvidence
					? {
							actionType: "collect_evidence",
							intent: "provide_evidence",
					  }
					: undefined,
			},
		]);

		setInput("");

		try {
			if (analysis.isEmergency && !emergencyMode) {
				setEmergencyMode(true);
				setEmergencySeverity(analysis.severity);
				setShowEmergencyActions(true);
				messageQueue.current.push({
					id: crypto.randomUUID(),
					role: "assistant",
					content:
						analysis.severity === "high"
							? "I'm very concerned about what you're sharing. Your safety is my top priority."
							: "I can hear that you're going through a difficult time.",
					timestamp: new Date(),
					metadata: {
						intent: "emergency_response",
						actionRequired: true,
						actionType: "emergency",
					},
				});
				return;
			}

			// Prepare context with evidence information
			const context = {
				previousMessages: messages.slice(-3),
				userState: {
					isDistressed: emergencyMode,
					hasProvidedEvidence: messages.some((m) => m.evidenceRef),
					conversationLength: messages.length,
				},
				messageContent: input,
				needsEvidence: analysis.needsEvidence,
			};

			const response = await sendMessage(input, {
				isDistressed: analysis.isDistressed,
				needsEvidence: analysis.needsEvidence,
				isEmergency: analysis.isEmergency,
			});

			// Handle evidence collection if needed
			if (analysis.needsEvidence) {
				const evidence = await handleEvidenceCollection("text", input);
				if (evidence) {
					// Update message with evidence reference
					setMessages((prev) =>
						prev.map((m) =>
							m.id === userMessageId ? { ...m, evidenceRef: evidence.id } : m,
						),
					);
				}
			}

			await handleResponse(response, context);
		} catch (error) {
			console.error("Failed to send message:", error);
			messageQueue.current.push({
				id: crypto.randomUUID(),
				role: "assistant",
				content:
					"I'm having trouble responding right now. If you need immediate help, please reach out to emergency services or a trusted adult.",
				timestamp: new Date(),
			});
			processMessageQueue();
		}
	};

	const handleEvidenceRetry = useCallback(
		async (message: Message) => {
			setEvidenceQueue((prev) => ({
				...prev,
				status: "pending",
				progress: 0,
			}));

			if (evidenceQueue.type === "file") {
				await handleEvidenceCollection("file", evidenceQueue.content as File[]);
			} else {
				await handleEvidenceCollection("text", message.content);
			}
		},
		[handleEvidenceCollection],
	);

	// Auto-scroll to latest messages
	useEffect(() => {
		if (scrollRef.current) {
			const timeoutId = setTimeout(() => {
				scrollRef.current?.scrollTo({
					top: scrollRef.current.scrollHeight,
					behavior: messages.length <= 1 ? "auto" : "smooth",
				});
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [messages]);

	// Initialize chat with welcome message
	useEffect(() => {
		if (messages.length === 0) {
			messageQueue.current.push({
				id: "welcome",
				role: "assistant",
				content:
					"Hi, I'm Billy. I'm here to help you with any cyberbullying issues you're experiencing. Everything you share with me is confidential. How can I help you today?",
				timestamp: new Date(),
			});
			processMessageQueue();
		}
	}, [messages.length]);

	const renderMessage = useCallback(
		(message: Message) => (
			<div
				key={message.id}
				className={cn(
					"flex flex-col gap-2 animate-in slide-in-from-bottom duration-300",
					message.role === "user" ? "items-end" : "items-start",
				)}
			>
				<div
					className={cn(
						"max-w-[80%] rounded-lg p-4 shadow-sm",
						message.role === "user"
							? "bg-primary text-primary-foreground ml-12"
							: "bg-card text-card-foreground border mr-12",
						message.metadata?.actionType === "emergency" &&
							"border-destructive",
					)}
				>
					<p className="whitespace-pre-wrap">{message.content}</p>

					<div className="mt-1 text-xs opacity-70">
						{new Date(message.timestamp).toLocaleTimeString()}
					</div>

					{message.metadata?.actionType === "collect_evidence" && (
						<div className="mt-2">
							{evidenceQueue.status === "uploading" && (
								<div className="flex items-center gap-2 text-yellow-500">
									<LoaderCircleIcon className="w-4 h-4 animate-spin" />
									<span className="text-xs">
										Saving evidence... {evidenceQueue.progress}%
									</span>
								</div>
							)}
							{evidenceQueue.status === "success" && (
								<div className="flex items-center gap-2 text-green-500">
									<CheckIcon className="w-4 h-4" />
									<span className="text-xs">Evidence saved successfully</span>
								</div>
							)}
							{evidenceQueue.status === "error" && (
								<div className="flex items-center gap-2 text-red-500">
									<XIcon className="w-4 h-4" />
									<span className="text-xs">Failed to save evidence</span>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => handleEvidenceRetry(message)}
									>
										Retry
									</Button>
								</div>
							)}
						</div>
					)}

					{message.evidenceRef && !message.metadata?.actionType && (
						<div className="mt-2 text-xs flex items-center gap-1">
							<PaperclipIcon className="w-3 h-3" />
							<span>Saved as evidence</span>
						</div>
					)}

					{message.metadata?.actionRequired &&
						message.metadata.actionType === "emergency" && (
							<EmergencyActions
								severity={emergencySeverity}
								onConnect={handleEmergencyConnect}
								onDismiss={handleEmergencyDismiss}
							/>
						)}
				</div>
			</div>
		),
		[
			evidenceQueue,
			emergencySeverity,
			handleEmergencyConnect,
			handleEmergencyDismiss,
			handleEvidenceRetry,
		],
	);

	return (
		<Card className="flex flex-col h-[600px] w-full bg-background border shadow-md">
			{/* Header section */}
			<div className="flex items-center justify-between p-4 border-b bg-muted/50">
				<div className="flex items-center space-x-4">
					<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
						<MessageSquare className="w-4 h-4 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold text-foreground">Billy</h3>
						<p className="text-sm text-muted-foreground">
							{isTyping ? "Typing..." : "Online"}
						</p>
					</div>
				</div>

				{emergencyMode && (
					<Alert variant="destructive" className="ml-auto max-w-xs">
						<AlertTriangle className="h-4 w-4" />
						<AlertTitle className="text-sm">Emergency Mode Active</AlertTitle>
					</Alert>
				)}
			</div>

			{/* Chat area */}
			<ScrollArea
				className="flex-1 p-4 bg-gradient-to-b from-background to-muted/20"
				ref={scrollRef}
			>
				<div className="space-y-4">
					{messages.map((message) => renderMessage(message))}
					{showFileUpload && (
						<FileUpload
							onFileSelect={handleFileUpload}
							onCancel={() => setShowFileUpload(false)}
							allowedTypes={[
								"image/*",
								"application/pdf",
								".doc,.docx,.txt",
								"video/*",
							]}
							maxSize={20}
						/>
					)}
				</div>
			</ScrollArea>

			{/* Input area */}
			<form
				onSubmit={handleSendMessage}
				className="p-4 border-t bg-muted/50 backdrop-blur"
			>
				<div className="flex space-x-2">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							emergencyMode
								? "I'm here to help. What would you like to tell me?"
								: "Type your message..."
						}
						disabled={isLoading || (emergencyMode && showEmergencyActions)}
						className="flex-1 bg-background border-muted-foreground/20"
					/>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="submit"
									disabled={
										isLoading || (emergencyMode && showEmergencyActions)
									}
									className="bg-primary hover:bg-primary/90"
								>
									<Send className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Send message</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</form>
		</Card>
	);
}
