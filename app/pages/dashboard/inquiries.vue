<template>
	<div>
		<MyInquiries
			:key="state"
			:inquiries="state === 'empty' ? [] : myInquiries"
			:company-inbox="company_inbox"
			:state="state === 'error' ? 'error' : 'ready'"
			:retry-path="route.path"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MyInquiries from '@/components/features/dashboard/inquiries/Index.vue'
import { notFound } from '~/utils/errors'

const { findEditableCompany, findOwnProfessional, myInquiries } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const professional = resolveProfessional()

// GET /api/dashboard/professional/inquiries needs the user's own profile.
function resolveProfessional() {
	const found = findOwnProfessional()

	if (!found) {
		throw notFound('You don’t have a sales profile yet, so there’s no inbox to show.')
	}
	return found
}

// Owners and admins also get a pointer to the company's shared inbox.
const managed = findEditableCompany(professional.company.id)
const company_inbox = managed
	? { name: managed.name, to: `/dashboard/companies/${managed.id}/inquiries` }
	: null

// ?state=empty previews an empty inbox; ?state=error a failed load.
const state = computed(() => {
	const value = route.query.state
	return value === 'empty' || value === 'error' ? value : 'ready'
})

useHead({
	title: 'My inquiries',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
