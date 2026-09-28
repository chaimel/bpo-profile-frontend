<template>
	<ResetPassword
		:state="state"
		:email="email"
		@submit="onSubmit"
	/>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ResetPassword from '@/components/features/auth/reset-password/Index.vue'
import type { ResetPasswordState } from '~/types/features/onboarding'

definePageMeta({ layout: 'auth' })

// The emailed link carries a secret token: keep it out of Referer headers.
useHead({
	title: 'Choose a new password',
	meta: [
		{ name: 'referrer', content: 'no-referrer' },
		{ name: 'robots', content: 'noindex' },
	],
})

const route = useRoute()

const states: ResetPasswordState[] = ['form', 'updated', 'invalid']

// Static UI: ?state= previews each screen. Once the API is wired up, the
// POST /api/reset-password response decides it (a 422 on the token is
// `invalid`); there is no way to check a token before submitting.
function stateFromQuery(): ResetPasswordState {
	return states.find(state => state === route.query.state) ?? 'form'
}

const state = ref<ResetPasswordState>(stateFromQuery())

watch(() => route.query.state, () => {
	state.value = stateFromQuery()
})

// The link is /reset-password?token=…&email=…. The email is shown back
// read-only; route.query.token is never shown or handed to the feature —
// it only goes back in the POST body once the API is wired up.
const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))

// Stand-in for POST /api/reset-password { token, email, password,
// password_confirmation } → 200. A reset never signs anyone in.
function onSubmit() {
	state.value = 'updated'
}
</script>
