<template>
	<MFormSection
		:id="props.idPrefix"
		class="email"
		title="Email address"
		description="The address you sign in with and where we send sign-in codes."
	>
		<form class="email__form" novalidate @submit.prevent="submit">
			<MInput
				:id="`${props.idPrefix}-current`"
				:model-value="current_email"
				name="current_email"
				type="email"
				readonly
			>
				<template #label>Current email</template>
			</MInput>

			<MInput
				:id="`${props.idPrefix}-new`"
				v-model="fields.new_email"
				name="new_email"
				type="email"
				autocomplete="email"
				:max-length="255"
				required
				:has-error="Boolean(errors.new_email)"
			>
				<template #label>New email</template>
				<template #error>{{ errors.new_email }}</template>
			</MInput>

			<MInput
				:id="`${props.idPrefix}-password`"
				v-model="fields.password"
				name="current_password"
				type="password"
				autocomplete="current-password"
				revealable
				required
				:has-error="Boolean(errors.password)"
			>
				<template #label>Current password</template>
				<template #hint>We ask for it to confirm it’s really you.</template>
				<template #error>{{ errors.password }}</template>
			</MInput>

			<MAlert tone="neutral">
				Changing your email signs you out of every session. The next time you sign in, we’ll send a code to the new address to verify it.
			</MAlert>

			<div class="email__actions">
				<MButton type="submit" :is-loading="status === 'saving'">Change email</MButton>
			</div>

			<MAlert v-if="status === 'saved'" tone="success" live>
				<template #title>Email changed to {{ current_email }}</template>
				You’re signed out everywhere. Sign in with your new address and enter the code we send there to verify it.
			</MAlert>
			<MAlert v-else-if="status === 'failed'" tone="danger" live>
				We couldn’t change your email. Please try again.
			</MAlert>
		</form>
	</MFormSection>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'

interface Props {
	idPrefix: string
	email: string
	// previews a failed request (?state=error)
	fails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	fails: false,
})

const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const current_email = ref(props.email)
const fields = reactive({ new_email: '', password: '' })
const errors = reactive<{ new_email?: string, password?: string }>({})
const status = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')

function validate(): boolean {
	const next_email = fields.new_email.trim()

	if (!next_email) errors.new_email = 'Enter your new email address.'
	else if (!email_pattern.test(next_email)) errors.new_email = 'Enter an email address in the format name@company.com.'
	else if (next_email.toLowerCase() === current_email.value.toLowerCase()) errors.new_email = 'That’s already your email address.'
	else errors.new_email = undefined

	errors.password = fields.password ? undefined : 'Enter your current password.'
	return !errors.new_email && !errors.password
}

function submit() {
	if (!validate()) {
		status.value = 'idle'
		return
	}

	status.value = 'saving'
	// Static stand-in for the email change. The password never outlives
	// the attempt, whatever the result.
	setTimeout(() => {
		fields.password = ''
		if (props.fails) {
			status.value = 'failed'
			return
		}
		current_email.value = fields.new_email.trim()
		fields.new_email = ''
		status.value = 'saved'
	}, 600)
}
</script>

<style lang="scss" scoped>
.email {
	&__form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 520px;
	}

	&__actions {
		display: flex;
	}
}
</style>
