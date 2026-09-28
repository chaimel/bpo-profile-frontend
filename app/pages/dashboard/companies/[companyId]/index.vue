<template>
	<div>
		<CompanyProfile
			:key="state"
			:company="preview_company"
			:team-size="team.members.length"
			:state="state === 'error' ? 'error' : 'ready'"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyProfile from '@/components/features/dashboard/company/profile/Index.vue'
import type { PublicationStatus } from '~/types/features/directory'
import { notFound } from '~/utils/errors'

const { findEditableCompany, findTeam } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { company, team } = resolveCompany(Number(route.params.companyId))

// GET /api/dashboard/companies/{companyId}. A company the user doesn't
// own or administer is a 404, never a 403 (docs/API.md §5).
function resolveCompany(companyId: number) {
	const company = findEditableCompany(companyId)
	const team = findTeam(companyId)

	if (!company || !team) {
		throw notFound('That company isn’t in your dashboard. Check the link, or pick a company from the menu.')
	}
	return { company, team }
}

// ?state= previews what the static data can't reach: a draft,
// pending_review or suspended listing, or a failed save (error).
const preview_statuses: PublicationStatus[] = ['draft', 'pending_review', 'suspended']
const state = computed(() => String(route.query.state ?? ''))

const preview_company = computed(() => {
	const status = preview_statuses.find(value => value === state.value)
	return status ? { ...company, status } : company
})

useHead({
	title: 'Company profile',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
