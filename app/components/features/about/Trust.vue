<template>
	<div id="trust" class="trust">
		<div class="wrapper">
			<div class="trust__con">
				<div class="trust__intro">
					<MHeading variant="2" size="3">{{ trustIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="trust__text">{{ trustIntro.text }}</MText>
					<MText color="--text-primary" class="trust__bought">
						<MIcon name="light-shield" size="sm" class="trust__bought-icon" />
						<span>{{ trustIntro.bought }}</span>
					</MText>
				</div>

				<!-- each badge beside what it checks, and what it doesn't -->
				<dl class="trust__list">
					<div v-for="badge in trustBadges" :key="badge.key" class="trust__row">
						<dt class="trust__term">
							<MBadge :tone="badge.tone" :icon="badge.icon">{{ badge.label }}</MBadge>
							<span class="trust__applies">{{ badge.applies_to }}</span>
						</dt>
						<dd class="trust__detail">
							<MText class="trust__line">
								<span class="trust__key">What it means</span>
								{{ badge.means }}
							</MText>
							<MText color="--text-secondary" class="trust__line">
								<span class="trust__key">What it doesn’t mean</span>
								{{ badge.does_not_mean }}
							</MText>
						</dd>
					</div>

					<!-- Featured placements are Phase 2 (docs/PLAN.md §4.6) -->
					<div class="trust__row trust__row--upcoming">
						<dt class="trust__term">
							<MBadge :tone="featuredBadge.tone" :icon="featuredBadge.icon" variant="outline">
								{{ featuredBadge.label }}
							</MBadge>
							<span class="trust__applies trust__applies--status">
								<MIcon name="light-alarm-clock" size="xs" />
								{{ featuredBadge.status }}
							</span>
						</dt>
						<dd class="trust__detail">
							<MText class="trust__line">{{ featuredBadge.means }}</MText>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { featuredBadge, trustBadges, trustIntro } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.trust {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		align-items: start;
		gap: 80px;
		padding: 112px 0;
	}

	&__intro {
		position: sticky;
		top: calc(var(--header-height) + 32px);
	}

	&__text {
		padding-top: 16px;
	}

	&__bought {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		margin-top: 24px;
		padding-top: 20px;
		border-top: var(--rule);
	}

	&__bought-icon {
		margin-top: 4px;
		color: var(--brand);
	}

	&__list {
		border-top: var(--rule);
	}

	&__row {
		display: grid;
		grid-template-columns: minmax(0, 200px) minmax(0, 1fr);
		gap: 32px;
		padding: 28px 0;
		border-bottom: var(--rule);

		&--upcoming {
			border-bottom-style: dashed;
		}
	}

	&__term {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	&__applies {
		font-family: var(--font-ui);
		font-size: 13px;
		line-height: 18px;
		color: var(--text-muted);

		&--status {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			font-weight: 600;
			color: var(--warning);
		}
	}

	&__detail {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	&__key {
		display: block;
		padding-bottom: 2px;
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		line-height: 18px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 1024px) {
	.trust {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 80px 0;
		}

		&__intro {
			position: static;
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.trust {
		&__con {
			padding: 64px 0;
		}

		&__row {
			grid-template-columns: minmax(0, 1fr);
			gap: 16px;
			padding: 24px 0;
		}
	}
}
</style>
