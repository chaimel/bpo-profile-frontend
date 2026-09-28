<template>
	<div>
		<CompanyLocations
			:key="state"
			:company="preview_company"
			:state="state === 'error' ? 'error' : 'ready'"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyLocations from '@/components/features/dashboard/company/locations/Index.vue'
import { notFound } from '~/utils/errors'

const { findEditableCompany } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const company = resolveCompany(Number(route.params.companyId))

// GET /api/dashboard/companies/{companyId}; unknown or foreign is a 404.
function resolveCompany(companyId: number) {
	const found = findEditableCompany(companyId)

	if (!found) {
		throw notFound('That company isn’t in your dashboard. Check the link, or pick a company from the menu.')
	}
	return found
}

// ?state=empty previews no operating locations, ?state=no-hq keeps the
// locations but clears the headquarters, ?state=error fails the save.
const state = computed(() => String(route.query.state ?? ''))

const preview_company = computed(() => {
	if (state.value === 'empty') return { ...company, location_ids: [], hq_location_id: null }
	if (state.value === 'no-hq') return { ...company, hq_location_id: null }
	return company
})

useHead({
	title: 'Locations',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
