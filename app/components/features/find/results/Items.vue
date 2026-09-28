<template>
	<MEmptyState v-if="props.state === 'error'" icon="light-exclamation-triangle" tone="danger" class="items__state">
		<template #title>Something went wrong. Please try again.</template>
		Your search and filters are still set, so nothing needs re-entering.
		<template #actions>
			<MButton @click="retry">Try again</MButton>
		</template>
	</MEmptyState>

	<ul v-else-if="props.companies.length" class="items" aria-label="BPO companies">
		<li v-for="company in props.companies" :key="company.id" class="items__item">
			<MCompanyCard :company="company" layout="row" heading-level="2" />
		</li>
	</ul>

	<MEmptyState v-else class="items__state">
		<template #title>No BPOs found. Try adjusting your search.</template>
		Remove a filter or two, or search a broader location — a country includes every city inside it.
		<template #actions>
			<MButton variant="neutral" @click="emit('clear')">Clear all filters</MButton>
			<MButton variant="text" to="/companies">Browse all BPO companies</MButton>
		</template>
	</MEmptyState>
</template>

<script setup lang="ts">
import MCompanyCard from '~/components/core/company/MCompanyCard.vue'
import type { CompanyCard } from '~/types/features/directory'

interface Props {
	companies: CompanyCard[]
	state: 'ready' | 'error'
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(_e: 'clear'): void
}>()

function retry() {
	// the query stays in the URL, so a reload repeats the same search
	reloadNuxtApp({ persistState: false })
}
</script>

<style lang="scss" scoped>
.items {
	display: flex;
	flex-direction: column;

	&__item {
		border-bottom: var(--rule);
	}

	&__state {
		margin-top: 24px;
	}
}
</style>
