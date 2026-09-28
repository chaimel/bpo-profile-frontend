<template>
	<div class="setup">
		<Pending v-if="props.state === 'pending'" ref="step_ref" :company-name="props.companyName" />
		<Complete v-else-if="props.state === 'complete'" ref="step_ref" />
		<SetupForm
			v-else
			ref="step_ref"
			:account="props.account"
			:companies="props.companies"
			@submit="emit('submit', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { CompanyCard } from '~/types/features/directory'
import type { OnboardingAccount, OnboardingState, OnboardingSubmission } from '~/types/features/onboarding'
import Complete from './Complete.vue'
import SetupForm from './Form.vue'
import Pending from './Pending.vue'

// A signed-in account with no company and no sales profile — usually a
// first-time Google sign-in — picks what it is for (docs/API.md §1).
interface Props {
	state?: OnboardingState
	account: OnboardingAccount
	// published companies a sales professional can join
	companies: CompanyCard[]
	// the company reviewing a new sales profile
	companyName?: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'form',
	companyName: '',
})

const emit = defineEmits<{
	(_e: 'submit', _submission: OnboardingSubmission): void
}>()

const step_ref = ref<{ focusHeading: () => void } | null>(null)

// Each screen replaces the last: start at its heading.
watch(() => props.state, async () => {
	await nextTick()
	step_ref.value?.focusHeading()
})
</script>
