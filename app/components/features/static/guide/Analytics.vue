<template>
	<section id="analytics" class="analytics" aria-labelledby="analytics-title">
		<div class="wrapper">
			<div class="analytics__con">
				<div class="analytics__intro">
					<MHeading id="analytics-title" variant="2" size="3">{{ analyticsIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="analytics__text">{{ analyticsIntro.text }}</MText>
					<MText size="small" color="--text-secondary" class="analytics__note">
						<MIcon name="light-chart-increase" size="sm" class="analytics__note-icon" />
						<span>{{ analyticsIntro.plans }}</span>
					</MText>
					<MText size="small" color="--text-muted" class="analytics__note">
						<MIcon name="light-info-circle" size="sm" class="analytics__note-icon" />
						<span>{{ analyticsIntro.note }}</span>
					</MText>
				</div>

				<div class="analytics__body">
					<MHeading variant="3" size="5" weight="semi-bold">{{ analyticsIntro.metrics_title }}</MHeading>
					<dl class="analytics__metrics">
						<div v-for="metric in analyticsMetrics" :key="metric.title" class="analytics__metric">
							<dt class="analytics__metric-title">{{ metric.title }}</dt>
							<dd>
								<MText size="small" color="--text-secondary">{{ metric.text }}</MText>
							</dd>
						</div>
					</dl>

					<MHeading variant="3" size="5" weight="semi-bold" class="analytics__stops-title">{{ analyticsIntro.stops_title }}</MHeading>
					<ul class="analytics__stops">
						<li v-for="stop in analyticsStops" :key="stop.to">
							<NuxtLink :to="stop.to" class="analytics__stop">
								<span class="analytics__stop-title">
									{{ stop.title }}
									<MIcon name="light-arrow-right" size="xs" class="analytics__arrow" />
								</span>
								<MText variant="span" size="small" color="--text-secondary">{{ stop.text }}</MText>
							</NuxtLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { analyticsIntro, analyticsMetrics, analyticsStops } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
// Shares the white band with the model above it, so a rule opens it.
.analytics {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 72px;
		padding: 96px 0;
		border-top: var(--rule);
	}

	&__intro {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	&__text {
		padding-top: 16px;
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		margin-top: 20px;
		font-family: var(--font-ui);

		& + & {
			margin-top: 12px;
		}
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	// --- What's counted ---------------------------------------------
	&__metrics {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px 32px;
		padding-top: 20px;
	}

	&__metric {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 16px;
		border-top: var(--rule);
	}

	&__metric-title {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);
	}

	// --- See it in the demo -----------------------------------------
	&__stops-title {
		padding-top: 48px;
	}

	&__stops {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		padding-top: 20px;
		list-style: none;

		> li {
			display: flex;

			// an odd card out takes the whole row
			&:last-child:nth-child(odd) {
				grid-column: 1 / -1;
			}
		}
	}

	&__stop {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		padding: 14px 16px;
		border-radius: var(--radius-md);
		box-shadow: inset 0 0 0 1px var(--border);
		transition: box-shadow 0.15s ease;

		&:hover {
			box-shadow: inset 0 0 0 1px var(--brand);

			.analytics__stop-title,
			.analytics__arrow {
				color: var(--brand-strong);
			}
		}
	}

	&__stop-title {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		color: var(--text-primary);
		transition: color 0.15s ease;
	}

	&__arrow {
		color: var(--text-muted);
		transition: color 0.15s ease;
	}
}

@media only screen and (max-width: 1024px) {
	.analytics {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 80px 0;
		}

		&__intro {
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.analytics {
		&__metrics,
		&__stops {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}

@media only screen and (max-width: 600px) {
	.analytics {
		&__con {
			padding: 64px 0;
		}

		&__stops-title {
			padding-top: 40px;
		}
	}
}
</style>
