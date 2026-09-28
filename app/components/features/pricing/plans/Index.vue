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
import type { PlanPresentation } from '~/types/features/content'
import Plan from './Plan.vue'

const { plans } = useCatalogStore()

// Active plans from the catalog, in its sort order (GET /api/plans).
const visible_plans: PlanPresentation[] = [...plans]
	.filter(plan => plan.is_active)
	.sort((a, b) => a.sort_order - b.sort_order)
	.map(plan => planPresentations.find(presentation => presentation.slug === plan.slug))
	.filter((presentation): presentation is PlanPresentation => Boolean(presentation))
</script>

<style lang="scss" scoped>
.plans {
	&__con {
		display: flex;
		align-items: stretch;
		padding: 16px 0 96px;
	}
}

@media only screen and (max-width: 1024px) {
	.plans {
		&__con {
			flex-direction: column;
			padding-bottom: 72px;
		}
	}
}
</style>
