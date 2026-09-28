<template>
	<div class="filters">
		<div class="wrapper">
			<form class="filters__con" role="search" aria-label="Search sales pros" @submit.prevent="emit('change', { q: term.trim() || undefined })">
				<div class="filters__keyword">
					<MSearch
						id="professionals-q"
						v-model="term"
						name="q"
						label="Search by name, role, or specialty"
						placeholder="Name, role, or specialty"
						@clear="emit('change', { q: undefined })"
					>
						<template #label>Keyword</template>
					</MSearch>
				</div>
				<MSelect
					id="professionals-service"
					name="service"
					:model-value="props.params.service ?? ''"
					:options="service_options"
					placeholder="Any service"
					@update:model-value="emit('change', { service: $event || undefined })"
				>
					<template #label>Service</template>
				</MSelect>
				<MSelect
					id="professionals-industry"
					name="industry"
					:model-value="props.params.industry ?? ''"
					:options="industry_options"
					placeholder="Any industry"
					@update:model-value="emit('change', { industry: $event || undefined })"
				>
					<template #label>Industry</template>
				</MSelect>
				<MSelect
					id="professionals-country"
					name="country"
					:model-value="props.params.country ?? ''"
					:options="country_options"
					placeholder="Anywhere"
					@update:model-value="emit('change', { country: $event || undefined, location: undefined })"
				>
					<template #label>Based in</template>
				</MSelect>
				<MSelect
					id="professionals-language"
					name="language"
					:model-value="props.params.language ?? ''"
					:options="language_options"
					placeholder="Any language"
					@update:model-value="emit('change', { language: $event || undefined })"
				>
					<template #label>Language</template>
				</MSelect>
				<MSelect
					id="professionals-sort"
					name="sort"
					class="filters__sort"
					:model-value="props.params.sort ?? 'relevance'"
					:options="sortOptions"
					@update:model-value="emit('change', { sort: $event === 'relevance' ? undefined : $event })"
				>
					<template #label>Sort by</template>
				</MSelect>
				<!-- Enter in the keyword field submits; the button is for pointer users -->
				<MButton type="submit" class="filters__submit">Search</MButton>
			</form>
			<MText v-if="has_filters" class="filters__clear">
				<MButton variant="text" size="sm" @click="emit('clear')">Clear all filters</MButton>
			</MText>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MSearch from '~/components/core/search/MSearch.vue'
import type { SelectOption } from '~/types/base/ui'
import { sortOptions } from '~/utils/labels'

const { countryOf, findLocation, industries, languages, services } = useCatalogStore()
const { professionalCards } = useDirectoryStore()

interface Props {
	params: Record<string, string | undefined>
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'change', _patch: Record<string, string | undefined>): void
	(_e: 'clear'): void
}>()

const term = ref(props.params.q ?? '')

watch(() => props.params.q, (value) => {
	term.value = value ?? ''
})

const service_options: SelectOption[] = services.map(item => ({ label: item.name, value: item.slug }))
const industry_options: SelectOption[] = industries.map(item => ({ label: item.name, value: item.slug }))
const language_options: SelectOption[] = languages.map(item => ({ label: item.name, value: item.slug }))

// Countries where listed sales pros are based (not markets they serve).
const country_options: SelectOption[] = Array.from(
	new Map(
		professionalCards
			.map(card => (card.location ? findLocation(card.location.id) : undefined))
			.filter(location => location !== undefined)
			.map(location => countryOf(location))
			.map(country => [country.slug, { label: country.name, value: country.slug }]),
	).values(),
).sort((a, b) => a.label.localeCompare(b.label))

const has_filters = computed(() =>
	Boolean(props.params.q || props.params.service || props.params.industry || props.params.country || props.params.language || props.params.location),
)
</script>

<style lang="scss" scoped>
.filters {
	border-top: var(--rule);
	border-bottom: var(--rule);
	background: var(--canvas);

	// two rows: one row of seven left each select too narrow for its value
	&__con {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		align-items: end;
		gap: 12px;
		padding: 16px 0;
	}

	&__keyword {
		grid-column: span 2;
	}

	&__clear {
		padding-bottom: 12px;
		margin-top: -4px;
	}
}

@media only screen and (max-width: 1200px) {
	.filters__con {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media only screen and (max-width: 640px) {
	.filters__con {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	}

	.filters__keyword,
	.filters__sort,
	.filters__submit {
		grid-column: 1 / -1;
	}
}
</style>
