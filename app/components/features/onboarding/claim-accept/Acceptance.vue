<template>
	<div class="acceptance">
		<div class="wrapper">
			<div class="acceptance__con">
				<span :class="['acceptance__mark', `acceptance__mark--${screen.tone}`]" aria-hidden="true">
					<MIcon :name="screen.icon" size="lg" />
				</span>

				<MHeading ref="heading_ref" variant="1" size="2" tabindex="-1" class="acceptance__title">
					{{ screen.title }}
				</MHeading>

				<template v-if="props.state === 'signed-out'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						Sign in with the email address your claim was approved for. No account for that address yet?
						Create one with it — we’ll bring you back to this page.
					</MText>
					<div class="acceptance__actions">
						<MButton size="lg" :to="sign_in_link">Sign in to continue</MButton>
						<MButton size="lg" variant="neutral" :to="register_link">Create an account</MButton>
					</div>
					<MText size="small" color="--text-muted" class="acceptance__fine">
						Opening this link doesn’t change anything on its own. The listing only changes hands when the
						approved account accepts it.
					</MText>
				</template>

				<template v-else-if="props.state === 'ready'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						Your claim was approved. Accepting makes you the owner of the listing named in your approval email.
					</MText>

					<MText size="small" color="--text-secondary" class="acceptance__account">
						<MIcon name="light-user-circle" size="sm" color="text-muted" class="acceptance__account-icon" />
						<span>
							Signed in as <strong class="acceptance__email">{{ props.accountEmail }}</strong> — the
							account this claim was approved for.
						</span>
					</MText>

					<div class="acceptance__effects">
						<MText size="small" weight="semi-bold" class="acceptance__effects-title">When you accept</MText>
						<ul class="acceptance__effect-list">
							<li v-for="effect in effects" :key="effect.text" class="acceptance__effect">
								<MIcon
									:name="effect.applies ? 'light-check' : 'light-minus'"
									size="sm"
									:color="effect.applies ? 'success' : 'text-muted'"
									class="acceptance__effect-icon"
								/>
								{{ effect.text }}
							</li>
						</ul>
					</div>

					<div class="acceptance__actions">
						<MButton size="lg" @click="emit('accept')">Accept and take ownership</MButton>
					</div>
					<MText size="small" color="--text-muted" class="acceptance__fine">
						Opening this link didn’t change anything. Only the verified account the claim was approved for
						can accept it, and nothing happens until you do.
					</MText>
				</template>

				<template v-else-if="props.state === 'wrong-account'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						You’re signed in as <strong class="acceptance__email">{{ props.accountEmail }}</strong>, but this
						claim was approved for a different email address. Sign out, then sign in with the account you
						used to request the claim.
					</MText>
					<div class="acceptance__actions">
						<MButton size="lg" @click="emit('sign-out')">
							<template #prefix>
								<MIcon name="light-sign-out" size="sm" />
							</template>
							Sign out and switch accounts
						</MButton>
					</div>
					<MText size="small" color="--text-muted" class="acceptance__fine">
						A claim can only be accepted by the account that requested it, so a listing can’t pass to the
						wrong person by mistake.
					</MText>
				</template>

				<template v-else-if="props.state === 'accepted'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						The listing is yours to manage. Here’s what to do next:
					</MText>
					<ol class="acceptance__next">
						<li v-for="(step, index) in next_steps" :key="step" class="acceptance__next-step">
							<span class="acceptance__next-number" aria-hidden="true">{{ index + 1 }}</span>
							<span>{{ step }}</span>
						</li>
					</ol>
					<div class="acceptance__actions">
						<MButton size="lg" to="/dashboard">
							Go to your dashboard
							<template #suffix>
								<MIcon name="light-long-arrow-right" size="sm" />
							</template>
						</MButton>
					</div>
				</template>

				<template v-else>
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						It may have expired, already been used, or been replaced by a newer link. If you asked for a new
						one, use the link in your most recent email.
					</MText>
					<div class="acceptance__actions">
						<MButton size="lg" to="/contact">Ask our team to reissue it</MButton>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MIconName } from '~/types/base/ui'
import type { CompanyRef } from '~/types/features/directory'
import type { TokenState } from '~/types/features/onboarding'

interface Props {
	state: TokenState
	// named only once acceptance succeeds; a token has no read endpoint
	company: CompanyRef
	// the signed-in account, masked
	accountEmail: string
	// the path to come back to after signing in
	returnTo: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'accept' | 'sign-out'): void
}>()

interface Screen {
	title: string
	icon: MIconName
	tone: 'brand' | 'success' | 'warning' | 'danger'
}

const screens = computed<Record<TokenState, Screen>>(() => ({
	'signed-out': { title: 'Sign in to accept your claim', icon: 'light-sign-in', tone: 'brand' },
	'ready': { title: 'Accept ownership of your listing', icon: 'light-shield', tone: 'brand' },
	'wrong-account': { title: 'This claim belongs to a different account', icon: 'light-user-circle', tone: 'warning' },
	'accepted': { title: `You now own ${props.company.name}`, icon: 'light-check-circle', tone: 'success' },
	'invalid': { title: 'This claim link can’t be used', icon: 'light-exclamation-triangle', tone: 'danger' },
}))

const screen = computed(() => screens.value[props.state])

// What acceptance does and doesn't change (docs/API.md §7).
const effects = [
	{ applies: true, text: 'You become the listing’s owner, with its dashboard, inquiries and team settings.' },
	{ applies: true, text: 'Any other open claims for the listing are closed.' },
	{ applies: false, text: 'The listing isn’t published or verified — those stay separate BPO Profile reviews.' },
]

const next_steps = [
	'Complete the profile: services, locations, and the inbox where inquiries should arrive.',
	'Invite your sales team, so each person can look after their own profile.',
	'Submit the listing for review. Publication and the Verified company badge are separate reviews — claiming changes neither.',
]

const sign_in_link = computed<RouteLocationRaw>(() => ({ path: '/login', query: { redirect: props.returnTo } }))
const register_link = computed<RouteLocationRaw>(() => ({
	path: '/register',
	query: { type: 'account', redirect: props.returnTo },
}))

const heading_ref = ref<ComponentPublicInstance | null>(null)

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

// Each state rewrites the screen; start again at its heading.
watch(() => props.state, async () => {
	await nextTick()
	focusHeading()
})
</script>

<style lang="scss" scoped>
.acceptance {
	background: var(--canvas);

	&__con {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: 720px;
		padding: 96px 0 112px;
	}

	&__mark {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: var(--radius-md);
		background: var(--brand-soft);
		color: var(--brand-deep);

		&--success {
			background: var(--success-soft);
			color: var(--success);
		}

		&--warning {
			background: var(--warning-soft);
			color: var(--warning);
		}

		&--danger {
			background: var(--danger-soft);
			color: var(--danger);
		}
	}

	&__title {
		padding-top: 24px;

		&:focus {
			outline: none;
		}
	}

	&__lede {
		padding-top: 16px;
	}

	&__email {
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	&__account {
		display: flex;
		gap: 10px;
		margin-top: 24px;
		font-family: var(--font-ui);
	}

	&__account-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	&__effects {
		width: 100%;
		margin-top: 24px;
		padding: 20px 24px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__effects-title {
		font-family: var(--font-ui);
	}

	&__effect-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 12px;
	}

	&__effect {
		display: flex;
		gap: 10px;
		font-size: 16px;
		line-height: 24px;
		color: var(--text-secondary);
	}

	&__effect-icon {
		flex: 0 0 auto;
		margin-top: 4px;
	}

	&__next {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 24px;
		border-top: var(--rule);
	}

	&__next-step {
		display: flex;
		gap: 14px;
		padding: 14px 0;
		border-bottom: var(--rule);
		font-size: 16px;
		line-height: 24px;
		color: var(--text-secondary);
	}

	&__next-number {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border-strong);
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		padding-top: 32px;
	}

	&__fine {
		max-width: 560px;
		padding-top: 20px;
	}
}

@media only screen and (max-width: 768px) {
	.acceptance {
		&__con {
			padding: 56px 0 72px;
		}

		&__effects {
			padding: 16px 18px;
		}

		// a long action label wraps rather than widening the page
		&__actions .m-button {
			white-space: normal;
		}
	}
}
</style>
