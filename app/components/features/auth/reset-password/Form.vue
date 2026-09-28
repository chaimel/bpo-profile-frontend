<template>
	<form ref="form_ref" class="form" novalidate @submit.prevent="submit">
		<header class="form__head">
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="form__title">
				Choose a new password
			</MHeading>
			<MText size="large" color="--text-secondary">
				Pick one you don’t use anywhere else. Updating it signs you out on every other device.
			</MText>
		</header>

		<div class="form__fields">
			<!-- Read-only, but still named "username" so password managers file the new password under it. -->
			<MInput
				v-if="props.email"
				id="reset-email"
				:model-value="props.email"
				name="email"
				type="email"
				autocomplete="username"
				readonly
			>
				<template #label>Email</template>
			</MInput>

			<MInput
				id="reset-password"
				v-model="password"
				name="password"
				type="password"
				autocomplete="new-password"
				revealable
				:has-error="Boolean(errors.password)"
			>
				<template #label>New password</template>
				<template #hint>
					Use at least {{ authPolicy.passwordMinLength }} characters. A few unrelated words make a strong one.
				</template>
				<template #error>{{ errors.password }}</template>
			</MInput>

			<MInput
				id="reset-password-confirmation"
				v-model="password_confirmation"
				name="password_confirmation"
				type="password"
				autocomplete="new-password"
				revealable
				:has-error="Boolean(errors.password_confirmation)"
			>
				<template #label>Confirm new password</template>
				<template #error>{{ errors.password_confirmation }}</template>
			</MInput>
		</div>

		<MButton type="submit" size="lg" block>Update password</MButton>

		<div class="form__back">
			<MButton variant="text" to="/login">
				<template #prefix>
					<MIcon name="light-arrow-left" size="sm" />
				</template>
				Back to sign in
			</MButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, nextTick, ref } from 'vue'
import { authPolicy } from '~/data/features/onboarding'

interface Props {
	// from the emailed link; shown so people know which account they're changing
	email?: string
}

const props = withDefaults(defineProps<Props>(), {
	email: '',
})

const emit = defineEmits<{
	(_e: 'submit', _passwords: { password: string, password_confirmation: string }): void
}>()

const form_ref = ref<HTMLFormElement | null>(null)
const heading_ref = ref<ComponentPublicInstance | null>(null)
const password = ref('')
const password_confirmation = ref('')
const is_attempted = ref(false)

const errors = computed(() => {
	const result = { password: '', password_confirmation: '' }
	if (!is_attempted.value) return result

	const min_length = authPolicy.passwordMinLength

	if (!password.value) result.password = 'Enter a new password.'
	else if (password.value.length < min_length) result.password = `Use at least ${min_length} characters.`

	if (!password_confirmation.value) result.password_confirmation = 'Enter the new password again.'
	else if (password_confirmation.value !== password.value) result.password_confirmation = 'The passwords don’t match. Enter the same password twice.'

	return result
})

async function submit() {
	is_attempted.value = true

	if (errors.value.password || errors.value.password_confirmation) {
		await nextTick()
		form_ref.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
		return
	}

	emit('submit', { password: password.value, password_confirmation: password_confirmation.value })

	// Passwords leave with the request and are never kept (docs/ARCHITECTURE.md §5).
	password.value = ''
	password_confirmation.value = ''
	is_attempted.value = false
}

function focusHeading() {
	(heading_ref.value?.$el as HTMLElement | undefined)?.focus()
}

defineExpose({ focusHeading })
</script>

<style lang="scss" scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: 28px;

	&__head {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__title:focus {
		outline: none;
	}

	&__fields {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__back {
		display: flex;
		justify-content: center;
	}
}
</style>
