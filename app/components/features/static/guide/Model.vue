<template>
	<section id="model" class="model" aria-labelledby="model-title">
		<div class="wrapper">
			<div class="model__con">
				<div class="model__intro">
					<MHeading id="model-title" variant="2" size="3">{{ modelIntro.title }}</MHeading>
					<MText size="large" color="--text-secondary" class="model__text">{{ modelIntro.text }}</MText>
					<MText size="small" color="--text-muted" class="model__note">
						<MIcon name="light-alarm-clock" size="sm" class="model__note-icon" />
						<span>{{ modelIntro.note }}</span>
					</MText>
					<MButton to="/pricing" variant="text" class="model__link">
						Compare the plans
						<template #suffix>
							<MIcon name="light-arrow-right" size="xs" />
						</template>
					</MButton>
				</div>

				<div class="model__body">
					<!-- the pricing page's own plans, so the two never disagree -->
					<ol class="model__plans">
						<li
							v-for="plan in planPresentations"
							:key="plan.slug"
							:class="['model__plan', { 'model__plan--free': plan.highlighted }]"
						>
							<MHeading variant="3" size="4" weight="semi-bold">{{ plan.name }}</MHeading>
							<span class="model__price">{{ plan.price_label }}</span>
							<MText size="small" color="--text-secondary">{{ plan.summary }}</MText>
						</li>
					</ol>

					<div class="model__rules">
						<MHeading variant="3" size="5" weight="semi-bold">{{ modelIntro.rules_title }}</MHeading>
						<ul class="model__rule-list">
							<li v-for="rule in modelRules" :key="rule.title" class="model__rule">
								<MIcon :name="rule.icon" size="md" class="model__rule-icon" />
								<span class="model__rule-title">{{ rule.title }}</span>
								<MText size="small" color="--text-secondary">{{ rule.text }}</MText>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { modelIntro, modelRules } from '~/data/features/guide'
import { planPresentations } from '~/data/features/pricing'
</script>

<style lang="scss" scoped>
.model {
	&__con {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		align-items: start;
		gap: 72px;
		padding: 96px 0;
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
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 3px;
	}

	&__link {
		margin-top: 16px;
	}

	// --- Plans ------------------------------------------------------
	&__plans {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 32px;
		list-style: none;
	}

	&__plan {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 20px;
		border-top: 2px solid var(--border-strong);

		&--free {
			border-top-color: var(--brand);
		}
	}

	&__price {
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--brand-strong);
	}

	// --- What money can't buy -----------------------------------------
	&__rules {
		margin-top: 48px;
		padding: 28px;
		border-radius: var(--radius-md);
		background: var(--canvas);
	}

	&__rule-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px;
		padding-top: 20px;
		list-style: none;
	}

	&__rule {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__rule-icon {
		margin-bottom: 4px;
		color: var(--brand);
	}

	&__rule-title {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: var(--text-primary);
	}
}

@media only screen and (max-width: 1024px) {
	.model {
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
	.model {
		&__plans,
		&__rule-list {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}

@media only screen and (max-width: 600px) {
	.model {
		&__con {
			padding: 64px 0;
		}

		&__rules {
			padding: 20px;
		}
	}
}
</style>
