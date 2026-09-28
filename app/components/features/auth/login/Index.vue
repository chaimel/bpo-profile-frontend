<template>
	<div class="login">
		<Verify
			v-if="step === 'verify'"
			ref="step_ref"
			:challenge="props.challenge"
			:error="props.state === 'code-error'"
			@verify="emit('verify', $event)"
			@resend="emit('resend')"
			@restart="emit('restart')"
		/>
		<Credentials
			v-else
			ref="step_ref"
			v-model:email="email"
			:notice="notice"
			@submit="emit('sign-in', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { LoginChallenge, LoginState } from '~/types/features/onboarding'
import Credentials from './Credentials.vue'
import Verify from './Verify.vue'

interface Props {
	state?: LoginState
	challenge: LoginChallenge
}

const props = withDefaults(defineProps<Props>(), {
	state: 'credentials',
})

const emit = defineEmits<{
	(_e: 'sign-in', _credentials: { email: string, password: string }): void
	(_e: 'verify', _code: string): void
	(_e: 'resend' | 'restart'): void
}>()

// Non-secret input survives a trip back to the first step; the password never does.
const email = ref('')
const step_ref = ref<{ focusHeading: () => void } | null>(null)

const step = computed(() => (props.state === 'verify' || props.state === 'code-error' ? 'verify' : 'credentials'))
const notice = computed(() => (props.state === 'error' || props.state === 'expired' || props.state === 'linked' ? props.state : null))

// Each step replaces the whole form, so start keyboard and screen-reader
// users at its heading.
watch(step, async () => {
	await nextTick()
	step_ref.value?.focusHeading()
})
</script>
