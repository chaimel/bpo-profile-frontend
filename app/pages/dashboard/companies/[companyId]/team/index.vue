<template>
	<div>
		<CompanyTeam
			:key="state"
			:company="company"
			:team="preview_team"
			:editable-ids="editable_ids"
			:own-professional-id="me.professional?.id ?? null"
			:inviter-name="`${me.first_name} ${me.last_name}`"
			:initial-tab="initial_tab"
			:invite-for="invite_for"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompanyTeam from '@/components/features/dashboard/company/team/Index.vue'
import { notFound } from '~/utils/errors'

const { editableProfessionals, findEditableCompany, findTeam } = useDashboardStore()
const { me } = useSessionStore()

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { company, team } = resolveTeam(Number(route.params.companyId))

// GET /api/dashboard/companies/{companyId}/team; unknown or foreign is a 404.
function resolveTeam(companyId: number) {
	const company = findEditableCompany(companyId)
	const team = findTeam(companyId)

	if (!company || !team) {
		throw notFound('That company isn’t in your dashboard. Check the link, or pick a company from the menu.')
	}
	return { company, team }
}

// Members with an editor page in the static data.
const editable_ids = Object.values(editableProfessionals)
	.filter(professional => professional.company.id === company.id)
	.map(professional => professional.id)

// ?state=empty previews a team with no members, requests or invitations.
// ?tab=members|requests|invitations opens a tab; ?invite=<id> opens the
// invite dialog for a roster profile without a login.
const state = computed(() => (route.query.state === 'empty' ? 'empty' : 'ready'))

const preview_team = computed(() =>
	state.value === 'empty' ? { members: [], requests: [], invitations: [] } : team,
)

const tab_values = ['members', 'requests', 'invitations'] as const
const initial_tab = tab_values.find(value => value === route.query.tab) ?? 'members'
const invite_for = Number(route.query.invite) || null

useHead({
	title: 'Team',
	meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
