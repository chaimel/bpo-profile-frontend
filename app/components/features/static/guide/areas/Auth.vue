<template>
	<Frame path="/login" class="auth">
		<div class="auth__split">
			<div class="auth__panel">
				<Logo inverse size="sm" />
				<span class="auth__message">{{ masterMessage }}</span>
			</div>

			<div class="auth__main">
				<span class="auth__label">From Get Listed to the dashboard</span>
				<ol class="auth__flow">
					<li v-for="(step, index) in joinFlow" :key="step.to" class="auth__step">
						<span class="auth__num" aria-hidden="true">{{ index + 1 }}</span>
						<NuxtLink :to="step.to" class="auth__link">{{ step.label }}</NuxtLink>
					</li>
				</ol>
			</div>
		</div>
	</Frame>
</template>

<script setup lang="ts">
import Logo from '~/components/layout/Logo.vue'
import { joinFlow } from '~/data/features/guide'
import { masterMessage } from '~/data/features/site'
import Frame from './Frame.vue'
</script>

<style lang="scss" scoped>
.auth {
	&__split {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
		min-height: 300px;
	}

	// the sign-in layout's brand panel
	&__panel {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24px;
		padding: 20px;
		background: var(--slate);
	}

	&__message {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
		line-height: 24px;
		color: var(--white);
	}

	&__main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;
		padding: 24px;
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__flow {
		display: flex;
		flex-direction: column;
		gap: 12px;
		list-style: none;
	}

	&__step {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;

		// the line down to the next step
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 13px;
			top: 28px;
			height: 12px;
			width: 2px;
			background: var(--brand-soft);
		}
	}

	&__num {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--brand-soft);
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		color: var(--brand-deep);
	}

	&__link {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 500;
		color: var(--brand-strong);

		&:hover {
			color: var(--brand-deep);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.auth {
		&__split {
			grid-template-columns: minmax(0, 1fr);
			min-height: 0;
		}

		&__panel {
			padding: 14px 16px;
		}

		&__message {
			display: none;
		}
	}
}
</style>
