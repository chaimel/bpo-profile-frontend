<template>
	<div>
		<CompanyStats
			:key="state"
			:company="company"
			:stats="state === 'empty' ? noActivityStats('company') : stats"
			:state="state === 'error' ? 'error' : 'ready'"
			:retry-path="route.path"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyStats from '@/components/features/dashboard/company/stats/Index.vue'
import { notFound } from '~/utils/errors'

const { findCompanyStats, findEditableCompany, noActivityStats } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { company, stats } = resolveStats(Number(route.params.companyId))

// GET /api/dashboard/companies/{companyId}/stats; unknown or foreign is a 404.
function resolveStats(companyId: number) {
	const company = findEditableCompany(companyId)
	const stats = findCompanyStats(companyId)

	if (!company || !stats) {
		throw notFound('That company isn’t in your dashboard. Check the link, or pick a company from the menu.')
	}
	return { company, stats }
}

// ?state=empty previews a window with no activity (the rate reads
// "Unavailable"); ?state=error previews a failed load.
const state = computed(() => {
	const value = route.query.state
	return value === 'empty' || value === 'error' ? value : 'ready'
})

useHead({
	title: 'Stats',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
