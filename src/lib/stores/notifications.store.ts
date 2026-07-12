import { writable } from 'svelte/store';
import { getUnreadCount } from '$lib/repositories/notification.repository';

function createNotificationsStore() {
	const { subscribe, set } = writable<number>(0);

	async function refresh(uid: string | null) {
		if (!uid) {
			set(0);
			return;
		}
		try {
			const count = await getUnreadCount(uid);
			set(count);
		} catch {
			set(0);
		}
	}

	return { subscribe, refresh };
}

export const unreadNotificationsStore = createNotificationsStore();
