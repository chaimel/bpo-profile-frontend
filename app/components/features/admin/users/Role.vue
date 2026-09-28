<template>
	<MModal :name="props.modal" :max-width="560">
		<template #header>Change role</template>

		<template #content>
			<div class="role">
				<MText size="medium" color="--text-secondary" class="role__intro">
					Choose what {{ name }} can do on BPO Profile. Company access still comes from their memberships,
					whatever you pick.
				</MText>

				<fieldset class="role__options">
					<legend class="sr-only">Role for {{ name }}</legend>
					<MRadio
						id="user-role-user"
						v-model="role"
						name="user-role"
						value="user"
						variant="card"
					>
						Provider account
						<template #description>Their own companies, profile and claims. No admin access.</template>
					</MRadio>
					<MRadio
						id="user-role-admin"
						v-model="role"
						name="user-role"
						value="admin"
						variant="card"
					>
						Platform admin
						<template #description>Moderation, catalogs and every account.</template>
					</MRadio>
				</fieldset>

				<MText size="small" color="--text-secondary" class="role__note">
					<MIcon name="light-info-circle" size="sm" color="text-muted" />
					Saving a new role signs {{ first_name }} out everywhere. They sign in again with their password and an
					emailed code.
				</MText>
			</div>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.modal)">Cancel</MButton>
			<MButton :disabled="!props.user || role === props.user.platform_role" @click="save">Save role</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AdminUser } from '~/types/features/admin'
import type { PlatformRole } from '~/types/features/dashboard'

// PATCH /api/admin/users/{id} with a new platform_role. A role change
// invalidates the account's sessions (docs/PLAN.md §4.5).
interface Props {
	// the MModal name
	modal: string
	user?: AdminUser | null
}

const props = withDefaults(defineProps<Props>(), {
	user: null,
})

const emit = defineEmits<{
	(_e: 'save', _role: PlatformRole): void
}>()

const { closeModal, isOpen } = useModal()

const role = ref<string>(props.user?.platform_role ?? 'user')

const name = computed(() => (props.user ? `${props.user.first_name} ${props.user.last_name}` : 'this person'))
const first_name = computed(() => props.user?.first_name ?? 'them')

// preselect the current role each time the dialog opens
watch([() => isOpen(props.modal), () => props.user], ([open]) => {
	if (open) role.value = props.user?.platform_role ?? 'user'
})

function save() {
	emit('save', role.value === 'admin' ? 'admin' : 'user')
	closeModal(props.modal)
}
</script>

<style lang="scss" scoped>
.role {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__options {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 0;
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 8px;

		.m-icon {
			margin-top: 3px;
		}
	}
}
</style>
