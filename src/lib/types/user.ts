export type UserRole = 'user' | 'admin';

export interface UserProfile {
	uid: string;
	fullName: string;
	email: string;
	role: UserRole;
	phoneVerified: boolean;
	emailVerified: boolean;
	photoURL: string | null;
	createdAt: string;
	updatedAt: string;
	lastLoginAt: string | null;
	wishlistCount: number;
	ordersCount: number;
	notificationsEnabled: boolean;
}

export interface RegisterPayload {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface LoginPayload {
	email: string;
	password: string;
	role: UserRole;
}

export interface ForgotPasswordPayload {
	email: string;
}

export interface ResetPasswordPayload {
	oobCode: string;
	newPassword: string;
	confirmPassword: string;
}

export interface UpdateProfilePayload {
	fullName?: string;
	photoURL?: string | null;
	notificationsEnabled?: boolean;
}
