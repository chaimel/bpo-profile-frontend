<template>
	<MModal :name="props.name" class="invite">
		<template #header>Invite by email</template>

		<template #content>
			<form v-if="can_invite" :id="form_id" class="invite__fields" novalidate @submit.prevent="submit">
				<MText color="--text-secondary" class="invite__intro">
					We’ll email a link that lets them sign in and take over the profile. It only works for the address you enter, and it replaces any earlier invitation for the same profile.
				</MText>

				<div v-if="props.member" class="invite__profile">
					<MAvatar :name="fullName(props.member)" size="sm" decorative />
					<span class="invite__profile-text">
						<span class="invite__profile-name">{{ fullName(props.member) }}</span>
						{{ props.member.job_title }}
					</span>
				</div>

				<MSelect
					v-else
					:id="`${props.name}-profile`"
					v-model="fields.professional_id"
					name="professional_id"
					:options="candidate_options"
					placeholder="Choose a profile"
					required
					:has-error="Boolean(errors.professional_id)"
				>
					<template #label>Profile</template>
					<template #hint>Only profiles that don’t have a login yet can be invited.</template>
					<template #error>{{ errors.professional_id }}</template>
				</MSelect>

				<MInput
					:id="`${props.name}-email`"
					v-model="fields.email"
					name="email"
					type="email"
					autocomplete="off"
					:max-length="255"
					required
					:has-error="Boolean(errors.email)"
				>
					<template #label>Their email address</template>
					<template #error>{{ errors.email }}</template>
				</MInput>
			</form>

			<MText v-else color="--text-secondary" class="invite__intro">
				Invitations are for roster profiles that don’t have a login yet, and there aren’t any right now. Add the person as a team member first, then invite them.
			</MText>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.name)">Cancel</MButton>
			<MButton v-if="can_invite" type="submit" :form="form_id">
				<template #prefix>
					<MIcon name="light-paper-plane" size="xs" />
				</template>
				Send invitation
			</MButton>
			<MButton v-else @click="emit('add-member')">Add team member</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import type { TeamMember } from '~/types/features/dashboard'
import { fullName } from '~/utils/format'

// POST .../team/{professionalId}/invitations — for an unlinked roster
// profile only; it grants no access until accepted (docs/API.md §5).
interface Props {
	name: string
	// preselected from a member's row; null lets the user choose
	member?: TeamMember | null
	// roster profiles without a login
	candidates: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
	member: null,
})

const emit = defineEmits<{
	(_e: 'invite', _value: { professional_id: number, email: string }): void
	(_e: 'add-member'): void
}>()

const { closeModal, isOpen } = useModal()

const form_id = `${props.name}-fields`
const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fields = reactive({ professional_id: '', email: '' })
const errors = reactive<{ professional_id?: string, email?: string }>({})

const can_invite = computed(() => Boolean(props.member) || props.candidates.length > 0)

const candidate_options = computed<SelectOption[]>(() =>
	props.candidates.map(member => ({ label: `${fullName(member)} — ${member.job_title}`, value: String(member.id) })),
)

// Start clean on every open. 'post' runs after the parent has passed
// down the member the dialog was opened for.
watch(() => isOpen(props.name), (open) => {
	if (!open) return
	const only = props.candidates.length === 1 ? props.candidates[0] : undefined
	fields.professional_id = props.member ? String(props.member.id) : only ? String(only.id) : ''
	fields.email = ''
	errors.professional_id = undefined
	errors.email = undefined
}, { flush: 'post' })

function submit() {
	const email = fields.email.trim()

	errors.professional_id = fields.professional_id ? undefined : 'Choose the profile this invitation is for.'
	errors.email = !email
		? 'Enter the email address to send the invitation to.'
		: email_pattern.test(email) ? undefined : 'Enter an email address in the format name@company.com.'
	if (errors.professional_id || errors.email) return

	emit('invite', { professional_id: Number(fields.professional_id), email })
	closeModal(props.name)
}
</script>

<style lang="scss" scoped>
.invite {
	&__fields {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	&__profile {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border-radius: var(--radius-sm);
		background: var(--canvas);
	}

	&__profile-text {
		display: flex;
		flex-direction: column;
		font-size: 15px;
		line-height: 22px;
		color: var(--text-secondary);
	}

	&__profile-name {
		font-family: var(--font-ui);
		font-weight: 600;
		color: var(--text-primary);
	}
}
</style>
