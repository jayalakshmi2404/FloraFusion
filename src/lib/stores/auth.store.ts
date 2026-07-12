import { writable, derived, type Readable } from 'svelte/store';
import type { User } from 'firebase/auth';
import type { UserProfile } from '$lib/types/user';
import { fetchUserProfile, syncSessionCookie, watchIdTokenChanges } from '$lib/services/auth.service';

export interface AuthState {
	user: User | null;
	profile: UserProfile | null;
	loading: boolean;
	initialized: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		profile: null,
		loading: true,
		initialized: false
	});

	let unsubscribeTokenWatcher: (() => void) | null = null;

	function init() {
		if (unsubscribeTokenWatcher) return;
		unsubscribeTokenWatcher = watchIdTokenChanges(async (user) => {
			update((state) => ({ ...state, loading: true }));

			if (!user) {
				await syncSessionCookie(null);
				set({ user: null, profile: null, loading: false, initialized: true });
				return;
			}

			await syncSessionCookie(user);
			const profile = await fetchUserProfile(user.uid);
			set({ user, profile, loading: false, initialized: true });
		});
	}

	function destroy() {
		unsubscribeTokenWatcher?.();
		unsubscribeTokenWatcher = null;
	}

	async function refreshProfile() {
		let currentUid: string | null = null;
		update((state) => {
			currentUid = state.user?.uid ?? null;
			return state;
		});
		if (!currentUid) return;
		const profile = await fetchUserProfile(currentUid);
		update((state) => ({ ...state, profile }));
	}

	function reset() {
		set({ user: null, profile: null, loading: false, initialized: true });
	}

	return { subscribe, init, destroy, refreshProfile, reset };
}

export const authStore = createAuthStore();

export const isAuthenticated: Readable<boolean> = derived(authStore, ($s) => !!$s.user);
export const currentRole: Readable<'user' | 'admin' | null> = derived(
	authStore,
	($s) => $s.profile?.role ?? null
);
export const isAdmin: Readable<boolean> = derived(currentRole, ($r) => $r === 'admin');
