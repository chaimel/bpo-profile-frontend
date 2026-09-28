<template>
	<li class="branch">
		<div
			:class="[
				'branch__row',
				{
					'branch__row--country': props.location.type === 'country',
					'branch__row--deleted': props.location.deleted_at,
				},
			]"
			:style="{ '--depth': props.depth }"
		>
			<div class="branch__name">
				<button
					v-if="children.length"
					type="button"
					:class="['branch__toggle', { 'branch__toggle--open': is_expanded }]"
					:aria-expanded="is_expanded"
					:aria-controls="children_id"
					:aria-label="`Places in ${props.location.name}`"
					@click="emit('toggle', props.location.id)"
				>
					<MIcon name="light-angle-right" size="xs" />
				</button>
				<span v-else class="branch__spacer" aria-hidden="true" />

				<span class="branch__label">{{ props.location.name }}</span>
				<span v-if="props.location.iso_code" class="branch__iso">{{ props.location.iso_code }}</span>
				<MBadge v-if="props.location.deleted_at" tone="danger" icon="light-trash" size="sm">Deleted</MBadge>
				<span v-else-if="summary" class="branch__summary">{{ summary }}</span>
			</div>

			<div class="branch__type">
				<MBadge :tone="type_tones[props.location.type]" size="sm">{{ type_labels[props.location.type] }}</MBadge>
			</div>

			<div class="branch__slug">
				<code class="branch__code">{{ props.location.slug }}</code>
			</div>

			<div class="branch__active">
				<MSwitch
					:model-value="props.location.is_active"
					:label="`Active: ${props.location.name}`"
					:disabled="Boolean(props.location.deleted_at)"
					@update:model-value="emit('set-active', props.location, $event)"
				/>
				<span class="branch__state" aria-hidden="true">{{ props.location.is_active ? 'Active' : 'Inactive' }}</span>
			</div>

			<div class="branch__actions">
				<RowMenu
					:label="`Actions for ${props.location.name}`"
					:items="actions"
					@select="emit('action', props.location, $event.value)"
				/>
			</div>
		</div>

		<ul
			v-if="children.length"
			v-show="is_expanded"
			:id="children_id"
			class="branch__children"
			:aria-label="`Places in ${props.location.name}`"
		>
			<Branch
				v-for="child in children"
				:key="child.id"
				:location="child"
				:depth="props.depth + 1"
				:locations="props.locations"
				:expanded="props.expanded"
				@toggle="emit('toggle', $event)"
				@set-active="onSetActive"
				@action="onAction"
			/>
		</ul>
	</li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownItem, Tone } from '~/types/base/ui'
import type { AdminLocation } from '~/types/features/admin'
import type { LocationType } from '~/types/features/directory'
import { pluralize } from '~/utils/format'
import RowMenu from '../shared/RowMenu.vue'

// One place and, when open, the places inside it. Renders itself for
// each child.
defineOptions({ name: 'Branch' })

interface Props {
	location: AdminLocation
	depth: number
	// the whole tree, to find this place's children
	locations: AdminLocation[]
	expanded: number[]
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'toggle', _id: number): void
	(_e: 'set-active', _location: AdminLocation, _value: boolean): void
	(_e: 'action', _location: AdminLocation, _action: string): void
}>()

// children's events pass straight up to the tree
function onSetActive(location: AdminLocation, value: boolean) {
	emit('set-active', location, value)
}

function onAction(location: AdminLocation, action: string) {
	emit('action', location, action)
}

const type_labels: Record<LocationType, string> = {
	country: 'Country',
	region: 'Region',
	city: 'City',
}

const type_tones: Record<LocationType, Tone> = {
	country: 'slate',
	region: 'brand',
	city: 'neutral',
}

const children = computed(() =>
	props.locations
		.filter(location => location.parent_id === props.location.id)
		.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
)

const is_expanded = computed(() => props.expanded.includes(props.location.id))
const children_id = computed(() => `location-children-${props.location.id}`)

// "3 regions · 1 city" for countries and regions
const summary = computed(() => {
	const live = children.value.filter(location => !location.deleted_at)
	const regions = live.filter(location => location.type === 'region').length
	const cities = live.filter(location => location.type === 'city').length
	const parts: string[] = []
	if (regions) parts.push(pluralize(regions, 'region'))
	if (cities) parts.push(pluralize(cities, 'city', 'cities'))
	return parts.join(' · ')
})

const actions = computed<DropdownItem[]>(() => {
	if (props.location.deleted_at) {
		return [{ label: 'Restore location', value: 'restore', icon: 'light-undo' }]
	}

	const items: DropdownItem[] = []
	if (props.location.type === 'country') items.push({ label: 'Add region or city', value: 'add-child', icon: 'light-plus' })
	if (props.location.type === 'region') items.push({ label: 'Add city', value: 'add-child', icon: 'light-plus' })
	items.push({ label: 'Edit', value: 'edit', icon: 'light-edit' })
	items.push({ label: 'Delete location', value: 'delete', icon: 'light-trash', tone: 'danger', divided: true })
	return items
})
</script>

<style lang="scss" scoped>
.branch {
	&__row {
		display: grid;
		grid-template-columns: var(--tree-columns);
		align-items: center;
		gap: 12px;
		min-height: 52px;
		padding: 6px 16px;
		border-bottom: var(--rule);
		font-family: var(--font-ui);
		font-size: 14px;
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--brand-tint);
		}

		&--country {
			background: var(--canvas);
		}

		&--deleted {
			color: var(--text-muted);
		}
	}

	// one line: the toggle, name and code stay together and only the
	// name's own text wraps in a narrow column
	&__name {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
		padding-left: calc(var(--depth) * 28px);
	}

	&__toggle {
		display: inline-grid;
		place-items: center;
		flex: 0 0 auto;
		width: 28px;
		height: 28px;
		border-radius: var(--radius-xs);
		color: var(--text-secondary);
		cursor: pointer;

		&:hover {
			background: var(--surface-muted);
			color: var(--text-primary);
		}

		.m-icon {
			transition: transform 0.15s ease;
		}

		&--open .m-icon {
			transform: rotate(90deg);
		}
	}

	&__spacer {
		flex: 0 0 auto;
		width: 28px;
	}

	&__label {
		min-width: 0;
		font-weight: 600;
		color: var(--text-primary);
		overflow-wrap: break-word;
	}

	&__row--deleted .branch__label {
		color: var(--text-muted);
	}

	&__iso {
		flex: 0 0 auto;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--text-muted);
	}

	&__summary {
		flex: 0 1 auto;
		min-width: 0;
		font-size: 12px;
		color: var(--text-muted);
	}

	&__code {
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
		font-size: 13px;
		color: var(--text-secondary);
	}

	&__actions {
		display: flex;
		justify-content: flex-end;
	}

	&__children:empty {
		display: none;
	}
}

@media only screen and (max-width: 768px) {
	.branch {
		&__slug,
		&__state,
		&__summary {
			display: none;
		}

		&__name {
			padding-left: calc(var(--depth) * 16px);
		}
	}
}

@media only screen and (max-width: 600px) {
	.branch__type {
		display: none;
	}
}
</style>
