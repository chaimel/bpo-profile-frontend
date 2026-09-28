<template>
	<div class="forgot-password">
		<Sent
			v-if="props.state === 'sent'"
			ref="step_ref"
			:email="props.sentTo"
			@retry="emit('retry')"
		/>
		<RequestForm
			v-else
			ref="step_ref"
			v-model:email="email"
			@submit="emit('submit', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { ForgotPasswordState } from '~/types/features/onboarding'
import RequestForm from './Form.vue'
import Sent from './Sent.vue'

interface Props {
	state?: ForgotPasswordState
	// the address the request was made for, shown back on the confirmation
	sentTo?: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'form',
	sentTo: '',
})

const emit = defineEmits<{
	(_e: 'submit', _email: string): void
	(_e: 'retry'): void
}>()

// Kept here so "try a different email" returns with the address filled in.
const email = ref(props.sentTo)
const step_ref = ref<{ focusHeading: () => void } | null>(null)

watch(() => props.state, async () => {
	await nextTick()
	step_ref.value?.focusHeading()
})
</script>
