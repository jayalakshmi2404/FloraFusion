import type { UserRole } from '$lib/types/user';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}
		interface Locals {
			uid: string | null;
			email: string | null;
			role: UserRole | null;
			isAuthenticated: boolean;
		}
		interface PageData {
			uid?: string | null;
			email?: string | null;
			role?: UserRole | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
