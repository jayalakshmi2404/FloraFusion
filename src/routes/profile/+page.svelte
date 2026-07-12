<script lang="ts">
	import { authStore } from '$lib/stores/auth.store';
	import { updateProfileSchema } from '$lib/schemas/validation';
	import { updateUserProfile } from '$lib/services/auth.service';
	import { uploadProfilePhoto, StorageServiceError } from '$lib/services/storage.service';
	import { toastStore } from '$lib/stores/toast.store';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	let fullName = $state($authStore.profile?.fullName ?? '');
	let notificationsEnabled = $state($authStore.profile?.notificationsEnabled ?? true);
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);
	let uploadingPhoto = $state(false);
	let photoError = $state('');

	$effect(() => {
		if ($authStore.profile) {
			fullName = $authStore.profile.fullName;
			notificationsEnabled = $authStore.profile.notificationsEnabled;
		}
	});

	async function handleSave(event: SubmitEvent) {
		event.preventDefault();
		errors = {};

		const result = updateProfileSchema.safeParse({ fullName, notificationsEnabled });
		if (!result.success) {
			for (const issue of result.error.issues) {
				errors[issue.path[0] as string] = issue.message;
			}
			return;
		}

		const uid = $authStore.user?.uid;
		if (!uid) return;

		saving = true;
		try {
			await updateUserProfile(uid, result.data);
			await authStore.refreshProfile();
			toastStore.success('Profile updated successfully.');
		} catch {
			toastStore.error('Could not update your profile. Please try again.');
		} finally {
			saving = false;
		}
	}

	async function handlePhotoChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const uid = $authStore.user?.uid;
		if (!uid) return;

		photoError = '';
		uploadingPhoto = true;
		try {
			const url = await uploadProfilePhoto(uid, file);
			await updateUserProfile(uid, { photoURL: url });
			await authStore.refreshProfile();
			toastStore.success('Profile photo updated.');
		} catch (err) {
			photoError = err instanceof StorageServiceError ? err.message : 'Could not upload photo.';
		} finally {
			uploadingPhoto = false;
			input.value = '';
		}
	}
</script>

<svelte:head>
	<title>My Profile — Flora Fusion</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900">My Profile</h1>
	<p class="mt-1 text-charcoal-700">Manage your account details and preferences.</p>

	{#if $authStore.loading}
		<div class="mt-10">
			<LoadingSpinner fullScreen label="Loading your profile" />
		</div>
	{:else if $authStore.profile}
		<Card classNames="mt-8">
			<div class="flex items-center gap-5">
				<div class="relative">
					{#if $authStore.profile.photoURL}
						<img src={$authStore.profile.photoURL} alt={$authStore.profile.fullName} class="h-20 w-20 rounded-full object-cover" />
					{:else}
						<div class="flex h-20 w-20 items-center justify-center rounded-full bg-bloom-100 text-2xl font-semibold text-bloom-700">
							{$authStore.profile.fullName.charAt(0).toUpperCase()}
						</div>
					{/if}
					{#if uploadingPhoto}
						<div class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
							<LoadingSpinner size="sm" />
						</div>
					{/if}
				</div>
				<div>
					<label class="btn-secondary cursor-pointer text-xs">
						Change Photo
						<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" class="hidden" onchange={handlePhotoChange} />
					</label>
					{#if photoError}<p class="mt-1 text-xs text-red-600">{photoError}</p>{/if}
				</div>
			</div>

			<form onsubmit={handleSave} class="mt-8 space-y-5">
				<div>
					<label for="fullName" class="label-text">Full Name</label>
					<input
						id="fullName"
						type="text"
						bind:value={fullName}
						aria-invalid={!!errors.fullName}
						class={`input-field ${errors.fullName ? 'input-error' : ''}`}
					/>
					{#if errors.fullName}<p class="mt-1.5 text-xs text-red-600">{errors.fullName}</p>{/if}
				</div>

				<div>
					<label for="email" class="label-text">Email Address</label>
					<input id="email" type="email" value={$authStore.profile.email} disabled class="input-field bg-cream-100 text-charcoal-700" />
					<p class="mt-1 text-xs text-charcoal-700">
						Need to change your email? Contact <a href="mailto:florafusion111@gmail.com" class="text-bloom-600 hover:underline">florafusion111@gmail.com</a>.
					</p>
				</div>

				<label class="flex items-center gap-3">
					<input type="checkbox" bind:checked={notificationsEnabled} class="h-4 w-4 rounded border-charcoal-100 text-bloom-600" />
					<span class="text-sm text-charcoal-700">Email me about order updates and promotions</span>
				</label>

				<Button type="submit" variant="primary" loading={saving}>
					Save Changes
				</Button>
			</form>
		</Card>

		<Card classNames="mt-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Account Summary</h2>
			<dl class="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
				<div>
					<dt class="text-charcoal-700">Role</dt>
					<dd class="font-semibold capitalize text-charcoal-900">{$authStore.profile.role}</dd>
				</div>
				<div>
					<dt class="text-charcoal-700">Orders Placed</dt>
					<dd class="font-semibold text-charcoal-900">{$authStore.profile.ordersCount}</dd>
				</div>
				<div>
					<dt class="text-charcoal-700">Wishlist Items</dt>
					<dd class="font-semibold text-charcoal-900">{$authStore.profile.wishlistCount}</dd>
				</div>
			</dl>
		</Card>
	{/if}
</div>