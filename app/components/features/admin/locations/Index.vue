<template>
	<MPage
		id="admin-locations"
		class="locations"
		title="Locations"
		description="Countries, regions and cities used for headquarters, operating sites, markets served and search filters. A city can sit under a region or straight under its country."
	>
		<template #actions>
			<MButton @click="openAdd({ type: 'country', parent_id: null })">
				<template #prefix>
					<MIcon name="light-plus" size="xs" />
				</template>
				Add country
			</MButton>
		</template>

		<MAlert v-if="notice" :tone="notice_tone" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<Tree
			:locations="rows"
			:expanded="expanded"
			@toggle="toggle"
			@expand-all="expandAll"
			@collapse-all="expanded = []"
			@set-active="setActive"
			@action="onAction"
		/>

		<Editor
			:modal="editor_modal"
			:location="editing"
			:preset="preset"
			:locations="rows"
			@save="onSave"
		/>

		<LifecycleModal
			:name="lifecycle_modal"
			kind="location"
			:action="lifecycle_action"
			:subject="target?.name ?? ''"
			:note="lifecycle_note"
			@confirm="onLifecycle"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdminLocation, AdminLocationPayload } from '~/types/features/admin'
import type { LocationType } from '~/types/features/directory'
import { pluralize } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import Editor from './Editor.vue'
import Tree from './Tree.vue'

// GET / POST /api/admin/locations and the location lifecycle
// (docs/API.md §8, docs/DATABASE.md §4.6).
interface Props {
	locations: AdminLocation[]
}

interface EditorPreset {
	type: LocationType
	parent_id: number | null
}

const props = withDefaults(defineProps<Props>(), {})

const { openModal } = useModal()

const editor_modal = 'admin-location-editor'
const lifecycle_modal = 'admin-location-lifecycle'

// Edits change this local copy while the UI is static.
const rows = ref<AdminLocation[]>(props.locations.map(location => ({ ...location })))
// the first country starts open so the tree reads as a tree
const expanded = ref<number[]>(rows.value.filter(item => item.type === 'country').slice(0, 1).map(item => item.id))
const editing = ref<AdminLocation | null>(null)
const preset = ref<EditorPreset | null>(null)
const target = ref<AdminLocation | null>(null)
const lifecycle_action = ref<'delete' | 'restore'>('delete')
const notice = ref('')
const notice_tone = ref<'success' | 'danger'>('success')

function findRow(id: number | null): AdminLocation | undefined {
	return id === null ? undefined : rows.value.find(item => item.id === id)
}

function childrenOf(id: number): AdminLocation[] {
	return rows.value.filter(item => item.parent_id === id)
}

const lifecycle_note = computed(() => {
	const location = target.value
	if (!location || lifecycle_action.value === 'restore') return ''
	const count = childrenOf(location.id).filter(item => !item.deleted_at).length
	return count ? `${pluralize(count, 'place')} inside ${location.name} will be hidden with it.` : ''
})

function say(message: string, tone: 'success' | 'danger' = 'success') {
	notice.value = message
	notice_tone.value = tone
}

function update(id: number, changes: Partial<AdminLocation>) {
	rows.value = rows.value.map(item => (item.id === id ? { ...item, ...changes } : item))
}

// open every ancestor so a place is visible in the tree
function reveal(id: number | null) {
	let current = findRow(id)
	while (current) {
		if (!expanded.value.includes(current.id)) expanded.value = [...expanded.value, current.id]
		current = findRow(current.parent_id)
	}
}

function toggle(id: number) {
	expanded.value = expanded.value.includes(id)
		? expanded.value.filter(item => item !== id)
		: [...expanded.value, id]
}

function expandAll() {
	expanded.value = rows.value.filter(item => childrenOf(item.id).length).map(item => item.id)
}

function openAdd(next: EditorPreset) {
	editing.value = null
	preset.value = next
	openModal(editor_modal)
}

function setActive(location: AdminLocation, value: boolean) {
	update(location.id, { is_active: value })
	say(value
		? `${location.name} is active again in filters and editors.`
		: `${location.name} is inactive. Profiles keep it, but it’s hidden from filters and editors.`)
}

function onAction(location: AdminLocation, action: string) {
	if (action === 'add-child') {
		openAdd({ type: location.type === 'country' ? 'region' : 'city', parent_id: location.id })
		return
	}

	if (action === 'edit') {
		editing.value = location
		preset.value = null
		openModal(editor_modal)
		return
	}

	if (action === 'restore') {
		// the API rechecks the parent and sibling slugs before restoring
		const parent = findRow(location.parent_id)
		if (parent?.deleted_at) {
			say(`Restore ${parent.name} first. ${location.name} can’t come back while its parent is deleted.`, 'danger')
			return
		}
		const taken = rows.value.some(other =>
			other.id !== location.id
			&& !other.deleted_at
			&& other.parent_id === location.parent_id
			&& other.slug === location.slug,
		)
		if (taken) {
			say(`Another place${parent ? ` in ${parent.name}` : ''} already uses the slug “${location.slug}”. Change that one first.`, 'danger')
			return
		}
	}

	if (action === 'delete' || action === 'restore') {
		target.value = location
		lifecycle_action.value = action
		openModal(lifecycle_modal)
	}
}

function onLifecycle() {
	const location = target.value
	if (!location) return

	if (lifecycle_action.value === 'delete') {
		update(location.id, { deleted_at: new Date().toISOString() })
		say(`${location.name} was deleted and hidden from filters, landing pages and editors.`)
	}
	else {
		update(location.id, { deleted_at: null })
		say(`${location.name} was restored${location.is_active ? '' : '. It’s still inactive; switch it on when it should appear in filters'}.`)
	}

	target.value = null
}

function nextSortOrder(parent_id: number | null): number {
	const siblings = rows.value.filter(item => item.parent_id === parent_id)
	return Math.max(0, ...siblings.map(item => item.sort_order)) + 1
}

function onSave(payload: AdminLocationPayload, id: number | null) {
	if (id !== null) {
		const current = findRow(id)
		const moved = current && current.parent_id !== payload.parent_id
		update(id, { ...payload, ...(moved ? { sort_order: nextSortOrder(payload.parent_id) } : {}) })
		reveal(payload.parent_id)
		say(`Saved ${payload.name}.`)
		return
	}

	rows.value = [
		...rows.value,
		{
			id: Math.max(0, ...rows.value.map(item => item.id)) + 1,
			...payload,
			sort_order: nextSortOrder(payload.parent_id),
			deleted_at: null,
		},
	]
	reveal(payload.parent_id)

	const parent = findRow(payload.parent_id)
	say(parent ? `${payload.name} was added to ${parent.name}.` : `${payload.name} was added as a country.`)
}
</script>

<style lang="scss" scoped>
.locations {
	min-width: 0;
}
</style>
