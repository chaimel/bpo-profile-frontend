<template>
	<div class="table">
		<MTable :columns="columns" :rows="props.rows" :caption="`${props.singular} terms`" :muted-row="isDeleted">
			<template #cell-name="{ row }">
				<div class="table__term">
					<span :class="['table__name', { 'table__name--muted': row.deleted_at }]">{{ row.name }}</span>
					<span v-if="row.deleted_at" class="table__meta">Deleted {{ formatDate(row.deleted_at) }}</span>
					<span v-else-if="row.description" class="table__description">{{ row.description }}</span>
				</div>
			</template>

			<template #cell-slug="{ row }">
				<code class="table__slug">{{ row.slug }}</code>
			</template>

			<template #cell-active="{ row }">
				<div class="table__active">
					<MSwitch
						:model-value="row.is_active"
						:label="`Active: ${row.name}`"
						:disabled="Boolean(row.deleted_at)"
						@update:model-value="emit('toggle-active', row, $event)"
					/>
					<span class="table__state" aria-hidden="true">{{ row.is_active ? 'Active' : 'Inactive' }}</span>
				</div>
			</template>

			<template #cell-order="{ row }">
				<span class="table__number">{{ row.sort_order }}</span>
			</template>

			<template #cell-usage="{ row }">
				<span :class="['table__number', { 'table__number--zero': !row.usage_count }]">
					{{ pluralize(row.usage_count, 'profile') }}
				</span>
			</template>

			<template #cell-actions="{ row }">
				<RowMenu :label="`Actions for ${row.name}`" :items="actionsFor(row)" @select="emit('action', row, $event.value)" />
			</template>

			<template #empty>
				<MEmptyState icon="light-tags" variant="plain" heading-level="3">
					<template #title>No terms yet</template>
					Add the first one to make it available in filters and profile editors.
				</MEmptyState>
			</template>
		</MTable>
	</div>
</template>

<script setup lang="ts">
import type { DropdownItem, TableColumn } from '~/types/base/ui'
import type { AdminTaxonomyTerm } from '~/types/features/admin'
import { formatDate, pluralize } from '~/utils/format'
import RowMenu from '../shared/RowMenu.vue'

interface Props {
	rows: AdminTaxonomyTerm[]
	// "Service", "Industry"…
	singular: string
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'toggle-active', _term: AdminTaxonomyTerm, _value: boolean): void
	(_e: 'action', _term: AdminTaxonomyTerm, _action: string): void
}>()

const columns: TableColumn[] = [
	{ key: 'name', label: 'Name' },
	{ key: 'slug', label: 'Slug', hideBelow: 'md' },
	{ key: 'active', label: 'Active' },
	{ key: 'order', label: 'Sort order', align: 'right', hideBelow: 'lg' },
	{ key: 'usage', label: 'Used by', align: 'right', hideBelow: 'md' },
	{ key: 'actions', label: 'Actions', align: 'right', srOnlyLabel: true, width: '64px' },
]

function isDeleted(row: AdminTaxonomyTerm): boolean {
	return Boolean(row.deleted_at)
}

function actionsFor(row: AdminTaxonomyTerm): DropdownItem[] {
	if (row.deleted_at) {
		return [{ label: `Restore ${props.singular.toLowerCase()}`, value: 'restore', icon: 'light-undo' }]
	}

	return [
		{ label: 'Edit', value: 'edit', icon: 'light-edit' },
		{ label: `Delete ${props.singular.toLowerCase()}`, value: 'delete', icon: 'light-trash', tone: 'danger', divided: true },
	]
}
</script>

<style lang="scss" scoped>
.table {
	&__term {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 200px;
		max-width: 420px;
	}

	&__name {
		font-weight: 600;
		color: var(--text-primary);

		&--muted {
			color: var(--text-muted);
		}
	}

	&__description {
		font-family: var(--font-base);
		font-size: 15px;
		line-height: 21px;
		color: var(--text-secondary);
	}

	&__meta {
		font-size: 13px;
		color: var(--text-muted);
	}

	&__slug {
		padding: 2px 6px;
		border-radius: var(--radius-xs);
		background: var(--surface-muted);
		font-size: 13px;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	&__active {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	&__state {
		min-width: 56px;
		font-size: 13px;
		color: var(--text-secondary);
	}

	&__number {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;

		&--zero {
			color: var(--text-muted);
		}
	}
}
</style>
