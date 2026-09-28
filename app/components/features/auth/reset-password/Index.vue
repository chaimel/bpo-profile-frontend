<template>
	<div class="reset-password">
		<Updated v-if="props.state === 'updated'" ref="step_ref" />
		<Invalid v-else-if="props.state === 'invalid'" ref="step_ref" />
		<ResetForm
			v-else
			ref="step_ref"
			:email="props.email"
			@submit="emit('submit', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { ResetPasswordState } from '~/types/features/onboarding'
import ResetForm from './Form.vue'
import Invalid from './Invalid.vue'
import Updated from './Updated.vue'

interface Props {
	state?: ResetPasswordState
	email?: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'form',
	email: '',
})

const emit = defineEmits<{
	(_e: 'submit', _passwords: { password: string, password_confirmation: string }): void
}>()

const step_ref = ref<{ focusHeading: () => void } | null>(null)

watch(() => props.state, async () => {
	await nextTick()
	step_ref.value?.focusHeading()
})
</script>
