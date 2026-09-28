<template>
	<MFormSection
		:id="props.idPrefix"
		class="google"
		title="Google sign-in"
		description="Link your Google account to sign in with it. Every sign-in still ends with a code we email you."
	>
		<div class="google__account">
			<img src="/images/brand/google-g.svg" alt="" width="20" height="20" class="google__mark">
			<MText size="small" color="--text-secondary">
				Google has to confirm <strong class="google__email">{{ props.email }}</strong>, the email on this account.
				A Google account with a different address can’t be linked.
			</MText>
		</div>

		<div class="google__actions">
			<MButton variant="neutral" :is-loading="status === 'linking'" @click="link">Link Google account</MButton>
		</div>

		<!-- Laravel refuses a link when the last completed sign-in is too old. -->
		<MAlert v-if="status === 'stale'" tone="warning" live>
			<template #title>Sign in again to link Google</template>
			For your security, linking needs a sign-in from the last {{ authPolicy.recentSignInMinutes }} minutes.
			Sign in, then come back to this page.
			<template #actions>
				<MButton variant="text" size="sm" :to="{ path: '/login', query: { redirect: '/dashboard/account' } }">
					Sign in again
				</MButton>
			</template>
		</MAlert>
		<MAlert v-else-if="status === 'failed'" tone="danger" live>
			We couldn’t start linking your Google account. Nothing has changed — please try again.
		</MAlert>

		<MText size="small" color="--text-muted" class="google__note">
			Linking signs you out on every device, so you’ll sign in again afterwards. To remove a link, contact the
			BPO Profile team. Signed up with Google and want a password too?
			<NuxtLink to="/forgot-password" class="google__link">Set one with a reset link</NuxtLink>.
		</MText>
	</MFormSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'
import { authPolicy } from '~/data/features/onboarding'

interface Props {
	idPrefix: string
	email: string
	// previews a failed request (?state=error)
	fails?: boolean
	// previews the recent sign-in check failing (?google=stale)
	stale?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	fails: false,
	stale: false,
})

const status = ref<'idle' | 'linking' | 'stale' | 'failed'>('idle')

// POST /api/account/google/link → 200 { redirect_url }, then a full-page
// trip to Google. The callback signs out every session and lands on
// /login (docs/API.md §1), which the static stand-in goes to directly.
function link() {
	status.value = 'linking'
	setTimeout(() => {
		if (props.fails) status.value = 'failed'
		else if (props.stale) status.value = 'stale'
		else navigateTo({ path: '/login', query: { state: 'linked' } })
	}, 600)
}
</script>

<style lang="scss" scoped>
.google {
	&__account {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		max-width: 560px;
	}

	&__mark {
		flex: 0 0 auto;
		margin-top: 1px;
	}

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__actions {
		display: flex;
	}

	&__note {
		max-width: 560px;
	}

	&__link {
		font-weight: 500;
		color: var(--brand-strong);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--brand-deep);
		}
	}
}
</style>
