<template>
	<div class="plans">
		<div class="wrapper">
			<div class="plans__con" :style="{ '--plan-columns': plan_columns }">
				<Plan
					v-for="(plan, index) in visible_plans"
					:key="plan.slug"
					:plan="plan"
					:class="{ 'plan--row-start': index % columns === 0 }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { planPresentations } from '~/data/features/pricing'
import type { Plan as CatalogPlan } from '~/types/features/directory'
import { presentPlan } from '~/utils/plans'
import Plan from './Plan.vue'

const props = defineProps<{ plans: CatalogPlan[] }>()
const visible_plans = computed(() => props.plans.map(plan => presentPlan(plan, planPresentations)))

// Rows of up to three, balanced so extra tiers wrap evenly:
// three plans share one row, six make two rows of three.
const columns = computed(() => {
	const count = Math.max(visible_plans.value.length, 1)
	return Math.ceil(count / Math.ceil(count / 3))
})

// One row keeps the highlighted plan's wider panel; wrapped rows use
// equal columns so the plans line up.
const plan_columns = computed(() => {
	const single_row = visible_plans.value.length <= columns.value
	return visible_plans.value
		.slice(0, columns.value)
		.map(plan => (single_row && plan.highlighted ? 'minmax(0, 1.3fr)' : 'minmax(0, 1fr)'))
		.join(' ')
})
</script>

<style lang="scss" scoped>
.plans {
	&__con {
		display: grid;
		grid-template-columns: var(--plan-columns);
		row-gap: 40px;
		align-items: stretch;
		padding: 16px 0 96px;
	}
}

@media only screen and (max-width: 1024px) {
	.plans {
		&__con {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 0;
			padding-bottom: 72px;
		}
	}
}
</style>
