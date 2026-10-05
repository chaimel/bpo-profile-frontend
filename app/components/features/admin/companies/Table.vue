<template>
	<div class="table">
		<MTable :columns="columns" :rows="props.rows" caption="Companies" :muted-row="isDeleted">
			<template #cell-company="{ row }">
				<div class="table__company">
					<MLogo :name="row.name" :src="row.logo_url" size="sm" decorative />
					<div class="table__company-text">
						<NuxtLink
							:to="`/admin/companies/${row.id}`"
							:class="['table__name', { 'table__name--muted': row.deleted_at }]"
						>
							{{ row.name }}
						</NuxtLink>
						<span class="table__meta">
							{{ row.deleted_at ? `Deleted ${formatDate(row.deleted_at)}` : (row.hq ?? 'No headquarters yet') }}
						</span>
					</div>
				</div>
			</template>

			<template #cell-status="{ row }">
				<MBadge v-if="row.deleted_at" tone="danger" icon="light-trash" size="sm">Deleted</MBadge>
				<MStatusBadge v-else kind="publication" :status="row.status" size="sm" />
			</template>

			<template #cell-claimed="{ row }">
				<YesNo :value="Boolean(row.claimed_at)" />
			</template>

			<template #cell-verified="{ row }">
				<YesNo :value="Boolean(row.verified_at)" />
			</template>

			<template #cell-plan="{ row }">
				{{ planLabel(row.plan) }}
			</template>

			<template #cell-completeness="{ row }">
				<div class="table__completeness">
					<MProgress
						:value="row.completeness_score"
						size="sm"
						:threshold="80"
						:aria-label="`Profile completeness for ${row.name}`"
					/>
					<span class="table__score" aria-hidden="true">{{ row.completeness_score }}%</span>
				</div>
			</template>

			<template #cell-updated="{ row }">
				<span class="table__date">{{ formatDate(row.updated_at) }}</span>
			</template>

			<template #cell-actions="{ row }">
				<RowMenu :label="`Actions for ${row.name}`" :items="actionsFor(row)" @select="onSelect(row, $event)" />
			</template>

			<template #empty>
				<MEmptyState icon="light-building" variant="plain" heading-level="2">
					<template #title>No companies found</template>
					{{ props.hasFilters ? 'Try another status or clear the search.' : 'Create a company to get started.' }}
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
import type { AdminCompanyRow } from '~/types/features/admin'
import { formatDate } from '~/utils/format'
import RowMenu from '../shared/RowMenu.vue'
import YesNo from '../shared/YesNo.vue'

const { planLabel } = useCatalogStore()

interface Props {
	rows: AdminCompanyRow[]
	unpublishableIds?: number[]
	hasFilters?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	unpublishableIds: () => [],
	hasFilters: false,
})

const emit = defineEmits<{
	(_e: 'action', _row: AdminCompanyRow, _action: string): void
	(_e: 'clear-filters'): void
}>()

const columns: TableColumn[] = [
	{ key: 'company', label: 'Company' },
	{ key: 'status', label: 'Status' },
	{ key: 'claimed', label: 'Claimed', hideBelow: 'md' },
	{ key: 'verified', label: 'Verified', hideBelow: 'md' },
	{ key: 'plan', label: 'Plan', hideBelow: 'lg' },
	{ key: 'completeness', label: 'Completeness', hideBelow: 'lg', width: '150px' },
	{ key: 'updated', label: 'Updated', hideBelow: 'lg' },
	{ key: 'actions', label: 'Actions', align: 'right', srOnlyLabel: true, width: '64px' },
]

function isDeleted(row: AdminCompanyRow): boolean {
	return Boolean(row.deleted_at)
}

function actionsFor(row: AdminCompanyRow): DropdownItem[] {
	const items: DropdownItem[] = [
		{ label: 'View details', value: 'view', icon: 'light-file-details', to: `/admin/companies/${row.id}` },
	]

	if (row.deleted_at) {
		items.push({ label: 'Restore company', value: 'restore', icon: 'light-undo', divided: true })
		return items
	}

	if (row.status === 'published') {
		items.push({ label: 'Open public profile', value: 'public', icon: 'light-external-link', to: `/companies/${row.slug}` })
		items.push({ label: 'Unpublish', value: 'unpublish', icon: 'light-eye-slash', divided: true })
	}
	else if (props.unpublishableIds.includes(row.id)) {
		// the API would refuse; show what's missing instead
		items.push({ label: 'Review before publishing', value: 'review', icon: 'light-clipboard-list', to: `/admin/companies/${row.id}#moderation`, divided: true })
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

	items.push({ label: 'Delete company', value: 'delete', icon: 'light-trash', tone: 'danger', divided: true })
	return items
}

function onSelect(row: AdminCompanyRow, item: DropdownItem) {
	// links navigate on their own
	if (item.to) return
	emit('action', row, item.value)
}
</script>

<style lang="scss" scoped>
.table {
	&__company {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 220px;
	}

	&__company-text {
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

	&__meta,
	&__date {
		font-size: 13px;
		color: var(--text-muted);
		white-space: nowrap;
	}

	&__completeness {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	&__score {
		min-width: 36px;
		font-size: 13px;
		font-weight: 600;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
}
</style>
