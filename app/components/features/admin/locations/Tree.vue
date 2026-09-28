<template>
	<section class="tree" aria-labelledby="location-tree-title">
		<div class="tree__bar">
			<div class="tree__heading">
				<MHeading id="location-tree-title" variant="2" size="5">All places</MHeading>
				<MText size="xsmall" color="--text-muted" class="tree__count">{{ counts }}</MText>
			</div>
			<div class="tree__controls">
				<MButton variant="ghost" size="sm" @click="emit('expand-all')">Expand all</MButton>
				<MButton variant="ghost" size="sm" @click="emit('collapse-all')">Collapse all</MButton>
			</div>
		</div>

		<div class="tree__panel">
			<div class="tree__head" aria-hidden="true">
				<span>Name</span>
				<span class="tree__head-type">Type</span>
				<span class="tree__head-slug">Slug</span>
				<span>Active</span>
				<span />
			</div>

			<ul class="tree__list" aria-label="Countries">
				<Branch
					v-for="country in countries"
					:key="country.id"
					:location="country"
					:depth="0"
					:locations="props.locations"
					:expanded="props.expanded"
					@toggle="emit('toggle', $event)"
					@set-active="onSetActive"
					@action="onAction"
				/>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdminLocation } from '~/types/features/admin'
import { pluralize } from '~/utils/format'
import Branch from './Branch.vue'

// Country -> region -> city, with cities allowed straight under a
// country (docs/DATABASE.md §4.6). Countries and regions fold open.
interface Props {
	locations: AdminLocation[]
	// ids of the places whose children are showing
	expanded: number[]
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
	(_e: 'toggle', _id: number): void
	(_e: 'expand-all' | 'collapse-all'): void
	(_e: 'set-active', _location: AdminLocation, _value: boolean): void
	(_e: 'action', _location: AdminLocation, _action: string): void
}>()

function onSetActive(location: AdminLocation, value: boolean) {
	emit('set-active', location, value)
}

function onAction(location: AdminLocation, action: string) {
	emit('action', location, action)
}

const countries = computed(() =>
	props.locations
		.filter(location => location.parent_id === null)
		.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
)

const counts = computed(() => {
	const live = props.locations.filter(location => !location.deleted_at)
	const count = (type: AdminLocation['type']) => live.filter(location => location.type === type).length
	return [
		pluralize(count('country'), 'country', 'countries'),
		pluralize(count('region'), 'region'),
		pluralize(count('city'), 'city', 'cities'),
	].join(' · ')
})
</script>

<style lang="scss" scoped>
.tree {
	// shared by the header row here and every row in Branch.vue
	--tree-columns: minmax(0, 1fr) 104px minmax(0, 200px) 132px 48px;

	display: flex;
	flex-direction: column;
	gap: 12px;

	&__bar {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__heading {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	&__count {
		font-family: var(--font-ui);
	}

	&__controls {
		display: flex;
		gap: 4px;
	}

	// a real border: row backgrounds would paint over an inset one.
	// RowMenu pins its menus to the viewport, so clipping is safe here.
	&__panel {
		overflow: hidden;
		border: var(--rule);
		border-radius: var(--radius-md);
		background: var(--white);
	}

	// tucks the last row's rule under the panel border
	&__list {
		margin-bottom: -1px;
	}

	&__head {
		display: grid;
		grid-template-columns: var(--tree-columns);
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		border-bottom: var(--rule);
		background: var(--canvas);
		font-family: var(--font-ui);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
}

@media only screen and (max-width: 768px) {
	.tree {
		--tree-columns: minmax(0, 1fr) auto 64px 44px;

		&__head-slug {
			display: none;
		}
	}
}

// phones: the indent already shows the level, so the type column goes
// and the names get the room
@media only screen and (max-width: 600px) {
	.tree {
		--tree-columns: minmax(0, 1fr) 64px 44px;

		&__head-type {
			display: none;
		}
	}
}
</style>
