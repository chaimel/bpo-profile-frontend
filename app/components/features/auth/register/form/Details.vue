<template>
	<fieldset class="details">
		<legend class="details__legend">Your details</legend>

		<div class="details__fields">
			<div class="details__names">
				<MInput
					id="register-first-name"
					v-model="first_name"
					name="first_name"
					autocomplete="given-name"
					:has-error="Boolean(props.errors.first_name)"
				>
					<template #label>First name</template>
					<template #error>{{ props.errors.first_name }}</template>
				</MInput>

				<MInput
					id="register-last-name"
					v-model="last_name"
					name="last_name"
					autocomplete="family-name"
					:has-error="Boolean(props.errors.last_name)"
				>
					<template #label>Last name</template>
					<template #error>{{ props.errors.last_name }}</template>
				</MInput>
			</div>

			<MInput
				id="register-email"
				v-model="email"
				name="email"
				type="email"
				autocomplete="email"
				:has-error="Boolean(props.errors.email)"
			>
				<template #label>Work email</template>
				<template #hint>{{ props.emailHint }}</template>
				<template #error>{{ props.errors.email }}</template>
			</MInput>

			<MInput
				id="register-password"
				v-model="password"
				name="password"
				type="password"
				autocomplete="new-password"
				revealable
				:has-error="Boolean(props.errors.password)"
			>
				<template #label>Password</template>
				<template #hint>
					Use at least {{ authPolicy.passwordMinLength }} characters. A few unrelated words make a strong one.
				</template>
				<template #error>{{ props.errors.password }}</template>
			</MInput>

			<MInput
				id="register-password-confirmation"
				v-model="password_confirmation"
				name="password_confirmation"
				type="password"
				autocomplete="new-password"
				revealable
				:has-error="Boolean(props.errors.password_confirmation)"
			>
				<template #label>Confirm password</template>
				<template #error>{{ props.errors.password_confirmation }}</template>
			</MInput>
		</div>
	</fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { authPolicy } from '~/data/features/onboarding'

type DetailsField = 'first_name' | 'last_name' | 'email' | 'password' | 'password_confirmation'

interface Props {
	firstName: string
	lastName: string
	email: string
	password: string
	passwordConfirmation: string
	errors: Partial<Record<DetailsField, string>>
	emailHint: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(
		_e: 'update:firstName' | 'update:lastName' | 'update:email' | 'update:password' | 'update:passwordConfirmation',
		_value: string,
	): void
}>()

const first_name = computed({
	get: () => props.firstName,
	set: (value: string) => emit('update:firstName', value),
})

const last_name = computed({
	get: () => props.lastName,
	set: (value: string) => emit('update:lastName', value),
})

const email = computed({
	get: () => props.email,
	set: (value: string) => emit('update:email', value),
})

const password = computed({
	get: () => props.password,
	set: (value: string) => emit('update:password', value),
})

const password_confirmation = computed({
	get: () => props.passwordConfirmation,
	set: (value: string) => emit('update:passwordConfirmation', value),
})
</script>

<style lang="scss" scoped>
.details {
	&__legend {
		padding-bottom: 12px;
		font-family: var(--font-ui);
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		color: var(--text-primary);
	}

	&__fields {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__names {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px 16px;
	}
}

@media only screen and (max-width: 600px) {
	.details {
		&__names {
			grid-template-columns: 1fr;
		}
	}
}
</style>
