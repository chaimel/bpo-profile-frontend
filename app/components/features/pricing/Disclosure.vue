<template>
	<div class="disclosure">
		<div class="wrapper">
			<div class="disclosure__con">
				<div class="disclosure__text">
					<MIcon name="light-balance-scale" size="xl" class="disclosure__mark" />
					<MHeading variant="2" size="3" color="white">{{ rankingDisclosure.title }}</MHeading>
					<MText size="large" color="--on-dark-muted" class="disclosure__lede">{{ rankingDisclosure.text }}</MText>
					<MText color="--on-dark-muted" class="disclosure__status">
						<MIcon name="light-info-circle" size="sm" class="disclosure__status-icon" />
						<span>{{ rankingDisclosure.status }}</span>
					</MText>
					<NuxtLink to="/about#ranking" class="disclosure__link">
						How results are ranked
						<MIcon name="light-arrow-right" size="xs" />
					</NuxtLink>
				</div>

				<ol class="disclosure__order" aria-label="The order every search follows">
					<li
						v-for="(priority, index) in rankingPriorities"
						:key="priority.title"
						:class="['disclosure__step', { 'disclosure__step--tie-breaker': priority.tie_breaker }]"
					>
						<span class="disclosure__num">{{ index + 1 }}</span>
						<span class="disclosure__label">{{ priority.title }}</span>
						<span v-if="priority.tie_breaker" class="disclosure__tag">Tie-breaker only</span>
					</li>
				</ol>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { rankingPriorities } from '~/data/features/about'
import { rankingDisclosure } from '~/data/features/pricing'
</script>

<style lang="scss" scoped>
.disclosure {
	background: var(--slate);
	color: var(--white);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		align-items: start;
		gap: 80px;
		padding: 96px 0;
	}

	&__text {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	&__mark {
		margin-bottom: 8px;
		color: var(--on-dark-muted);
	}

	&__lede {
		max-width: 540px;
	}

	&__status {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		max-width: 540px;
		padding-top: 16px;
		border-top: 1px solid var(--on-dark-rule);
	}

	&__status-icon {
		margin-top: 4px;
	}

	&__link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding-top: 8px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--white);
		text-decoration: underline;
		text-underline-offset: 3px;

		&:hover {
			color: var(--on-dark-muted);
		}

		&:focus-visible {
			outline-color: var(--white);
		}
	}

	// --- The ranking ladder ---------------------------------------
	&__order {
		display: flex;
		flex-direction: column;
		list-style: none;
		border-top: 1px solid var(--on-dark-rule);
	}

	&__step {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 16px 0;
		border-bottom: 1px solid var(--on-dark-rule);

		&--tie-breaker {
			margin-top: 20px;
			border-top: 1px dashed var(--on-dark-subtle);
			border-bottom: 1px dashed var(--on-dark-subtle);

			.disclosure__num {
				background: transparent;
				box-shadow: inset 0 0 0 1px var(--on-dark-subtle);
				color: var(--on-dark-muted);
			}

			.disclosure__label {
				color: var(--on-dark-muted);
			}
		}
	}

	&__num {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--on-dark-hover);
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		color: var(--white);
		flex: 0 0 auto;
	}

	&__label {
		flex: 1 1 auto;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 500;
		line-height: 26px;
		color: var(--white);
	}

	&__tag {
		padding: 4px 8px;
		border-radius: var(--radius-xs);
		box-shadow: inset 0 0 0 1px var(--on-dark-subtle);
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		line-height: 16px;
		color: var(--on-dark-muted);
		white-space: nowrap;
	}
}

@media only screen and (max-width: 1024px) {
	.disclosure {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 48px;
			padding: 72px 0;
		}
	}
}

@media only screen and (max-width: 600px) {
	.disclosure {
		&__con {
			padding: 56px 0;
		}

		&__step {
			gap: 14px;
		}

		&__label {
			font-size: 16px;
			line-height: 24px;
		}
	}
}
</style>
