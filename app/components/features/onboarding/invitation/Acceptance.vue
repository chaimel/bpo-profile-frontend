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
						Sign in with the email address your invitation was sent to. New to BPO Profile? Create an account
						with that address — your company has already set up your sales profile, so you won’t start a new one.
					</MText>
					<div class="acceptance__actions">
						<MButton size="lg" :to="sign_in_link">Sign in to continue</MButton>
						<MButton size="lg" variant="neutral" :to="register_link">Create an account</MButton>
					</div>
					<MText size="small" color="--text-muted" class="acceptance__fine">
						Opening this link doesn’t change anything on its own. Nothing is linked until the invited account
						accepts.
					</MText>
				</template>

				<template v-else-if="props.state === 'ready'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						Your company has set up a sales profile for you on BPO Profile. Accept to link it to your account
						and look after it yourself.
					</MText>

					<MText size="small" color="--text-secondary" class="acceptance__account">
						<MIcon name="light-user-circle" size="sm" color="text-muted" class="acceptance__account-icon" />
						<span>
							Signed in as <strong class="acceptance__email">{{ props.accountEmail }}</strong> — the address
							this invitation was sent to.
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
						<MButton size="lg" @click="emit('accept')">Accept invitation</MButton>
					</div>
					<MText size="small" color="--text-muted" class="acceptance__fine">
						Opening this link didn’t change anything. Only the verified account the invitation was sent to can
						accept it, and nothing happens until you do.
					</MText>
				</template>

				<template v-else-if="props.state === 'wrong-account'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						You’re signed in as <strong class="acceptance__email">{{ props.accountEmail }}</strong>, but this
						invitation was sent to a different email address. Sign out, then sign in with the invited address —
						or create an account with it.
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
						An invitation only links a profile to the address it was sent to, so a profile can’t end up with
						the wrong person.
					</MText>
				</template>

				<template v-else-if="props.state === 'accepted'">
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						Your account is now linked to the profile your company created:
					</MText>

					<div class="acceptance__profile">
						<MAvatar :name="profile_name" size="lg" decorative />
						<div class="acceptance__profile-text">
							<MText size="large" weight="semi-bold" class="acceptance__profile-name">{{ profile_name }}</MText>
							<MText size="small" color="--text-secondary" class="acceptance__profile-role">{{ props.profile.job_title }} · {{ props.company.name }}</MText>
						</div>
					</div>

					<MText color="--text-secondary" class="acceptance__note">
						Its publication status hasn’t changed. When your profile is ready, submit it for review from your
						dashboard — BPO Profile publishes it after that review.
					</MText>

					<div class="acceptance__actions">
						<MButton size="lg" to="/dashboard/profile">
							Open your profile
							<template #suffix>
								<MIcon name="light-long-arrow-right" size="sm" />
							</template>
						</MButton>
					</div>
				</template>

				<template v-else>
					<MText size="xlarge" color="--text-secondary" class="acceptance__lede">
						It may have expired, already been used, or been replaced by a newer invitation. Ask your company’s
						admin to send you a new one — if you’re not sure who that is, our team can help.
					</MText>
					<div class="acceptance__actions">
						<MButton size="lg" to="/contact">Contact our team</MButton>
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
import type { CompanyRef, ProfessionalCard } from '~/types/features/directory'
import type { TokenState } from '~/types/features/onboarding'
import { fullName } from '~/utils/format'

interface Props {
	state: TokenState
	// named only once acceptance succeeds; a token has no read endpoint
	company: CompanyRef
	// the roster profile the invitation is bound to
	profile: Pick<ProfessionalCard, 'first_name' | 'last_name' | 'job_title'>
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
	'signed-out': { title: 'Sign in to accept your invitation', icon: 'light-sign-in', tone: 'brand' },
	'ready': { title: 'Accept your team invitation', icon: 'light-user-friends', tone: 'brand' },
	'wrong-account': { title: 'This invitation is for a different account', icon: 'light-user-circle', tone: 'warning' },
	'accepted': {
		title: `You’re now managing your sales profile at ${props.company.name}`,
		icon: 'light-check-circle',
		tone: 'success',
	},
	'invalid': { title: 'This invitation link can’t be used', icon: 'light-exclamation-triangle', tone: 'danger' },
}))

const screen = computed(() => screens.value[props.state])
const profile_name = computed(() => fullName(props.profile))

// What acceptance does and doesn't change (docs/API.md §5 "Team affiliation and invitations").
const effects = [
	{ applies: true, text: 'Your account is linked to the sales profile your company created, so you can edit it and see the inquiries sent to you.' },
	{ applies: false, text: 'No second profile is created — you take over the existing one.' },
	{ applies: false, text: 'You don’t get company admin rights. Your company’s owners and admins still manage its listing and team.' },
	{ applies: false, text: 'Your profile isn’t published. Publication stays a separate BPO Profile review.' },
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

	&__profile {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		margin-top: 24px;
		padding: 20px 24px;
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__profile-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__profile-name {
		font-family: var(--font-display);
	}

	&__profile-role {
		font-family: var(--font-ui);
	}

	&__note {
		max-width: 600px;
		padding-top: 20px;
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

		&__effects,
		&__profile {
			padding: 16px 18px;
		}

		// a long action label wraps rather than widening the page
		&__actions .m-button {
			white-space: normal;
		}
	}
}
</style>
