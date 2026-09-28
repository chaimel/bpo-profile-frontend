<template>
	<Claim
		:company="company"
		:missing="missing"
		:companies="companyCards"
		:state="state"
		:account="me"
		:return-to="return_to"
		@submit="onSubmit"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Claim from '@/components/features/onboarding/claim/Index.vue'
import type { ClaimRequestState } from '~/types/features/onboarding'

const { companyCards, findCompany } = useDirectoryStore()
const { me } = useSessionStore()

definePageMeta({ layout: 'default' })

const route = useRoute()

const slug = computed(() => (typeof route.query.company === 'string' ? route.query.company : ''))
const company = computed(() => (slug.value ? findCompany(slug.value) ?? null : null))
const missing = computed(() => Boolean(slug.value) && !company.value)

const states: ClaimRequestState[] = ['signed-out', 'ready', 'submitted']

// Static UI: ?state= previews each request state. Once the API is wired up,
// GET /api/me decides signed-out or ready, and POST /api/claims → 201 is
// what shows submitted.
function stateFromQuery(): ClaimRequestState {
	return states.find(state => state === route.query.state) ?? 'signed-out'
}

const state = ref<ClaimRequestState>(stateFromQuery())

watch(() => route.fullPath, () => {
	state.value = stateFromQuery()
})

// Sign-in and registration bring the visitor back to this same listing.
const return_to = computed(() => (company.value ? `/claim?company=${company.value.slug}` : '/claim'))

// Stand-in for POST /api/claims { company_id } → 201, status pending.
function onSubmit() {
	state.value = 'submitted'
}

useHead({
	title: computed(() => (company.value ? `Claim ${company.value.name}` : 'Claim your profile')),
	// the search page can be found; per-listing variants stay out of the index
	meta: computed(() => (slug.value ? [{ name: 'robots', content: 'noindex' }] : [])),
})
</script>
