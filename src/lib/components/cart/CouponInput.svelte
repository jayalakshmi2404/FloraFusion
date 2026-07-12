<script lang="ts">
	import { getCouponByCode } from '$lib/repositories/coupon.repository';
	import { validateCoupon, CouponError } from '$lib/services/pricing.service';
	import type { Coupon } from '$lib/types/product';

	interface Props {
		subtotal: number;
		appliedCoupon: Coupon | null;
		onApply: (coupon: Coupon | null) => void;
	}

	let { subtotal, appliedCoupon = $bindable(), onApply }: Props = $props();

	let code = $state('');
	let error = $state('');
	let checking = $state(false);

	async function applyCoupon() {
		error = '';
		if (!code.trim()) {
			error = 'Please enter a coupon code.';
			return;
		}

		checking = true;
		try {
			const coupon = await getCouponByCode(code);
			if (!coupon) {
				error = 'Invalid coupon code.';
				return;
			}
			validateCoupon(coupon, subtotal);
			onApply(coupon);
		} catch (err) {
			error = err instanceof CouponError ? err.message : 'Could not apply this coupon.';
		} finally {
			checking = false;
		}
	}

	function removeCoupon() {
		code = '';
		error = '';
		onApply(null);
	}
</script>

<div>
	{#if appliedCoupon}
		<div class="flex items-center justify-between rounded-xl bg-sage-50 px-4 py-3 text-sm text-sage-700">
			<span>
				Coupon <strong>{appliedCoupon.code}</strong> applied
			</span>
			<button type="button" onclick={removeCoupon} class="font-medium underline">Remove</button>
		</div>
	{:else}
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={code}
				placeholder="Coupon code"
				class="input-field flex-1 uppercase"
				oninput={() => (code = code.toUpperCase())}
			/>
			<button type="button" onclick={applyCoupon} disabled={checking} class="btn-secondary shrink-0">
				{checking ? 'Checking…' : 'Apply'}
			</button>
		</div>
		{#if error}<p class="mt-1.5 text-xs text-red-600" role="alert">{error}</p>{/if}
	{/if}
</div>
