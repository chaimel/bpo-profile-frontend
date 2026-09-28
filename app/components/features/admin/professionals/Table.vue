<template>
	<div class="table">
		<MTable :columns="columns" :rows="props.rows" caption="Professionals" :muted-row="isDeleted">
			<template #cell-person="{ row }">
				<div class="table__person">
					<MAvatar :name="fullName(row)" :src="row.photo_url" size="sm" decorative />
					<div class="table__person-text">
						<NuxtLink
							:to="`/admin/professionals/${row.id}`"
							:class="['table__name', { 'table__name--muted': row.deleted_at }]"
						>
							{{ fullName(row) }}
						</NuxtLink>
						<span class="table__meta">{{ row.job_title }}</span>
					</div>
				</div>
			</template>

			<template #cell-company="{ row }">
				<NuxtLink :to="`/admin/companies/${row.company.id}`" class="table__company">
					{{ row.company.name }}
				</NuxtLink>
			</template>

			<template #cell-affiliation="{ row }">
				<MStatusBadge kind="affiliation" :status="row.affiliation_status" size="sm" />
			</template>

			<template #cell-status="{ row }">
				<MBadge v-if="row.deleted_at" tone="danger" icon="light-trash" size="sm">Deleted</MBadge>
				<MStatusBadge v-else kind="publication" :status="row.status" size="sm" />
			</template>

			<template #cell-verified="{ row }">
				<YesNo :value="Boolean(row.verified_at)" />
			</template>

			<template #cell-account="{ row }">
				<YesNo :value="row.has_account" yes="Linked" no="No login" />
			</template>

			<template #cell-updated="{ row }">
				<span class="table__date">{{ formatDate(row.updated_at) }}</span>
			</template>

			<template #cell-actions="{ row }">
				<RowMenu :label="`Actions for ${fullName(row)}`" :items="actionsFor(row)" @select="onSelect(row, $event)" />
			</template>

			<template #empty>
				<MEmptyState icon="light-id-card" variant="plain" heading-level="2">
					<template #title>No professionals found</template>
					{{ props.hasFilters ? 'Try another status or clear the search.' : 'Create a roster profile to get started.' }}
					<template v-if="props.hasFilters" #actions>
						<MButton variant="neutral" size="sm" @click="emit('clear-filters')">Clear filters</MButton>
					</template>
				</MEmptyState>
			</template>
		</MTable>
	</div>
</template>

<script setup lang="ts">
import MStatusBadge from '~/components/core/status/MStatusBadge.vue'
import type { DropdownItem, TableColumn } from '~/types/base/ui'
import type { AdminCompanyRow, AdminProfessionalRow } from '~/types/features/admin'
import { formatDate, fullName } from '~/utils/format'
import RowMenu from '../shared/RowMenu.vue'
import YesNo from '../shared/YesNo.vue'

interface Props {
	rows: AdminProfessionalRow[]
	// parent companies, to know which profiles can be public
	companies: AdminCompanyRow[]
	unpublishableIds?: number[]
	hasFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	unpublishableIds: () => [],
	hasFilters: false,
})

const emit = defineEmits<{
	(_e: 'action', _row: AdminProfessionalRow, _action: string): void
	(_e: 'clear-filters'): void
}>()

const columns: TableColumn[] = [
	{ key: 'person', label: 'Person' },
	{ key: 'company', label: 'Company', hideBelow: 'md' },
	{ key: 'affiliation', label: 'Affiliation' },
	{ key: 'status', label: 'Status' },
	{ key: 'verified', label: 'Verified', hideBelow: 'lg' },
	{ key: 'account', label: 'Account', hideBelow: 'lg' },
	{ key: 'updated', label: 'Updated', hideBelow: 'lg' },
	{ key: 'actions', label: 'Actions', align: 'right', srOnlyLabel: true, width: '64px' },
]

function isDeleted(row: AdminProfessionalRow): boolean {
	return Boolean(row.deleted_at)
}

// A public profile needs publication, an approved affiliation and a
// live, published company (docs/DATABASE.md §4.5).
function isPublic(row: AdminProfessionalRow): boolean {
	const company = props.companies.find(item => item.id === row.company.id)
	return row.status === 'published'
		&& row.affiliation_status === 'approved'
		&& company?.status === 'published'
		&& !company.deleted_at
}

function actionsFor(row: AdminProfessionalRow): DropdownItem[] {
	const items: DropdownItem[] = [
		{ label: 'View details', value: 'view', icon: 'light-file-details', to: `/admin/professionals/${row.id}` },
	]

	if (row.deleted_at) {
		items.push({ label: 'Restore profile', value: 'restore', icon: 'light-undo', divided: true })
		return items
	}

	if (isPublic(row)) {
		items.push({ label: 'Open public profile', value: 'public', icon: 'light-external-link', to: `/professionals/${row.slug}` })
	}

	if (row.affiliation_status === 'pending') {
		items.push({ label: 'Review affiliation', value: 'affiliation', icon: 'light-user-check', to: `/admin/professionals/${row.id}#affiliation` })
	}

	if (row.status === 'published') {
		items.push({ label: 'Unpublish', value: 'unpublish', icon: 'light-eye-slash', divided: true })
	}
	else if (props.unpublishableIds.includes(row.id)) {
		items.push({ label: 'Review before publishing', value: 'review', icon: 'light-clipboard-list', to: `/admin/professionals/${row.id}#moderation`, divided: true })
	}
	else {
		items.push({ label: 'Publish', value: 'publish', icon: 'light-check-circle', divided: true })
	}

	if (row.status === 'pending_review') {
		items.push({ label: 'Return to draft', value: 'draft', icon: 'light-file-edit' })
	}

	if (row.status === 'suspended') {
		items.push({ label: 'Lift suspension', value: 'lift', icon: 'light-undo' })
	}
	else {
		items.push({ label: 'Suspend', value: 'suspend', icon: 'light-exclamation-triangle' })
	}

	items.push({ label: 'Delete profile', value: 'delete', icon: 'light-trash', tone: 'danger', divided: true })
	return items
}

function onSelect(row: AdminProfessionalRow, item: DropdownItem) {
	// links navigate on their own
	if (item.to) return
	emit('action', row, item.value)
}
</script>

<style lang="scss" scoped>
.table {
	&__person {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 220px;
	}

	&__person-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	&__name {
		font-weight: 600;
		color: var(--text-primary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}

		&--muted {
			color: var(--text-muted);
		}
	}

	&__meta {
		font-size: 13px;
		color: var(--text-muted);
	}

	&__date {
		font-size: 13px;
		color: var(--text-muted);
		white-space: nowrap;
	}

	&__company {
		color: var(--text-secondary);

		&:hover {
			color: var(--brand-strong);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}
}
</style>
