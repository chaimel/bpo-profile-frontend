<template>
	<MModal :name="props.modal" :max-width="580">
		<template #header>{{ title }}</template>

		<template #content>
			<form id="location-editor-form" class="editor" novalidate @submit.prevent="submit">
				<MSelect
					id="location-editor-type"
					v-model="type"
					name="type"
					:options="type_options"
					:disabled="type_options.length < 2"
				>
					<template #label>Type</template>
					<template v-if="props.location" #hint>A place keeps its type. Add a new one to change it.</template>
				</MSelect>

				<MSelect
					v-if="type !== 'country'"
					id="location-editor-parent"
					v-model="parent_id"
					name="parent_id"
					:options="parent_options"
					placeholder="Choose where it sits"
					required
					:has-error="Boolean(errors.parent)"
				>
					<template #label>Parent</template>
					<template #hint>
						{{ type === 'region' ? 'Regions sit under a country.' : 'Cities sit under a region, or straight under a country.' }}
					</template>
					<template #error>{{ errors.parent }}</template>
				</MSelect>

				<MInput
					id="location-editor-name"
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

				<div class="editor__pair">
					<MInput
						id="location-editor-slug"
						v-model="slug"
						name="slug"
						autocomplete="off"
						required
						:has-error="Boolean(errors.slug)"
						@update:model-value="slug_edited = true"
					>
						<template #label>Slug</template>
						<template #hint>Unique among places with the same parent.</template>
						<template #error>{{ errors.slug }}</template>
					</MInput>

					<MInput
						v-if="type === 'country'"
						id="location-editor-iso"
						v-model="iso_code"
						name="iso_code"
						autocomplete="off"
						:max-length="2"
						placeholder="PH"
						required
						:has-error="Boolean(errors.iso)"
					>
						<template #label>ISO code</template>
						<template #hint>Two letters, ISO 3166-1.</template>
						<template #error>{{ errors.iso }}</template>
					</MInput>
				</div>

				<div class="editor__active">
					<MSwitch id="location-editor-active" v-model="is_active" aria-describedby="location-editor-active-hint">
						Active
					</MSwitch>
					<MText id="location-editor-active-hint" size="small" color="--text-muted" class="editor__hint">
						Active places appear in search filters and can be picked in profile editors.
					</MText>
				</div>
			</form>
		</template>

		<template #footer>
			<MButton variant="neutral" @click="closeModal(props.modal)">Cancel</MButton>
			<MButton type="submit" form="location-editor-form">{{ props.location ? 'Save changes' : 'Add location' }}</MButton>
		</template>
	</MModal>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import type { AdminLocation, AdminLocationPayload } from '~/types/features/admin'
import type { LocationType } from '~/types/features/directory'
import { slugify } from '~/utils/format'

// POST / PATCH /api/admin/locations. Parents must fit the hierarchy
// and slugs are unique per parent (docs/DATABASE.md §4.6).
interface Props {
	// the MModal name
	modal: string
	// the place being edited; null adds one
	location?: AdminLocation | null
	// type and parent to start from when adding
	preset?: { type: LocationType, parent_id: number | null } | null
	// the whole tree, for parents and slug checks
	locations?: AdminLocation[]
}

const props = withDefaults(defineProps<Props>(), {
	location: null,
	preset: null,
	locations: () => [],
})

const emit = defineEmits<{
	(_e: 'save', _payload: AdminLocationPayload, _id: number | null): void
}>()

const { closeModal, isOpen } = useModal()

const type_labels: Record<LocationType, string> = {
	country: 'Country',
	region: 'Region or state',
	city: 'City',
}

const type = ref<string>('country')
const parent_id = ref('')
const name = ref('')
const slug = ref('')
const iso_code = ref('')
const is_active = ref(true)
// once someone types a slug, the name stops overwriting it
const slug_edited = ref(false)
const errors = reactive({ parent: '', name: '', slug: '', iso: '' })

const is_open = computed(() => isOpen(props.modal))

function findRow(id: number | null | undefined): AdminLocation | undefined {
	return id === null || id === undefined ? undefined : props.locations.find(item => item.id === id)
}

function isType(value: string): value is LocationType {
	return value in type_labels
}

// what the new place can be, given where it's being added
const allowed_types = computed<LocationType[]>(() => {
	if (props.location) return [props.location.type]
	const parent = findRow(props.preset?.parent_id)
	if (!parent) return ['country']
	return parent.type === 'country' ? ['region', 'city'] : ['city']
})

const type_options = computed<SelectOption[]>(() =>
	allowed_types.value.map(value => ({ label: type_labels[value], value })),
)

const title = computed(() => {
	if (props.location) return `Edit ${props.location.name}`
	const parent = findRow(props.preset?.parent_id)
	return parent ? `Add a place in ${parent.name}` : 'Add a country'
})

// regions go under countries; cities under a country or a region
const parent_options = computed<SelectOption[]>(() => {
	const live = props.locations.filter(item => !item.deleted_at && item.id !== props.location?.id)
	const countries = live
		.filter(item => item.type === 'country')
		.sort((a, b) => a.name.localeCompare(b.name))

	if (type.value === 'region') {
		return countries.map(country => ({ label: country.name, value: String(country.id) }))
	}

	return countries.flatMap(country => [
		{ label: country.name, value: String(country.id) },
		...live
			.filter(item => item.type === 'region' && item.parent_id === country.id)
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(region => ({ label: `${country.name} › ${region.name}`, value: String(region.id) })),
	])
})

// load the place (or the preset) each time the dialog opens
watch([is_open, () => props.location, () => props.preset], ([open]) => {
	if (!open) return
	const location = props.location
	type.value = location?.type ?? allowed_types.value[0] ?? 'country'
	parent_id.value = String(location?.parent_id ?? props.preset?.parent_id ?? '')
	name.value = location?.name ?? ''
	slug.value = location?.slug ?? ''
	iso_code.value = location?.iso_code ?? ''
	is_active.value = location?.is_active ?? true
	slug_edited.value = Boolean(location)
	Object.assign(errors, { parent: '', name: '', slug: '', iso: '' })
})

// a region can't stay under a region if the type changes back
watch(type, () => {
	if (!parent_options.value.some(option => option.value === parent_id.value)) parent_id.value = ''
})

function onName(value: string) {
	if (!slug_edited.value) slug.value = slugify(value)
}

function validate(): boolean {
	const parent = type.value === 'country' ? null : Number(parent_id.value) || null
	const value = slug.value.trim()
	const iso = iso_code.value.trim().toUpperCase()
	const siblings = props.locations.filter(item =>
		item.id !== props.location?.id && !item.deleted_at && item.parent_id === parent,
	)

	errors.parent = type.value !== 'country' && !parent ? 'Choose where this place sits.' : ''
	errors.name = name.value.trim() ? '' : 'Enter a name.'

	if (!value) errors.slug = 'Enter a slug.'
	else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) errors.slug = 'Use lowercase letters, numbers and single hyphens only.'
	else if (siblings.some(item => item.slug === value)) errors.slug = 'Another place with the same parent uses this slug.'
	else errors.slug = ''

	if (type.value !== 'country') errors.iso = ''
	else if (!/^[A-Z]{2}$/.test(iso)) errors.iso = 'Enter the two-letter code, like PH or US.'
	else if (siblings.some(item => item.iso_code === iso)) errors.iso = 'Another country uses this code.'
	else errors.iso = ''

	return !errors.parent && !errors.name && !errors.slug && !errors.iso
}

async function submit() {
	if (!validate() || !isType(type.value)) {
		await nextTick()
		const fields: [string, string][] = [
			['location-editor-parent', errors.parent],
			['location-editor-name', errors.name],
			['location-editor-slug', errors.slug],
			['location-editor-iso', errors.iso],
		]
		const field_id = fields.find(([, message]) => message)?.[0]
		if (field_id) document.getElementById(field_id)?.focus()
		return
	}

	const is_country = type.value === 'country'
	emit(
		'save',
		{
			type: type.value,
			parent_id: is_country ? null : Number(parent_id.value),
			name: name.value.trim(),
			slug: slug.value.trim(),
			iso_code: is_country ? iso_code.value.trim().toUpperCase() : null,
			is_active: is_active.value,
		},
		props.location?.id ?? null,
	)
	closeModal(props.modal)
}
</script>

<style lang="scss" scoped>
.editor {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 160px);
		gap: 16px;
	}

	&__active {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
}

@media only screen and (max-width: 600px) {
	.editor {
		&__pair {
			grid-template-columns: 1fr;
		}
	}
}
</style>
