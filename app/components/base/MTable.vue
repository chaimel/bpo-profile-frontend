<template>
	<div :class="['m-table', { 'm-table--dense': props.dense }]">
		<div class="m-table__scroll">
			<table class="m-table__table">
				<caption v-if="props.caption" class="sr-only">{{ props.caption }}</caption>
				<thead>
					<tr>
						<th
							v-for="column in props.columns"
							:key="column.key"
							scope="col"
							:class="cellClass(column)"
							:style="column.width ? { width: column.width } : undefined"
						>
							<span :class="{ 'sr-only': column.srOnlyLabel }">{{ column.label }}</span>
						</th>
					</tr>
				</thead>
				<tbody v-if="props.rows.length">
					<tr
						v-for="(row, index) in props.rows"
						:key="keyOf(row, index)"
						:class="['m-table__row', { 'm-table__row--muted': props.mutedRow?.(row) }]"
					>
						<td v-for="column in props.columns" :key="column.key" :class="cellClass(column)">
							<slot :name="`cell-${column.key}`" :row="row" :value="valueOf(row, column.key)">
								{{ valueOf(row, column.key) }}
							</slot>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="!props.rows.length" class="m-table__empty">
			<slot name="empty">Nothing to show yet.</slot>
		</div>
	</div>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn } from '~/types/base/ui'

interface Props {
	columns: TableColumn[]
	rows: T[]
	// field name or function giving each row a stable key
	rowKey?: string | ((row: T) => string | number)
	// visually hidden caption that names the table for screen readers
	caption?: string
	dense?: boolean
	// dim rows such as soft-deleted records
	mutedRow?: (row: T) => boolean
}

const props = withDefaults(defineProps<Props>(), {
	rowKey: 'id',
	caption: undefined,
	dense: false,
	mutedRow: undefined,
})

function valueOf(row: T, key: string): unknown {
	return (row as Record<string, unknown>)[key]
}

function keyOf(row: T, index: number): string | number {
	if (typeof props.rowKey === 'function') return props.rowKey(row)
	const key = valueOf(row, props.rowKey)
	return typeof key === 'string' || typeof key === 'number' ? key : index
}

function cellClass(column: TableColumn) {
	return [
		'm-table__cell',
		`m-table__cell--${column.align ?? 'left'}`,
		column.hideBelow ? `m-table__cell--hide-${column.hideBelow}` : '',
	]
}
</script>
