<template>
	<div>
		<CompanyServices
			:key="state"
			:company="preview_company"
			:state="state === 'error' ? 'error' : 'ready'"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyServices from '@/components/features/dashboard/company/services/Index.vue'
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

// ?state=empty previews a listing with nothing chosen and no
// certifications; ?state=error previews a failed save.
const state = computed(() => String(route.query.state ?? ''))

const preview_company = computed(() => {
	if (state.value !== 'empty') return company

	return {
		...company,
		service_ids: [],
		industry_ids: [],
		capability_ids: [],
		language_ids: [],
		technology_ids: [],
		certifications: [],
	}
})

useHead({
	title: 'Services & expertise',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
