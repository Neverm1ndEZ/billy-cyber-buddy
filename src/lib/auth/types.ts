export interface UserRole {
	id: string;
	role: "user" | "admin" | "counselor";
	permissions: string[];
}
