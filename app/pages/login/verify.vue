<template>
	<Login
		:state="state"
		:challenge="challenge"
		@verify="onVerify"
		@resend="onResend"
		@restart="navigateTo('/login')"
	/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Login from '@/components/features/auth/login/Index.vue'
import { authPolicy } from '~/data/features/onboarding'
import type { LoginState } from '~/types/features/onboarding'

const { googleChallenge, loginChallenge } = useOnboardingStore()

definePageMeta({ layout: 'auth' })

useHead({
	title: 'Check your email',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

// Laravel's Google callback lands here with nothing identifying in the URL,
// and the page reads the pending challenge from GET /api/login/challenge
// (docs/API.md §1). A 404 there means no sign-in is waiting, so the visitor
// starts again. ?state=expired previews that.
if (route.query.state === 'expired') {
	await navigateTo({ path: '/login', query: { state: 'expired' } }, { replace: true })
}

// Static UI: ?state=code-error previews a rejected code;
// ?account=new previews a first-time Google account.
function stateFromQuery(): LoginState {
	return route.query.state === 'code-error' ? 'code-error' : 'verify'
}

const state = ref<LoginState>(stateFromQuery())
const challenge = ref(route.query.account === 'new' ? googleChallenge : loginChallenge)

watch(() => route.query.state, () => {
	state.value = stateFromQuery()
})

// Stand-in for POST /api/login/verify → 200, then GET /api/me: an account
// with no company and no sales profile continues to onboarding.
function onVerify() {
	navigateTo(route.query.account === 'new' ? '/onboarding' : '/dashboard')
}

// Stand-in for POST /api/login/resend → 202: a fresh cooldown, same deadline.
function onResend() {
	challenge.value = { ...challenge.value, resend_after: authPolicy.resendAfterSeconds }
}
</script>
