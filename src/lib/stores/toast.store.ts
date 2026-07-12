import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function push(message: string, type: ToastType = 'info', duration = 4000) {
		const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		update((toasts) => [...toasts, { id, type, message, duration }]);
		if (duration > 0) {
			setTimeout(() => dismiss(id), duration);
		}
		return id;
	}

	function dismiss(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string, duration?: number) => push(message, 'success', duration),
		error: (message: string, duration?: number) => push(message, 'error', duration),
		info: (message: string, duration?: number) => push(message, 'info', duration),
		warning: (message: string, duration?: number) => push(message, 'warning', duration),
		dismiss
	};
}

export const toastStore = createToastStore();
