<template>
	<MModal :name="props.modal" :max-width="560">
		<template #header>{{ props.term ? `Edit ${props.term.name}` : `Add a ${props.singular.toLowerCase()}` }}</template>

		<template #content>
			<form id="taxonomy-term-form" class="term" novalidate @submit.prevent="submit">
				<MInput
					id="taxonomy-term-name"
					v-model="name"
					name="name"
					autocomplete="off"
					required
					:has-error="Boolean(errors.name)"
					@update:model-value="onName"
				>
					<template #label>Name</template>
					<template #error>{{ errors.name }}</template>
				</MInput>

				<MInput
					id="taxonomy-term-slug"
					v-model="slug"
					name="slug"
					autocomplete="off"
					required
					:has-error="Boolean(errors.slug)"
					@update:model-value="slug_edited = true"
				>
					<template #label>Slug</template>
					<template #hint>
						Used in URLs and filters. Lowercase letters, numbers and hyphens.
						{{ props.term ? '' : 'Filled in from the name until you change it.' }}
					</template>
					<template #error>{{ errors.slug }}</template>
				</MInput>

				<MTextarea
					id="taxonomy-term-description"
					v-model="description"
					name="description"
					:rows="3"
					:max-length="300"
					optional
				>
					<template #label>Description</template>
					<template #hint>A sentence buyers see on catalog and landing pages.</template>
				</MTextarea>

				<div class="term__active">
					<MSwitch id="taxonomy-term-active" v-model="is_active" aria-describedby="taxonomy-term-active-hint">
						Active
					</MSwitch>
					<MText id="taxonomy-term-active-hint" size="small" color="--text-muted" class="term__hint">
						Active terms appear in search filters and profile editors.
					</MText>
				</div>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.modal)">Cancel</MButton>
			<MButton type="submit" form="taxonomy-term-form">
				{{ props.term ? 'Save changes' : `Add ${props.singular.toLowerCase()}` }}
			</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { AdminTaxonomyTerm, AdminTermPayload } from '~/types/features/admin'
import { slugify } from '~/utils/format'

// POST / PATCH /api/admin/{taxonomy}. Slugs are unique among live terms
// of the same taxonomy (docs/DATABASE.md §4.7).
interface Props {
	// the MModal name
	modal: string
	// "Service", "Industry"…
	singular: string
	// the term being edited; null adds a new one
	term?: AdminTaxonomyTerm | null
	// every term in this taxonomy, for the slug check
	terms?: AdminTaxonomyTerm[]
}

const props = withDefaults(defineProps<Props>(), {
	term: null,
	terms: () => [],
})

const emit = defineEmits<{
	(_e: 'save', _payload: AdminTermPayload, _id: number | null): void
}>()

const { closeModal, isOpen } = useModal()

const name = ref('')
const slug = ref('')
const description = ref('')
const is_active = ref(true)
// once someone types a slug, the name stops overwriting it
const slug_edited = ref(false)
const errors = reactive({ name: '', slug: '' })

const is_open = computed(() => isOpen(props.modal))

// load the term (or a blank form) each time the dialog opens
watch([is_open, () => props.term], ([open]) => {
	if (!open) return
	name.value = props.term?.name ?? ''
	slug.value = props.term?.slug ?? ''
	description.value = props.term?.description ?? ''
	is_active.value = props.term?.is_active ?? true
	slug_edited.value = Boolean(props.term)
	errors.name = ''
	errors.slug = ''
})

function onName(value: string) {
	if (!slug_edited.value) slug.value = slugify(value)
}

function slugError(value: string): string {
	if (!value) return 'Enter a slug.'
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers and single hyphens only.'
	const taken = props.terms.some(other => other.id !== props.term?.id && !other.deleted_at && other.slug === value)
	return taken ? `Another ${props.singular.toLowerCase()} already uses this slug.` : ''
}

function validate(): boolean {
	errors.name = name.value.trim() ? '' : 'Enter a name.'
	errors.slug = slugError(slug.value.trim())
	return !errors.name && !errors.slug
}

async function submit() {
	if (!validate()) {
		await nextTick()
		document.getElementById(errors.name ? 'taxonomy-term-name' : 'taxonomy-term-slug')?.focus()
		return
	}

	emit(
		'save',
		{
			name: name.value.trim(),
			slug: slug.value.trim(),
			description: description.value.trim() || null,
			is_active: is_active.value,
		},
		props.term?.id ?? null,
	)
	closeModal(props.modal)
}
</script>

<style lang="scss" scoped>
.term {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__active {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
}
</style>
