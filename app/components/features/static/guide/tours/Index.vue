<template>
	<section id="tours" class="tours" aria-labelledby="tours-title">
		<div class="wrapper">
			<div class="tours__con">
				<div class="tours__head">
					<div class="tours__intro">
						<MHeading id="tours-title" variant="2" size="3">{{ toursIntro.title }}</MHeading>
						<MText size="large" color="--text-secondary" class="tours__text">{{ toursIntro.text }}</MText>
					</div>

					<nav class="tours__index" aria-label="Tours">
						<a v-for="(tour, index) in guideTours" :key="tour.id" :href="`#${tour.id}`" class="tours__jump">
							<span class="tours__jump-num">{{ index + 1 }}</span>
							<span class="tours__jump-text">
								<span class="tours__jump-role">{{ tour.role }}</span>
								<span class="tours__jump-title">{{ tour.title }}</span>
							</span>
						</a>
					</nav>
				</div>

				<div class="tours__grid">
					<article
						v-for="(tour, index) in guideTours"
						:id="tour.id"
						:key="tour.id"
						class="tours__tour"
						:aria-labelledby="`${tour.id}-title`"
					>
						<span class="tours__label">
							Tour {{ index + 1 }} · {{ tour.role }} · {{ pluralize(tour.stops.length, 'stop') }}
						</span>
						<MHeading :id="`${tour.id}-title`" variant="3" size="4" weight="semi-bold">{{ tour.title }}</MHeading>
						<MText color="--text-secondary" class="tours__summary">{{ tour.text }}</MText>
						<Stops :stops="tour.stops" />
					</article>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { guideTours, toursIntro } from '~/data/features/guide'
import { pluralize } from '~/utils/format'
import Stops from './Stops.vue'
</script>

<style lang="scss" scoped>
.tours {
	&__con {
		padding: 96px 0 112px;
	}

	&__head {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		align-items: end;
		gap: 64px;
		padding-bottom: 56px;
	}

	&__text {
		padding-top: 16px;
	}

	// --- Jump to a tour ---------------------------------------------
	&__index {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px 24px;
	}

	&__jump {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 0;
		border-top: var(--rule);

		&:hover .tours__jump-title {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	// display-size numerals may use --brand (large text, 3:1+)
	&__jump-num {
		flex: 0 0 auto;
		min-width: 24px;
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 600;
		line-height: 1;
		color: var(--brand);
	}

	&__jump-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-family: var(--font-ui);
	}

	&__jump-role {
		font-size: 12px;
		line-height: 16px;
		color: var(--text-muted);
	}

	&__jump-title {
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
		color: var(--text-primary);
	}

	// --- Tours --------------------------------------------------------
	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 72px 64px;
	}

	&__tour {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding-top: 24px;
		border-top: 2px solid var(--text-primary);
	}

	&__label {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__summary {
		padding-bottom: 12px;
	}
}

@media only screen and (max-width: 1024px) {
	.tours {
		&__con {
			padding: 80px 0 96px;
		}

		&__head {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
			padding-bottom: 48px;
		}

		&__intro {
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 768px) {
	.tours {
		&__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 56px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.tours {
		&__con {
			padding: 64px 0 72px;
		}

		&__index {
			grid-template-columns: minmax(0, 1fr);
			gap: 0;
		}
	}
}
</style>
