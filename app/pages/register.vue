<template>
	<Register
		:state="state"
		:type="type"
		:companies="companyCards"
		:email="created_email"
		:redirect="redirect"
		@submit="onSubmit"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Register from '@/components/features/auth/register/Index.vue'
import type { RegisterPath, RegisterState, RegisterSubmission } from '~/types/features/onboarding'

const { companyCards } = useDirectoryStore()

definePageMeta({ layout: 'auth' })

useHead({
	title: 'Create your account',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

const paths: RegisterPath[] = ['company', 'professional', 'account']
const states: RegisterState[] = ['form', 'created']

// ?type= preselects a path (the header's Get Listed, the footer's sales
// profile link, claim and invitation pages). Static UI: ?state=created
// previews the confirmation; once the API is wired up, the 201 response
// decides it instead.
function typeFromQuery(): RegisterPath {
	return paths.find(path => path === route.query.type) ?? 'company'
}

function stateFromQuery(): RegisterState {
	return states.find(state => state === route.query.state) ?? 'form'
}

const type = ref<RegisterPath>(typeFromQuery())
const state = ref<RegisterState>(stateFromQuery())
const created_email = ref('')

watch(() => route.query, () => {
	type.value = typeFromQuery()
	state.value = stateFromQuery()
})

// Carried through to sign-in so claim and invitation links pick up where
// they left off. Only a same-site path is honored.
const redirect = computed(() => {
	const value = route.query.redirect
	return typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : undefined
})

// Stand-in for POST /api/register{,/company,/professional} → 201 with
// next_action = login. The account starts unverified and signed out.
function onSubmit(submission: RegisterSubmission) {
	type.value = submission.path
	created_email.value = submission.body.email
	state.value = 'created'
}
</script>
