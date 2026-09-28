<template>
	<MPage id="my-profile" class="profile" title="My sales profile">
		<template #description>
			How you appear to buyers in the Sales Pros directory and on {{ props.professional.company.name }}’s team.
		</template>

		<MProfessionalEditor
			id-prefix="my-profile"
			:professional="props.professional"
			context="own"
		/>
	</MPage>
</template>

<script setup lang="ts">
import MProfessionalEditor from '~/components/core/profile/MProfessionalEditor.vue'
import type { EditableProfessional } from '~/types/features/dashboard'

// GET / PUT /api/dashboard/professional. The editor keeps company,
// affiliation, verification and plan read-only (docs/API.md §6).
interface Props {
	professional: EditableProfessional
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.profile {
	// checklist links land below the sticky top bar
	:deep(.m-form-section) {
		scroll-margin-top: 88px;
	}
}
</style>
