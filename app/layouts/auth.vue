<template>
	<div class="auth">
		<a href="#main-content" class="skip-link">Skip to content</a>

		<aside class="auth__panel">
			<div class="auth__panel-con">
				<Logo inverse />

				<div class="auth__pitch">
					<MText weight="semi-bold" class="auth__message">{{ masterMessage }}</MText>
					<ul class="auth__points">
						<li v-for="point in points" :key="point.title" class="auth__point">
							<span class="auth__point-icon">
								<MIcon :name="point.icon" size="sm" />
							</span>
							<span>
								<strong>{{ point.title }}</strong>
								{{ point.text }}
							</span>
						</li>
					</ul>
				</div>

				<MText size="small" color="--on-dark-subtle" class="auth__fine">
					Buyers never need an account. Accounts are for BPO companies and their sales professionals.
				</MText>
			</div>
		</aside>

		<div class="auth__main">
			<div class="auth__top">
				<Logo class="auth__mobile-logo" size="sm" />
				<NuxtLink to="/" class="auth__back">
					<MIcon name="light-angle-left" size="xs" />
					Back to BPO Profile
				</NuxtLink>
			</div>

			<main id="main-content" class="auth__content" tabindex="-1">
				<slot />
			</main>

			<MText size="xsmall" color="--text-muted" class="auth__legal">
				<NuxtLink to="/terms">Terms</NuxtLink>
				<span aria-hidden="true">·</span>
				<NuxtLink to="/privacy">Privacy</NuxtLink>
				<span aria-hidden="true">·</span>
				<NuxtLink to="/contact">Help</NuxtLink>
			</MText>
		</div>
	</div>
</template>

<script setup lang="ts">
import Logo from '@/components/layout/Logo.vue'
import { masterMessage } from '~/data/features/site'
import type { MIconName } from '~/types/base/ui'

const points: { icon: MIconName, title: string, text: string }[] = [
	{ icon: 'light-building', title: 'Get discovered.', text: 'Put your company in front of businesses looking for outsourcing partners.' },
	{ icon: 'light-user-friends', title: 'Show your people.', text: 'Give every sales professional a profile buyers can find and contact.' },
	{ icon: 'light-envelope', title: 'Receive inquiries.', text: 'Contact, question and quote requests arrive in your dashboard.' },
]
</script>

<style lang="scss" scoped>
.auth {
	display: grid;
	grid-template-columns: minmax(360px, 5fr) 7fr;
	min-height: 100vh;
	background: var(--white);

	// --- Brand panel ------------------------------------------
	&__panel {
		position: sticky;
		top: 0;
		height: 100vh;
		background: var(--slate);
		color: var(--white);
	}

	&__panel-con {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 48px;
		height: 100%;
		padding: 40px 48px;
	}

	&__pitch {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	// a display statement, larger than the text scale goes
	&__message {
		max-width: 420px;
		font-family: var(--font-display);
		font-size: 32px;
		line-height: 40px;
		letter-spacing: -0.015em;
	}

	&__points {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 420px;
	}

	&__point {
		display: flex;
		gap: 14px;
		font-size: 16px;
		line-height: 24px;
		color: var(--on-dark-muted);

		strong {
			font-weight: 700;
			color: var(--white);
		}
	}

	&__point-icon {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		background: var(--on-dark-hover);
		color: var(--white);
	}

	&__fine {
		max-width: 420px;
	}

	// --- Form side --------------------------------------------
	&__main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 24px 48px;
	}

	&__top {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 16px;
	}

	&__mobile-logo {
		display: none;
	}

	&__back {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);

		&:hover {
			color: var(--brand-strong);
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 0 auto;
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
		padding: 48px 0;

		&:focus {
			outline: none;
		}
	}

	&__legal {
		display: flex;
		justify-content: center;
		gap: 8px;
		font-family: var(--font-ui);

		a:hover {
			color: var(--brand-strong);
			text-decoration: underline;
		}
	}
}

@media only screen and (max-width: 1024px) {
	.auth {
		grid-template-columns: minmax(0, 1fr);

		&__panel {
			display: none;
		}

		&__main {
			padding: 16px;
		}

		&__top {
			justify-content: space-between;
		}

		&__mobile-logo {
			display: inline-flex;
		}

		&__content {
			padding: 32px 0;
		}
	}
}
</style>
