<template>
	<MFormSection
		id="danger"
		class="danger"
		title="Danger zone"
		description="Deleting is a soft delete: the record stays so it can be restored, but its access and claims don’t."
	>
		<div v-if="!props.company.deleted_at" class="danger__panel">
			<div class="danger__text">
				<MHeading variant="3" size="6" weight="semi-bold" class="danger__title">Delete this company</MHeading>
				<MText size="small" color="--text-secondary" class="danger__body">
					Hides the listing and its team, removes every membership, rejects pending and approved claims,
					and revokes unused invitations and claim links.
				</MText>
			</div>
			<MButton variant="destructive" @click="openModal(modal)">
				<template #prefix>
					<MIcon name="light-trash" size="xs" />
				</template>
				Delete company
			</MButton>
		</div>

		<div v-else class="danger__panel danger__panel--restore">
			<div class="danger__text">
				<MHeading variant="3" size="6" weight="semi-bold" class="danger__title">Restore this company</MHeading>
				<MText size="small" color="--text-secondary" class="danger__body">
					Deleted {{ formatDate(props.company.deleted_at) }}. Restoring brings it back as an unclaimed draft.
					A new claim and review are needed before anyone can manage it again.
				</MText>
			</div>
			<MButton @click="openModal(modal)">
				<template #prefix>
					<MIcon name="light-undo" size="xs" />
				</template>
				Restore company
			</MButton>
		</div>

		<LifecycleModal
			:name="modal"
			kind="company"
			:action="props.company.deleted_at ? 'restore' : 'delete'"
			:subject="props.company.name"
			@confirm="confirm"
		/>
	</MFormSection>
</template>

<script setup lang="ts">
import MFormSection from '~/components/core/form/MFormSection.vue'
import { formatDate } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import type { AdminCompanyDetail } from '~/types/features/admin'

// DELETE /api/admin/companies/{id} and POST .../restore (docs/API.md §8).
interface Props {
	company: AdminCompanyDetail
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'update', _changes: Partial<AdminCompanyDetail>, _message: string): void
}>()

const { openModal } = useModal()

const modal = 'admin-company-danger'

function confirm() {
	if (props.company.deleted_at) {
		emit(
			'update',
			{ deleted_at: null, status: 'draft', claimed_at: null, owners: [] },
			`${props.company.name} was restored as an unclaimed draft.`,
		)
		return
	}

	emit(
		'update',
		{ deleted_at: new Date().toISOString(), claimed_at: null, owners: [] },
		`${props.company.name} was deleted. Its team is hidden and its open claims were rejected.`,
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
