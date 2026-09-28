<template>
	<fieldset class="m-location-select">
		<legend :class="props.hideLegend ? 'sr-only' : 'm-location-select__legend'">{{ props.legend }}</legend>

		<MSelect
			:id="`${props.idPrefix}-country`"
			:name="`${props.idPrefix}-country`"
			:model-value="country_id"
			:options="country_options"
			:placeholder="props.anyLabel"
			:height="props.height"
			@update:model-value="onCountry"
		>
			<template #label>Country</template>
		</MSelect>

		<MSelect
			v-if="region_options.length && !props.countriesOnly"
			:id="`${props.idPrefix}-region`"
			:name="`${props.idPrefix}-region`"
			:model-value="region_id"
			:options="region_options"
			placeholder="Any region"
			:height="props.height"
			@update:model-value="onRegion"
		>
			<template #label>Region or state</template>
		</MSelect>

		<MSelect
			v-if="city_options.length && !props.countriesOnly"
			:id="`${props.idPrefix}-city`"
			:name="`${props.idPrefix}-city`"
			:model-value="city_id"
			:options="city_options"
			placeholder="Any city"
			:height="props.height"
			@update:model-value="onCity"
		>
			<template #label>City</template>
		</MSelect>
	</fieldset>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import type { LocationItem } from '~/types/features/directory'

const { childrenOf, countryOf, findLocation, locations, regionOf } = useCatalogStore()

// Country -> region -> city, matching the location hierarchy
// (docs/DATABASE.md §4.6). v-model is the deepest selected location id.
interface Props {
	modelValue: string
	idPrefix: string
	legend?: string
	hideLegend?: boolean
	anyLabel?: string
	// limit choices to these location ids (e.g. places with listings)
	allowedIds?: number[]
	countriesOnly?: boolean
	height?: number
}

const props = withDefaults(defineProps<Props>(), {
	legend: 'Location',
	hideLegend: false,
	anyLabel: 'Anywhere',
	allowedIds: undefined,
	countriesOnly: false,
	height: 44,
})

const emit = defineEmits<{
	(_e: 'update:modelValue', _value: string): void
}>()

const selected = computed(() => findLocation(props.modelValue ? Number(props.modelValue) : null))

const country_id = computed(() => (selected.value ? String(countryOf(selected.value).id) : ''))

const region_id = computed(() => {
	if (!selected.value) return ''
	if (selected.value.type === 'region') return String(selected.value.id)
	return String(regionOf(selected.value)?.id ?? '')
})

const city_id = computed(() => (selected.value?.type === 'city' ? String(selected.value.id) : ''))

function allowed(location: LocationItem) {
	return !props.allowedIds || props.allowedIds.includes(location.id)
}

function toOption(location: LocationItem): SelectOption {
	return { label: location.name, value: String(location.id) }
}

const country_options = computed(() =>
	locations.filter(location => location.type === 'country' && allowed(location)).map(toOption),
)

const region_options = computed(() => {
	if (!country_id.value) return []
	return childrenOf(Number(country_id.value))
		.filter(location => location.type === 'region' && allowed(location))
		.map(toOption)
})

// Cities under the chosen region, or cities sitting directly under the country.
const city_options = computed(() => {
	if (!country_id.value) return []
	const parent = region_id.value ? Number(region_id.value) : Number(country_id.value)
	return childrenOf(parent)
		.filter(location => location.type === 'city' && allowed(location))
		.map(toOption)
})

function onCountry(value: string) {
	emit('update:modelValue', value)
}

function onRegion(value: string) {
	emit('update:modelValue', value || country_id.value)
}

function onCity(value: string) {
	emit('update:modelValue', value || region_id.value || country_id.value)
}
</script>

<style lang="scss" scoped>
.m-location-select {
	display: flex;
	flex-direction: column;
	gap: 12px;
	min-width: 0;

	&__legend {
		margin-bottom: 8px;
		font-family: var(--font-ui);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}
}
</style>
