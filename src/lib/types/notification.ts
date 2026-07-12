export type NotificationType =
	| 'Order Update'
	| 'Submission Update'
	| 'Promotion'
	| 'System'
	| 'Review Request';

export interface AppNotification {
	id: string;
	uid: string;
	type: NotificationType;
	title: string;
	message: string;
	link: string | null;
	read: boolean;
	createdAt: string;
}
