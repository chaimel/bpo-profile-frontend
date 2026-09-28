<template>
	<MPage
		id="admin-taxonomies"
		class="taxonomies"
		title="Taxonomies"
		description="The terms companies and professionals choose from, and the filters buyers search with."
	>
		<template #actions>
			<MButton @click="openAdd">
				<template #prefix>
					<MIcon name="light-plus" size="xs" />
				</template>
				Add {{ labels.singular.toLowerCase() }}
			</MButton>
		</template>

		<Nav :active="props.taxonomy" :counts="props.counts" />

		<div class="taxonomies__intro">
			<MHeading variant="2" size="5">{{ labels.plural }}</MHeading>
			<MText size="small" color="--text-secondary" class="taxonomies__summary">
				{{ pluralize(live_count, 'term') }}, {{ active_count }} active. Inactive terms stay on existing profiles
				but disappear from filters and editors.
			</MText>
		</div>

		<MAlert tone="neutral">
			Work model isn’t edited here. It’s a fixed list (onshore, offshore, nearshore and hybrid), so every
			filter and profile uses the same words.
		</MAlert>

		<MAlert v-if="notice" :tone="notice_tone" live dismissible @dismiss="notice = ''">
			{{ notice }}
		</MAlert>

		<Table
			:rows="sorted_rows"
			:singular="labels.singular"
			@toggle-active="setActive"
			@action="onAction"
		/>

		<Term
			:modal="term_modal"
			:singular="labels.singular"
			:term="editing"
			:terms="rows"
			@save="onSave"
		/>

		<LifecycleModal
			:name="lifecycle_modal"
			kind="term"
			:action="lifecycle_action"
			:subject="target?.name ?? ''"
			:note="lifecycle_note"
			@confirm="onLifecycle"
		/>
	</MPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { taxonomyLabels } from '~/data/features/taxonomies'
import type { AdminTaxonomyTerm, AdminTermPayload } from '~/types/features/admin'
import type { TaxonomyKey } from '~/types/features/directory'
import { pluralize } from '~/utils/format'
import LifecycleModal from '../shared/LifecycleModal.vue'
import Nav from './Nav.vue'
import Table from './Table.vue'
import Term from './Term.vue'

// GET / POST /api/admin/{taxonomy} and the term lifecycle, for the five
// allowlisted taxonomies (docs/API.md §8).
interface Props {
	taxonomy: TaxonomyKey
	terms: AdminTaxonomyTerm[]
	// live terms per taxonomy, for the tabs
	counts: Record<TaxonomyKey, number>
}

const props = withDefaults(defineProps<Props>(), {})

const { openModal } = useModal()

const term_modal = 'admin-taxonomy-term'
const lifecycle_modal = 'admin-taxonomy-lifecycle'

// Edits change this local copy while the UI is static.
const rows = ref<AdminTaxonomyTerm[]>(props.terms.map(term => ({ ...term })))
const editing = ref<AdminTaxonomyTerm | null>(null)
const target = ref<AdminTaxonomyTerm | null>(null)
const lifecycle_action = ref<'delete' | 'restore'>('delete')
const notice = ref('')
const notice_tone = ref<'success' | 'danger'>('success')

const labels = computed(() => taxonomyLabels[props.taxonomy])

const sorted_rows = computed(() =>
	[...rows.value].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
)

const live_count = computed(() => rows.value.filter(term => !term.deleted_at).length)
const active_count = computed(() => rows.value.filter(term => !term.deleted_at && term.is_active).length)

const lifecycle_note = computed(() => {
	const term = target.value
	if (!term || lifecycle_action.value === 'restore') return ''
	return term.usage_count
		? `${term.name} is on ${pluralize(term.usage_count, 'company or professional profile', 'company and professional profiles')} today.`
		: `No profiles use ${term.name} today.`
})

function say(message: string, tone: 'success' | 'danger' = 'success') {
	notice.value = message
	notice_tone.value = tone
}

function update(id: number, changes: Partial<AdminTaxonomyTerm>) {
	rows.value = rows.value.map(term => (term.id === id ? { ...term, ...changes } : term))
}

function openAdd() {
	editing.value = null
	openModal(term_modal)
}

function setActive(term: AdminTaxonomyTerm, value: boolean) {
	update(term.id, { is_active: value })
	say(value
		? `${term.name} is active again in filters and profile editors.`
		: `${term.name} is inactive. Profiles keep it, but it’s hidden from filters and editors.`)
}

function onAction(term: AdminTaxonomyTerm, action: string) {
	if (action === 'edit') {
		editing.value = term
		openModal(term_modal)
		return
	}

	if (action === 'restore') {
		// the API refuses a restore while a live term holds the slug
		const taken = rows.value.some(other => other.id !== term.id && !other.deleted_at && other.slug === term.slug)
		if (taken) {
			say(`Another ${labels.value.singular.toLowerCase()} already uses the slug “${term.slug}”. Change that one first, then restore ${term.name}.`, 'danger')
			return
		}
	}

	if (action === 'delete' || action === 'restore') {
		target.value = term
		lifecycle_action.value = action
		openModal(lifecycle_modal)
	}
}

function onLifecycle() {
	const term = target.value
	if (!term) return

	if (lifecycle_action.value === 'delete') {
		update(term.id, { deleted_at: new Date().toISOString() })
		say(`${term.name} was deleted and hidden everywhere buyers and providers see it.`)
	}
	else {
		update(term.id, { deleted_at: null })
		say(`${term.name} was restored${term.is_active ? '' : '. It’s still inactive; switch it on when providers should see it'}.`)
	}

	target.value = null
}

function onSave(payload: AdminTermPayload, id: number | null) {
	if (id !== null) {
		update(id, payload)
		say(`Saved ${payload.name}.`)
		return
	}

	rows.value = [
		...rows.value,
		{
			id: Math.max(0, ...rows.value.map(term => term.id)) + 1,
			...payload,
			sort_order: Math.max(0, ...rows.value.map(term => term.sort_order)) + 1,
			usage_count: 0,
			deleted_at: null,
		},
	]
	say(`${payload.name} was added to ${labels.value.plural.toLowerCase()}.`)
}
</script>

<style lang="scss" scoped>
.taxonomies {
	&__intro {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
}
</style>
