<template>
	<div>
		<MemberProfile
			:company="company"
			:professional="professional"
			:team-path="`/dashboard/companies/${company.id}/team`"
		/>
	</div>
</template>

<script setup lang="ts">
import MemberProfile from '@/components/features/dashboard/company/member/Index.vue'
import { notFound } from '~/utils/errors'

const { findEditableCompany, findTeamProfessional } = useDashboardStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { company, professional } = resolveMember(Number(route.params.companyId), Number(route.params.professionalId))

// GET .../team/{professionalId}. A profile from another company, or one
// that isn't on the team, is a 404 (docs/API.md §5).
function resolveMember(companyId: number, professionalId: number) {
	const company = findEditableCompany(companyId)

	if (!company) {
		throw notFound('That company isn’t in your dashboard. Check the link, or pick a company from the menu.')
	}

	const professional = findTeamProfessional(companyId, professionalId)

	if (!professional) {
		throw notFound(`That profile isn’t on ${company.name}’s team. It may have been removed — the Team page lists everyone.`)
	}
	return { company, professional }
}

useHead({
	title: `${professional.first_name} ${professional.last_name} · Team`,
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
