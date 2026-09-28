<template>
	<div class="register">
		<Success
			v-if="props.state === 'created'"
			ref="step_ref"
			:path="props.type"
			:email="props.email"
			:redirect="props.redirect"
		/>
		<RegisterForm
			v-else
			ref="step_ref"
			:type="props.type"
			:companies="props.companies"
			:redirect="props.redirect"
			@submit="emit('submit', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { CompanyCard } from '~/types/features/directory'
import type { RegisterPath, RegisterState, RegisterSubmission } from '~/types/features/onboarding'
import RegisterForm from './form/Index.vue'
import Success from './Success.vue'

interface Props {
	state?: RegisterState
	type?: RegisterPath
	// published companies a sales professional can join
	companies: CompanyCard[]
	// where sign-in continues afterwards, e.g. back to an invitation link
	redirect?: string
	// the address the new account uses, once it exists
	email?: string
}

const props = withDefaults(defineProps<Props>(), {
	state: 'form',
	type: 'company',
	redirect: undefined,
	email: '',
})

const emit = defineEmits<{
	(_e: 'submit', _submission: RegisterSubmission): void
}>()

const step_ref = ref<{ focusHeading: () => void } | null>(null)

// The confirmation replaces the form: start at its heading.
watch(() => props.state, async () => {
	await nextTick()
	step_ref.value?.focusHeading()
})
</script>
