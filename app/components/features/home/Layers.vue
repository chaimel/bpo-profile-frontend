<template>
	<div class="layers">
		<div class="wrapper">
			<div class="layers__con">
				<MText size="small" weight="semi-bold" color="--brand-strong" class="layers__kicker">Why BPO Profile</MText>
				<MHeading variant="2" size="1" class="layers__statement">{{ layers.statement }}</MHeading>

				<div class="layers__grid">
					<section v-for="layer in columns" :key="layer.title" class="layers__layer" :aria-labelledby="`layer-${layer.key}`">
						<span class="layers__icon">
							<MIcon :name="layer.icon" size="lg" />
						</span>
						<MHeading :id="`layer-${layer.key}`" variant="3" size="4">{{ layer.title }}</MHeading>
						<MText size="large" color="--text-secondary" class="layers__lede">{{ layer.lede }}</MText>
						<ul class="layers__points">
							<li v-for="point in layer.points" :key="point">
								<MIcon name="light-check" size="sm" />
								{{ point }}
							</li>
						</ul>
						<MButton :to="layer.to" variant="outline" class="layers__cta">{{ layer.cta }}</MButton>
					</section>
				</div>

				<ul class="layers__pillars">
					<li v-for="pillar in pillars" :key="pillar.title" class="layers__pillar">
						<MIcon :name="pillar.icon" size="sm" />
						<span><strong>{{ pillar.title }}.</strong> {{ pillar.text }}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { layers, pillars } from '~/data/features/home'
import type { MIconName } from '~/types/base/ui'

const columns: {
	key: string
	icon: MIconName
	title: string
	lede: string
	points: string[]
	to: string
	cta: string
}[] = [
	{ key: 'company', icon: 'light-building', ...layers.company, to: '/companies', cta: 'Explore BPO Profiles' },
	{ key: 'people', icon: 'light-user-friends', ...layers.people, to: '/professionals', cta: 'Meet the Sales Pros' },
]
</script>

<style lang="scss" scoped>
.layers {
	// the locations list above already ends on a rule
	&__con {
		padding: 96px 0;
	}

	&__kicker {
		font-family: var(--font-ui);
	}

	&__statement {
		max-width: 900px;
		padding-top: 12px;
		font-weight: 600;
	}

	&__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding-top: 56px;
	}

	&__layer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 8px 48px 8px 0;

		& + & {
			padding: 8px 0 8px 48px;
			border-left: var(--rule);
		}
	}

	&__icon {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		margin-bottom: 8px;
		border-radius: var(--radius-md);
		background: var(--brand-soft);
		color: var(--brand-deep);
	}

	&__points {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 12px 0 8px;

		li {
			display: flex;
			align-items: flex-start;
			gap: 10px;
			font-size: 16px;
			line-height: 24px;
		}

		.m-icon {
			margin-top: 4px;
			color: var(--success);
		}
	}

	&__cta {
		margin-top: 8px;
	}

	&__pillars {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
		margin-top: 64px;
		padding-top: 28px;
		border-top: var(--rule);
	}

	&__pillar {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);

		strong {
			font-weight: 700;
			color: var(--text-primary);
		}

		.m-icon {
			margin-top: 3px;
			color: var(--brand);
		}
	}
}

@media only screen and (max-width: 1024px) {
	.layers {
		&__con {
			padding: 64px 0;
		}

		&__grid {
			grid-template-columns: 1fr;
			gap: 40px;
			padding-top: 40px;
		}

		&__layer,
		&__layer + &__layer {
			padding: 0;
			border-left: 0;
		}

		&__pillars {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
}

@media only screen and (max-width: 600px) {
	.layers__pillars {
		grid-template-columns: 1fr;
	}
}
</style>
