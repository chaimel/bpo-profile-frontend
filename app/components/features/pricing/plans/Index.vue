<template>
	<div class="plans">
		<div class="wrapper">
			<div class="plans__con">
				<Plan v-for="plan in visible_plans" :key="plan.slug" :plan="plan" />
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
</script>

<style lang="scss" scoped>
.plans {
	&__con {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		row-gap: 24px;
		align-items: stretch;
		padding: 16px 0 96px;
	}
}

@media only screen and (max-width: 1024px) {
	.plans {
		&__con {
			grid-template-columns: 1fr;
			padding-bottom: 72px;
		}
	}
}
</style>
