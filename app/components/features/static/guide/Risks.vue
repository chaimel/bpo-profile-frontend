<template>
	<section id="risks" class="risks" aria-labelledby="risks-title">
		<div class="wrapper">
			<div class="risks__con">
				<div class="risks__intro">
					<MHeading id="risks-title" variant="2" size="3">{{ risksIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="risks__text">{{ risksIntro.text }}</MText>
				</div>

				<!-- each risk beside the rule that guards against it -->
				<dl class="risks__list">
					<div v-for="item in risks" :key="item.risk" class="risks__row">
						<dt class="risks__risk">
							<MIcon name="light-exclamation-triangle" size="sm" class="risks__risk-icon" />
							<span>{{ item.risk }}</span>
						</dt>
						<dd class="risks__detail">
							<span class="risks__key">The safeguard</span>
							<MText color="--text-primary">{{ item.safeguard }}</MText>
							<MButton :to="item.link.to" variant="text" size="sm" class="risks__link">
								{{ item.link.label }}
								<template #suffix>
									<MIcon name="light-arrow-right" size="xs" />
								</template>
							</MButton>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { risks, risksIntro } from '~/data/features/guide'
</script>

<style lang="scss" scoped>
.risks {
	background: var(--canvas);

	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		align-items: start;
		gap: 80px;
		padding: 96px 0 112px;
	}

	&__intro {
		position: sticky;
		top: calc(var(--header-height) + 32px);
	}

	&__text {
		padding-top: 16px;
	}

	&__list {
		border-top: var(--rule);
	}

	&__row {
		display: grid;
		grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
		gap: 32px;
		padding: 24px 0;
		border-bottom: var(--rule);
	}

	&__risk {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);
	}

	&__risk-icon {
		flex: 0 0 auto;
		margin-top: 4px;
		color: var(--warning);
	}

	&__detail {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}

	&__key {
		font-family: var(--font-ui);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	&__link {
		margin-top: 6px;
	}
}

@media only screen and (max-width: 1024px) {
	.risks {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
			padding: 80px 0 96px;
		}

		&__intro {
			position: static;
			max-width: 640px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.risks {
		&__con {
			padding: 64px 0 72px;
		}

		&__row {
			grid-template-columns: minmax(0, 1fr);
			gap: 12px;
			padding: 20px 0;
		}
	}
}
</style>
