<template>
	<MFormSection
		id="danger"
		class="danger"
		title="Danger zone"
		description="Deleting is a soft delete: the profile can come back, but its access and approvals don’t."
	>
		<div v-if="!props.professional.deleted_at" class="danger__panel">
			<div class="danger__text">
				<MHeading variant="3" size="6" weight="semi-bold" class="danger__title">Delete this profile</MHeading>
				<MText size="small" color="--text-secondary" class="danger__body">
					Removes it from the directory and stops new personal inquiries, revokes unused invitations, and
					removes a professional-only company membership.
				</MText>
			</div>
			<MButton variant="destructive" @click="openModal(modal)">
				<template #prefix>
					<MIcon name="light-trash" size="xs" />
				</template>
				Delete profile
			</MButton>
		</div>

		<div v-else class="danger__panel danger__panel--restore">
			<div class="danger__text">
				<MHeading variant="3" size="6" weight="semi-bold" class="danger__title">Restore this profile</MHeading>
				<MText size="small" color="--text-secondary" class="danger__body">
					Deleted {{ formatDate(props.professional.deleted_at) }}. Restoring brings it back as a draft with its
					affiliation pending. No membership or invitation comes back with it.
				</MText>
			</div>
			<MButton @click="openModal(modal)">
				<template #prefix>
					<MIcon name="light-undo" size="xs" />
				</template>
				Restore profile
			</MButton>
		</div>

		<LifecycleModal
			:name="modal"
			kind="professional"
			:action="props.professional.deleted_at ? 'restore' : 'delete'"
			:subject="`${props.professional.first_name} ${props.professional.last_name}`"
			@confirm="confirm"
		/>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import { formatDate } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import type { AdminProfessionalDetail } from '~/types/features/admin'

// DELETE /api/admin/professionals/{id} and POST .../restore
// (docs/API.md §5, §8).
interface Props {
	professional: AdminProfessionalDetail
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminProfessionalDetail>, _message: string): void
}>()

const { openModal } = useModal()

const modal = 'admin-professional-danger'

function confirm() {
	const name = `${props.professional.first_name} ${props.professional.last_name}`

	if (props.professional.deleted_at) {
		emit(
			'update',
			{
				deleted_at: null,
				status: 'draft',
				affiliation_status: 'pending',
				affiliation_reviewed_by: null,
				affiliation_reviewed_at: null,
				verified_at: null,
			},
			`${name} was restored as a draft. The affiliation needs approving again.`,
		)
		return
	}

	const role = props.professional.membership_role
	emit(
		'update',
		// an independent owner or admin role survives
		{ deleted_at: new Date().toISOString(), membership_role: role === 'professional' ? null : role },
		`${name} was deleted and removed from ${props.professional.company.name}’s public team.`,
	)
}
</script>

<style lang="scss" scoped>
.danger {
	&__panel {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px 24px;
		padding: 18px 20px;
		border-radius: var(--radius-sm);
		box-shadow: inset 0 0 0 1px var(--danger-soft), inset 4px 0 0 var(--danger);

		&--restore {
			box-shadow: inset 0 0 0 1px var(--border), inset 4px 0 0 var(--slate);
		}
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-width: 520px;
	}

	&__title {
		font-family: var(--font-ui);
	}
}

@media only screen and (max-width: 768px) {
	.danger {
		&__panel {
			flex-direction: column;
			align-items: flex-start;
		}
	}
}
</style>
