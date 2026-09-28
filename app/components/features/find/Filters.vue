<template>
	<div class="filters">
		<MFilterGroup title="Service & industry" :active="Boolean(props.params.service || props.params.industry)">
			<MSelect
				:id="`${props.idPrefix}-service`"
				:name="`${props.idPrefix}-service`"
				:model-value="props.params.service ?? ''"
				:options="toSlugOptions(services)"
				placeholder="Any service"
				@update:model-value="emit('change', { service: $event || undefined })"
			>
				<template #label>Service</template>
			</MSelect>
			<MSelect
				:id="`${props.idPrefix}-industry`"
				:name="`${props.idPrefix}-industry`"
				:model-value="props.params.industry ?? ''"
				:options="toSlugOptions(industries)"
				placeholder="Any industry"
				@update:model-value="emit('change', { industry: $event || undefined })"
			>
				<template #label>Industry</template>
			</MSelect>
		</MFilterGroup>

		<MFilterGroup title="Location" :active="Boolean(props.params.country || props.params.location)">
			<MLocationSelect
				:model-value="location_value"
				:id-prefix="`${props.idPrefix}-location`"
				legend="Location"
				hide-legend
				:allowed-ids="allowed_location_ids"
				@update:model-value="onLocation"
			/>
		</MFilterGroup>

		<MFilterGroup title="Company" :active="Boolean(props.params.size || props.params.work_model)">
			<MSelect
				:id="`${props.idPrefix}-size`"
				:name="`${props.idPrefix}-size`"
				:model-value="props.params.size ?? ''"
				:options="companySizeOptions"
				placeholder="Any size"
				@update:model-value="emit('change', { size: $event || undefined })"
			>
				<template #label>Company size</template>
			</MSelect>
			<MSelect
				:id="`${props.idPrefix}-work-model`"
				:name="`${props.idPrefix}-work-model`"
				:model-value="props.params.work_model ?? ''"
				:options="workModelOptions"
				placeholder="Any work model"
				@update:model-value="emit('change', { work_model: $event || undefined })"
			>
				<template #label>Work model</template>
			</MSelect>
		</MFilterGroup>

		<MFilterGroup
			title="Capabilities & technology"
			:active="Boolean(props.params.capability || props.params.language || props.params.technology)"
		>
			<MSelect
				:id="`${props.idPrefix}-capability`"
				:name="`${props.idPrefix}-capability`"
				:model-value="props.params.capability ?? ''"
				:options="toSlugOptions(capabilities)"
				placeholder="Any capability"
				@update:model-value="emit('change', { capability: $event || undefined })"
			>
				<template #label>Capability</template>
			</MSelect>
			<MSelect
				:id="`${props.idPrefix}-language`"
				:name="`${props.idPrefix}-language`"
				:model-value="props.params.language ?? ''"
				:options="toSlugOptions(languages)"
				placeholder="Any language"
				@update:model-value="emit('change', { language: $event || undefined })"
			>
				<template #label>Language</template>
			</MSelect>
			<MSelect
				:id="`${props.idPrefix}-technology`"
				:name="`${props.idPrefix}-technology`"
				:model-value="props.params.technology ?? ''"
				:options="toSlugOptions(technologies)"
				placeholder="Any technology"
				@update:model-value="emit('change', { technology: $event || undefined })"
			>
				<template #label>Technology</template>
			</MSelect>
		</MFilterGroup>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MFilterGroup from '~/components/core/filters/MFilterGroup.vue'
import MLocationSelect from '~/components/core/location/MLocationSelect.vue'
import type { SelectOption } from '~/types/base/ui'
import type { TaxonomyItem } from '~/types/features/directory'
import { companySizeOptions, workModelOptions } from '~/utils/labels'

const {
	capabilities,
	findCountryBySlug,
	findLocation,
	industries,
	languages,
	services,
	technologies,
} = useCatalogStore()
const { locationsWithCompanies } = useDirectoryStore()

interface Props {
	idPrefix: string
	params: Record<string, string | undefined>
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'change', _patch: Record<string, string | undefined>): void
}>()

function toSlugOptions(items: TaxonomyItem[]): SelectOption[] {
	return items.map(item => ({ label: item.name, value: item.slug }))
}

// Only places with listings can be picked, so no search dead-ends.
const allowed_location_ids = locationsWithCompanies().map(location => location.id)

// The picker speaks location ids; the URL uses a country slug for
// countries and an id for regions and cities (docs/API.md §3).
const location_value = computed(() => {
	if (props.params.location) return props.params.location
	if (props.params.country) return String(findCountryBySlug(props.params.country)?.id ?? '')
	return ''
})

function onLocation(value: string) {
	const location = findLocation(value ? Number(value) : null)
	if (!location) emit('change', { location: undefined, country: undefined })
	else if (location.type === 'country') emit('change', { country: location.slug, location: undefined })
	else emit('change', { location: String(location.id), country: undefined })
}
</script>

<style lang="scss" scoped>
.filters {
	display: flex;
	flex-direction: column;

	:deep(.m-filter-group:first-child .m-filter-group__summary) {
		padding-top: 4px;
	}
}
</style>
