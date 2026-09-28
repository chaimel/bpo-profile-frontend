<template>
	<div class="request">
		<div class="wrapper">
			<div class="request__con">
				<section class="request__panel" aria-labelledby="claim-request-title">
					<!-- Already owned: nothing to request, only someone to talk to. -->
					<template v-if="props.company.claimed">
						<MHeading id="claim-request-title" ref="heading_ref" variant="2" size="4" tabindex="-1" class="request__title">
							Think you should manage this listing?
						</MHeading>
						<MText size="medium" color="--text-secondary">
							If you believe the wrong person controls {{ props.company.name }}’s listing, tell us what’s
							happening. Our team reviews ownership questions by hand.
						</MText>
						<div class="request__actions">
							<MButton to="/contact">Contact our team</MButton>
							<MButton variant="neutral" :to="`/companies/${props.company.slug}`">View the listing</MButton>
						</div>
					</template>

					<template v-else-if="props.state === 'signed-out'">
						<MHeading id="claim-request-title" ref="heading_ref" variant="2" size="4" tabindex="-1" class="request__title">
							Sign in to continue
						</MHeading>
						<MText size="medium" color="--text-secondary">
							Claim requests come from accounts with a verified email address. Sign in, or create an
							account with your work email — either way, we’ll bring you back here.
						</MText>
						<div class="request__actions">
							<MButton :to="sign_in_link">Sign in to continue</MButton>
							<MButton variant="neutral" :to="register_link">Create an account</MButton>
						</div>
					</template>

					<form v-else-if="props.state === 'ready'" class="request__form" novalidate @submit.prevent="submit">
						<MHeading id="claim-request-title" ref="heading_ref" variant="2" size="4" tabindex="-1" class="request__title">
							Request ownership of {{ props.company.name }}
						</MHeading>

						<div class="request__account">
							<MAvatar :name="account_name" size="sm" decorative />
							<MText size="small" class="request__account-text">
								Signed in as <strong>{{ account_name }}</strong>
								<span class="request__account-email">{{ props.account.email }}</span>
							</MText>
						</div>

						<MCheckbox id="claim-authorized" v-model="is_authorized" name="authorized" :has-error="Boolean(error)">
							I’m authorized to represent {{ props.company.name }}
							<template #description>We may contact you to confirm your role before we approve the request.</template>
							<template #error>{{ error }}</template>
						</MCheckbox>

						<div class="request__actions">
							<MButton type="submit">Submit claim request</MButton>
							<MButton variant="text" :to="sign_in_link">Use a different account</MButton>
						</div>
					</form>

					<template v-else>
						<MBadge :tone="pending.tone" :icon="pending.icon">{{ pending.label }}</MBadge>
						<MHeading id="claim-request-title" ref="heading_ref" variant="2" size="4" tabindex="-1" class="request__title">
							Request received — pending review
						</MHeading>
						<MText size="medium" color="--text-secondary">
							We’ll email {{ props.account.email }} if it’s approved. A request doesn’t change the listing
							or give you editing access; that only happens when you accept the claim link we send.
						</MText>
						<div class="request__actions">
							<MButton to="/dashboard">Go to your dashboard</MButton>
							<MButton variant="neutral" :to="`/companies/${props.company.slug}`">View the listing</MButton>
						</div>
					</template>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { Me } from '~/types/features/dashboard'
import type { CompanyCard } from '~/types/features/directory'
import { fullName } from '~/utils/format'
import { claimStatusMeta } from '~/utils/labels'
import type { ClaimRequestState } from '~/types/features/onboarding'

interface Props {
	company: CompanyCard
	state: ClaimRequestState
	account: Pick<Me, 'first_name' | 'last_name' | 'email'>
	// where sign-in and registration should bring the visitor back to
	returnTo: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'submit'): void
}>()

const heading_ref = ref<ComponentPublicInstance | null>(null)
const is_authorized = ref(false)
const is_attempted = ref(false)

const pending = claimStatusMeta.pending
const account_name = computed(() => fullName(props.account))

const sign_in_link = computed<RouteLocationRaw>(() => ({ path: '/login', query: { redirect: props.returnTo } }))
const register_link = computed<RouteLocationRaw>(() => ({
	path: '/register',
	query: { type: 'account', redirect: props.returnTo },
}))

const error = computed(() =>
	is_attempted.value && !is_authorized.value
		? `Confirm that you’re authorized to represent ${props.company.name}.`
		: '',
)

function submit() {
	is_attempted.value = true

	if (error.value) {
		document.getElementById('claim-authorized')?.focus()
		return
	}

	emit('submit')
}

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

// A new request state replaces the panel's content: move focus to its heading.
watch(() => props.state, async () => {
	is_attempted.value = false
	await nextTick()
	focusHeading()
})
</script>

<style lang="scss" scoped>
.request {
	&__con {
		max-width: 720px;
		padding: 56px 0;
	}

	&__panel {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		padding: 32px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow:
			inset 0 0 0 1px var(--border-strong),
			var(--shadow-card);
	}

	&__form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		width: 100%;
	}

	&__title:focus {
		outline: none;
	}

	&__account {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 14px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
	}

	&__account-text {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
		font-family: var(--font-ui);
	}

	&__account-email {
		color: var(--text-secondary);
		overflow-wrap: anywhere;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		padding-top: 8px;
	}
}

@media only screen and (max-width: 600px) {
	.request {
		&__con {
			padding: 40px 0;
		}

		&__panel {
			padding: 24px 20px;
		}
	}
}
</style>
