<template>
	<form class="form" novalidate @submit.prevent="submit">
		<header class="form__head">
			<MHeading ref="heading_ref" variant="1" size="3" tabindex="-1" class="form__title">
				Reset your password
			</MHeading>
			<MText size="large" color="--text-secondary">
				Enter the email address you sign in with. We’ll send you a link to choose a new password.
			</MText>
		</header>

		<MInput
			id="forgot-email"
			v-model="email_model"
			name="email"
			type="email"
			autocomplete="email"
			:has-error="Boolean(error)"
		>
			<template #label>Email</template>
			<template #error>{{ error }}</template>
		</MInput>

		<MButton type="submit" size="lg" block>Send reset link</MButton>

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
import { type ComponentPublicInstance, computed, ref } from 'vue'

interface Props {
	email?: string
}

const props = withDefaults(defineProps<Props>(), {
	email: '',
})

const emit = defineEmits<{
	(_e: 'update:email' | 'submit', _value: string): void
}>()

const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const heading_ref = ref<ComponentPublicInstance | null>(null)
const is_attempted = ref(false)

const email_model = computed({
	get: () => props.email,
	set: (value: string) => emit('update:email', value),
})

const error = computed(() => {
	if (!is_attempted.value) return ''
	const email = email_model.value.trim()
	if (!email) return 'Enter your email address.'
	if (!email_pattern.test(email)) return 'Enter an email address like name@company.com.'
	return ''
})

function submit() {
	is_attempted.value = true

	if (error.value) {
		document.getElementById('forgot-email')?.focus()
		return
	}

	emit('submit', email_model.value.trim())
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

	&__back {
		display: flex;
		justify-content: center;
	}
}
</style>
