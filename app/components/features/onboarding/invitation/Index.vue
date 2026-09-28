<template>
	<div class="invitation">
		<Acceptance
			:state="props.state"
			:company="props.company"
			:profile="props.profile"
			:account-email="props.accountEmail"
			:return-to="props.returnTo"
			@accept="emit('accept')"
			@sign-out="emit('sign-out')"
		/>
	</div>
</template>

<script setup lang="ts">
import type { CompanyRef, ProfessionalCard } from '~/types/features/directory'
import type { TokenState } from '~/types/features/onboarding'
import Acceptance from './Acceptance.vue'

// The emailed team invitation (docs/ARCHITECTURE.md §5 "Team invitations").
// Accepting attaches the account to an existing roster profile. The token
// never reaches this component: the page keeps it for the POST.
interface Props {
	state?: TokenState
	company: CompanyRef
	profile: Pick<ProfessionalCard, 'first_name' | 'last_name' | 'job_title'>
	accountEmail: string
	returnTo: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'ready',
})

const emit = defineEmits<{
	(_e: 'accept' | 'sign-out'): void
}>()
</script>
