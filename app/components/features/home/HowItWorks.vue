<template>
	<div class="how-it-works">
		<div class="wrapper">
			<div class="how-it-works__con">
				<div class="how-it-works__head">
					<MHeading variant="2" color="--white">How it works</MHeading>
					<MText size="large" color="--on-dark-muted" class="how-it-works__lede">
						Discover the company. Meet the people. Start the conversation.
					</MText>
				</div>

				<ol class="how-it-works__steps">
					<li v-for="(step, index) in steps" :key="step.title" class="how-it-works__step">
						<span class="how-it-works__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
						<MHeading variant="3" size="4" color="--white" class="how-it-works__title">{{ step.title }}</MHeading>
						<MText color="--on-dark-muted" class="how-it-works__text">{{ step.text }}</MText>
					</li>
				</ol>

				<div class="how-it-works__foot">
					<MText color="--on-dark-muted" class="how-it-works__note">
						<MIcon name="light-shield" size="sm" />
						No account needed. Your inquiry goes straight to the company or the person you chose.
					</MText>
					<MButton variant="inverse" size="lg" to="/find">
						Start Your Search
						<template #suffix>
							<MIcon name="light-long-arrow-right" size="sm" />
						</template>
					</MButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { steps } from '~/data/features/home'
</script>

<style lang="scss" scoped>
.how-it-works {
	background: var(--slate);
	color: var(--white);

	&__con {
		padding: 88px 0;
	}

	&__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px 32px;
	}

	&__lede {
		font-family: var(--font-display);
	}

	// Four steps on one line, joined by a rule.
	&__steps {
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 32px;
		margin-top: 56px;
		list-style: none;

		&::before {
			content: '';
			position: absolute;
			top: 20px;
			left: 0;
			right: 0;
			height: 1px;
			background: var(--on-dark-rule);
		}
	}

	&__step {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	&__number {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		margin-bottom: 12px;
		border-radius: 50%;
		background: var(--brand);
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		color: var(--white);
	}

	&__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 20px 32px;
		margin-top: 56px;
		padding-top: 32px;
		border-top: 1px solid var(--on-dark-rule);
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		max-width: 560px;

		.m-icon {
			margin-top: 4px;
			color: var(--white);
		}
	}
}

@media only screen and (max-width: 1024px) {
	.how-it-works {
		&__con {
			padding: 64px 0;
		}

		&__steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));

			&::before {
				display: none;
			}
		}
	}
}

@media only screen and (max-width: 560px) {
	.how-it-works__steps {
		grid-template-columns: 1fr;
	}
}
</style>
