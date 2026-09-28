<template>
	<div class="members">
		<MTable :columns="columns" :rows="props.members" caption="Team members">
			<template #cell-person="{ row }">
				<div class="members__person">
					<MAvatar :name="fullName(row)" :src="row.photo_url" size="md" decorative class="members__avatar" />
					<div class="members__who">
						<span class="members__name">
							{{ fullName(row) }}
							<MBadge v-if="row.id === props.ownProfessionalId" tone="slate" size="sm">You</MBadge>
						</span>
						<span class="members__title">{{ row.job_title }}</span>
					</div>
				</div>
			</template>

			<template #cell-status="{ row }">
				<MStatusBadge kind="publication" :status="row.status" size="sm" />
			</template>

			<template #cell-account="{ row }">
				<MBadge v-if="row.has_account" tone="success" icon="light-user-check" size="sm">Linked</MBadge>
				<MBadge v-else tone="neutral" icon="light-user" size="sm">No login yet</MBadge>
			</template>

			<template #cell-verified="{ row }">
				<MBadge v-if="row.verified" tone="brand" icon="light-check-circle" size="sm">Verified</MBadge>
				<MBadge v-else tone="neutral" size="sm">Not yet</MBadge>
			</template>

			<template #cell-completeness="{ row }">
				<div class="members__completeness">
					<MProgress
						:value="row.completeness_score"
						:threshold="profileCompleteThreshold"
						:aria-label="`Profile completeness for ${fullName(row)}`"
						size="sm"
					/>
					<span class="members__score" aria-hidden="true">{{ row.completeness_score }}%</span>
				</div>
			</template>

			<template #cell-actions="{ row }">
				<MDropdown
					:label="`Actions for ${fullName(row)}`"
					:items="actionsFor(row)"
					icon="light-dots-horizontal"
					icon-only
					variant="ghost"
					@select="onSelect(row, $event)"
				/>
			</template>

			<template #empty>
				No one is on the team yet. Add a roster profile, or approve a request from someone who registered with your company.
			</template>
		</MTable>

		<MText size="small" color="--text-secondary" class="members__note">
			<MIcon name="light-info-circle" size="sm" class="members__note-icon" />
			<span>A roster profile with no login is managed by your company. Invite the person by email so they can sign in and keep it up to date themselves.</span>
		</MText>
	</div>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { DropdownItem, TableColumn } from '~/types/base/ui'
import type { TeamMember } from '~/types/features/dashboard'
import { fullName } from '~/utils/format'

const { profileCompleteThreshold } = useDashboardStore()

interface Props {
	members: TeamMember[]
	companyId: number
	editableIds: number[]
	ownProfessionalId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
	ownProfessionalId: null,
})

const emit = defineEmits<{
	(_e: 'invite' | 'remove', _member: TeamMember): void
}>()

const columns: TableColumn[] = [
	{ key: 'person', label: 'Person' },
	{ key: 'status', label: 'Profile' },
	{ key: 'account', label: 'Account', hideBelow: 'md' },
	{ key: 'verified', label: 'Verified', hideBelow: 'lg' },
	{ key: 'completeness', label: 'Completeness', hideBelow: 'md', width: '170px' },
	{ key: 'actions', label: 'Actions', srOnlyLabel: true, align: 'right', width: '64px' },
]

function actionsFor(member: TeamMember): DropdownItem[] {
	const items: DropdownItem[] = []

	// your own profile has its own editor under "Your sales profile"
	if (member.id === props.ownProfessionalId) {
		items.push({ label: 'Edit your profile', value: 'edit', icon: 'light-edit', to: '/dashboard/profile' })
	}
	else if (props.editableIds.includes(member.id)) {
		items.push({ label: 'Edit profile', value: 'edit', icon: 'light-edit', to: `/dashboard/companies/${props.companyId}/team/${member.id}` })
	}

	if (!member.has_account) {
		items.push({ label: 'Invite by email', value: 'invite', icon: 'light-envelope' })
	}

	items.push({
		label: 'Remove from team',
		value: 'remove',
		icon: 'light-trash',
		tone: 'danger',
		divided: items.length > 0,
	})

	return items
}

function onSelect(member: TeamMember, item: DropdownItem) {
	if (item.value === 'invite') emit('invite', member)
	if (item.value === 'remove') emit('remove', member)
}
</script>

<style lang="scss" scoped>
.members {
	display: flex;
	flex-direction: column;
	gap: 16px;

	// Let the row menus spill out of the table instead of being clipped
	// by its scroll box. Phones hide columns rather than scroll.
	:deep(.m-table),
	:deep(.m-table__scroll) {
		overflow: visible;
	}

	:deep(thead th:first-child) {
		border-top-left-radius: var(--radius-md);
	}

	:deep(thead th:last-child) {
		border-top-right-radius: var(--radius-md);
	}

	&__person {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	&__who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	&__name {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
		font-weight: 600;
	}

	&__title {
		font-size: 13px;
		color: var(--text-secondary);
	}

	&__muted {
		color: var(--text-muted);
	}

	&__completeness {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	&__score {
		flex: 0 0 auto;
		min-width: 36px;
		font-size: 13px;
		font-weight: 600;
		text-align: right;
	}

	&__note {
		display: flex;
		align-items: flex-start;
		gap: 10px;
	}

	&__note-icon {
		flex: 0 0 auto;
		margin-top: 2px;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 768px) {
	.members {
		:deep(.m-table__table) {
			min-width: 0;
		}
	}
}

// phones: the name, profile status and menu must fit 343px without the avatar
@media only screen and (max-width: 600px) {
	.members {
		&__avatar {
			display: none;
		}
	}
}
</style>
