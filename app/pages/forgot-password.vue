<template>
	<ForgotPassword
		:state="state"
		:sent-to="sent_to"
		@submit="onSubmit"
		@retry="state = 'form'"
	/>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ForgotPassword from '@/components/features/auth/forgot-password/Index.vue'
import type { ForgotPasswordState } from '~/types/features/onboarding'

definePageMeta({ layout: 'auth' })

useHead({
	title: 'Reset your password',
	meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

const states: ForgotPasswordState[] = ['form', 'sent']

// Static UI: ?state=sent previews the confirmation. Once the API is wired
// up, POST /api/forgot-password answering at all is what shows it.
function stateFromQuery(): ForgotPasswordState {
	return states.find(state => state === route.query.state) ?? 'form'
}

const state = ref<ForgotPasswordState>(stateFromQuery())
const sent_to = ref('')

watch(() => route.query.state, () => {
	state.value = stateFromQuery()
})

// Stand-in for POST /api/forgot-password: the answer is generic either way.
function onSubmit(email: string) {
	sent_to.value = email
	state.value = 'sent'
}
</script>
