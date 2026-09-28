<template>
	<Onboarding
		:state="state"
		:account="onboardingAccount"
		:companies="companyCards"
		:company-name="pending_company"
		@submit="onSubmit"
	/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Onboarding from '@/components/features/onboarding/setup/Index.vue'
import type { OnboardingState, OnboardingSubmission } from '~/types/features/onboarding'

const { companyCards } = useDirectoryStore()
const { onboardingAccount } = useOnboardingStore()

definePageMeta({ layout: 'auth' })

useHead({
	title: 'Set up your account',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

const states: OnboardingState[] = ['form', 'pending', 'complete']

// Static UI: ?state= previews each screen. Once the API is wired up,
// GET /api/me decides whether onboarding applies (no company and no sales
// profile) and each POST response moves it on (docs/API.md §1).
function stateFromQuery(): OnboardingState {
	return states.find(state => state === route.query.state) ?? 'form'
}

const state = ref<OnboardingState>(stateFromQuery())

// the company a new sales profile waits on, for the pending screen
const pending_company = ref(companyCards[0]?.name ?? '')

watch(() => route.query.state, () => {
	state.value = stateFromQuery()
})

// Stand-ins for POST /api/onboarding/company → a draft company the user
// owns, so on to the dashboard; and POST /api/onboarding/professional →
// a draft profile whose affiliation the company reviews.
function onSubmit(submission: OnboardingSubmission) {
	if (submission.path === 'company') {
		navigateTo('/dashboard')
		return
	}

	const company = companyCards.find(item => item.id === submission.body.company_id)
	if (company) pending_company.value = company.name
	state.value = 'pending'
}
</script>
