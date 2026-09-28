<template>
	<MFormSection
		:id="props.idPrefix"
		class="password"
		title="Password"
		description="Use a password you don’t use anywhere else."
	>
		<form class="password__form" novalidate @submit.prevent="submit">
			<MInput
				:id="`${props.idPrefix}-current`"
				v-model="fields.current"
				name="current_password"
				type="password"
				autocomplete="current-password"
				revealable
				required
				:has-error="Boolean(errors.current)"
			>
				<template #label>Current password</template>
				<template #error>{{ errors.current }}</template>
			</MInput>

			<MInput
				:id="`${props.idPrefix}-new`"
				v-model="fields.next"
				name="password"
				type="password"
				autocomplete="new-password"
				revealable
				required
				:has-error="Boolean(errors.next)"
			>
				<template #label>New password</template>
				<template #hint>At least {{ min_length }} characters.</template>
				<template #error>{{ errors.next }}</template>
			</MInput>

			<MInput
				:id="`${props.idPrefix}-confirm`"
				v-model="fields.confirm"
				name="password_confirmation"
				type="password"
				autocomplete="new-password"
				revealable
				required
				:has-error="Boolean(errors.confirm)"
			>
				<template #label>Confirm new password</template>
				<template #error>{{ errors.confirm }}</template>
			</MInput>

			<MAlert tone="neutral">
				Changing your password signs you out of every session, including this one.
			</MAlert>

			<div class="password__actions">
				<MButton type="submit" :is-loading="status === 'saving'">Change password</MButton>
			</div>

			<MAlert v-if="status === 'saved'" tone="success" live>
				<template #title>Password changed</template>
				You’re signed out everywhere. Next time, sign in with your new password and the code we email you.
			</MAlert>
			<MAlert v-else-if="status === 'failed'" tone="danger" live>
				We couldn’t change your password. Please try again.
			</MAlert>
		</form>
	</MFormSection>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import MFormSection from '~/components/core/form/MFormSection.vue'

interface Props {
	idPrefix: string
	// previews a failed request (?state=error)
	fails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	fails: false,
})

// UI hint only; the API's password rules are the ones that count
const min_length = 8

const fields = reactive({ current: '', next: '', confirm: '' })
const errors = reactive<{ current?: string, next?: string, confirm?: string }>({})
const status = ref<'idle' | 'saving' | 'saved' | 'failed'>('idle')

function validate(): boolean {
	errors.current = fields.current ? undefined : 'Enter your current password.'

	if (!fields.next) errors.next = 'Enter a new password.'
	else if (fields.next.length < min_length) errors.next = `Use at least ${min_length} characters.`
	else if (fields.next === fields.current) errors.next = 'Choose a password that’s different from your current one.'
	else errors.next = undefined

	errors.confirm = fields.confirm && fields.confirm === fields.next ? undefined : 'Enter the same new password again.'
	return !errors.current && !errors.next && !errors.confirm
}

function clear() {
	fields.current = ''
	fields.next = ''
	fields.confirm = ''
}

function submit() {
	if (!validate()) {
		status.value = 'idle'
		return
	}

	status.value = 'saving'
	// Static stand-in for the password change. Passwords are cleared
	// after every attempt (docs/SETUP.md §5).
	setTimeout(() => {
		clear()
		status.value = props.fails ? 'failed' : 'saved'
	}, 600)
}
</script>

<style lang="scss" scoped>
.password {
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
