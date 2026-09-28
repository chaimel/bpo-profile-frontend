<template>
	<div class="claim-accept">
		<Acceptance
			:state="props.state"
			:company="props.company"
			:account-email="props.accountEmail"
			:return-to="props.returnTo"
			@accept="emit('accept')"
			@sign-out="emit('sign-out')"
		/>
	</div>
</template>

<script setup lang="ts">
import type { CompanyRef } from '~/types/features/directory'
import type { TokenState } from '~/types/features/onboarding'
import Acceptance from './Acceptance.vue'

// The emailed claim link (docs/ARCHITECTURE.md §5 "Company claims"). The
// token never reaches this component: the page keeps it for the POST.
interface Props {
	state?: TokenState
	company: CompanyRef
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
