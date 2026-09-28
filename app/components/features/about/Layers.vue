<template>
	<div class="layers">
		<div class="wrapper">
			<div class="layers__con">
				<div class="layers__head">
					<MHeading variant="2" size="3">{{ discoveryLayers.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="layers__statement">
						{{ discoveryLayers.statement }}
					</MText>
				</div>

				<div class="layers__items">
					<div v-for="(layer, index) in discoveryLayers.items" :key="layer.title" class="layers__item">
						<div class="layers__top">
							<span class="layers__index">Layer {{ index + 1 }}</span>
							<MIcon :name="layer.icon" size="xl" class="layers__icon" />
						</div>
						<MHeading variant="3" size="4" weight="semi-bold">{{ layer.title }}</MHeading>
						<MText weight="medium" color="--text-primary" class="layers__lede">{{ layer.lede }}</MText>
						<MText color="--text-secondary" class="layers__text">{{ layer.text }}</MText>
						<MButton :to="layer.link.to" variant="text" class="layers__link">
							{{ layer.link.label }}
							<template #suffix>
								<MIcon name="light-arrow-right" size="xs" />
							</template>
						</MButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { discoveryLayers } from '~/data/features/about'
</script>

<style lang="scss" scoped>
.layers {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 72px;
		padding: 112px 0;
	}

	&__statement {
		padding-top: 16px;
	}

	&__items {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 48px;
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		padding-top: 24px;
		border-top: 2px solid var(--text-primary);
	}

	&__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		align-self: stretch;
		padding-bottom: 24px;
	}

	&__index {
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__icon {
		color: var(--brand);
	}

	&__lede {
		font-family: var(--font-display);
	}

	&__text {
		padding-top: 4px;
	}

	&__link {
		margin-top: 12px;
	}
}

@media only screen and (max-width: 1024px) {
	.layers {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 80px 0;
		}
	}
}

@media only screen and (max-width: 600px) {
	.layers {
		&__con {
			padding: 64px 0;
		}

		&__items {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
	}
}
</style>
