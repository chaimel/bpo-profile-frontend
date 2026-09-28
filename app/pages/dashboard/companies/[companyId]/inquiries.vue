<template>
	<div>
		<CompanyInquiries
			:key="state"
			:company="company"
			:inquiries="state === 'empty' ? [] : inquiries"
			:state="state === 'error' ? 'error' : 'ready'"
			:retry-path="route.path"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyInquiries from '@/components/features/dashboard/company/inquiries/Index.vue'
import { notFound } from '~/utils/errors'

const { findCompanyInquiries, findEditableCompany } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { company, inquiries } = resolveInbox(Number(route.params.companyId))

// GET /api/dashboard/companies/{companyId}/inquiries — owners and admins
// only; unknown or foreign is a 404 (docs/API.md §5).
function resolveInbox(companyId: number) {
	const company = findEditableCompany(companyId)
	const inquiries = findCompanyInquiries(companyId)

	if (!company || !inquiries) {
		throw notFound('That company isn’t in your dashboard. Check the link, or pick a company from the menu.')
	}
	return { company, inquiries }
}

// ?state=empty previews an empty inbox; ?state=error a failed load.
const state = computed(() => {
	const value = route.query.state
	return value === 'empty' || value === 'error' ? value : 'ready'
})

useHead({
	title: 'Inquiries',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
