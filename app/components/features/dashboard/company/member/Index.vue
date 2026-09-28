<template>
	<MPage
		id="team-member"
		class="member"
		:title="full_name"
		:description="`${props.professional.job_title} · ${props.company.name} team profile`"
		:back="{ label: 'Team', to: props.teamPath }"
	>
		<MProfessionalEditor
			id-prefix="member"
			:professional="props.professional"
			context="team"
			:team-path="invite_path"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MProfessionalEditor from '~/components/core/profile/MProfessionalEditor.vue'
import type { EditableProfessional } from '~/types/features/dashboard'
import type { CompanyRef } from '~/types/features/directory'
import { fullName } from '~/utils/format'

// GET / PUT .../team/{professionalId}: an owner or admin editing a
// teammate's profile. Company, affiliation and verification stay
// read-only here too (docs/API.md §5).
interface Props {
	company: CompanyRef
	professional: EditableProfessional
	teamPath: string
}

const props = defineProps<Props>()

const full_name = computed(() => fullName(props.professional))

// A roster profile's "Send an invitation" opens the team page's invite
// dialog for this person.
const invite_path = computed(() =>
	props.professional.has_account ? props.teamPath : `${props.teamPath}?invite=${props.professional.id}`,
)
</script>

<style lang="scss" scoped>
.member {
	// section links land below the sticky top bar
	:deep(.m-form-section) {
		scroll-margin-top: 88px;
	}
}
</style>
