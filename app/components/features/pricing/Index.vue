<template>
	<div class="pricing">
		<Banner />
		<Plans :plans="visible_plans" />
		<Comparison :plans="visible_plans" />
		<Disclosure />
		<Faq />
		<Cta />
	</div>
</template>

<script setup lang="ts">
import Banner from './Banner.vue'
import Comparison from './Comparison.vue'
import Cta from './Cta.vue'
import Disclosure from './Disclosure.vue'
import Faq from './Faq.vue'
import Plans from './plans/Index.vue'
import { activeCompanyPlans } from '~/utils/plans'

const props = defineProps<{ expanded?: boolean }>()
const catalog = useCatalogStore()
const visible_plans = computed(() => activeCompanyPlans(props.expanded ? catalog.expandedPlans : catalog.plans))
</script>
