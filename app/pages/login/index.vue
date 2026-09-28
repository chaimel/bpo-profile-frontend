<template>
	<Login
		:state="state"
		:challenge="challenge"
		@sign-in="onSignIn"
		@verify="onVerify"
		@resend="onResend"
		@restart="state = 'credentials'"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Login from '@/components/features/auth/login/Index.vue'
import { authPolicy } from '~/data/features/onboarding'
import type { LoginState } from '~/types/features/onboarding'

const { loginChallenge, startLoginChallenge } = useOnboardingStore()

definePageMeta({ layout: 'auth' })

useHead({
	title: 'Sign in',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

const states: LoginState[] = ['credentials', 'error', 'expired', 'verify', 'code-error', 'linked']

// Static UI: ?state= opens any step for review. Once the API is wired up,
// the step comes from the POST /api/login and /api/login/verify responses;
// Laravel's Google redirects add the generic error or the linked notice.
function stateFromQuery(): LoginState {
	return states.find(state => state === route.query.state) ?? 'credentials'
}

const state = ref<LoginState>(stateFromQuery())
const challenge = ref(loginChallenge)

watch(() => route.query.state, () => {
	state.value = stateFromQuery()
})

// Claim and invitation links send people here with ?redirect=. Only a
// same-site path is honored, never an absolute or protocol-relative URL.
const redirect = computed(() => {
	const value = route.query.redirect
	return typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : '/dashboard'
})

// Stand-in for POST /api/login → 202: any credentials start a code challenge.
function onSignIn(credentials: { email: string, password: string }) {
	challenge.value = startLoginChallenge(credentials.email)
	state.value = 'verify'
}

// Stand-in for POST /api/login/verify → 200: any six digits sign you in.
function onVerify() {
	navigateTo(redirect.value)
}

// Stand-in for POST /api/login/resend → 202: a fresh cooldown, same deadline.
function onResend() {
	challenge.value = { ...challenge.value, resend_after: authPolicy.resendAfterSeconds }
}
</script>
