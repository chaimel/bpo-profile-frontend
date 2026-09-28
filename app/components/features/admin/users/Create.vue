<template>
	<MModal :name="props.modal" :max-width="600">
		<template #header>Create an account</template>

		<template #content>
			<form id="create-user-form" class="create" novalidate @submit.prevent="submit">
				<div class="create__names">
					<MInput
						id="create-user-first"
						v-model="first_name"
						name="first_name"
						autocomplete="off"
						required
						:has-error="Boolean(errors.first)"
					>
						<template #label>First name</template>
						<template #error>{{ errors.first }}</template>
					</MInput>

					<MInput
						id="create-user-last"
						v-model="last_name"
						name="last_name"
						autocomplete="off"
						required
						:has-error="Boolean(errors.last)"
					>
						<template #label>Last name</template>
						<template #error>{{ errors.last }}</template>
					</MInput>
				</div>

				<MInput
					id="create-user-email"
					v-model="email"
					name="email"
					type="email"
					autocomplete="off"
					required
					:has-error="Boolean(errors.email)"
				>
					<template #label>Email</template>
					<template #hint>They verify it with an emailed code the first time they sign in.</template>
					<template #error>{{ errors.email }}</template>
				</MInput>

				<fieldset class="create__types">
					<legend class="create__legend">Account type</legend>
					<MRadio
						id="create-user-type-user"
						v-model="platform_role"
						name="create-user-type"
						value="user"
						variant="card"
					>
						Provider account
						<template #description>
							Can register a company, ask to join one as a professional, or submit a claim.
						</template>
					</MRadio>
					<MRadio
						id="create-user-type-admin"
						v-model="platform_role"
						name="create-user-type"
						value="admin"
						variant="card"
					>
						Platform admin
						<template #description>
							Full access to moderation, catalogs and accounts. Keep this list short.
						</template>
					</MRadio>
				</fieldset>

				<MAlert tone="neutral">
					Company ownership only comes from the reviewed claim workflow or company registration. You can’t
					attach this account to a company here.
				</MAlert>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.modal)">Cancel</MButton>
			<MButton type="submit" form="create-user-form">Create account</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { AdminUserPayload } from '~/types/features/admin'

// POST /api/admin/users: a provider or platform-admin account with no
// ownership shortcut (docs/API.md §8).
interface Props {
	// the MModal name
	modal: string
	// emails already in use
	emails?: string[]
}

const props = withDefaults(defineProps<Props>(), {
	emails: () => [],
})

const emit = defineEmits<{
	(_e: 'create', _payload: AdminUserPayload): void
}>()

const { closeModal, isOpen } = useModal()

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const platform_role = ref('user')
const errors = reactive({ first: '', last: '', email: '' })

const is_open = computed(() => isOpen(props.modal))

// start clean every time the dialog opens
watch(is_open, (open) => {
	if (!open) return
	first_name.value = ''
	last_name.value = ''
	email.value = ''
	platform_role.value = 'user'
	Object.assign(errors, { first: '', last: '', email: '' })
})

function emailError(value: string): string {
	if (!value) return 'Enter an email address.'
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter an email address like name@company.com.'
	if (props.emails.some(existing => existing.toLowerCase() === value.toLowerCase())) {
		return 'An account with this email already exists.'
	}
	return ''
}

function validate(): boolean {
	errors.first = first_name.value.trim() ? '' : 'Enter a first name.'
	errors.last = last_name.value.trim() ? '' : 'Enter a last name.'
	errors.email = emailError(email.value.trim())
	return !errors.first && !errors.last && !errors.email
}

async function submit() {
	if (!validate()) {
		await nextTick()
		const fields: [string, string][] = [
			['create-user-first', errors.first],
			['create-user-last', errors.last],
			['create-user-email', errors.email],
		]
		const field_id = fields.find(([, message]) => message)?.[0]
		if (field_id) document.getElementById(field_id)?.focus()
		return
	}

	emit('create', {
		first_name: first_name.value.trim(),
		last_name: last_name.value.trim(),
		email: email.value.trim(),
		platform_role: platform_role.value === 'admin' ? 'admin' : 'user',
	})
	closeModal(props.modal)
}
</script>

<style lang="scss" scoped>
.create {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__names {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	&__types {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		min-width: 0;
	}

	&__legend {
		margin-bottom: 10px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}
}

@media only screen and (max-width: 600px) {
	.create {
		&__names,
		&__types {
			grid-template-columns: 1fr;
		}
	}
}
</style>
