<template>
	<div class="filters">
		<div class="wrapper">
			<form class="filters__con" aria-label="Filter BPO companies" @submit.prevent>
				<MSelect
					id="companies-service"
					name="service"
					:model-value="props.params.service ?? ''"
					:options="service_options"
					placeholder="Any service"
					@update:model-value="emit('change', { service: $event || undefined })"
				>
					<template #label>Service</template>
				</MSelect>
				<MSelect
					id="companies-industry"
					name="industry"
					:model-value="props.params.industry ?? ''"
					:options="industry_options"
					placeholder="Any industry"
					@update:model-value="emit('change', { industry: $event || undefined })"
				>
					<template #label>Industry</template>
				</MSelect>
				<MSelect
					id="companies-country"
					name="country"
					:model-value="props.params.country ?? ''"
					:options="country_options"
					placeholder="Any country"
					@update:model-value="emit('change', { country: $event || undefined })"
				>
					<template #label>Country</template>
				</MSelect>
				<MSelect
					id="companies-sort"
					name="sort"
					:model-value="props.params.sort ?? 'relevance'"
					:options="sortOptions"
					@update:model-value="emit('change', { sort: $event === 'relevance' ? undefined : $event })"
				>
					<template #label>Sort by</template>
				</MSelect>

				<div class="filters__links">
					<MButton variant="text" :to="{ path: '/find', query: find_query }">
						<template #prefix>
							<MIcon name="light-slider-horizontal" size="sm" />
						</template>
						More filters
					</MButton>
					<MButton v-if="has_filters" variant="text" @click="emit('clear')">Clear</MButton>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '~/types/base/ui'
import { sortOptions } from '~/utils/labels'

const { industries, services } = useCatalogStore()
const { locationsWithCompanies } = useDirectoryStore()

interface Props {
	params: Record<string, string | undefined>
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'change', _patch: Record<string, string | undefined>): void
	(_e: 'clear'): void
}>()

const service_options: SelectOption[] = services.map(item => ({ label: item.name, value: item.slug }))
const industry_options: SelectOption[] = industries.map(item => ({ label: item.name, value: item.slug }))
const country_options: SelectOption[] = locationsWithCompanies()
	.filter(location => location.type === 'country')
	.map(country => ({ label: country.name, value: country.slug }))

const has_filters = computed(() => Boolean(props.params.service || props.params.industry || props.params.country))

// Carry the current filters over to the full search.
const find_query = computed(() => {
	const query: Record<string, string> = {}
	for (const key of ['service', 'industry', 'country'] as const) {
		const value = props.params[key]
		if (value) query[key] = value
	}
	return query
})
</script>

<style lang="scss" scoped>
.filters {
	position: sticky;
	top: var(--header-height);
	z-index: 20;
	background: var(--header-glass);
	backdrop-filter: saturate(1.4) blur(12px);
	border-top: var(--rule);
	border-bottom: var(--rule);

	&__con {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
		align-items: end;
		gap: 16px;
		padding: 16px 0;
	}

	&__links {
		display: flex;
		gap: 16px;
		height: 44px;
		align-items: center;
	}
}

@media only screen and (max-width: 1024px) {
	.filters {
		position: static;

		&__con {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		&__links {
			grid-column: 1 / -1;
			height: auto;
		}
	}
}

@media only screen and (max-width: 480px) {
	.filters__con {
		grid-template-columns: 1fr;
	}
}
</style>
