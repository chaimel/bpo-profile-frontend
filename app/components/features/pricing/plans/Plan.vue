<template>
	<div :class="['plan', { 'plan--highlighted': props.plan.highlighted }]">
		<div class="plan__head">
			<MHeading :id="title_id" variant="2" size="4" weight="semi-bold">{{ props.plan.name }}</MHeading>
			<MText weight="semi-bold" class="plan__price">{{ props.plan.price_label }}</MText>
			<MText size="xsmall" color="--text-muted" class="plan__note">{{ props.plan.price_note }}</MText>
		</div>

		<MText color="--text-secondary" class="plan__summary">{{ props.plan.summary }}</MText>

		<MButton
			:to="props.plan.cta_to"
			:variant="props.plan.highlighted ? 'primary' : 'outline'"
			size="lg"
			block
			class="plan__cta"
		>
			{{ props.plan.cta_label }}
			<span v-if="!props.plan.highlighted" class="sr-only">about the {{ props.plan.name }} plan</span>
		</MButton>

		<!-- grouped by when each benefit ships: a word and an icon, never color alone -->
		<div v-for="group in benefit_groups" :key="group.availability" class="plan__group">
			<MText :id="`${title_id}-${group.availability}`" size="xsmall" weight="semi-bold" color="--text-muted" class="plan__group-title">{{ group.label }}</MText>
			<ul class="plan__benefits" :aria-labelledby="`${title_id} ${title_id}-${group.availability}`">
				<li
					v-for="benefit in group.items"
					:key="benefit.label"
					:class="['plan__benefit', `plan__benefit--${group.availability}`]"
				>
					<MIcon :name="group.icon" size="sm" class="plan__benefit-icon" />
					<span>{{ benefit.label }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MIconName } from '~/types/base/ui'
import type { BenefitAvailability, PlanBenefit, PlanPresentation } from '~/types/features/content'

interface Props {
	plan: PlanPresentation
}

const props = defineProps<Props>()

interface BenefitGroup {
	availability: BenefitAvailability
	label: string
	icon: MIconName
	items: PlanBenefit[]
}

const availability_meta: Record<BenefitAvailability, { label: string, icon: MIconName }> = {
	now: { label: 'Available now', icon: 'light-check-circle' },
	later: { label: 'Coming later', icon: 'light-alarm-clock' },
}

const title_id = computed(() => `plan-${props.plan.slug}`)

const benefit_groups = computed<BenefitGroup[]>(() =>
	(['now', 'later'] as const)
		.map(availability => ({
			availability,
			...availability_meta[availability],
			items: props.plan.benefits.filter(benefit => benefit.availability === availability),
		}))
		.filter(group => group.items.length > 0),
)
</script>

<style lang="scss" scoped>
.plan {
	display: flex;
	flex-direction: column;
	min-width: 0;
	padding: 36px 32px 40px;

	// a rule between neighbouring plain plans on one row; the highlighted
	// one has a panel. The plans grid marks the first plan of each row.
	&:not(.plan--highlighted) + .plan:not(.plan--highlighted, .plan--row-start) {
		border-left: var(--rule);
	}

	&--highlighted {
		margin-right: 16px;
		border-radius: var(--radius-lg);
		background: var(--canvas);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&__head {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	// a display figure, larger than the text scale goes
	&__price {
		padding-top: 12px;
		font-family: var(--font-display);
		font-size: 24px;
		line-height: 32px;
	}

	&--highlighted .plan__price {
		font-size: 48px;
		font-weight: 700;
		line-height: 56px;
		letter-spacing: -0.02em;
	}

	&__note {
		font-family: var(--font-ui);
	}

	&__summary {
		padding-top: 20px;
	}

	&__cta {
		margin-top: 28px;
	}

	&__group {
		padding-top: 32px;
	}

	&__group-title {
		padding-bottom: 12px;
		border-bottom: var(--rule);
		font-family: var(--font-ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	&__benefits {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 16px;
	}

	&__benefit {
		display: grid;
		grid-template-columns: 16px minmax(0, 1fr);
		gap: 12px;
		font-size: 16px;
		line-height: 24px;
		color: var(--text-primary);

		&--now {
			.plan__benefit-icon {
				color: var(--success);
			}
		}

		&--later {
			color: var(--text-secondary);

			.plan__benefit-icon {
				color: var(--warning);
			}
		}
	}

	&__benefit-icon {
		margin-top: 4px;
	}
}

@media only screen and (max-width: 1024px) {
	// stacked: each plan takes its content height
	.plan {
		padding: 32px 0;

		&:not(.plan--highlighted) + .plan:not(.plan--highlighted) {
			border-left: 0;
			border-top: var(--rule);
		}

		&--highlighted {
			margin: 0 0 16px;
			padding: 32px 28px;
		}
	}
}

@media only screen and (max-width: 600px) {
	.plan {
		&--highlighted {
			padding: 28px 20px;
		}

		&--highlighted .plan__price {
			font-size: 40px;
			line-height: 48px;
		}
	}
}
</style>
